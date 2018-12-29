## 一、 问题描述

新建Java Web工程后，index.jsp文件报错，显示：
```
The superclass "javax.servlet.http.HttpServlet" was not found on the Java Build Path
```

---
## 二、 问题原因

jsp需要servlet包的支持，所以导入servlet包即可。

---
## 三、 解决方案

列举三种方法

- 1.Maven依赖

Maven配置文件中添加依赖，例如：

```xml
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>servlet-api</artifactId>
    <version>2.5</version>
    <scope>provided</scope>
</dependency>
```

保存一下就开始自动下载jar包了。

具体的servlet包可以从[Maven仓库](http://mvnrepository.com/artifact/javax.servlet/servlet-api)中查找需要的版本。

- 2.导入Tomcat环境

以eclipse为例：

工程右键 - Build Path - Configure Build Path

右边顶部导航栏选择Libraries - 右边Add Library - Server Runtime - 选择Tomcat服务器 - Apply

![](https://raw.githubusercontent.com/universezy/MavenBuildJavaWeb-Teaching/master/image/05.png)

因为Tomcat环境中是集成了servlet包的。

- 3.添加jar文件

以eclipse为例：

src目录层创建同级lib文件夹，将网上下载的jar包丢进去

工程右键 - Build Path - Configure Build Path

右边顶部导航栏选择Libraries - 右边Add JARs - 从工程lib文件夹中把刚才的添加进去 - Apply