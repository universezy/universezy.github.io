## 一、 错误日志

修改AIDL中的方法入参后出现以下编译错误：
```shell
Process 'command '/home/zengyu/Android/Sdk/build-tools/26.0.3/aidl'' finished with non-zero exit value 1
```

---
## 二、 问题原因

两种可能：

1. AIDL和java的同一个方法的入参不一致。

2. 入参类型不是AIDL支持的，需要对入参加上定向tag：in或out或inout。

---
## 三、 解决方案

先检查入参是否需要加定向tag，没问题后检查入参是否一致。

---
## 四、 参考文献

- [android AIDL 编译错误，finished with non-zero exit value 1](https://blog.csdn.net/feihuiwu123/article/details/51785433)

- [Android：学习AIDL，这一篇文章就够了(上)](https://www.jianshu.com/p/a8e43ad5d7d2)