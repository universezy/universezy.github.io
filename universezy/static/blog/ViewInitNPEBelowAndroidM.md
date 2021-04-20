# Android M之前View实例化时报访问成员变量空指针的问题

## 一、 背景

最近在新需求中，遇到一个crash问题，具体堆栈是：
```log
android.view.InflateException: Binary XML file line #227: Error inflating class XXXView
	at android.view.LayoutInflater.createView(LayoutInflater.java:633)
	at android.view.LayoutInflater.createViewFromTag(LayoutInflater.java:743)
	at android.view.LayoutInflater.rInflate(LayoutInflater.java:806)
	at android.view.LayoutInflater.inflate(LayoutInflater.java:504)
	at android.view.LayoutInflater.inflate(LayoutInflater.java:414)
	...
Caused by: java.lang.reflect.InvocationTargetException
	at java.lang.reflect.Constructor.newInstance(Native Method)
	at java.lang.reflect.Constructor.newInstance(Constructor.java:288)
	at android.view.LayoutInflater.createView(LayoutInflater.java:607)
	...
Caused by: java.lang.NullPointerException: Attempt to invoke virtual method 'void android.os.Handler.removeCallbacks(java.lang.Runnable)' on a null object reference
	at XXXView.cancelAnim(XXXView.kt:379)
	at XXXView.onVisibilityChanged(XXXView.kt:103)
	at android.view.View.dispatchVisibilityChanged(View.java:8895)
	at android.view.ViewGroup.dispatchVisibilityChanged(ViewGroup.java:1178)
	at android.view.View.setFlags(View.java:9990)
	at android.view.View.<init>(View.java:4231)
	at android.view.ViewGroup.<init>(ViewGroup.java:529)
	at android.view.ViewGroup.<init>(ViewGroup.java:525)
	at androidx.constraintlayout.widget.ConstraintLayout.<init>(ConstraintLayout.java:580)
	at XXXView.<init>(XXXView.kt:32)
	at XXXView.<init>(XXXView.kt:31)
	at XXXView.<init>(XXXView.kt)
	...
```

该异常堆栈对应的业务伪代码为：
```kotlin
class XXXView @JvmOverloads constructor(
    context: Context,
    attr: AttributeSet? = null,
    defStyleAttr: Int = 0
) : ConstraintLayout(context, attr, defStyleAttr) {

    private val mainHandler = Handler()
    private val actionDismiss = Runnable {...}

    override fun onVisibilityChanged(changedView: View, visibility: Int) {
        super.onVisibilityChanged(changedView, visibility)
        if (changedView != this) return
        if (visibility == VISIBLE) {
            show()
        } else {
            cancelAnim()
        }
    }

    private fun cancelAnim() {
        mainHandler.removeCallbacks(actionDismiss)
        ...
    }
}
```

**XXXView**继承**ConstraintLayout**，在**XXXView**中，重写了`onVisibilityChanged`，当判断为隐藏时，调用`cancelAnim`方法取消动画，其具体实现会通过成员变量`mainHandler`的`removeCallbacks`方法移除延时动画任务避免内存泄漏，该`mainHandler`对象在声明时实例化。

- 开发调试手机为：OPPO Reno3 Pro，Android 10（Q），SDK 29。
- 异常上报手机为：OPPO R9，Android 5.1（L_MR1），SDK 22。

---
## 二、 分析

从堆栈看，**XXXView**在实例化时，访问了**XXXView**的全局变量，此时变量还未实例化，导致NPE。

我们所知的一个对象实例化过程为：初始化成员变量->调用init函数->调用构造函数，这可以通过一个简单的demo证明：
```kotlin
class Demo {

    companion object {
        private const val TAG = "Demo"
    }

    private val obj = Any().apply {
        Log.i(TAG, "member variable")
    }

    constructor() {
        Log.i(TAG, "constructor")
    }

    init {
        Log.i(TAG, "init")
    }
}
```

该`Demo`类实例化日志为：

![](static/blog/image/ViewInitNPEDemo1.png)

按此顺序，理论上不存在构造方法中访问成员变量时还未初始化的问题。

接下来将从多个方向深入分析。

---
### 1. 指令重排序

指令重排序发生在编译期间，是编译器进行的优化操作，可能会将编译器认为不影响执行结果的代码进行顺序交换。例如：
```kotlin
val a = 1
val b = 2
val c = a + b
```

从逻辑上来看，a和b的赋值语句之间没有其他语句，这两行的顺序不会影响后续c的结果，那么编译时这两行可能会被置换顺序。

由于都是同一个kotlin文件的编译产物，不可能在运行时产生不同效果，因此排除了编译时指令重排序的可能。

---
### 2. 编写Demo复现问题

该问题的特殊性在于继承了父类，父类的构造方法间接调用了被子类重写的方法。

按照crash堆栈中的类关系和关键方法调用栈，编写一个简单的Demo，并补全日志：

![](static/blog/image/ViewInitNPEDemo2.png)

