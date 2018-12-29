## 一、 摘要

对外部应用提供的Service或AIDL之类的接口，我们想知道是谁调用了这个方法，因此需要获取调用者包名。

---
## 二、 方法示例

### 1. 简单版方法：适用于第三方应用
```java
String invokerPkg = getPackageManager().getNameForUid(Binder.getCallingUid());
```

该方法如果用于获取系统级应用的话，返回的不是真实包名而是"android.uid.system:1000"，因此需要用下一个方法。

### 2. 加强版方法：适用于所有应用
```java
String invokerPkg = getAppPkg(Binder.getCallingPid());

private String getAppPkg(int pid) {
    String processName = "";
    ActivityManager activityManager = (ActivityManager) getSystemService(ACTIVITY_SERVICE);
    if (activityManager != null) {
        List<ActivityManager.RunningAppProcessInfo> list = activityManager.getRunningAppProcesses();
        for (ActivityManager.RunningAppProcessInfo info : list) {
            if (info.pid == pid) {
                processName = info.processName;
                break;
            }
        }
    }
    return processName;
}
```

该方法通过进程ID去遍历运行中的应用，从而获取到应用包名。

---
## 三、 参考文献

- [获取接口调用者的包名](https://blog.csdn.net/wuqingyidongren/article/details/53787705)

- [Android 通过pId获取包名](https://blog.csdn.net/xiaxl/article/details/72457967)