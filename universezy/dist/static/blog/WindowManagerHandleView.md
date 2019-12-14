# WindowManager操作View源码分析

## 一、 摘要

本文通过源码分析WindowManager的几个重要的操作View的方法：`addView`，`removeView`，`updateViewLayout`等，以及它们隐含的一些风险项。

---
## 二、 WindowManager接口

`WindowManager`接口继承于`ViewManager`接口，`ViewManager`中仅有三个方法，也是我们熟知的那三个方法：

```java
public interface ViewManager {
    public void addView(View view, ViewGroup.LayoutParams params);
    public void updateViewLayout(View view, ViewGroup.LayoutParams params);
    public void removeView(View view);
}
```

而移除View还有一个方法`removeViewImmediate`位于`WindowManager`中。

以上几个接口方法的实现，均位于`WindowManagerImpl`实现类中：
```java
public final class WindowManagerImpl implements WindowManager {
    @UnsupportedAppUsage
    private final WindowManagerGlobal mGlobal = WindowManagerGlobal.getInstance();

    @Override
    public void addView(@NonNull View view, @NonNull ViewGroup.LayoutParams params) {
        // ...
        mGlobal.addView(view, params, mContext.getDisplay(), mParentWindow);
    }

    @Override
    public void updateViewLayout(@NonNull View view, @NonNull ViewGroup.LayoutParams params) {
        // ...
        mGlobal.updateViewLayout(view, params);
    }
    
    @Override
    public void removeView(View view) {
        mGlobal.removeView(view, false);
    }

    @Override
    public void removeViewImmediate(View view) {
        mGlobal.removeView(view, true);
    }
}
```

因此，下面将从`WindowManagerGlobal`入手逐个分析。

---
## 三、 添加View

在`WindowManagerGlobal`中：

```java
public void addView(View view, ViewGroup.LayoutParams params,
        Display display, Window parentWindow) {
    // ...
    ViewRootImpl root;
    // ...
    root = new ViewRootImpl(view.getContext(), display);
    // ...
    root.setView(view, wparams, panelParentView);
    // ...
}
```

将待添加的view传给了`ViewRootImpl`，然后看`ViewRootImpl`中：
```java
public void setView(View view, WindowManager.LayoutParams attrs, View panelParentView) {
    // ...
    mView = view;
    // ...
    // Schedule the first layout -before- adding to the window
    // manager, to make sure we do the relayout before receiving
    // any other events from the system.
    requestLayout();
    // ...
}

@Override
public void requestLayout() {
    // ...
    scheduleTraversals();
    // ...
}

void scheduleTraversals() {
    // ...
    mChoreographer.postCallback(
            Choreographer.CALLBACK_TRAVERSAL, mTraversalRunnable, null);
    // ...
}
```

`Choreographer`这个类中：
```java
/**
 * Posts a callback to run on the next frame.
 * <p>
 * The callback runs once then is automatically removed.
 * </p>
 *
 * @param callbackType The callback type.
 * @param action The callback action to run during the next frame.
 * @param token The callback token, or null if none.
 *
 * @see #removeCallbacks
 * @hide
 */
public void postCallback(int callbackType, Runnable action, Object token) {
    postCallbackDelayed(callbackType, action, token, 0);
}
```

明确说明了回调将在绘制完下一帧之后执行，下一帧的绘制，由native层每隔16毫秒（60帧）发送一个`VSYNC`信号到这里，收到信号后才会执行这里的Runnable，即执行`mTraversalRunnable`。

`mTraversalRunnable`最后执行的是`performTraversals`这个方法：
```java
private void performTraversals() {
    // cache mView since it is used so much below...
    final View host = mView;
    // ...
    if (mFirst) {
        // ...
        host.dispatchAttachedToWindow(mAttachInfo, 0);
        // ...
    }
    // ...
    // Ask host how big it wants to be
    performMeasure(childWidthMeasureSpec, childHeightMeasureSpec);
    // ...
    performLayout(lp, mWidth, mHeight);
    // ...
    performDraw();
    // ...
}
```

此处的host，即刚才`setView`中赋值的view，也就是WM添加的view。在`View`中：
```java
void dispatchAttachedToWindow(AttachInfo info, int visibility) {
    // ...
    onAttachedToWindow();
    // ...
}
```

此时我们看到了`onAttachedToWindow`回调。

综上分析，`onAttachedToWindow`回调发生的时机，是在添加的view绘制第一帧时，并且在`performMeasure`、`performLayout`、`performDraw`之前，因此该回调具有非常严重且明显的延迟性，这也是为什么我们在`onAttachedToWindow`中拿不到View的宽高。

---
## 四、 删除View