实例化**Child**类时同样发生了crash，堆栈如下：
```kotlin
2021-04-19 15:17:17.586 12720-12720/com.zengyu.demo I/Parent: member variable
2021-04-19 15:17:17.586 12720-12720/com.zengyu.demo I/Parent: init
2021-04-19 15:17:17.586 12720-12720/com.zengyu.demo I/Parent: constructor
2021-04-19 15:11:46.335 12328-12328/com.zengyu.demo D/AndroidRuntime: Shutting down VM
2021-04-19 15:11:46.337 12328-12328/com.zengyu.demo E/AndroidRuntime: FATAL EXCEPTION: main
     ...
     Caused by: java.lang.NullPointerException: Attempt to invoke virtual method 'java.lang.String java.lang.Object.toString()' on a null object reference
        at com.zengyu.demo.Child.method(Child.kt:16)
        at com.zengyu.demo.Parent.<init>(Parent.kt:10)
        at com.zengyu.demo.Child.<init>(Child.kt:10)
        at com.zengyu.demo.MainActivity.onCreate(MainActivity.kt:10)
        at android.app.Activity.performCreate(Activity.java:7963)
        at android.app.Activity.performCreate(Activity.java:7952)
        ...
```

这和本文的问题如出一辙。

查看**Child**类的字节码，其中类实例化函数`<init>`对应如下：
```class
  // access flags 0x1
  public <init>()V
   L0
    LINENUMBER 15 L0
    ALOAD 0
    INVOKESPECIAL com/zengyu/demo/Parent.<init> ()V
   L1
    LINENUMBER 11 L1
    ALOAD 0
    NEW java/lang/Object
    DUP
    INVOKESPECIAL java/lang/Object.<init> ()V
    ASTORE 1
   L2
    ICONST_0
    ISTORE 2
   L3
    ICONST_0
    ISTORE 3
   L4
    ALOAD 1
    ASTORE 4
    ASTORE 6
   L5
    ICONST_0
    ISTORE 5
   L6
    LINENUMBER 12 L6
    LDC "Child"
    LDC "member variable"
    INVOKESTATIC android/util/Log.i (Ljava/lang/String;Ljava/lang/String;)I
    POP
   L7
    LINENUMBER 13 L7
    NOP
   L8
    GETSTATIC kotlin/Unit.INSTANCE : Lkotlin/Unit;
    ASTORE 7
    ALOAD 6
   L9
    LINENUMBER 11 L9
   L10
    ALOAD 1
   L11
    PUTFIELD com/zengyu/demo/Child.obj : Ljava/lang/Object;
   L12
    LINENUMBER 19 L12
    NOP
   L13
    LINENUMBER 20 L13
    LDC "Child"
    LDC "init"
    INVOKESTATIC android/util/Log.i (Ljava/lang/String;Ljava/lang/String;)I
    POP
   L14
    LINENUMBER 21 L14
   L15
    LINENUMBER 16 L15
    LDC "Child"
    LDC "constructor"
    INVOKESTATIC android/util/Log.i (Ljava/lang/String;Ljava/lang/String;)I
    POP
   L16
    RETURN
   L17
    LOCALVARIABLE $this$apply Ljava/lang/Object; L5 L8 4
    LOCALVARIABLE $i$a$-apply-Child$obj$1 I L6 L8 5
    LOCALVARIABLE this Lcom/zengyu/demo/Child; L0 L17 0
    MAXSTACK = 3
    MAXLOCALS = 8
```

指令依次为：
- 调用父类的实例化函数`<init>`
- 初始化成员变量`obj`
- 调用`init`函数
- 调用构造方法`constructor`

而在第一步调用父类实例化函数时，通过被子类重写的方法，访问了子类还未初始化的成员变量，从而导致crash，这便是该问题的根本原因。

---
### 3. 对比SDK差异

在对比测试了其他安卓5.1的手机后，发现该crash为一个必现问题，而在高版本sdk的手机上，均未复现，且执行构造方法后未回调`onVisibilityChanged`。

因此需要结合源码对比二者在调用栈上的差异。

在Android5.1上，[View#setFlags](http://aosp.opersys.com/xref/android-5.1.1_r38/xref/frameworks/base/core/java/android/view/View.java#9774)中：

![](static/blog/image/ViewInitNPESource1.png)

实例化View时便会去回调`onVisibilityChanged`。

在Android6.0上，[View#setFlags](http://aosp.opersys.com/xref/android-6.0.1_r81/xref/frameworks/base/core/java/android/view/View.java#10646)中：

![](static/blog/image/ViewInitNPESource2.png)

回调`onVisibilityChanged`之前会判断`mAttachInfo`是否为空，而`mAttachInfo`赋值的时机是该View被添加到窗口，即绘制第一帧时，且赋值后会回调`onAttachedToWindow`，置空的时机是该View从窗口移除，且置空前会回调`onDetachedFromWindow`。

可见在6.0，谷歌官方已经修复了这个可能导致开发者使用时崩溃的设计不合理的问题：不应该在构造方法中调用一个可被重写的方法。

---
## 三、 解决方案

和原生解决方案保持一致，在重写的方法中进行判断：
```kotlin
    override fun onVisibilityChanged(changedView: View, visibility: Int) {
        super.onVisibilityChanged(changedView, visibility)
        if (!isAttachedToWindow) {
            return
        }
        ...
    }
```

当View绘制第一帧之前，或从窗口移除之后，可见性变化的回调均会被忽略。
