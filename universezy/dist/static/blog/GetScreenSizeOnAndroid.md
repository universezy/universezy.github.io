## 一、 前言

android 4.4（sdk 19）之后，获取屏幕高度需要考虑底部导航栏等decor。网上很多方案是没有考虑这一点的，因此获取到的屏幕高度小于实际高度，误导开发者。

---
## 二、 错误方案

列举几种常见的获取出来高度可能小于实际高度的方案：

1.
```java
DisplayMetrics dm = getApplicationContext().getResources().getDisplayMetrics(); 
int screenWidth = dm.widthPixels; 
int screenHeight = dm.heightPixels; 
```

2.
```java
Display display = getWindowManager().getDefaultDisplay();
int screenWidth  = display.getWidth();
int screenHeight = display.getHeight();
```

3.
```java
WindowManager wm = (WindowManager) getSystemService(Context.WINDOW_SERVICE);
int screenWidth = wm.getDefaultDisplay().getWidth();
int screenHeight = wm.getDefaultDisplay().getHeight();
```

4.
```java
DisplayMetrics outMetrics = new DisplayMetrics();
getWindowManager().getDefaultDisplay().getMetrics(outMetrics);
int screenWidth = outMetrics.widthPixels;
int screenHeight = outMetrics.heightPixels;
```

---
## 三、 正确方案

以下是供参考的获取完整高度的方案：

1.
```java
WindowManager windowManager = (WindowManager) getApplication().getSystemService(Context.WINDOW_SERVICE);
Display display = windowManager.getDefaultDisplay();
Point outPoint = new Point();
if (Build.VERSION.SDK_INT >= 19) {
	// 可能有虚拟按键的情况
	display.getRealSize(outPoint);
} else {
	// 不可能有虚拟按键
	display.getSize(outPoint);
}
int mRealSizeWidth;//手机屏幕真实宽度
int mRealSizeHeight;//手机屏幕真实高度
mRealSizeHeight = outPoint.y;
mRealSizeWidth = outPoint.x;
```

2.
```java
DisplayMetrics metric = new DisplayMetrics();
getWindowManager().getDefaultDisplay().getRealMetrics(metric);
int width = metric.widthPixels; // 宽度（PX）
int height = metric.heightPixels; // 高度（PX）
```

---
## 四、 源码解读

以上方法的区别在于"getRealSize"和"getRealMetrics"，查看源码：

1.getMetrics：

```java
    /**
     * Gets display metrics that describe the size and density of this display.
     * The size returned by this method does not necessarily represent the
     * actual raw size (native resolution) of the display.
     * <p>
     * 1. The returned size may be adjusted to exclude certain system decor elements
     * that are always visible.
     * </p><p>
     * 2. It may be scaled to provide compatibility with older applications that
     * were originally designed for smaller displays.
     * </p><p>
     * 3. It can be different depending on the WindowManager to which the display belongs.
     * </p><p>
     * - If requested from non-Activity context (e.g. Application context via
     * {@code (WindowManager) getApplicationContext().getSystemService(Context.WINDOW_SERVICE)})
     * metrics will report the size of the entire display based on current rotation and with
     * subtracted system decoration areas.
     * </p><p>
     * - If requested from activity (either using {@code getWindowManager()} or
     * {@code (WindowManager) getSystemService(Context.WINDOW_SERVICE)}) resulting metrics will
     * correspond to current app window metrics. In this case the size can be smaller than physical
     * size in multi-window mode.
     * </p>
     *
     * @param outMetrics A {@link DisplayMetrics} object to receive the metrics.
     */
    public void getMetrics(DisplayMetrics outMetrics) {
        synchronized (this) {
            updateDisplayInfoLocked();
            mDisplayInfo.getAppMetrics(outMetrics, getDisplayAdjustments());
        }
    }
```

- 包含decor时，返回的size可能不准确
- 老式机型下可能不准确
- 可能因WindowManager而改变

2.getRealSize：

```java
    /**
     * Gets the real size of the display without subtracting any window decor or
     * applying any compatibility scale factors.
     * <p>
     * The size is adjusted based on the current rotation of the display.
     * </p><p>
     * The real size may be smaller than the physical size of the screen when the
     * window manager is emulating a smaller display (using adb shell wm size).
     * </p>
     *
     * @param outSize Set to the real size of the display.
     */
    public void getRealSize(Point outSize) {
        synchronized (this) {
            updateDisplayInfoLocked();
            outSize.x = mDisplayInfo.logicalWidth;
            outSize.y = mDisplayInfo.logicalHeight;
        }
    }
```

- 获取的size没有减去任何decor或者考虑缩放因素
- 使用"adb shell wm size"可以查看设备的物理尺寸

3.getRealMetrics：

```java
    /**
     * Gets display metrics based on the real size of this display.
     * <p>
     * The size is adjusted based on the current rotation of the display.
     * </p><p>
     * The real size may be smaller than the physical size of the screen when the
     * window manager is emulating a smaller display (using adb shell wm size).
     * </p>
     *
     * @param outMetrics A {@link DisplayMetrics} object to receive the metrics.
     */
    public void getRealMetrics(DisplayMetrics outMetrics) {
        synchronized (this) {
            updateDisplayInfoLocked();
            mDisplayInfo.getLogicalMetrics(outMetrics,
                    CompatibilityInfo.DEFAULT_COMPATIBILITY_INFO, null);
        }
    }
```

- 基于getRealSize实现

---
## 五、 参考文献

- [Android 获取屏幕高和宽（不包含/包含虚拟按键），状态栏的高度](https://blog.csdn.net/htwhtw123/article/details/79949789)
- [Android获取真正准确的分辨率，拒绝那些瞎扯乱混的文章](https://blog.csdn.net/tc839706407/article/details/50906962)