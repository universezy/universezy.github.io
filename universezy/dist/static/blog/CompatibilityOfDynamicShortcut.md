# Android动态快捷方式兼容性问题

## 一、 摘要

本文基于Android Q，通过介绍笔者工作中翻过的一次车，讲述Android中的动态快捷方式兼容性处理注意事项。

---
## 二、 问题描述

去年下半年，笔者负责的一个应用，出现了一例NPE导致应用crash的问题，接到用户反馈后，本着用户至上的原则，立马跟测试、PM伙伴一起以最高优先级跟踪该问题。

大致情况是，笔者读取ContentProvider的动态快捷方式数据，筛选后保存，由于考虑到大量Bitmap的内存占用，因此采用**LruCache**+**SoftReference**的实现方式。

NPE堆栈显示LruCache的key为null导致。

---
## 三、 直接原因

将数据放入LruCache时未考虑key为null的情况。查看源码：
```java
public final V put(K key, V value) {
    if (key == null || value == null) {
        throw new NullPointerException("key == null || value == null");
    }
}
```

这也给笔者敲了一个警钟，对于常用的API，一定要熟悉其基本实现，了解风险项，同时要对自己的代码提升容错性。

另一方面，笔者传入LruCache的key，对应快捷方式的**shortcut_id**，其作为同一个应用主体下创建的快捷方式的唯一标识符，为什么会是null呢？

---
## 四、 快捷方式

在分析根本原因之前，先简单介绍下Android中的快捷方式。

快捷方式分为静态快捷方式和动态快捷方式两种：

### 4.1 静态快捷方式

声明在**AndroidManifest**中（具体实现不在这里阐述），对于扩展了快捷方式的应用，在桌面长按可以展开（某些ROM厂商屏蔽了静态快捷方式能力）：

这是招行的静态快捷方式：

![](static/blog/image/CDS_0.jpg)

这是天猫精灵的静态快捷方式：

![](static/blog/image/CDS_1.jpg)

还可以将其拖动到空白以添加至桌面：

![](static/blog/image/CDS_2.jpg)

---
### 4.2 动态快捷方式

在运行时通过**ShortcutManager**创建：

这是金拱门微信小程序的动态快捷方式：

![](static/blog/image/CDS_3.jpg)

这是美宜佳支付宝小程序的动态快捷方式：

![](static/blog/image/CDS_4.jpg)

这是微博快应用的动态快捷方式：

![](static/blog/image/CDS_5.jpg)

---
### 4.3 基本概念

- 应用主体：快捷方式由哪个应用创建，这个应用就是应用主体，对于动态快捷方式，常见的应用主体有微信、支付宝、快应用平台等
- shortcut_id：同一个应用主体创建的快捷方式，通过shortcut_id进行区分，即唯一标识符，且该id会在启动快捷方式时作为参数传入

---
## 五、 根本原因

既然**shortcut_id**作为唯一标识符，怎么可能为null呢？于是笔者想到了Android O这个版本分界线，简单来说，在目前的Android版本上，快捷方式是通过**ShortcutManager**创建的，但是在O以前，其是通过广播的形式创建的（具体可以参考笔者另外一篇文章[《Android动态创建快捷方式》](https://universezy.github.io/universezy/dist/index.html#/blog/display/DynamicShortcut)），这种方式下，不同应用主体实现方式差异很大，且没有固定的格式，也就没有**shortcut_id**一说。

同时，分析出现异常的数据库，发现其中引起crash的数据的格式并不符合现有的创建动态快捷方式的格式，其根本没有**shortcut_id**这个字段，这再一次印证了笔者的猜想。

经过和用户确认，该异常数据系从多年前的Android N的手机通过某个方式拷贝到Android Q，至此找到了问题根本原因。

---
## 六、 反思总结

- 作为Android开发者，每年都会经历一次Android大版本更新，我们需要关注这些更新内容，及时响应变化，并对旧版本做好兼容处理，甚至需要考虑时隔多年的Android版本。
- 代码设计时，应注重容错性和健壮性，对于常用API，需熟悉其基本原理，以免出现被忽视的严重问题。