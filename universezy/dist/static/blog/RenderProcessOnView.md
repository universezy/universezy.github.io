# Android中View的绘制流程

## 一、 摘要

介绍Android中View的绘制流程，以及更新视图的两种方法：invalidate和requestLayout。

---
## 二、 ViewRootImpl

### 1. ViewRootImpl是什么

在API文档中如此描述ViewRootImpl：
```java
/**
 * The top of a view hierarchy, implementing the needed protocol between View
 * and the WindowManager.  This is for the most part an internal implementation
 * detail of {@link WindowManagerGlobal}.
 *
 * {@hide}
 */
```

- View层次结构的顶层。
- 在view和WindowManager之间实现所需的协议。
- WindowManagerGlobal的内部实现细节。

简而言之，ViewRootImpl起到了一个从WindowManager到View的桥梁作用。因此我们先从ViewRootImpl讲起。

---
### 2. ViewRootImpl的具体流程

#### 2.1 performTraversals

一个核心的方法：performTraversals，我们通过方法调用倒推：
> performTraversals <- doTraversal <- TraversalRunnable <- scheduleTraversals

而这个scheduleTraversals，进行搜索可以发现，它在ViewRootImpl的很多事件中都有调用，这些事件包括对View变化的处理（可以看到有我们熟悉的两个刷新视图的方法invalidate和requestLayout）：

