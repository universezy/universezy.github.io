# Android中View的事件分发

## 一、 摘要

介绍Android中View的事件分发流程，以及对事件的消费和拦截。本文基于Android 8.0（Oreo），即API 26。

---
## 二、 View的事件

View有四种基本事件，它们位于MotionEvent中：
- ACTION_DOWN：按压动作开始的标志，事件中包含这个初始位置。
- ACTION_UP：按压结束的标志，事件中包含这个结束位置。
- ACTION_MOVE：按压松开之前的状态，事件中包含当前运动位置。
- ACTION_CANCEL：手势取消了，你应该类比ACTION_UP来处理。

当我们在View上进行交互时，首先硬件层屏幕传感器捕获这些信息，然后通过很复杂的流程传递到Android应用层，即传到我们的Activity中，以事件的形式向下分发到各层的View中进行处理。

---
## 三、 分发涉及的三个核心方法

### 1. 概述
View的事件分发流程涉及到三个核心方法：dispatchTouchEvent()、onTouchEvent()和onInterceptTouchEvent()，这三个方法将事件在Activity、Window、DecorView、ViewGroup、View之间传递。

通过前两章（《[Android中View的绘制流程](https://universezy.github.io/universezy/dist/index.html#/blog/display/RenderProcessOnView)》、《[Android中View的异步消息](https://universezy.github.io/universezy/dist/index.html#/blog/display/AsyncMessage)》）的学习，我们知道了Window、ViewRootImpl、DecorView、ViewGroup、View之间的关系，在源码中，Window只有唯一实现类——PhoneWindow：
```java
/**
 * <p>The only existing implementation of this abstract class is
 * android.view.PhoneWindow, which you should instantiate when needing a
 * Window.
 */
public abstract class Window {...}
```

根据这些知识，我们能够更快地理解事件分发流程。

接下来我们先介绍这三个方法。
- dispatchTouchEvent()存在于Activity、ViewGroup、View中；
- onTouchEvent()也存在于Activity、ViewGroup、View中；
- onInterceptTouchEvent()仅存在于ViewGroup中。

即：
|组件 \ 方法|dispatchTouchEvent|onTouchEvent|onInterceptTouchEvent|
| :- | :-: | :-: | :-: |
|Activity|YES|YES| |
|View|YES|YES| |
|ViewGroup|YES|YES|YES|

从字面意思上看，dispatchTouchEvent和分发触摸事件有关，onTouchEvent和执行触摸事件有关，onInterceptTouchEvent和拦截触摸事件有关。

---
### 2. Activity中

#### 2.1. dispatchTouchEvent()
```java
/**
 * Called to process touch screen events.  You can override this to
 * intercept all touch screen events before they are dispatched to the
 * window.  Be sure to call this implementation for touch screen events
 * that should be handled normally.
 *
 * @param ev The touch screen event.
 *
 * @return boolean Return true if this event was consumed.
 */
public boolean dispatchTouchEvent(MotionEvent ev) {...}
```

- 用于处理触屏事件。
- 你可以重写这个方法来拦截所有的触屏事件，不让他们分发到Window。
- 通常情况下你应该调用这里的具体实现去处理触屏事件。
- 如果事件被消费了，返回true。

---
#### 2.2. onTouchEvent()
```java
/**
 * Called when a touch screen event was not handled by any of the views
 * under it.  This is most useful to process touch events that happen
 * outside of your window bounds, where there is no view to receive it.
 *
 * @param event The touch screen event being processed.
 *
 * @return Return true if you have consumed the event, false if you haven't.
 * The default implementation always returns false.
 */
public boolean onTouchEvent(MotionEvent event) {...}
```

- 当一个触屏事件没有被这个Activity下的任何View处理时，调用该方法。
- 该方法最大的用处是去处理Window边界以外，没有View去响应的触屏事件。
- 如果事件被消费了，返回true。默认返回false。

---
### 3. View中

#### 3.1. dispatchTouchEvent()
```java
/**
 * Pass the touch screen motion event down to the target view, or this
 * view if it is the target.
 *
 * @param event The motion event to be dispatched.
 * @return True if the event was handled by the view, false otherwise.
 */
public boolean dispatchTouchEvent(MotionEvent event) {...}
```

- 将触屏事件向下传递到目标视图，如果当前视图就是目标，则传递到当前视图。
- 如果事件被处理了，返回true。

---
#### 3.2. onTouchEvent()
```java
/**
 * Implement this method to handle touch screen motion events.
 * <p>
 * If this method is used to detect click actions, it is recommended that
 * the actions be performed by implementing and calling
 * {@link #performClick()}. This will ensure consistent system behavior,
 * including:
 * <ul>
 * <li>obeying click sound preferences
 * <li>dispatching OnClickListener calls
 * <li>handling {@link AccessibilityNodeInfo#ACTION_CLICK ACTION_CLICK} when
 * accessibility features are enabled
 * </ul>
 *
 * @param event The motion event.
 * @return True if the event was handled, false otherwise.
 */
public boolean onTouchEvent(MotionEvent event) {...}
```

- 该方法用于处理触屏事件。
- 如果想用这个方法来监听点击动作，建议实现并调用performClick()。这将确保系统行为一致性，包括：遵守点击声音首选项、分发OnClickListener、处理ACTION_CLICK。
- 如果事件被处理了，返回true。

---
### 4. ViewGroup中

#### 4.1. dispatchTouchEvent()

重写了View中的实现。

---
#### 4.2. onTouchEvent()

继承View中的方法。

---
#### 4.3. onInterceptTouchEvent()
```java
/**
 * Implement this method to intercept all touch screen motion events.  This
 * allows you to watch events as they are dispatched to your children, and
 * take ownership of the current gesture at any point.
 *
 * <p>Using this function takes some care, as it has a fairly complicated
 * interaction with {@link View#onTouchEvent(MotionEvent)
 * View.onTouchEvent(MotionEvent)}, and using it requires implementing
 * that method as well as this one in the correct way.  Events will be
 * received in the following order:
 *
 * <ol>
 * <li> You will receive the down event here.
 * <li> The down event will be handled either by a child of this view
 * group, or given to your own onTouchEvent() method to handle; this means
 * you should implement onTouchEvent() to return true, so you will
 * continue to see the rest of the gesture (instead of looking for
 * a parent view to handle it).  Also, by returning true from
 * onTouchEvent(), you will not receive any following
 * events in onInterceptTouchEvent() and all touch processing must
 * happen in onTouchEvent() like normal.
 * <li> For as long as you return false from this function, each following
 * event (up to and including the final up) will be delivered first here
 * and then to the target's onTouchEvent().
 * <li> If you return true from here, you will not receive any
 * following events: the target view will receive the same event but
 * with the action {@link MotionEvent#ACTION_CANCEL}, and all further
 * events will be delivered to your onTouchEvent() method and no longer
 * appear here.
 * </ol>
 *
 * @param ev The motion event being dispatched down the hierarchy.
 * @return Return true to steal motion events from the children and have
 * them dispatched to this ViewGroup through onTouchEvent().
 * The current target will receive an ACTION_CANCEL event, and no further
 * messages will be delivered here.
 */
public boolean onInterceptTouchEvent(MotionEvent ev) {...}
```

- 用于拦截所有的触屏事件。
- 这使你可以在事件被分发到子视图时进行监听，并且在任何时候把控当前手势。
- 使用时需要当心，因为它和onTouchEvent()的交互相当复杂，你得以正确的方式来实现这个方法。
- 按这个顺序接收事件：（1）接收down事件。（2）既可以用这个ViewGroup的子视图，也可以用onTouchEvent()这个方法来处理down事件，这意味着你应该实现onTouchEvent()这个方法并返回true，这样你将看到手势的剩余部分（不要用父视图来处理它）。同样，通过在onTouchEvent()中返回true，你就不会在onInterceptTouchEvent()中收到任何后续事件，并且所有的触摸处理只能在onTouchEvent()中正常进行。（3）只要你从这返回false，接下来的每个事件(直到并包括最终的up事件)都将首先传递到这里，然后传递给目标的onTouchEvent()。（4）如果你从这返回true，你将接收不到以下事件：目标视图会接收相同的事件但是带着ACTION_CANCEL动作，所有其他事件将被传递到onTouchEvent()方法，不再出现在这里。
- 返回true来拦截来自子视图的事件，通过onTouchEvent()来分发它们。当前目标将接收一个ACTION_CANCEL事件，并且此处不会再传递更多的消息。

---
## 四、 事件分发流程

看完了三个核心方法的注释，被一大堆布尔返回值搞懵了，那么我们从方法调用栈下手，分析事件分发的具体流程，分析过程中，我们除了要关注向下传递的事件，还要关注向上传递的返回值，这比一般的方法调用要复杂一些。

在开始介绍流程前，还得搞明白两个术语：消费和拦截。

### 1. 什么是消费

事件被消费，即事件被处理，也就是onTouchEvent()这个方法中的执行情况，因为Activity、ViewGroup和View中都有onTouchEvent()，所以我们将在它们三个中分别介绍消费的情况。

---
### 2. 什么是拦截

拦截，顾名思义，截断事件的传递过程，当事件被拦截后，无法再向下分发，由于拦截的方法onInterceptTouchEvent()仅存于ViewGroup中，因此我们只会在ViewGroup中分析拦截过程。

### 3. Activity中的流程

我们先从Activity的入口——dispatchTouchEvent()开始分析，至于这个入口又是谁在调用，我们调一下顺序，放在后面来介绍。（因为一般情况下，我们只需要研究从Activity这里开始的内容，至于事件的来源，涉及到native部分）
```java
/**
 * 分发
 */
public boolean dispatchTouchEvent(MotionEvent ev) {
    // 事件开始的标志：ACTION_DOWN
    if (ev.getAction() == MotionEvent.ACTION_DOWN) {
        // 你可以重写这个方法，来得知用户用什么方式进行的交互
        onUserInteraction();
    }
    // 将事件分发给Window，如果它消费了，此处也就返回true表示消费了
    if (getWindow().superDispatchTouchEvent(ev)) {
        return true;
    }
    // Window没消费这个事件的话，Activity就自己来处理，并返回消费情况
    return onTouchEvent(ev);
}

/**
 * 消费
 */
public boolean onTouchEvent(MotionEvent event) {
    // 如果需要关闭Window，即结束Activity，就结束，并返回true表示消费了
    if (mWindow.shouldCloseOnTouch(this, event)) {
        finish();
        return true;
    }
    return false;
}

/**
 * 位于Window类中的shouldCloseOnTouch()
 * 主要是根据事件是否出界来判断是否需要关闭
 */
public boolean shouldCloseOnTouch(Context context, MotionEvent event) {
    final boolean isOutside =
            event.getAction() == MotionEvent.ACTION_DOWN && isOutOfBounds(context, event)
            || event.getAction() == MotionEvent.ACTION_OUTSIDE;
    if (mCloseOnTouchOutside && peekDecorView() != null && isOutside) {
        return true;
    }
    return false;
}
```

Activity将事件分发到了Window中，而Window唯一实现类是PhoneWindow，我们直接去PhoneWindow中看此处方法：
```java
@Override
public boolean superDispatchTouchEvent(MotionEvent event) {
    return mDecor.superDispatchTouchEvent(event);
}
```

PhoneWindow将事件分发给了DecorView：
```java
public boolean superDispatchTouchEvent(MotionEvent event) {
    return super.dispatchTouchEvent(event);
}
```

DecorView将事件分发给了父类，我们知道DecorView是继承ViewGroup的，因此这里又将事件分发到了ViewGroup中。

由此可得：
- Activity中，事件被分发到ViewGroup，并返回消费结果。
- 如果ViewGroup返回的消费结果是false，则由Activity自己消费并返回结果。

---
### 4. ViewGroup中的流程
```java
/**
 * 分发
 */
@Override
public boolean dispatchTouchEvent(MotionEvent ev) {
    // ...
    // 事件是否被消费
    boolean handled = false;
    // ...
    final int actionMasked = action & MotionEvent.ACTION_MASK;
    // Handle an initial down.
    if (actionMasked == MotionEvent.ACTION_DOWN) {
        // Throw away all previous state when starting a new touch gesture.
        // The framework may have dropped the up or cancel event for the previous gesture
        // due to an app switch, ANR, or some other state change.
        cancelAndClearTouchTargets(ev);
        // 此处会将mFirstTouchTarget置空
        resetTouchState();
    }
    // 事件是否被拦截
    // Check for interception.
    final boolean intercepted;
    // ACTION_DOWN是事件开始标志，因此在ACTION_DOWN情况下判断拦截
    if (actionMasked == MotionEvent.ACTION_DOWN
            || mFirstTouchTarget != null) {
        final boolean disallowIntercept = (mGroupFlags & FLAG_DISALLOW_INTERCEPT) != 0;
        if (!disallowIntercept) {
            // 由拦截方法返回值判断是否被拦截
            intercepted = onInterceptTouchEvent(ev);
            ev.setAction(action); // restore action in case it was changed
        } else {
            intercepted = false;
        }
    } else {
        // There are no touch targets and this action is not an initial down
        // so this view group continues to intercept touches.
        intercepted = true;
    }
    // ...
    // 如果不取消也不拦截，则向下分发
    if (!canceled && !intercepted) {
        // ...
        // 遍历子View，并寻找事件坐标在界限内的最上层一个子View来分发
        final View[] children = mChildren;
        for (int i = childrenCount - 1; i >= 0; i--) {
            final int childIndex = getAndVerifyPreorderedIndex(
                    childrenCount, i, customOrder);
            final View child = getAndVerifyPreorderedView(
                    preorderedList, children, childIndex);
            // ...
            // 根据子View分发
            if (dispatchTransformedTouchEvent(ev, false, child, idBitsToAssign)) {
                // ...
                // 此处对mFirstTouchTarget实例化
                newTouchTarget = addTouchTarget(child, idBitsToAssign);
                alreadyDispatchedToNewTouchTarget = true;
                break;
            }
            // ...
        }
        // ...
    }
    // Dispatch to touch targets.
    if (mFirstTouchTarget == null) {
        // 根据子View分发
        // No touch targets so treat this as an ordinary view.
        handled = dispatchTransformedTouchEvent(ev, canceled, null,
                TouchTarget.ALL_POINTER_IDS);
    } else {
        // Dispatch to touch targets, excluding the new touch target if we already
        // dispatched to it.  Cancel touch targets if necessary.
        TouchTarget predecessor = null;
        TouchTarget target = mFirstTouchTarget;
        // 循环对子View进行分发，不包括刚才已经分发过的那个
        while (target != null) {
            final TouchTarget next = target.next;
            if (alreadyDispatchedToNewTouchTarget && target == newTouchTarget) {
                handled = true;
            } else {
                final boolean cancelChild = resetCancelNextUpFlag(target.child)
                        || intercepted;
                // 根据子View分发
                if (dispatchTransformedTouchEvent(ev, cancelChild,
                        target.child, target.pointerIdBits)) {
                    handled = true;
                }
                // ...
            }
            predecessor = target;
            target = next;
        }
    }
    if (canceled
            || actionMasked == MotionEvent.ACTION_UP
            || actionMasked == MotionEvent.ACTION_HOVER_MOVE) {
        // 此处会将mFirstTouchTarget置空
        resetTouchState();
    }
    // ...
    return handled;
}

/**
 * 拦截
 */
 public boolean onInterceptTouchEvent(MotionEvent ev) {
    if (ev.isFromSource(InputDevice.SOURCE_MOUSE)
            && ev.getAction() == MotionEvent.ACTION_DOWN
            && ev.isButtonPressed(MotionEvent.BUTTON_PRIMARY)
            && isOnScrollbarThumb(ev.getX(), ev.getY())) {
        return true;
    }
    return false;
}

private boolean dispatchTransformedTouchEvent(MotionEvent event, boolean cancel,
            View child, int desiredPointerIdBits) {
    final boolean handled;
    // ...
    if (child == null) {
        // 没有子View的话，调用父类（即View）的分发方法，并将结果作为消费结果返回
        handled = super.dispatchTouchEvent(transformedEvent);
    } else {
        // 有子View的话，调用子View的分发方法，并将结果作为消费结果返回
        handled = child.dispatchTouchEvent(transformedEvent);
    }
    // ...
    return handled;
}

/**
 * 位于View类中的dispatchTouchEvent()
 * 由于ViewGroup没有重写onTouchEvent()，因此实际上消费的逻辑还是使用的View的消费逻辑
 */
public boolean dispatchTouchEvent(MotionEvent event) {
    // ...
    // 消费的结果
    boolean result = false;
    // ...
    if (!result && onTouchEvent(event)) {
        result = true;
    }
    // ...
    return result;
}

/**
 * 在子View中遍历到目标，则加到链表头部，并且将mFirstTouchTarget实例化
 */
private TouchTarget addTouchTarget(@NonNull View child, int pointerIdBits) {
    final TouchTarget target = TouchTarget.obtain(child, pointerIdBits);
    target.next = mFirstTouchTarget;
    mFirstTouchTarget = target;
    return target;
}
```

整理一下整个过程：
- Activity将事件分发到DecorView（本身也是ViewGroup）的dispatchTouchEvent()。
- ViewGroup先判断事件拦截onInterceptTouchEvent()，如果不拦截，找到目标子View（ViewGroup或者View对象）进行分发，并返回消费结果。
- 如果拦截了，则不再向下分发，而是由ViewGroup自己消费，并返回结果。
- 可能有读者没看明白为什么不拦截最后调用的是super.dispatchTouchEvent()，在dispatchTouchEvent()中有两处调用resetTouchState()来将mFirstTouchTarget置空，因此每次进入dispatchTouchEvent()时，mFirstTouchTarget都为null，只有当不拦截时，才会进入循环体去找到目标子View，并且将mFirstTouchTarget实例化。


---
### 5. View中的流程
```java
/**
 * 分发
 */
public boolean dispatchTouchEvent(MotionEvent event) {
    // ...
    // 消费的结果
    boolean result = false;
    // ...
    if (!result && onTouchEvent(event)) {
        result = true;
    }
    // ...
    return result;
}

/**
 * 消费
 */
public boolean onTouchEvent(MotionEvent event) {
    // ...
    final boolean clickable = ((viewFlags & CLICKABLE) == CLICKABLE
                || (viewFlags & LONG_CLICKABLE) == LONG_CLICKABLE)
                || (viewFlags & CONTEXT_CLICKABLE) == CONTEXT_CLICKABLE;
    // ...
    if (clickable || (viewFlags & TOOLTIP) == TOOLTIP) {
        switch (action) {
            case MotionEvent.ACTION_UP:
                // ...
            case MotionEvent.ACTION_DOWN:
                // ...
            case MotionEvent.ACTION_CANCEL:
                // ...
            case MotionEvent.ACTION_MOVE:
                // ...
        }
        return true;
    }
    return false;
}

/**
 * 指示此视图可在悬停或长按下时显示工具提示。
 * <p>Indicates this view can display a tooltip on hover or long press.</p>
 * {@hide}
 */
static final int TOOLTIP = 0x40000000;
```

View的情况比较简单，很容易理解：
- View作为基类不能再向下分发了，只能消费。
- 如果当前View可点击，就处理事件，并返回true作为消费结果。

---
### 6. Activity中事件来源

Activity中事件来源，也就是谁调用了dispatchTouchEvent()，我们查看方法栈，发现在DecorView中：
```java
@Override
public boolean dispatchTouchEvent(MotionEvent ev) {
    // ...
    final Window.Callback cb = mWindow.getCallback();
    return cb != null && !mWindow.isDestroyed() && mFeatureId < 0
            ? cb.dispatchTouchEvent(ev) : super.dispatchTouchEvent(ev);
}
```

Activity这个类是实现了Window.Callback接口的，因此事件从这里分发到Activity的dispatchTouchEvent()。接下来我们先看看这个mWindow的来源，再去追踪事件的来源：
```java
void setWindow(PhoneWindow phoneWindow) {
    mWindow = phoneWindow;
    Context context = getContext();
    if (context instanceof DecorContext) {
        DecorContext decorContext = (DecorContext) context;
        decorContext.setPhoneWindow(mWindow);
    }
}
```

而这个setWindow()有两处调用：

![](static/blog/image/ViewEvent1.jpg)

实际上，这两处最后都是走到同一个方法中：
```java
private void installDecor() {
    // ...
    if (mDecor == null) {
        // 这里第一处调用
        mDecor = generateDecor(-1);
       // ...
    } else {
        // 这是第二处调用
        mDecor.setWindow(this);
    }
}

protected DecorView generateDecor(int featureId) {
    // ...
    return new DecorView(context, featureId, this, getAttributes());
}

/**
 * 位于DecorView类中的构造方法
 */
DecorView(Context context, int featureId, PhoneWindow window,
    WindowManager.LayoutParams params) {
    // ...
    setWindow(window);
    // ...
}
```

继续，追踪installDecor()的调用：

![](static/blog/image/ViewEvent2.jpg)

这个方法有好几处调用，我们发现了其中有熟悉的方法——setContentView()，这是我们在Activity的onCreate()中用来加载xml文件，即ViewGroup的方法，于是我们查看它在Activity中的调用：
```java
public void setContentView(@LayoutRes int layoutResID) {
    getWindow().setContentView(layoutResID);
    initWindowDecorActionBar();
}
```

好了，到了这里我们不再继续往下找，因为后面涉及到Activity加载机制，为了不偏离本文主题，将在另外的文章中学习到。

至此我们来理一理：

(1) Activity在onCreate()中调用setContentView()，Window对象也调用setContentView()；
(2) Window的setContentView()中，对DecorView实例化；
(3) 当事件分发到DecorView时，DecorView通过构造方法传进来的Window对象的回调，将事件又分发到Activity的dispatchTouchEvent()；

现在，我们开始分析，是谁将事件分发到DecorView的，由于dispatchTouchEvent()的调用者太多，我们很难下手，因此我们改变一下思路，放弃逆推，选择顺推试试。从入参MotionEvent下手，并且尽可能朝着我们熟悉的这些组件去推理。

MotionEvent继承于InputEvent，根据依赖倒置原则，我们去追踪InputEvent在哪儿产生，发现一个叫InputEventReceiver的类，这个类中有一个方法：
```java
// Called from native code.
@SuppressWarnings("unused")
private void dispatchInputEvent(int seq, InputEvent event, int displayId) {
    mSeqMap.put(event.getSequenceNumber(), seq);
    onInputEvent(event, displayId);
}
```

由native层调用，当输入事件产生并分发到这里后，调用onInputEvent()，我们再看这个onInputEvent()：

![](static/blog/image/ViewEvent3.jpg)

里面一处调用位于ViewRootImpl：WindowInputEventReceiver，然后到ViewRootImpl中看看：
```java
final class WindowInputEventReceiver extends InputEventReceiver {
    @Override
    public void onInputEvent(InputEvent event, int displayId) {
        // ...
        // 将输入事件入列
        enqueueInputEvent(event, this, 0, true);
    }
}

void enqueueInputEvent(InputEvent event,
            InputEventReceiver receiver, int flags, boolean processImmediately) {
    // ...
    // 如果是立即执行
    if (processImmediately) {
        // 处理输入事件
        doProcessInputEvents();
    } else {
        // 调度输入事件，通过Handler-Message最终也是调用doProcessInputEvents()
        scheduleProcessInputEvents();
    }
}

void doProcessInputEvents() {
    // ...
    // 传递输入事件
    deliverInputEvent(q);
    // ...
}

private void deliverInputEvent(QueuedInputEvent q) {
    // ...
    InputStage stage;
    if (q.shouldSendToSynthesizer()) {
        stage = mSyntheticInputStage;
    } else {
        stage = q.shouldSkipIme() ? mFirstPostImeInputStage : mFirstInputStage;
    }
    // ...
    if (stage != null) {
        handleWindowFocusChanged();
        // 传递有序的输入事件
        stage.deliver(q);
    } else {
        finishInputEvent(q);
    }
}
```

此时我们得去追踪这个InputStage对象具体是哪一个实例，我们去查看这三个实例的初始化，发现是在同一个地方：
```java
public void setView(View view, WindowManager.LayoutParams attrs, View panelParentView) {
    synchronized (this) {
        if (mView == null) {
            // ...
            // Set up the input pipeline.
            CharSequence counterSuffix = attrs.getTitle();
            mSyntheticInputStage = new SyntheticInputStage();
            InputStage viewPostImeStage = new ViewPostImeInputStage(mSyntheticInputStage);
            InputStage nativePostImeStage = new NativePostImeInputStage(viewPostImeStage,
                    "aq:native-post-ime:" + counterSuffix);
            InputStage earlyPostImeStage = new EarlyPostImeInputStage(nativePostImeStage);
            InputStage imeStage = new ImeInputStage(earlyPostImeStage,
                    "aq:ime:" + counterSuffix);
            InputStage viewPreImeStage = new ViewPreImeInputStage(imeStage);
            InputStage nativePreImeStage = new NativePreImeInputStage(viewPreImeStage,
                    "aq:native-pre-ime:" + counterSuffix);

            mFirstInputStage = nativePreImeStage;
            mFirstPostImeInputStage = earlyPostImeStage;
        }
    }
}
```

这是什么操作？不明觉厉，这几个类都继承于InputStage，那就看看InputStage里面：
```java
/**
 * 用于实现处理输入事件的责任链阶段的基类。
 * 事件通过deliver()传递到该阶段，在此，可选择完成事件或者传递到下个阶段。
 */
abstract class InputStage {
    private final InputStage mNext;

    protected static final int FORWARD = 0;
    protected static final int FINISH_HANDLED = 1;
    protected static final int FINISH_NOT_HANDLED = 2;

    /**
     * 创建一个输入事件阶段
     * @param next 下个阶段
     */
    public InputStage(InputStage next) {
        mNext = next;
    }

    /**
     * 传递一个事件来处理
     */
    public final void deliver(QueuedInputEvent q) {
        if ((q.mFlags & QueuedInputEvent.FLAG_FINISHED) != 0) {
            forward(q);
        } else if (shouldDropInputEvent(q)) {
            finish(q, false);
        } else {
            apply(q, onProcess(q));
        }
    }

    /**
     * 将事件标记为完成了，并传递到下个阶段
     */
    protected void finish(QueuedInputEvent q, boolean handled) {
        q.mFlags |= QueuedInputEvent.FLAG_FINISHED;
        if (handled) {
            q.mFlags |= QueuedInputEvent.FLAG_FINISHED_HANDLED;
        }
        forward(q);
    }

    /**
     * 传递事件到下个阶段
     */
    protected void forward(QueuedInputEvent q) {
        onDeliverToNext(q);
    }

    /**
     * 将onProcess()的结果码应用于指定事件
     */
    protected void apply(QueuedInputEvent q, int result) {
        if (result == FORWARD) {
            forward(q);
        } else if (result == FINISH_HANDLED) {
            finish(q, true);
        } else if (result == FINISH_NOT_HANDLED) {
            finish(q, false);
        } else {
            throw new IllegalArgumentException("Invalid result: " + result);
        }
    }

    /**
     * 处理事件时调用
     * @return 事件处理结果
     */
    protected int onProcess(QueuedInputEvent q) {
        return FORWARD;
    }

    /**
     * 传递事件到下个阶段时调用
     */
    protected void onDeliverToNext(QueuedInputEvent q) {
        if (DEBUG_INPUT_STAGES) {
            Log.v(mTag, "Done with " + getClass().getSimpleName() + ". " + q);
        }
        if (mNext != null) {
            mNext.deliver(q);
        } else {
            finishInputEvent(q);
        }
    }
    // ...
}
```

大致意思就是，有一条责任链，当事件传递到链首，开始处理或向后传递。

结合ViewRootImpl中的责任链构造过程，我们去查看跟View有关的ViewPostImeInputStage，假设此时事件传递到这个阶段，由于它的内部没有重写deliver()，而是重写了onProcess()，那么其调用deliver()的情况是：
```java
/**
 * Delivers post-ime input events to the view hierarchy.
 */
final class ViewPostImeInputStage extends InputStage {
    // 继承父类的方法
    public final void deliver(QueuedInputEvent q) {
        if ((q.mFlags & QueuedInputEvent.FLAG_FINISHED) != 0) {
            forward(q);
        } else if (shouldDropInputEvent(q)) {
            finish(q, false);
        } else {
            apply(q, onProcess(q));
        }
    }

    @Override
    protected int onProcess(QueuedInputEvent q) {
        if (q.mEvent instanceof KeyEvent) {
            return processKeyEvent(q);
        } else {
            final int source = q.mEvent.getSource();
            if ((source & InputDevice.SOURCE_CLASS_POINTER) != 0) {
                return processPointerEvent(q);
            } else if ((source & InputDevice.SOURCE_CLASS_TRACKBALL) != 0) {
                return processTrackballEvent(q);
            } else {
                return processGenericMotionEvent(q);
            }
        }
    }
}
```

onProcess()中的四个process方法中，观察processPointerEvent()发现其中出现了View事件类型：
```java
private int processPointerEvent(QueuedInputEvent q) {
    // ...
    boolean handled = mView.dispatchPointerEvent(event);
    int action = event.getActionMasked();
    if (!SCROLL_BOOST_SS_ENABLE) {
        if (action == MotionEvent.ACTION_MOVE) {
            mHaveMoveEvent = true;
        } else if (action == MotionEvent.ACTION_UP) {
            mHaveMoveEvent = false;
            mIsPerfLockAcquired = false;
        }
    }
    // ...
}
```

而另一个更关键的信息是mView.dispatchPointerEvent(event)，查看其具体实现：
```java
/**
 * Dispatch a pointer event.
 * <p>
 * Dispatches touch related pointer events to {@link #onTouchEvent(MotionEvent)} and all
 * other events to {@link #onGenericMotionEvent(MotionEvent)}.  This separation of concerns
 * reinforces the invariant that {@link #onTouchEvent(MotionEvent)} is really about touches
 * and should not be expected to handle other pointing device features.
 * </p>
 *
 * @param event The motion event to be dispatched.
 * @return True if the event was handled by the view, false otherwise.
 * @hide
 */
public final boolean dispatchPointerEvent(MotionEvent event) {
    if (event.isTouchEvent()) {
        return dispatchTouchEvent(event);
    } else {
        return dispatchGenericMotionEvent(event);
    }
}
```

- 分发指针事件。
- 触摸相关的事件分发给onTouchEvent()。
- 其他事件分发给onGenericMotionEvent()。

我们知道了ViewRootImpl中的这个mView实例其实是DecorView对象，DecorView中正好对dispatchTouchEvent()进行了重写，那就是这一节最开始我们看到的具体实现。整理下这部分整个流程：

- native层将事件传递到ViewRootImpl中。
- ViewRootImpl将事件分发到DecorView中。
- DecorView通过Window.Callback将事件分发到Activity中。
- 然后再接上前面从Activity到ViewGroup再到View的流程。

至此，关于View中触摸事件的来龙去脉，我们已经全部梳理完成。

---
### 7. 事件分发整体流程

![](static/blog/image/ViewEvent4.jpg)

---
## 五、 参考文献

- [Android事件分发机制详解：史上最全面、最易懂](https://www.jianshu.com/p/38015afcdb58)
- [一文读懂Android View事件分发机制](https://www.jianshu.com/p/238d1b753e64)
- [Activity dispatchTouchEvent事件分发的源头](https://blog.csdn.net/conan9715/article/details/78529055)