# 浅谈Kotlin入门

## 前言

16年，Kotlin官方正式推出该语言第一版，17年，Google倡导开发者使用其作为Android开发的基本语言。三年过去了，作为Android开发者的我们，大部分还是维持着Java开发。但是，当前的形势容不得开发者们再怠慢，犹豫，就会败北。

---
## 一、 为什么是Kotlin

这还得从一场官司说起。

我们知道，JDK早先分为Oracle公司的OracleJDK 和Sun公司的OpenJDK，前者几乎全部开源，注意是“几乎”，而后者完全开源，前者存在极少数Java代码为Oracle公司商业私有，按照协议，使用者不可用于盈利，这也是为什么早先在日常工作开发中，要求我们使用OpenJDK，避免公司被律师函警告。

后来财大气粗的Oracle花了74亿美元收购了Sun，有钱真的可以为所欲为啊。

Google的Android使用Java作为基本开发语言，按照要求，JDK开发的程序需要运行在JVM上，但是，Android中使用的是魔改版JVM——Dalvik虚拟机。不仅如此，Google虽然声称Android开源免费（AOSP），但是自己通过Android赚了几百亿广告费。

忍一时越想越气，退一步越想越亏，Oracle看见Google发了财，心想自己下血本收购Sun，怎么能让你钻空子，于是律师函警告，向Google索赔88亿美金。

Google发现情况不妙，于是时隔几年宣布我们要使用备胎——Kotlin。但是，仔细推敲一下这背后的利益关系：Google官方建议Android开发者使用Android Studio，AS本质上是基于IntelliJ IDEA套了层壳，IDEA是JetBrains公司的产品，Kotlin由JetBrains俄罗斯团队开发诞生。因此我们可以大胆猜测：Google跟JetBrains合作，商讨开发一套全新的编程语言，以代替Java，作为Android开发的首选语言，并逐渐替换掉Java，避免今后因为商业盈利又被控告。

---
## 二、 Kotlin有哪些特点

作为一门新的编程语言，其诞生结合了多种已有的语言的优点，对于熟悉前端的开发者而言，很明显地能看到脚本语言JavaScript的影子。

- 语法上，Kotlin和Java互不兼容，但是二者可以混合编译，即Kotlin目前仍是基于JVM运行，也可相互调用，即互操作性。
- 简化一些基本数据类型，甚至可以省略基本类型的关键字，由编译器自动识别，即类型推断。
- 广泛使用函数式编程。
- 解决了Java代码臃肿的问题，开发者尽可能关注于业务本身。

其余特点待开发者学习时自行感受，此处不再赘述。

---
## 三、 Kotlin VS Java

- [与 Java 语言比较](https://www.kotlincn.net/docs/reference/comparison-to-java.html#%E4%B8%8E-java-%E8%AF%AD%E8%A8%80%E6%AF%94%E8%BE%83)

---
## 四、 新手上路

- [学习 Kotlin](https://www.kotlincn.net/docs/reference/)
- [使用 Kotlin 开发 Android 应用](https://developer.android.com/kotlin?hl=zh-cn)
- 另外建议无函数式编程经验的初学者先掌握Java下的函数式编程：[Java函数式编程](https://universezy.github.io/universezy/dist/index.html#/blog/display/FunctionalProgramming)

---
## 五、 参考文献

- [维基百科-Kotlin](https://zh.wikipedia.org/wiki/Kotlin)
- [Oracle与OpenJDK之间的区别](https://juejin.im/post/5ca1c747e51d45761c7441fa)
- [Google和Oracle的官司](https://sydmobile.github.io/2017/11/06/google-oracle/)
- [Google 凭什么要赔给 Oracle 88 亿？](https://blog.csdn.net/OQjya206rsQ71/article/details/79754454)
- [抛弃 Java 改用 Kotlin 的六个月后，我后悔了](https://blog.csdn.net/csdnnews/article/details/80746096)