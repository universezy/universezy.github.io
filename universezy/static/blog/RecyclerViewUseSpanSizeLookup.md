# RecyclerView使用SpanSizeLookup设置Item占位

## 一、 摘要

本文介绍使用栅栏布局管理器的抽象内部类SpanSizeLookup实现Item占位多行或多列的方法。

---
## 二、 方法分析

### 1. SpanSizeLookup.getSpanSize

> public abstract int getSpanSize(int position)

该方法返回position这个位置对应item所占的位数，默认情况下，每一个item占1个位。

---
### 2. GridLayoutManager

> public GridLayoutManager(Context context, int spanCount)

栅栏布局管理器，构造方法传入列数，创建一个垂直方向的管理器。因此使用该管理器的RecyclerView将具有水平方向填补、垂直方向滑动的表现性质。

---
### 3. GridLayoutManager.setSpanSizeLookup

> public void setSpanSizeLookup(SpanSizeLookup spanSizeLookup)

给栅栏布局管理器设置SpanSizeLookup对象。

---
## 三、 示例

假设现在的需求是奇数位置item占位为1，偶数位置item占位为2：

先定义一个SpanSizeLookup：

```java
public class DemoSpanSizeLookup extends GridLayoutManager.SpanSizeLookup {
    private final int mSpanCount;

    public DemoSpanSizeLookup(int spanCount) {
        mSpanCount = spanCount;
    }

    @Override
    public int getSpanSize(int position) {
        if (position % 2 == 0) {
            return mSpanCount;
        } else {
            return 1;
        }
    }
}
```

然后应用于RecyclerView上：

```java
private static final int COLUMN_COUNT = 3;
private static final int COLUMN_EVEN = 2;

private RecyclerView mRecyclerView;
private DemoSpanSizeLookup mSpanSizeLookup;

private void initView(){
    mRecyclerView = findViewById(R.id.rvDemo);
    mSpanSizeLookup = new DemoSpanSizeLookup(COLUMN_EVEN);
    GridLayoutManager layoutManager = new GridLayoutManager(getContext(), COLUMN_COUNT);
    layoutManager.setSpanSizeLookup(mSpanSizeLookup);
    mRecyclerView.setLayoutManager(layoutManager);
}
```

需要注意，SpanSizeLookup中的占位数别超过栅栏布局管理器的列数。
