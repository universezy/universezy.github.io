# AOSP解耦独立应用总结

## 一、 摘要

本文基于Android Q，介绍将AOSP中的仓库解耦为独立应用时的一些疑难点。

---
## 二、 简介

笔者在负责安卓大版本升级时，遇到很多坑，因此把这些疑难点记录下来，一方面是为了今后自己回顾，另一方面也是为了帮助同行业的开发者。

考虑到数据安全，文中内容已做脱敏处理。

下面将介绍如何将AOSP中的一个仓库解耦出来成为一个可独立编译apk的应用。

---
## 三、 准备工作

首先你需要具备以下知识技能：
- 掌握Kotlin基本语法：AOSP中kt所占比例在逐版本加大，因此，需要掌握基本的kt语法，才能顺利地阅读或修改原生代码。
- 清楚AOSP整体架构：对于相对上层的开发者，无需重点关注内核层、驱动层的目录结构，但需要熟悉框架层和应用层的目录结构，以及编译产物的目录结构。
- 基本命令：包括repo命令、环境配置命令、整编命令、单编命令等。
- Gradle：熟悉**build.gradle**文件的配置。

假设你已经搞定了上述知识点，那么接下来我们将开始一步一步解耦一个独立编译的应用。

---
## 四、 代码主体解耦

待解耦的模块，本身必须是一个git仓库。

- 申请一个新的git仓库，或者用已有的仓库，创建新的分支。
- 简单粗暴地将AOSP中这个仓库整体拷贝过去，保持目录结构不变。

---
## 五、 Gradle编译环境配置

AOSP中的编译方式不管整编还是单编，均是通过模块根目录下的编译文件，旧版本上为```Android.mk```，近期已经改用```Android.bp```，其类似Json格式的编写方式，更利于开发人员阅读和维护。

解耦为独立编译应用时，就需要改为gradle编译的方式，因此首先需要配置```build.gradle```文件，其次是本地的```properties```文件，以及其他一些配置文件和脚本文件（视自身业务需求而定）。

如果执行gradle编译命令，能开始运行并输出结果，那么继续下一步。

---
## 六、 Framework资源依赖

解耦前的模块可能使用到一些资源id，比如依赖框架层的资源id，原先由于位于AOSP环境中，因此在整编或单编时可以直接引用，但解耦出来后会因为找不到资源id而无法通过编译。

对此，解决方案为通过**Resources#getIdentifier**获取，示例：

原生有一处资源引用为`com.android.internal.R.string.resName`，那么解耦后的资源id获取方式为：

```java
int resId = context.getResources().getIdentifier("resName", "string", "android");
```

由于其最终通过**AssetManager#nativeGetResourceIdentifier**获得，因此当存在大量资源id时，需要考虑对性能的影响。

---
## 七、 Proto文件动态生成类

一些模块可能使用到源码中没有的java文件，其特征会有**proto**关键词。这便是动态生成的类。

proto文件是一种用来编译生成java文件的文件，其配置有要生成的java文件的一些信息，包括package，className，innerClass，field等，需要借助google的`protobuf`这个库才能编译。

关于protobuf：

- [google介绍protobuf](https://developers.google.com/protocol-buffers/docs/overview)
- [github-protobuf](https://github.com/protocolbuffers/protobuf)

AOSP中的模块，如果有proto文件，那么模块本身也是配置了对`protobuf`的依赖，因此才能正常执行整编。也就是说，整编的编译顺序中，会先编译各模块的proto文件生成所需的java文件，再开始对AOSP整编，否则工程中有引用这些java文件就编译不过了。

对于解耦出来的应用，不应去使用`protobuf`库自主编译生成java文件，而是直接引用整编的编译产物。

在`Android.bp`文件中，会定义proto文件相关信息，例如：
```java
java_library {
    name: "Demo-proto",
    srcs: ["src/**/*.proto"],
    proto: {
        type: "nano",
    }
}
```

AOSP中proto文件的编译产物位于：
> android\out\target\common\obj\JAVA_LIBRARIES

在整编成功后的`JAVA_LIBRARIES`文件夹下，就可以找到名为`Demo-proto_intermediates`的文件夹，其中便包含了我们所需的java文件。

将其中的`classes.jar`重命名为`Demo-proto.jar`，复制到解耦后的工程的`libs`下并配置好对其的依赖。

---
## 八、 可能遇到的问题

### 8.1 SDK的API缺失

通常是codebase未及时更新。

---
### 8.2 其他动态生成类缺失

查看`Android.bp`文件中是否有定义相关信息， 然后再按照proto的处理方式，将缺失的类通过jar包引入。


