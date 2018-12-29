## 一、 问题日志

- Run tasks中：
```shell
org.gradle.api.tasks.TaskExecutionException: Execution failed for task ':xxxx:transformClassesAndResourcesWithProguardForRelease'.
```

- Java compiler中：
```shell
Warning: there were 4 instances of library classes depending on program classes.
```

---
## 二、 原因分析

gradle依赖的库和引用这个库的代码，其中一个被混淆一个没有被混淆，导致引用时不一致。

---
## 三、 解决方案

网上一些解决方案是忽略该warning，这种方法肯定是存在隐患的，并不能真正解决问题，既然一个混淆，一个没混淆，那么这里给出两种思路，要么都混淆，要么都保留：

### 1. 不混淆报错的二者

- 如果是要保留引用这个库的类，在"proguard-rules.pro"文件中保留：
```
-dontwarn xxx.**
-keep class xxx.**{*;}  // 表示保留该类及其所有方法
```

- 如果是要保留通过gradle依赖的开源库或者从外部导入的jar，在"proguard-rules.pro"文件中保留：
```
-keep class com.example.demo.**{*;}  // com.example.demo为xxxx.jar中的包名，这里表示保留它下面所有的内容
```

### 2. 混淆依赖的库

- 如果是通过gradle依赖的开源库需要被混淆，在"build.gradle"文件中混淆该库：
```
dependencies {
    compile "com.org.example:demo:1.0.0"
    proguard "com.org.example:demo:1.0.0"
}
```

- 如果是从外部导入的jar包，由于很多jar包已经混淆过，所以二次混淆很可能会出问题

---
## 四、 参考文献

- [混淆代码打包时报错：library classes depending on program classes](https://www.xuebuyuan.com/3248567.html)

- [Android Studio 代码混淆(你真的会混淆吗)](https://blog.csdn.net/Two_Water/article/details/70233983)

- [Android 混淆打包不混淆第三方jar包](https://www.cnblogs.com/gavanwanggw/p/6730169.html)

- [android studio 代码混淆如何忽略第三方jar包](https://blog.csdn.net/i374711088/article/details/46786189)

- [解决 The same input jar is specified twice 问题](https://blog.csdn.net/u011484134/article/details/50716855)