![](https://raw.githubusercontent.com/universezy/TrilogyOfViewOnAndroid/master/image/scheduleTraversals.png)

因此我们要从performTraversals下手分析。

在源码中，performTraversals有超过800行代码，所以这里直接讲解其中的关键点：
```java
private void performTraversals() {
    // 后面可能出现名为host的实例，这个实例其实就是此ViewRootImpl中的View实例
    final View host = mView;
    // 中间包含了很多方法不是初始化时执行的，而是当视图发生变化需要重新绘制时调用的，可以通过if中条件的改变情况了解

    // 处理View的宽高约束条件，即MATCH_PARENT、WRAP_CONTENT或具体长度
    int childWidthMeasureSpec = getRootMeasureSpec(mWidth, lp.width);
    int childHeightMeasureSpec = getRootMeasureSpec(mHeight, lp.height);
    performMeasure(childWidthMeasureSpec, childHeightMeasureSpec);

    /** 
     * 特意列出这部分，在此处理LayoutParams布局参数的权重，即线性布局中设置的weight值，进行二次测量，并向子组件分发，
     * 这将对UI的加载造成很大的额外负担，从而降低UI的渲染效率，因此在Android性能优化中，建议开发者尽可能避免使用权重
     */
    if (lp.horizontalWeight > 0.0f) {
        width += (int) ((mWidth - width) * lp.horizontalWeight);
        childWidthMeasureSpec = MeasureSpec.makeMeasureSpec(width,
                MeasureSpec.EXACTLY);
        measureAgain = true;
    }
    if (lp.verticalWeight > 0.0f) {
        height += (int) ((mHeight - height) * lp.verticalWeight);
        childHeightMeasureSpec = MeasureSpec.makeMeasureSpec(height,
                MeasureSpec.EXACTLY);
        measureAgain = true;
    }

    if (measureAgain) {
        if (DEBUG_LAYOUT) Log.v(mTag,
                "And hey let's measure once more: width=" + width
                + " height=" + height);
        performMeasure(childWidthMeasureSpec, childHeightMeasureSpec);
    }

    // 将视图布置在正确位置
    performLayout(lp, mWidth, mHeight);

    // 绘制视图的内容
    performDraw();
}
```

---
#### 2.2. performMeasure

在这个方法中，通过WindowManager和各种参数形成一个约束，通过View的measure方法向下传递并，让View去获得最终宽高：
> mView.measure(childWidthMeasureSpec, childHeightMeasureSpec);

为什么此处不能获得具体宽高呢？举个例子，当前View包含了一些子View，当前View设置为WRAP_CONTENT，那么是不是就必须先获得子View的宽高后，才能得到当前View的宽高了呢？同样的，如果使用线性布局+权重值的方式设置宽高，也无法在此时获得准确值。

---
#### 2.3 performLayout

在这个方法中，入参的布局参数包含了视图的坐标，再加上另两个参数宽高，便可以定位视图，通过View的layout方法向下传递并设置：

> host.layout(0, 0, host.getMeasuredWidth(), host.getMeasuredHeight());

读者可能会觉得奇怪，为什么前两个参数是0？因为这四个参数其实并不是绝对坐标，而是相对父组件的相对坐标，具体分析将在后面讲解。

---
#### 2.4 performDraw

这个方法中，做了很多复杂的操作，我们关心的draw具体实现的调用，绕了一些远路，首先通过
> boolean canUseAsync = draw(fullRedrawNeeded);

调用draw这个方法，然后通过
> if (!drawSoftware(surface, mAttachInfo, xOffset, yOffset, scalingRequired, dirty, surfaceInsets))

调用drawSoftware这个方法，最后再通过
> mView.draw(canvas);

调用视图绘制的具体方法。

---
## 三、 View

### 1. View是什么

```java
/**
 * This class represents the basic building block for user interface components. A View
 * occupies a rectangular area on the screen and is responsible for drawing and
 * event handling. View is the base class for <em>widgets</em>, which are
 * used to create interactive UI components (buttons, text fields, etc.). The
 * {@link android.view.ViewGroup} subclass is the base class for <em>layouts</em>, which
 * are invisible containers that hold other Views (or other ViewGroups) and define
 * their layout properties.
 */
 ```

 - View是UI组件的基本构建块。
 - View在屏幕上占据一个矩形区域（所以我们想要各种不规则形状，都应该在View的绘制阶段实现），负责绘图和事件处理。
 - View是小部件的基类，小部件用于创建交互式UI组件(例如按钮Button、文本字段TextView等)。
 - ViewGroup子类是布局的基类，布局是不可见的容器，包含其他View(或其他ViewGroup)并定义它们的布局属性。

---
### 2. View中的核心方法

### 2.1. measure

```java
/**
 * <p>
 * This is called to find out how big a view should be. The parent
 * supplies constraint information in the width and height parameters.
 * </p>
 *
 * <p>
 * The actual measurement work of a view is performed in
 * {@link #onMeasure(int, int)}, called by this method. Therefore, only
 * {@link #onMeasure(int, int)} can and must be overridden by subclasses.
 * </p>
 *
 *
 * @param widthMeasureSpec Horizontal space requirements as imposed by the
 *        parent
 * @param heightMeasureSpec Vertical space requirements as imposed by the
 *        parent
 *
 * @see #onMeasure(int, int)
 */
public final void measure(int widthMeasureSpec, int heightMeasureSpec) {...}
```

- 通过入参的约束条件，我们可以计算得到View的实际大小。
- measure会调用onMeasure并在其中实现具体的测量工作。
- onMeasure必须被子类重写。

---
### 2.2. layout

```java
/**
 * Assign a size and position to a view and all of its
 * descendants
 *
 * <p>This is the second phase of the layout mechanism.
 * (The first is measuring). In this phase, each parent calls
 * layout on all of its children to position them.
 * This is typically done using the child measurements
 * that were stored in the measure pass().</p>
 *
 * <p>Derived classes should not override this method.
 * Derived classes with children should override
 * onLayout. In that method, they should
 * call layout on each of their children.</p>
 *
 * @param l Left position, relative to parent
 * @param t Top position, relative to parent
 * @param r Right position, relative to parent
 * @param b Bottom position, relative to parent
 */
@SuppressWarnings({"unchecked"})
public void layout(int l, int t, int r, int b) {...}
```

- 为View及其所有子View分配大小和位置。
- 这是布局机制的第二阶段。(第一阶段即measure)。在这个阶段，每个父元素调用它的所有子元素的layout来定位它们。
- 这通常是使用存储在measure pass()中的子度量来完成的。
- 派生类不应重写此方法，而应该重写onLayout。在onLayout中，他们应该调用每个子元素的layout。
- 四个入参均为相对父View的位置。
- layout中会调用onLayout。

---
### 2.3. draw

```java
/**
 * Manually render this view (and all of its children) to the given Canvas.
 * The view must have already done a full layout before this function is
 * called.  When implementing a view, implement
 * {@link #onDraw(android.graphics.Canvas)} instead of overriding this method.
 * If you do need to override this method, call the superclass version.
 *
 * @param canvas The Canvas to which the View is rendered.
 */
@CallSuper
public void draw(Canvas canvas) {...}
```

- 手动将此视图(及其所有子视图)呈现到给定画布。
- 在调用此方法之前，View必须已经完成了完整的布局（前一个阶段layout）。
- 在实现View时，实现onDraw这个方法，不要重写本方法。
- 如果确实需要重写本方法，请调用父类的具体实现。
- draw中会调用onDraw。

draw中的绘制步骤为（跳过非必须的两步）：

(1) Draw the background
> drawBackground(canvas);

(2) Draw view's content
> onDraw(canvas);

(3) Draw children
> dispatchDraw(canvas);

(4) Draw decorations
> onDrawForeground(canvas);

(5) Draw highlight
> drawDefaultFocusHighlight(canvas);

---
## 四、 整体绘制流程

![](https://raw.githubusercontent.com/universezy/TrilogyOfViewOnAndroid/master/image/RenderProcess.png)

---
## 五、 更新视图

更新视图有两种方式：invalidate和requestLayout。下面分别对这两种方式进行介绍。

### 1. invalidate

在class注释中这样描述到：
```java
/**
 * To force a view to draw, call {@link #invalidate()}.
 */
```

可知该方法与视图的draw阶段有关。

再看invalidate的注释：
```java
/**
 * Invalidate the whole view. If the view is visible,
 * {@link #onDraw(android.graphics.Canvas)} will be called at some point in
 * the future.
 * <p>
 * This must be called from a UI thread. To call from a non-UI thread, call
 * {@link #postInvalidate()}.
 */
public void invalidate() {...}
```

- 让整个视图作废。
- 如果视图可见，接下来将调用onDraw()这个方法对Canvas对象进行绘制。
- 必须在UI线程调用该方法，如果要在非UI线程，应该使用postInvalidate()。

沿着invalidate的调用栈，我们追查到了View中的这个方法：
```java
void invalidateInternal(int l, int t, int r, int b, boolean invalidateCache, boolean fullInvalidate) {
    // ...
    final ViewParent p = mParent;
    if (p != null && ai != null && l < r && t < b) {
        final Rect damage = ai.mTmpInvalRect;
        damage.set(l, t, r, b);
        p.invalidateChild(this, damage);
    }
    // ...
}
```

这里的mParent，需要特别注意，在Android的视图模型中，整个UI基于Window之上，这个Window之上首先是前面讲到的ViewRootImpl，ViewRootImpl之上是DecorView，它是一个特殊的View，我们将在后面专门用一篇文章进行讲解，DecorView包含两个部分，ActionBar和ContentParent，ContentParent就是我们xml文件的根节点对应的layout，它是一个ViewGroup。

再回过头来看p.invalidateChild()，由于当前的View可能是普通的View，其mParent是ViewGroup，也可能当前的View已经是DecorView，那么它的mParent就是ViewRootImpl。

我们先来看ViewGroup中的invalidateChild()：
```java
@Override
public final void invalidateChild(View child, final Rect dirty) {
    ViewParent parent = this;
    // ...
    do {
        View view = null;
        if (parent instanceof View) {
            view = (View) parent;
        }

        if (drawAnimation) {
            if (view != null) {
                view.mPrivateFlags |= PFLAG_DRAW_ANIMATION;
            } else if (parent instanceof ViewRootImpl) {
                ((ViewRootImpl) parent).mIsAnimating = true;
            }
        }

        // ...
        parent = parent.invalidateChildInParent(location, dirty);
        // ...
    } while (parent != null);
}
```

通过代码也能看出，此时当前的parent有ViewGroup和ViewRootImlp两种情况，先看ViewGroup中的invalidateChildInParent()：
```java
@Override
public ViewParent invalidateChildInParent(final int[] location, final Rect dirty) {
    if ((mPrivateFlags & (PFLAG_DRAWN | PFLAG_DRAWING_CACHE_VALID)) != 0) {
        // ...
        return mParent;
    }

    return null;
}
```

通过这两部分代码可知，在do-while循环体内，会一直递归去找parent，什么时候为null呢？找到parent为ViewRootImpl时，就停下来了，于是看ViewRootImpl中：
```java
/**
 * 在刚才的View.invalidateInternal中，如果mParent是一个ViewRootImpl，则直接到了这里
 */
@Override
public void invalidateChild(View child, Rect dirty) {
    invalidateChildInParent(null, dirty);
}

/**
 * ViewGroup中通过递归会直接到这里
 */
@Override
public ViewParent invalidateChildInParent(int[] location, Rect dirty) {
    // ...
    if (dirty == null) {
        invalidate();
        return null;
    } else if (dirty.isEmpty() && !mIsAnimating) {
        return null;
    }
    // ...
    invalidateRectOnScreen(dirty);

    return null;
}

private void invalidateRectOnScreen(Rect dirty) {
    // ...
    if (!mWillDrawSoon && (intersected || mIsAnimating)) {
        scheduleTraversals();
    }
}
```

我们看到了在第二章讲述ViewRootImpl的具体流程时说的scheduleTraversals()。现在回到performTraversals()中，结合之前的绘制流程：
```java
private void performTraversals() {
    // ...
    boolean layoutRequested = mLayoutRequested && (!mStopped || mReportNextDraw);
    // ...
    boolean windowShouldResize = layoutRequested && windowSizeMayChange
            && ((mWidth != host.getMeasuredWidth() || mHeight != host.getMeasuredHeight())
                || (lp.width == ViewGroup.LayoutParams.WRAP_CONTENT &&
                        frame.width() < desiredWindowWidth && frame.width() != mWidth)
                || (lp.height == ViewGroup.LayoutParams.WRAP_CONTENT &&
                        frame.height() < desiredWindowHeight && frame.height() != mHeight));
    // ...
    if (mFirst || windowShouldResize || insetsChanged || viewVisibilityChanged || params != null || mForceNextWindowRelayout) {
        // ...
        if (!mStopped || mReportNextDraw) {
            if (focusChangedDueToTouchMode || mWidth != host.getMeasuredWidth()
                            || mHeight != host.getMeasuredHeight() || contentInsetsChanged ||
                            updatedConfiguration) {
                // ...
                performMeasure(childWidthMeasureSpec, childHeightMeasureSpec);
                // ...
                layoutRequested = true;
            }
        }
    }
    // ...
    final boolean didLayout = layoutRequested && (!mStopped || mReportNextDraw);
    // ...
    if (didLayout) {
        performLayout(lp, mWidth, mHeight);
        // ...
    }
    // ...
    performDraw();
    // ...
}

private void performDraw() {
    // ...
    draw(fullRedrawNeeded);
    // ...
}

private void draw(boolean fullRedrawNeeded) {
    // ...
    final Rect dirty = mDirty;
    // ...
    if (!dirty.isEmpty() || mIsAnimating || accessibilityFocusDirty) {
        // ...
        if (!drawSoftware(surface, mAttachInfo, xOffset, yOffset, scalingRequired, dirty)) {
            return;
        }
    }
    // ...
}
```

从这里可以看出：
- 调用performMeasure()的前提条件之一是layoutRequested为true。
- 当视图的尺寸属性发生了变化后，才会调用performMeasure()。
- 调用performLayout()的前提条件是调用了performMeasure()。
- 最初在View.invalidateInternal传入的damege，即此处的mDirty，不为空，因此才能够执行后面的drawSoftware中的mView.draw()。

在前一次绘制流程正常执行结束后，layoutRequested变成了false，因此，如果我们的View只有渲染内容改变，调用invalidate最后只有ViewRootImpl.performDraw()会调用，即：View中的draw()会执行。

现在，我们可以得出一个结论，仅在内容改变的情况下，应当使用View.invalidate()去更新视图。

---
### 2. requestLayout

在class注释中这样描述到：
```java
/**
 * To initiate a layout, call {@link #requestLayout}. This method is typically
 * called by a view on itself when it believes that is can no longer fit within
 * its current bounds.
 */
```

用于初始化布局，当视图现有的边界不适用时，就应该调用该方法。

再看requestLayout的注释：
```java
/**
 * Call this when something has changed which has invalidated the
 * layout of this view. This will schedule a layout pass of the view
 * tree. This should not be called while the view hierarchy is currently in a layout
 * pass ({@link #isInLayout()}. If layout is happening, the request may be honored at the
 * end of the current layout pass (and then layout will run again) or after the current
 * frame is drawn and the next layout occurs.
 *
 * <p>Subclasses which override this method should call the superclass method to
 * handle possible request-during-layout errors correctly.</p>
 */
@CallSuper
public void requestLayout() {
    // ...
    if (mParent != null && !mParent.isLayoutRequested()) {
        mParent.requestLayout();
    }
    // ...
}
```

- 视图的布局无效时调用此方法。
- 此方法将应用到整个视图树。
- 当视图正在进行布局时（可通过isInLayout()判断），不应调用此方法。
- 如果正在布局时调用此方法，将在当前布局过程结束后再次布局，或者下一次绘制布局过程中执行。
- 子类重写此方法时应该调用该超类的具体实现。

同样的，该方法中的mParent也有ViewGroup和ViewRootImpl两种情况，在ViewGroup中，没有对该方法进行重写，因此mParent.requestLayout()也是调用的View中的requestLayout()，最终会递归调用到ViewRootImpl.requestLayout()：
```java
@Override
public void requestLayout() {
    if (!mHandlingLayoutInLayoutRequest) {
        checkThread();
        mLayoutRequested = true;
        scheduleTraversals();
    }
}
```

除了scheduleTraversals()这个方法，还多了一个mLayoutRequested = true，然后我们看performTraversals()中：
```java
private void performTraversals() {
    // ...
    boolean layoutRequested = mLayoutRequested && (!mStopped || mReportNextDraw);
    // ...
    boolean windowShouldResize = layoutRequested && windowSizeMayChange
            && ((mWidth != host.getMeasuredWidth() || mHeight != host.getMeasuredHeight())
                || (lp.width == ViewGroup.LayoutParams.WRAP_CONTENT &&
                        frame.width() < desiredWindowWidth && frame.width() != mWidth)
                || (lp.height == ViewGroup.LayoutParams.WRAP_CONTENT &&
                        frame.height() < desiredWindowHeight && frame.height() != mHeight));
    // ...
    if (mFirst || windowShouldResize || insetsChanged || viewVisibilityChanged || params != null || mForceNextWindowRelayout) {
        // ...
        if (!mStopped || mReportNextDraw) {
            if (focusChangedDueToTouchMode || mWidth != host.getMeasuredWidth()
                            || mHeight != host.getMeasuredHeight() || contentInsetsChanged ||
                            updatedConfiguration) {
                // ...
                performMeasure(childWidthMeasureSpec, childHeightMeasureSpec);
                // ...
                layoutRequested = true;
            }
        }
    }
    // ...
    final boolean didLayout = layoutRequested && (!mStopped || mReportNextDraw);
    // ...
    if (didLayout) {
        performLayout(lp, mWidth, mHeight);
        // ...
    }
    // ...
    performDraw();
    // ...
}

private void performDraw() {
    // ...
    draw(fullRedrawNeeded);
    // ...
}

private void draw(boolean fullRedrawNeeded) {
    // ...
    final Rect dirty = mDirty;
    // ...
    if (!dirty.isEmpty() || mIsAnimating || accessibilityFocusDirty) {
        // ...
        if (!drawSoftware(surface, mAttachInfo, xOffset, yOffset, scalingRequired, dirty)) {
            return;
        }
    }
    // ...
}
```

由上一节可知：
- 此时layoutRequested为true，如果View的尺寸有变化，那就会执行performMeasure()和performLayout()。
- 由于没有传入dirty实例，此处的mDirty为空，也就不会执行后续drawSoftware中的mView.draw()。

至此，我们得出第二个结论，仅当视图的尺寸发生变化时，应该调用View.requestLayout()去更新。

---
### 3. 总结

- 当View的内容发生变化时，应当调用View.invalidate()去更新视图。
- 当View的尺寸发生变化时，应当调用View.requestLayout()去更新视图。
- 当View的内容和尺寸都发生变化时，（按照绘制流程顺序）应当先调用View.requestLayout()再调用View.invalidate()去更新视图。

---
## 六、 参考文献

- [Android View的绘制流程](https://blog.csdn.net/sinat_27154507/article/details/79748010)
- [Android View重绘和更新： invalidate和requestLayout](https://www.cnblogs.com/cfas/p/6427182.html?tdsourcetag=s_pcqq_aiomsg)
- [从源码看invalidate和requestLayout的区别](https://blog.csdn.net/litefish/article/details/52859300)
- [关于View中mParent的来龙去脉](https://www.jianshu.com/p/a6fd2c4db80d)
- [Android DecorView学习](https://www.jianshu.com/p/6a3bca1b36e8)