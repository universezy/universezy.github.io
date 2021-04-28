# 基于GLSurfaceView的视频播放器偶现无画面的问题分析

## 一、 问题背景

博主所在项目中，涉及到视频动画播放功能，其实现方案采用的是bilibili开源项目[ijkplayer](https://github.com/bilibili/ijkplayer)播放器+GLSurfaceView+自定义渲染器：

- ijkplayer提供视频解码能力，回调帧数据
- 自定义Renderer实现shader操作，对帧画面修改
- GLSurfaceView作为画布，进行展示

整个视频动画播放流程如下：

<div align=center><img src="static/blog/image/GLSV_NoFrame_Process.png"/></div>
<center><p>图1.1 视频动画播放流程</p></center>

在长达近一年时间里，会偶现视频播放无画面的问题，具体表现为：视频动画开始播放到结束期间，没有任何帧画面。

该问题到了博主手里有半年时间，受限于对视频解码、OpenGL等技术领域知识体系的匮乏，尽管每隔一段时间把该问题捞出来分析一天，但每次都不了了之。并且也认为自己搞不定这个问题，无从下手。

这周趁着需求空档期，有些时间，决定调整思路，再系统地分析一遍这个问题。

---
## 二、 逐步排查

### 2.1 增加log，复现问题
- 在**SurfaceTexture#OnFrameAvailableListener**的`onFrameAvailable`回调中增加日志，正常情况下每一帧都会回调该方法。
- **ijkplayer**提供了外部注入日志打印的能力，通过**IjkLogConfig.setIjkLog**设置一个接收日志的对象，加上自己的TAG。

在测试环境下不停送礼触发礼物视频动画，压测上百次后，复现出该问题，抓取日志，发现其中大量如下异常信息：
```log
04-25 21:21:20.568 E/BufferQueueProducer(16697): [SurfaceTexture-1-16697-76] query: BufferQueue has been abandoned
04-25 21:21:20.568 E/BufferQueueProducer(16697): [SurfaceTexture-1-16697-76] query: BufferQueue has been abandoned
04-25 21:21:20.568 E/BufferQueueProducer(16697): [SurfaceTexture-1-16697-76] dequeueBuffer: BufferQueue has been abandoned
04-25 21:21:20.568 E/Surface (16697): dequeueBuffer failed (No such device)
04-25 21:21:20.568 E/IJKMEDIA(16697): SDL_Android_NativeWindow_display_l: ANativeWindow_lock: failed -19
04-25 21:21:20.579 E/IJKMEDIA(16697): SDL_AMediaCodecJava_dequeueInputBuffer return -1
04-25 21:21:20.580 E/IJKMEDIA(16697): SDL_AMediaCodec_dequeueInputBuffer 1 fail
04-25 21:21:20.580 I/IJKMEDIA(16697): SDL_AMediaCodec_dequeueInputBuffer 1 fail
04-25 21:21:20.583 E/IJKMEDIA(16697): av_read_frame error = -541478725
```

打印频率符合每帧打印一次，而`onFrameAvailable`回调仅首帧打印了一次。

根据日志，在native层解码器从缓冲队列出队数据时，发生了异常，错误码`-19`，因此，先从**ijkplayer**源码开始分析错误码具体含义。

---
### 2.2 查看ijkplayer源码

在**ijkplayer**的Android源码中，全局搜索SDL库的方法`SDL_Android_NativeWindow_display_l`，任选一个CPU平台，这里以`arm64`为例：
```c
int SDL_Android_NativeWindow_display_l(ANativeWindow *native_window, SDL_VoutOverlay *overlay)
{
    int retval;
    ...
    ANativeWindow_Buffer out_buffer;
    retval = ANativeWindow_lock(native_window, &out_buffer, NULL);
    if (retval < 0) {
        ALOGE("SDL_Android_NativeWindow_display_l: ANativeWindow_lock: failed %d", retval);
        return retval;
    }
    ...
    retval = ANativeWindow_unlockAndPost(native_window);
    if (retval < 0) {
        ALOGE("SDL_Android_NativeWindow_display_l: ANativeWindow_unlockAndPost: failed %d", retval);
        return retval;
    }

    return render_ret;
}
```

报错日志即上面这一行代码所输出，看到成对出现的lock和unlock，第一反应是canvas绘制时的操作步骤，结合这里的方法名，推测这里也是要执行绘制相关操作。

全局搜索未找到`ANativeWindow_lock`这个方法，因此前往AOSP中查找。

---
### 2.3 查看AOSP源码

以Android Q为例，在**ANativeWindow**中找到：

![](static/blog/image/GLSV_NoFrame_ANativeWindow.png)

其调用具体实现位于**Surface**中：

![](static/blog/image/GLSV_NoFrame_Surface_perform.png)

继续追踪调用链：

![](static/blog/image/GLSV_NoFrame_Surface_lock.png)

这里打印的log符合前面复现问题时的日志。虽然不懂native层渲染逻辑具体实现和原理，但从类名和方法名来看，这里应该是要从缓冲队列中出队帧数据，继续向下追踪：

![](static/blog/image/GLSV_NoFrame_Surface_dequeueBuffer.png)

该方法中有两处给`result`赋值的地方，后面一处在小于0时会打印错误级别的日志，而本地复现日志中没有对应记录，因此错误码`-19`就是这里返回的。

在**BufferQueueProducer**中：

![](static/blog/image/GLSV_NoFrame_BufferQueueProducer_dequeueBuffer.png)

在源码中，`NO_INIT`的值定义为`-ENODEV`，而`ENODEV`正好等于19。

现在需要分析的是：`mCore->mIsAbandoned`在什么时候为true。

![](static/blog/image/GLSV_NoFrame_BufferQueueConsumer_disconnect.png)

与Producer相对应，在**BufferQueueConsumer**中找到了答案，位于`disconnect`方法中，这个方法也有对应的`connect`方法。

**BufferQueueCore**中对`mIsAbandoned`的声明如下：

![](static/blog/image/GLSV_NoFrame_BufferQueueCore_mIsAbandoned.png)

- 表明从**IGraphicBufferProducer**接口入队到**BufferQueue**中的图像缓冲，不会再被消费
- 初始值为false，执行`consumerDisconnect`方法后置为true
- 对于已废弃的**BufferQueue**，从**IGraphicBufferProducer**接口调过来时都会返回`NO_INIT`错误

在**IGraphicBufferConsumer**中有两处`consumerDisconnect`的调用：

![](static/blog/image/GLSV_NoFrame_IGraphicBufferConsumer_consumerDisconnect_remote.png)

和

![](static/blog/image/GLSV_NoFrame_IGraphicBufferConsumer_consumerDisconnect_local.png)

前者跨进程调用给后者的IBinder，然后后者在进程内调用，这是因为native渲染流程位于一个与应用进程独立的进程。

从现在开始倒推分析，均位于应用进程。

![](static/blog/image/GLSV_NoFrame_ConsumerBase_abandonLocked.png)

**ConsumerBase**的`abandonLocked`方法被**SurfaceTexture**覆写，这在头文件中有声明：

![](static/blog/image/GLSV_NoFrame_SurfaceTexture_abandonLocked_h.png)

![](static/blog/image/GLSV_NoFrame_SurfaceTexture_abandonLocked.png)

看到**SurfaceTexture**的native类，不禁想到**Bitmap**也是这样设计，Java层只是一个壳，封装一些基本的API，本质上是通过JNI调用native方法，核心逻辑全部位于Native层的同名类中。

`abandonLocked`方法又是由`abandon`调用，`abandon`由**SurfaceTexture**的JNI调用：

![](static/blog/image/GLSV_NoFrame_SurfaceTexture_jni_release.png)

回到Java层的**SurfaceTexture**：

![](static/blog/image/GLSV_NoFrame_SurfaceTexture_java.png)

- 用于释放缓冲区资源，将**SurfaceTexture**置为`abandoned`状态且不可逆转
- 当处于`abandoned`状态，调用**IGraphicBufferProducer**接口的任何方法都会返回`NO_INIT`错误，即错误码`-19`
- 调用后会释放这个**SurfaceTexture**关联的所有缓冲，如果有客户端或OpenGL ES通过纹理的方式引用这些缓冲，则继续保留
- 当不再使用该**SurfaceTexture**时，需要调用这个方法，避免后续资源分配受阻

这和前面看到的**BufferQueueCore**中对`mIsAbandoned`字段的描述基本上是一回事。

由此可知，以上释放资源的步骤主要流程如下：

<div align=center><img src="static/blog/image/GLSV_NoFrame_Release.png"/></div>
<center><p>图2.3.1 视频动画释放资源主要流程</p></center>

---
## 三、 分析原因

根据前面的分析，出现无画面问题的原因是，使用了一个已经释放资源的**SurfaceTexture**，从而导致缓冲区出队帧数据时报错。

回过头来看前面的视频动画播放流程3，Player播放有两个前置条件：
- 播放器准备就绪（初始化环境资源等）：由播放器异步回调`onPrepared`，主线程
- 设置**Surface**：由**Renderer**回调`onSurfaceCreated`时创建的**SurfaceTexture**，再创建出**Surface**，GL子线程

以上两个条件位于两个不同的线程，如果未做线程同步校验，那么无法保证在条件一播放器准备就绪时，条件二新的**Surface**已经创建好，如果每次视频动画执行结束后未将旧的变量置空，就会导致使用上一次释放过的对象传给Player，从日志中，也证实了出现问题时使用的旧的**SurfaceTexture**对象。

那么，为什么绝大部分情况下都能正常播放，仅仅偶现无画面的问题呢？这得从两个条件的回调时机着手分析。

---
### 3.1 Renderer回调onSurfaceCreated

在**GLSurfaceView**中，定义了静态内部类**GLThread**，其`run`方法执行的核心逻辑为`guardedRun`方法：
```java
private void guardedRun() throws InterruptedException {
    mHaveEglContext = false;
    ...
    boolean createEglContext = false;
    boolean askedToReleaseEglContext = false;
    ...
    while(true) {
        synchronized (sGLThreadManager) {
            while(true) {
                ...
                // If we don't have an EGL context, try to acquire one.
                if (! mHaveEglContext) {
                    if (askedToReleaseEglContext) {
                        askedToReleaseEglContext = false;
                    } else {
                        try {
                            mEglHelper.start();
                        } catch (RuntimeException t) {
                            sGLThreadManager.releaseEglContextLocked(this);
                            throw t;
                        }
                        mHaveEglContext = true;
                        createEglContext = true;

                        sGLThreadManager.notifyAll();
                    }
                }
                ...
            }
        }
        ...
        if (createEglContext) {
            if (LOG_RENDERER) {
                Log.w("GLThread", "onSurfaceCreated");
            }
            GLSurfaceView view = mGLSurfaceViewWeakRef.get();
            if (view != null) {
                try {
                    Trace.traceBegin(Trace.TRACE_TAG_VIEW, "onSurfaceCreated");
                    view.mRenderer.onSurfaceCreated(gl, mEglHelper.mEglConfig);
                } finally {
                    Trace.traceEnd(Trace.TRACE_TAG_VIEW);
                }
            }
            createEglContext = false;
        }
        ...
    }
    ...
}

private Renderer mRenderer;
```

内层死循环设置标识位，跳出循环后，会创建Egl环境，其中便有回调**Renderer**的`onSurfaceCreated`方法。

而线程启动的地方有两处：
```java
public void setRenderer(Renderer renderer) {
    ...
    mRenderer = renderer;
    mGLThread = new GLThread(mThisWeakRef);
    mGLThread.start();
}

@Override
protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    if (LOG_ATTACH_DETACH) {
        Log.d(TAG, "onAttachedToWindow reattach =" + mDetached);
    }
    if (mDetached && (mRenderer != null)) {
        int renderMode = RENDERMODE_CONTINUOUSLY;
        if (mGLThread != null) {
            renderMode = mGLThread.getRenderMode();
        }
        mGLThread = new GLThread(mThisWeakRef);
        if (renderMode != RENDERMODE_CONTINUOUSLY) {
            mGLThread.setRenderMode(renderMode);
        }
        mGLThread.start();
    }
    mDetached = false;
}
```

- 首次设置**Renderer**时
- **GLSurfaceView**使用过后从窗口移除，后续复用添加到窗口时

对于回调`onSurfaceCreated`的耗时点，前者等于创建线程到线程真正开始执行这段时间，取决于系统当前分配资源以及CPU分配时间片的耗时，通常很短；后者等于将**GLSurfaceView**添加到窗口的耗时加上前者的耗时，而添加到窗口的耗时，在主线程流畅的情况下，会在调用`addView`后的下一帧添加到窗口，也就是一个`VSYNC`信号的间隔时长，但在丢帧的情况下，即`VSYNC`信号到来时，无法及时响应**Choreographer**中的`doFrame`操作，遍历**View**树，回调新View的`onAttachedToWindow`，因此耗时会成倍增加。

---
### 3.2 Player回调onPrepared

以原生的**MediaPlayer**为例（**IjkMediaPlayer**类似），播放器准备操作的大致流程如下：

<div align=center><img src="static/blog/image/GLSV_NoFrame_Prepare.png"/></div>
<center><p>图3.2.1 播放器准备操作大致流程</p></center>

Native层具体操作不作详细阐述。经多次测试，这个耗时大致在20ms——150ms之间浮动，大于一个`VSYNC`信号间隔16.7ms（60Hz刷新率下）。

---
### 3.3 总结

从以上两点分析可知，在播放视频动画前的准备阶段，如果主线程没有卡顿问题，则通常都能正常播放。而对于丢帧的情景，该问题复现概率理论上会显著提高，读者可以通过主线程执行耗时任务模拟卡顿来证明。

---
## 四、 解决方案

该问题本质上是一个多线程环境下的时序问题，解决方法有两种，分别进行说明。

---
### 4.1 串行

Player的播放依赖于**Surface**，那么在**Surface**创建完毕后才开始执行Player的准备操作：

<div align=center><img src="static/blog/image/GLSV_NoFrame_Serial.png"/></div>
<center><p>图4.1.1 视频播放串行准备流程</p></center>

对于**GLSurfaceView**提前添加或默认添加到布局的场景下，如果较早设置了**Renderer**，则可以较早地创建**SurfaceTexture**，那么无需关注该时机问题，只需要在场景触发播放视频时，正常设置资源和监听、准备、开始播放。

但对于仅在需要时才将**GLSurfaceView**添加到窗口，即节约系统资源的场景下，必须关注该时机问题，那么串行将导致视频动画真正渲染上屏的首帧时间，被延后一到多个`VSYNC`信号周期。

---
### 4.2 并行

为了兼顾“节约系统资源”、“缩短首帧耗时”，可以通过多线程并行+同步校验的方式：

<div align=center><img src="static/blog/image/GLSV_NoFrame_Parallel.png"/></div>
<center><p>图4.2.1 视频播放并行准备流程</p></center>

**GLSurfaceView**在需要播放视频时调用`addView`添加到窗口，在动画结束后调用`removeView`及时从窗口移除。在`addView`同时间对Player进行初始化和准备。

无论是**Renderer**的`onSurfaceCreated`回调还是Player的`onPrepare`回调，都去调用同一个校验方法，当**SurfaceTexture**创建好且Player准备就绪时，设置**Surface**并开始播放。需要注意的是，`onSurfaceCreated`的回调位于子线程，需要切换到主线程。

---
## 五、 反思总结

最终，博主采用了方案二来解决这个“祖传bug”。整个问题从系统分析到找到原因耗时不到一天，回顾过去的几个月，其实都是在做无用功。这个问题的整个处理过程，也颇有反思：

- 对于不熟悉的技术领域，应当尽可能一边快速学习一边分析问题，如果不迈出第一步，则永远无法拓宽技术栈
- 不轻易否定自己，尤其是在没有系统思考和查阅检索的情况下，这是逃避问题不负责任的表现
- 当问题卡壳时，借助图形辅助手段，梳理流程和思路，找准问题核心原因，避免在错误的方向上浪费时间精力

路漫漫其修远兮，这也算是职业生涯的成长过程吧。