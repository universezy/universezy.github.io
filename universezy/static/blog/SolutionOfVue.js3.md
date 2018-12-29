## 一、 问题描述

今天打包Vue.js工程，然后用浏览器打开index.html，发现引用的一些UI资源加载不出来，包括字体和icon等，打开控制台提示跨域请求问题。

---
## 二、 解决方案

首先看是否真的是CORS问题，如果被请求的资源不允许跨域请求，那么在开发环境下也同样无法正常请求的，看到的整个网页应该都是加载不出来，如果是这样，在原始工程的index.html中，head标签下，增加一个meta标签，表示允许跨域请求该网页：
```html
<meta http-equiv="Access-Control-Allow-Origin" content="*">
```

但是我遇到的只是部分资源请求不到，也就排除了CORS问题，那么另一种可能，那就是请求的url错了，检查报错项的路径，发现确实有问题，原因在于打包时未配置好相对路径，这种情况参考我的另一篇解决方案：
[Vue.js打包静态网页出现空白或路径错误的问题解决方案](https://universezy.github.io/universezy/dist/index.html#/blog/display?id=SolutionOfPackingVue.js)