`removeView`和`removeViewImmediate`最后都会走到`WindowManagerGlobal`中的同一个方法，只是参数值不同：
```java
public void removeView(View view, boolean immediate) {
    // ...
    removeViewLocked(index, immediate);
    // ...
}
 
private void removeViewLocked(int index, boolean immediate) {
    ViewRootImpl root = mRoots.get(index);
    // ...
    boolean deferred = root.die(immediate);
    // ...
}
```

`ViewRootImpl`中：
```java
/**
 * @param immediate True, do now if not in traversal. False, put on queue and do later.
 * @return True, request has been queued. False, request has been completed.
 */
boolean die(boolean immediate) {
    // Make sure we do execute immediately if we are in the middle of a traversal or the damage
    // done by dispatchDetachedFromWindow will cause havoc on return.
    if (immediate && !mIsInTraversal) {
        doDie();
        return false;
    }

    if (!mIsDrawing) {
        destroyHardwareRenderer();
    } else {
        Log.e(mTag, "Attempting to destroy the window while drawing!\n" +
                "  window=" + this + ", title=" + mWindowAttributes.getTitle());
    }
    mHandler.sendEmptyMessage(MSG_DIE);
    return true;
}

private void performDraw() {
    // ...
    mIsDrawing = true;
    // ...
    boolean canUseAsync = draw(fullRedrawNeeded);
    // ...
    mIsDrawing = false;
    // ...
}
```

- `mIsDrawing`这个标志位在`performDraw`方法中，先赋值为true，绘制结束后赋值为false
- `MSG_DIE`最后也是执行的`die`方法
- 当immediate参数为true并且此时没有处于遍历阶段，则立即销毁
- 否则会在下一次消息轮询中执行销毁。如果当前没有处于绘制阶段，还会销毁硬件渲染器

我们查看这个遍历阶段的标志位：
```java
/** Set to true while in performTraversals for detecting when die(true) is called from internal
 * callbacks such as onMeasure, onPreDraw, onDraw and deferring doDie() until later. */
boolean mIsInTraversal;
```

从这里可以得出，如果当前view处于`onMeasure`，`onPreDraw`，`onDraw`这几个阶段，这个标志位都会让**立即移除**加入到消息队列中，延后执行。

继续追踪`doDie`这个方法：
```java
void doDie() {
    // ...
    dispatchDetachedFromWindow();
    // ...
}

void dispatchDetachedFromWindow() {
    // ...
    mView.dispatchDetachedFromWindow();
    // ...
}
```

此处的mView，即前面`setView`中传入的view，也就是添加的那个view。在`View`中：
```java
void dispatchDetachedFromWindow() {
    // ...
    onDetachedFromWindow();
    // ...
}
```

见到了`onDetachedFromWindow`回调。

综上分析，即便是调用**立即移除**，也可能会延迟到下一次消息轮询中执行，因此无法保证回调的及时性。

---
## 五、 更新View

`updateViewLayout`的流程相对于前两个操作，简单了很多：
```java
public void updateViewLayout(View view, ViewGroup.LayoutParams params) {
    // ...
    final WindowManager.LayoutParams wparams = (WindowManager.LayoutParams)params;
    view.setLayoutParams(wparams);
    // ...
    int index = findViewLocked(view, true);
    ViewRootImpl root = mRoots.get(index);
    // ...
    root.setLayoutParams(wparams, false);
}
```

主要做了两件事：
- 更新view的布局参数
- 更新ViewRootImpl的布局参数

前者更新参数后，会执行一次`requestLayout`方法，而后者：
```java
void setLayoutParams(WindowManager.LayoutParams attrs, boolean newView) {
    // ...
    scheduleTraversals();
}
```

调用`scheduleTraversals`准备绘制下一帧的内容，绘制时将应用更新后的参数值。

---
## 六、 总结

笔者曾经在工作中遇到这样一个场景：
> 对View A调用addView，对View B调用removeView
> 观察log发现，很快回调了B的onDetachedFromWindow，隔了很多log才回调了A的onAttachedToWindow

学习完今天的内容便可以解释：
A在addView之后，进入了mChoreographer的回调队列，等待下一次`vsync`信号，而B在removeView之后，即便处于下一次消息轮询，但在消息队列中的事件不足以多到丢帧的情况下，也会非常快轮询到并执行，因此`onAttachedToWindow`回调远远慢于`onDetachedFromWindow`。

增加View和删除View，都具有延迟性，因此我们不能过于依赖`onAttachedToWindow`和`onDetachedFromWindow`回调，并且WM重复增加或删除同一个View会抛异常。对于高频增删View的场景，我们可以通过设置可见性`setVisibility`来代替实现，这样便可避免像add之后立马remove这种场景导致异常的问题。
