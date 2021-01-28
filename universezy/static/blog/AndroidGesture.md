# Android手势拦补点

## 一、 前言

在Android日常开发中，我们时有处理业务中手势的需求，即：基于事件的拦截、分发、消费三个回调，判断手势逻辑。

我们知道，当一个View消费了`ACTION_DOWN`事件，才可以接受到后续的事件，反之无法收到后续事件。那么如果一个View消费了事件后，判断为自己不需要的事件，又想将事件重新传递给子View处理怎么办呢？

这就引出了本文的要点——手势拦补点操作，以Android Q为例，进行介绍。

---
## 二、 拦点

### 1. 什么是拦点

拦点，即拦截触摸事件点位，不让事件向下传递。这并非我们常规的`onInterceptTouchEvent`方法中返回一个true来实现拦截这么简单，而是宏观上的以应用或窗口为单位的拦截，比如Android Q开始原生支持的手势交互。

---
### 2. 为什么拦点

以OPPO手机ColorOS 7为例，在`设置`-`便捷辅助`-`导航键`中选择**两侧滑动手势**，打开一个应用，我们在屏幕两侧偏下的边缘，向内滑动，可以触发手势操作：

![](static/blog/image/AG_1.jpg)

而在这个位置点击，如果对应位置有按钮之类的控件（比如设置页的Preference项），也可以响应点击事件：

![](static/blog/image/AG_2.jpg)

根据这些，我们提出疑惑，手势图形和应用页面二者应该属于不同的窗口，且手势的窗口层级高于应用，一个事件同一时刻应该只有一个地方可以消费，那么这里是如何实现二者均可以消费呢？这便是基于拦点实现的。

---
### 3. 怎么拦点

由于这部分功能的具体实现，位于每个ROM厂商的非开放仓库中，这里仅从技术侧介绍大致的实现思想，不同厂商之间实现原理大致相同：

对于一个窗口，事件的源头为**ViewRootImpl**类中**InputEventReceiver**的实例，其接收来自于硬件层传感器经Framework层传到App层的Input事件，并通过**DecorView**向整个View树进行深度优先的传递。

所以，每一个**MotionEvent**通过注册有**InputEventReceiver**的事件通道，先经过**ViewRootImpl**，之后才会传递到应用中的View。

当事件来到，在**ViewRootImpl**中会进行拦截和判断，是否满足当前用户选择的手势的判定，同时将每一个事件点存进cache中。假设以10个点为阈值，10个点内判断手势成功，则响应手势的逻辑。如果10个点判断手势失败，则不再判断手势，将cache中的点位全部分发下去，且后续的事件来到后也不再拦截，直接分发。

- 在**ViewRootImpl**中做的这套拦截逻辑，即为拦点，它避免了手势的事件误传到应用层。
- 手势图形绘制位于另一个窗口层级更高的常驻进程，从而保证绘制的层级能在绝大部分窗口之上，其也注册了**InputEventReceiver**作为事件通道。
- cache中的点位重新分发的过程即为**补点**，这将在下一节介绍。

---
## 三、 补点

### 1. 什么是补点

补点，即补充触摸事件点位，让事件重新沿系统传递链传递。这也并非我们主动去调用`dispatchTouchEvent`或`onTouchEvent`方法来传递一个**MotionEvent**，而是真正地模拟用户触摸事件，从底层到上层的传递，走一遍完整的流程，最终将返回值交给**ViewRootImpl**处理。

---
### 2. 为什么补点

假设我们有这样一个需求，一个父View里面塞了很多个子View，产品希望以父View为整体，可以实现在全屏内跟手拖动，而里面的子View各自又可以响应点击事件。

这个需求拆分成两部分：
- 父View跟手位移：拦截事件，自己消费，实时更新父View坐标
- 子View响应点击事件：设置点击监听器

问题来了，当父View拦截并开始消费事件后，子View因为没有`ACTION_DOWN`消费，是无法收到后续事件的，因此永远无法正常响应点击事件。

那么怎么实现既可以让父View消费，又可以让子View消费呢？这就需要用到补点。

---
### 3. 怎么补点

对于该需求场景，如果我们在跟手位移结束，即`ACTION_UP`时，判断本次操作应该为一次click事件，然后将这个click事件对应的`ACTION_DOWN`和`ACTION_UP`传给系统，重新从**ViewRootImpl**向下传递给子View，便可解决该问题。

这个补偿事件点的操作称为补点。

与触摸事件相关的系统服务为**InputManagerService**，其对应用层开放的管理类为**InputManager**，其中有一个方法`injectInputEvent`，用于主动注入Input事件到IMS中：

![](static/blog/image/AG_3.png)

遗憾的是，它是一个Hide API，且需要`INJECT_EVENTS`权限，即仅向系统层或有特权的系统应用（拥有AOSP证书签名、安装目录位于`/system/app/`中）开放。

幸运的是，可以使用替代方案**Instrumentation**：

![](static/blog/image/AG_4.png)

通过该API，可以间接地向系统注入点击事件对应的两个**MotionEvent**。需要注意的是：

- 需在子线程调用
- **MotionEvent**通过`MotionEvent#obtain`构造
- 时间戳使用`SystemClock#uptimeMillis()`

由于我们在父View进行了事件拦截以使自身消费事件，因此这里构造的**MotionEvent**需要通过`setEdgeFlags`设置一个特定的标识，当拥有标识的事件经过`onInterceptTouchEvent`方法时，对其放行，使其正常分发。

以上便是一次完整的补点操作。

---
### 4. 实战

以上一节**补点**的需求案例为例：
- 在一个名为*Container*的父View中，放入一个*ImageView*和两个*Button*
- *Container*为整体，在全屏内可以跟手拖动
- *Container*里面的子View各自能响应点击事件

(1) 自定义ViewGroup实现跟手拖动

- 由于需要全屏范围内拖动，父布局需使用**FrameLayout**
- 自定义ViewGroup这里继承**ConstraintLayout**
- 重写`onInterceptTouchEvent`返回true，使事件全部由自身消费
- 重写`onTouchEvent`，保存`ACTION_DOWN`时的落点和View的坐标，以计算相对位移，`ACTION_MOVE`时更新View的坐标，实现跟手拖动
- 位移时判断是否超出屏幕，限制坐标边界值

(2) 判断是否满足点击事件

- 点击事件的判定通常需要考虑*位移差*和*间隔时长*两个因素，如果严谨一点还可以加上对*离手速度*的判断
- 本例中，`ACTION_DOWN`和`ACTION_UP`的横纵坐标差均小于50px，间隔时长小于250ms，不考虑离手速度

(3) 注入事件到系统

- 在子线程中实例化一个**Instrumentation**实例
- 根据离手坐标构造**MotionEvent**
- 对其设置`edgeFlags`，注意不能和系统标识位重复
- 连续注入两个事件

(4) 拦截回调中放行注入的事件

- 如果事件的`edgeFlags`等于自定义的标识，则不拦截事件，使其分发给子View

(5) 运行效果

![](static/blog/image/AG_5.gif)

---
## 四、 总结

拦补点思想用于解决一些手势冲突问题，其本质还是基于事件分发机制，即：`InputEventReceiver`->`ViewRootImpl`->`PhoneWindow`->`DecorView`->`ViewGroup`->`View`这一分发链。

因此对这一机制越熟悉，运用起来也就越得心应手。



