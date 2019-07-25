# RecyclerView使用ItemDecoration绘制分割线

## 一、 摘要

本文介绍使用RecyclerView的抽象内部类ItemDecoration实现ItemView分割线的绘制。

---
## 二、 方法分析

实现分割线的绘制，需要重写两个方法：getItemOffsets()和onDraw()。

### 1. ItemDecoration.getItemOffsets

> public void getItemOffsets(@NonNull Rect outRect, @NonNull View view, @NonNull RecyclerView parent, @NonNull RecyclerView.State state)

看方法名，获取item的偏移量，`outRect`是item的偏移量矩形区域，对其设置四个方向的值，便起到设置该item在四个方向上的偏移量的作用，这个偏移量的实际效果，是扩展item本身的区域，例如：
```java
outRect.set(0, 0, 0, 1);
```
该代码的效果是让这个item的bottom位置空出1dp的高度。

获取当前item对应位置的方法：
```java
int position = parent.getChildAdapterPosition(view);
```

---
### 2. ItemDecoration.onDraw

> public void onDraw(@NonNull Canvas canvas, @NonNull RecyclerView parent, @NonNull RecyclerView.State state)

这个方法就是具体的绘制操作了，该方法中，我们应该和上一个方法保持一致，在位置相对应时才去绘制canvas，我们需要通过遍历`parent`来获取每个item对应的位置：
```java
for (int i = 0; i < parent.getChildCount(); i++) {
    View view = parent.getChildAt(i);
    int position = parent.getChildAdapterPosition(view);
    // TODO draw canvas
}
```

---
### 3. RecyclerView.addItemDecoration

> public void addItemDecoration(@NonNull ItemDecoration decor)

对RecyclerView添加一个Item装饰器

---
### 4. RecyclerView.invalidateItemDecorations

> public void invalidateItemDecorations()

刷新item装饰器，该方法内部会调用装饰器的getItemOffsets()和onDraw()方法。

---
## 三、 示例

假设现在我们的需求是：有一个垂直方向的RecyclerView，在指定位置item的底部加上一条1dp高的分割线：

先自定义一个ItemDecoration：
```java
public class DemoItemDecoration extends RecyclerView.ItemDecoration {

    private final static int DIVIDE_HEIGHT = 1;
    private Context mContext;
    private Paint mPaint;
    private int mDividerPosition;

    public DemoItemDecoration(Context context) {
        mContext = context;
        mPaint = new Paint();
        mPaint.setColor(Color.BLACK);
    }

    public void setPosition(int position) {
        mDividerPosition = position;
    }

    @Override
    public void getItemOffsets(@NonNull Rect outRect, @NonNull View view, @NonNull RecyclerView parent, @NonNull RecyclerView.State state) {
        super.getItemOffsets(outRect, view, parent, state);
        int position = parent.getChildAdapterPosition(view);
        if (position == mDividerPosition) {
            outRect.set(0, 0, 0, dip2px(DIVIDE_HEIGHT));
        }
    }

    @Override
    public void onDraw(@NonNull Canvas canvas, @NonNull RecyclerView parent, @NonNull RecyclerView.State state) {
        super.onDraw(canvas, parent, state);
        for (int i = 0; i < parent.getChildCount(); i++) {
            View view = parent.getChildAt(i);
            int position = parent.getChildAdapterPosition(view);
            if (position == mDividerPosition) {
                drawDivider(canvas, view);
                return;
            }
        }
    }

    /**
     * 在{@link #getItemOffsets}中，我们已经让item底部空出了1dp的位置，现在我们要在这1dp高的区域内填充，实现分割线
     *
     * @param canvas
     * @param view
     */
    private void drawDivider(Canvas canvas, View view) {
        int left = view.getLeft();
        int right = view.getRight();
        int top = view.getBottom();
        int bottom = top + dip2px(DIVIDE_HEIGHT);
        canvas.drawRect(left, top, right, bottom, mPaint);
    }

    private int dip2px(int dip) {
        float density = mContext.getResources().getDisplayMetrics().density;
        return (int) (dip * density + 0.5f);
    }
}
```

然后将这个装饰器应用于RecyclerView上：
```java
private RecyclerView mRecyclerView;
private DemoItemDecoration mItemDecoration;

private void initView(){
    mRecyclerView = findViewById(R.id.rvDemo);
    mItemDecoration = new DemoItemDecoration(this);
    mRecyclerView.addItemDecoration(mItemDecoration);
}

private void updateView(int position){
    mItemDecoration.setPosition(position);
    mRecyclerView.invalidateItemDecorations();
}
```

---
## 四、 总结

在学会使用Item装饰器之前，我们想实现在RecyclerView中插入分割线，可能得定义一个ViewHolder，然后在Adapter中进行适配，如今我们可以利用装饰器更加优雅地实现这个功能。同理，我们可以在Item的顶部加上组名进行分组，比如实现一个联系人列表，组名是大写首字母。