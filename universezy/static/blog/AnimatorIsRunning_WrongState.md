# Android O之前Animator的isRunning判断错误的问题

## 一、 背景

最近的需求开发中，遇到一个动画不执行的问题，具体逻辑伪代码为：
```kotlin
    private val animQueue: Queue<Animator> = LinkedList()
    private var animatorRunning: Animator? = null

    private fun scheduleAnimLooper() {
        if (animatorRunning?.isRunning == true) {
            return
        }
        animatorRunning = if (animQueue.isEmpty()) {
            null
        } else {
            animQueue.poll()
        }?.apply {
            addListener(object : AnimatorListenerAdapter() {
                override fun onAnimationEnd(animation: Animator?) {
                    scheduleAnimLooper()
                }
            })
            start()
        } ?: let {
            exit()
        }
    }
```

动画会动态添加，因此通过轮询机制连续执行动画。

- 开发调试手机为：OPPO Reno3 Pro，Android 10（Q），SDK 29。
- 异常表现手机为：OPPO R9，Android 5.1（L_MR1），SDK 22。

在低版本sdk的手机上，代码总是在第一个条件处return，即动画未继续执行。而在高版本sdk上未复现，动画能够连贯串行。

---
## 二、 分析

由于刚处理完一个低版本sdk的bug，面对这个问题时，第一反应又是sdk问题。因此直接从源码入手。

![](static/blog/image/AnimatorIsRunningWrongState1.png)

在Android5.1上，`isRunning`方法对于两个标识位任意一个满足条件时都返回true，而这两个标识位的变更位于：

![](static/blog/image/AnimatorIsRunningWrongState2.png)

当动画回调结束`onAnimationEnd`时，`mRunning`还未变更，此时调用`isRunning`便返回true。

在Android8及之后的版本：

![](static/blog/image/AnimatorIsRunningWrongState3.png)

废弃了多余的状态变量。

![](static/blog/image/AnimatorIsRunningWrongState4.png)

`mRunning`值的变更放在了动画回调结束`onAnimationEnd`之前，因此在回调中调用`isRunning`能判断正确。