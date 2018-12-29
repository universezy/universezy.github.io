## 一、 问题描述

如下所示，调用recorder.stop()时抛出异常：
```shell
Caused by: java.lang.RuntimeException: stop failed.
        at android.media.MediaRecorder.stop(Native Method)
```

---
## 二、 分析原因

start和stop间隔时间太短:
![源码分析](https://img-blog.csdn.net/20180726191317556?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3p5MTM2MDgwODk4NDk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

---
## 三、 解决方案

调用stop()之前将OnErrorListener、OnInfoListener和PreviewDisplay置空:
```java
recorder.setOnErrorListener(null);
recorder.setOnInfoListener(null);
recorder.setPreviewDisplay(null);
try {
    recorder.stop();
} catch (IllegalStateException e) {
    e.printStackTrace();
} catch (RuntimeException e) {
    e.printStackTrace();
} catch (Exception e) {
    e.printStackTrace();
}
```

---
## 四、 参考文献

- [解决Android MediaRecorder录制视频过短问题](https://www.jb51.net/article/89014.htm)
- [我的Android进阶之旅------>Android中MediaRecorder.stop()报错 java.lang.RuntimeException: stop failed.【转】](https://www.cnblogs.com/zzb-Dream-90Time/p/7736386.html)