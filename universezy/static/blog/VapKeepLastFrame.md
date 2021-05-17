# 企鹅电竞VAP动画组件停留最后一帧画面

## 一、 简介

VAP（Video Animation Player）是企鹅电竞开发的一款用于播放视频动画的组件库，其开源于：
- 腾讯工蜂：https://git.code.tencent.com/Tencent_Open_Source/vap
- Github：https://github.com/Tencent/vap

---
## 二、 问题现状

VAP播放动画采用的**TextureView**方式来提供**Surface**展示画面，在播放视频结束后，会清空动画画面，如果我们有需求需要让动画停留在画面最后一帧，当前是不支持的，跟VAP相关开发同事沟通，其解释是：播放动画期间，通过Home键或手势回到桌面，即应用在后台时，在部分机型上，**TextureView**会被移除，导致应用回到前台后会显示黑屏或空内容，在该兼容性问题解决之前，不对外提供停留最后一帧画面的能力。

因此，对于有该需求的使用者，需要自行改造源码，使其支持这样的能力。

---
## 三、 问题分析

对于采用**GLSurfaceView**+自定义**Renderer**+播放器的方案，每一帧画面纹理数据回调时，通过`GLSurfaceView#requestRender`来主动通知OpenGL进行渲染，渲染时先进行清屏操作，然后才是GL变换操作，这种方案下，最后一帧画面渲染结束后，如果不主动清屏，画面会停留在最后一帧。

受此启发，推测VAP在动画回调结束前后，主动执行了清屏操作。

VAP动画回调结束的方法是：`IAnimListener#onVideoComplete`，倒推其调用的地方：

![](static/blog/image/VAP1.png)

`clearFrame`的具体实现为：

![](static/blog/image/VAP2.png)

在解码完成时，会执行该方法，在渲染线程中：
- 清空GPU缓存画面
- 释放解码器资源
- 释放纹理资源
- GL环境解绑纹理
- 回调动画结束

而回调动画结束最后在**AnimView**中：

![](static/blog/image/VAP3.png)

会去移除**TextureView**：

![](static/blog/image/VAP4.png)

在**TextureView**中，当自身从窗口移除时：

![](static/blog/image/VAP5.png)

会去销毁窗口，释放纹理等。

因此，要解决这个问题，需要同时处理两个地方：
- GL清屏的操作
- 移除**TextureView**的操作

---
## 四、 解决方案

这里不罗列具体的代码，大致思路分为四点：

1. **AnimView**增加api：`setAutoDismiss`，内部维护变量`autoDismiss`，以便在动画结束时判断是走原始逻辑销毁画面还是保留最后一帧画面。
2. 在**AnimView**中，如果`autoDismiss`为false，则在`onVideoComplete`回调中不执行`hide`操作。
3. 在**HardDecoder#release**中，如果`autoDismiss`为false，则不执行GL的清屏操作`clearFrame`。
4. 主动销毁时，移除相关的**TextureView**，执行GL的清屏操作，需要注意的是，后者需要在渲染线程，要确保执行清屏时线程仍存活。这样一来纹理数据才能得到及时释放，避免内存泄漏，引发GPU OOM。