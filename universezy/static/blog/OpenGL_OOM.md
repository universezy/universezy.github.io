# OpenGL OOM的解决方案

## 一、 问题描述

GLSurfaceView运行期间抛出OOM崩溃：
```
07-22 11:47:19.919 24862 25042 W Adreno-GSL: <sharedmem_gpuobj_alloc:2713>: sharedmem_gpumem_alloc: mmap failed errno 12 Out of memory
07-22 11:47:19.920 24862 25042 E Adreno-GSL: <gsl_memory_alloc_pure:2297>: GSL MEM ERROR: kgsl_sharedmem_alloc ioctl failed.
07-22 11:47:19.921 24862 25042 E OpenGLRenderer: GL error:  Out of memory!
07-22 11:47:19.921 24862 25042 F OpenGLRenderer: GL errors! frameworks/base/libs/hwui/pipeline/skia/SkiaOpenGLPipeline.cpp:138
```

---
## 二、 问题原因

这个问题在Google上一搜一大堆，没有明确的解释native层如何引起崩溃，先大致回顾以下绘制流程：

开启硬件加速后，会创建Render Thread，当Vsync信号来到时，执行Choreographer中的traversal这个callback，即UI线程绘制操作，绘制操作会被记录到DisplayList中，同步到Render线程，并渲染出最终的buffer，交给SurfaceFlinger去合成，最终展示在显示屏上。

而该OOM问题对应的SkiaOpenGLPipeline，位于上述Render线程的渲染过程中，再往下分析我也不知道了，本文不对其深入分析，因为无论native因什么导致OOM，归根结底还是OOM问题，我们关心的是如何去解决它。

---
## 三、 解决方案

### 1. 限制使用硬件加速

Android提供了四种级别的硬件加速控制方式：

- Application：在Manifest文件中的Application Tag中配置属性：
```xml
<application android:hardwareAccelerated="true" ...>
```

- Activity：在Manifest文件中的Activity Tag中配置属性：
```xml
<activity android:hardwareAccelerated="true" ...>
```

- Window：运行时对窗口设置flag使其使用硬件加速：
```kotlin
window.setFlags(WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED)
```

- View：运行时对单个View设置层级类型使其停用硬件加速：
```kotlin
view.setLayerType(View.LAYER_TYPE_SOFTWARE, null)
```

开启硬件加速，是为了充分利用GPU提升渲染性能，但是并非所有场景都需要使用硬件加速，除了通常的Video、WebView、Canvas等场景，其他常规页面不涉及高频刷新的，应该尽量缩小硬件加速的使用范围，将GPU资源更多地分配给真正需要的场景。

---
### 2. 避免过度绘制

我们知道，无论一个显示区域有多少图层、多少视图组件，最终通过SurfaceFlinger进行合成后都是一个2D平面图，而那些被遮挡的视图或图层，就成了无效绘制，因为一开始对其的计算将被它上方覆盖，不仅在遍历View树时造成额外开销，也在合成buffer时成了累赘。

避免过度绘制既要减少图层，即布局的嵌套层次，也要减少视图数量，以提升单帧的合成效率。

---
### 3. 谨慎使用Alpha

以Activity为例，栈上方的页面如果不是完全不透明的，那么栈下方的Activity可以继续绘制，这就意味着同时渲染两个页面的内容，开销直接翻倍。同样的，单个视图如果是半透明的，也会造成该额外开销。

因此尽量避免半透明大视图，如果实在要使用，那就设置该视图的层级属性为硬件层。

---
### 4. 确保有足够的内存

前面所说都是从源头出发，避免OpenGL的过大负担，这一条则是从问题本身角度进行优化，内存不足，那么就想办法让内存尽可能满足。

优化内存主要从以下几个维度考虑：
- 避免ML。
- 控制大内存的申请，以Bitmap为例，裁剪大小、降低分辨率、调整编码格式等都可以在创建时减小内存占用，如果是应用内的资源，压缩图片或者使用矢量图代替，也是一种不错的方式。
- 在内存峰值时及时回收内存。

---
## 四、 参考文献

- [一次OOM纪实](https://www.codeleading.com/article/35562298346/)
- [Hardware acceleration](https://developer.android.com/guide/topics/graphics/hardware-accel)
- [Android Systrace 基础知识 - MainThread 和 RenderThread 解读](https://androidperformance.com/2019/11/06/Android-Systrace-MainThread-And-RenderThread/)
- [Android 基于 Choreographer 的渲染机制详解](https://www.androidperformance.com/2019/10/22/Android-Choreographer/)
- [Android P 图像显示系统（三）Android HWUI 绘制流程](https://www.jianshu.com/p/abfaea892611)