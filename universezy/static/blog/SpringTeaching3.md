# Chapter 2 —— 准备工作

## 前言

牢骚发完了，现在开始正式学习。

---
## 一、 建议

如果读者使用过servlet，那么对其中的
```java
@Override
public void doGet(HttpServletRequest req, HttpServletResponse response) throws ServletException, IOException {
}
```

深有体会，心里肯定早就在想，Spring也应该有一个这样类似的方法来处理请求吧？如果没有使用过，我建议读者可以先去学学servlet了解一些基本的东西，因为Spring也是对这些servlet进行了包装，后面教程会涉及到类似于servlet的操作。

其次是对于JDBC的相关操作，包括使用反射来加载驱动、各种数据库操作方法等。如果读者不具备这些知识储备，我建议先花一点小小的时间来学习一下。

---
## 二、 准备

本文教程案例基于：

- 操作系统Ubuntu 16.04 LTS
- 集成开发环境Eclipse
- 项目管理工具Maven
- 服务器Tomcat
- 关系型数据库MySQL以及可视化工具MySQL Workbench
- 接口测试工具Postman
- 接口开发标准RESTful

如果你使用的不是Ubuntu系统，不必担心，你只需配置好java环境就行。

如果你使用的不是Eclipse，比如IntelliJ IDEA，也不必担心，你只需在IDE差异性操作的时候会用就行。

如果没有安装Maven，可以参考我的另一篇文章《[Ubuntu下Maven的配置](https://universezy.github.io/universezy/dist/index.html#/blog/display?id=ConfigMavenOnUbuntu)》。
有了Maven，最直观的体验在于依赖第三方jar包不需要手动下载导入，而是统一在一个文件中管理，并且很轻松地修改版本，同时，在打包Spring工程导出文件时，Maven可以省很多事。

如果没有安装Tomcat，可以参考我的另一篇文章《[Ubuntu下搭建Tomcat服务器](https://universezy.github.io/universezy/dist/index.html#/blog/display?id=ConfigTomcatOnUbuntu)》
如果你用的不是Tomcat，也不必担心，你只需会使用你的服务器工具并且让你的工程运行在它上面就行。

MySQL Workbench可以在[官网](https://dev.mysql.com/downloads/workbench/)上按照提示进行安装，当然，你也可以仅使用命令行来操作你的数据库。如果你使用的不是MySQL，那么你需要在JDBC相关操作时替换为你的数据库的相关设置或方法。

如果你使用的不是Postman测试工具，这一点对整个项目没有什么影响，测试工具只是起到一个管理、维护API的功能。

至于RESTful，强烈建议读者遵循该API开发约束（虽然它不是标准，但是应当视为标准）。

---
## 三、 区分

在正式开始学习之前，我们需要先搞清楚Spring和SpringMVC这两个不同的概念。

Spring是一个大的框架，也是一个容器。

SpringMVC是一个开发架构，MVC知道吧，model，view，controller，SpringMVC是一个基于MVC设计模式的应用架构，类似的还有structs等，它们不能单独使用，需要在Spring容器中运行，将业务分成不同的模块，降低耦合度，提高可维护性等。

---

- [首页](https://universezy.github.io/universezy/dist/index.html#/blog/display?id=SpringTeaching1)

- [Chapter 1 —— 吐槽网上教程](https://universezy.github.io/universezy/dist/index.html#/blog/display?id=SpringTeaching2)

- Chapter 2 —— 准备工作

- [Chapter 3 —— 认识IoC](https://universezy.github.io/universezy/dist/index.html#/blog/display?id=SpringTeaching4)

- [Chapter 4 —— 剖析SpringMVC架构](https://universezy.github.io/universezy/dist/index.html#/blog/display?id=SpringTeaching5)

- [Chapter 5 —— 编写工程](https://universezy.github.io/universezy/dist/index.html#/blog/display?id=SpringTeaching6)

- [Chapter 6 —— 后记](https://universezy.github.io/universezy/dist/index.html#/blog/display?id=SpringTeaching7)

- [Issues —— 问题或反馈](https://universezy.github.io/universezy/dist/index.html#/blog/display?id=SpringTeaching8)