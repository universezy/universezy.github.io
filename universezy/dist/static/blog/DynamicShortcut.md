# Android动态创建快捷方式

## 一、 摘要

以Android O为分界，介绍两种动态创建快捷方式的途径：广播和ShortcutManager。

---
## 二、 Android O以前

在Android O（8.0）以前，动态创建快捷方式是通过发送广播实现的：
```java
// 由该action可知，我们的创建快捷方式广播会由launcher，也就是系统桌面来接收
public static final String ACTION_INSTALL_SHORTCUT = "com.android.launcher.action.INSTALL_SHORTCUT";

public void createShortcutBelowO(Context ctx, String name, Bitmap icon) {
    Intent shortcutIntent = new Intent(ACTION_INSTALL_SHORTCUT);
    // 快捷方式的名字
    shortcutIntent.putExtra(Intent.EXTRA_SHORTCUT_NAME, name);
    // 快捷方式的bitmap尽可能小，因为广播内容超过2MB会抛出异常
    shortcutIntent.putExtra(Intent.EXTRA_SHORTCUT_ICON, icon);
    // 设置是否允许重复创建快捷方式，该选项非必填，默认是允许
    shortcutIntent.putExtra("duplicate", false);

    // 快捷方式执行的intent，比如启动应用在AndroidManifest中配置的入口Activity
    Intent launchIntent = new Intent();
    launchIntent.setClass(ctx, "com.zengyu.shortcutdemo");

    shortcutIntent.putExtra(Intent.EXTRA_SHORTCUT_INTENT, launchIntent);
    ctx.sendBroadcast(shortcutIntent);
}
```

---
## 三、 Android O以后

Android O（8.0）新增了一个叫ShortcutManager的类：
```java
/**
 * The ShortcutManager manages an app's <em>shortcuts</em>. Shortcuts provide users
 * with quick access to activities other than an app's main activity in the currently-active
 * launcher.  For example,
 * an email app may publish the "compose new email" action, which will directly open the
 * compose activity.  The {@link ShortcutInfo} class contains information about each of the
 * shortcuts themselves.
 */
```

ShortcutManager管理应用的快捷方式。快捷方式为用户提供了一个访问应用的快速渠道。ShortcutInfo类包含了每个快捷方式的信息。

在ShortcutManager的API文档中，其实已经有详细的静态创建和动态创建的介绍，以及创建的具体步骤，但在此我还是以一个简单的例子，直观地展示使用ShortcutManager动态创建：
```java
public void createShortcutAboveO(Context ctx, String name, Bitmap icon) {
    ShortcutManager shortcutManager = (ShortcutManager) ctx.getSystemService(Context.SHORTCUT_SERVICE);
    /**
     * 判断是否支持该方式动态创建
     */
    if (shortcutManager.isRequestPinShortcutSupported()) {
        // 快捷方式执行的intent，比如启动应用在AndroidManifest中配置的入口Activity
        Intent launchIntent = new Intent();
        launchIntent.setClass(ctx, "com.zengyu.shortcutdemo");

        ShortcutInfo.Builder builder = new ShortcutInfo.Builder(context, pkg)
                    .setShortLabel(name)
                    .setIcon(Icon.createWithBitmap(icon))
                    .setIntent(launchIntent);
        /**
         * 第二个参数为弹出创建快捷方式确认框时的回调PendingIntent，此例不关注该回调，因此为null，
         * 如果需要监听该回调，需要自定义一个BroadcastReceiver，可参考参考文献中的例子
         */
        shortcutManager.requestPinShortcut(builder.build(), null);
    }
}
```

其中isRequestPinShortcutSupported方法：
```java
/**
 * Return {@code TRUE} if the app is running on a device whose default launcher supports
 * {@link #requestPinShortcut(ShortcutInfo, IntentSender)}.
 *
 * <p>The return value may change in subsequent calls if the user changes the default launcher
 * app.
 *
 * <p><b>Note:</b> See also the support library counterpart
 * {@link android.support.v4.content.pm.ShortcutManagerCompat#isRequestPinShortcutSupported(
 * Context)}, which supports Android versions lower than {@link VERSION_CODES#O} using the
 * legacy private intent {@code com.android.launcher.action.INSTALL_SHORTCUT}.
 *
 * @see #requestPinShortcut(ShortcutInfo, IntentSender)
 */
public boolean isRequestPinShortcutSupported() {
    try {
        return mService.isRequestPinItemSupported(injectMyUserId(),
                LauncherApps.PinItemRequest.REQUEST_TYPE_SHORTCUT);
    } catch (RemoteException e) {
        throw e.rethrowFromSystemServer();
    }
}
```

判断设备是否支持ShortcutManager的这种方式动态创建快捷方式，如果Android版本低于Android O，使用“com.android.launcher.action.INSTALL_SHORTCUT”这个intent，即我们在上一节中使用的action。因此，如果这个方法返回false，我们应该仍使用广播的方式来动态创建。

---
## 五、 参考文献

- [Android 8.0 快捷方式Shortcut](https://www.jianshu.com/p/c3b862279e38)