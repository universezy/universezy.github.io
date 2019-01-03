# Vue.js中的路由模式和第三方分享问题

## 一、 摘要

介绍Vue.js中的两种路由模式：**hash**和**history**，并提供第三方分享url问题的解决方案。

---
## 二、 Router mode

### 1. 关于SPA(Single Page Web Application)

> 单页Web应用（single page web application，SPA），就是只有一张Web页面的应用。单页应用程序 (SPA) 是加载单个HTML 页面并在用户与应用程序交互时动态更新该页面的Web应用程序。览器一开始会加载必需的HTML、CSS和JavaScript，所有的操作都在这张页面上完成，都由JavaScript来控制。因此，对单页应用来说模块化的开发和设计显得相当重要。

采用SPA方式，能够极大程度提高页面切换效率，毕竟js引擎的执行速度通常情况下是远高于网络请求的（除非你的代码真的糟糕到比重新请求新的网页还慢）。对于用户体验而言，SPA也能带来丝滑般的流畅。

---
### 2. 路由和url的区别

一个形象的例子：url就像公网ip，而路由则是局域网ip。

我们通过url访问到某个网站，这个网站是一个单页面的html文件，但是网站希望能够通过某种方式配合DOM操作改变视图，从而让访问者感觉像是在跳转不同的页面，并且浏览器地址栏也会实时改变，于是路由便发挥了作用。

通过模块化设计，将每个希望展示的独立页面，以路由形式配置下来，当用户希望跳转页面时，浏览器改变地址栏的url，并且根据配置的路由，加载对应的页面，但实际上还是在同一个html文件上，页面并没有真正的进行跳转，只是做个一个UI替换的工作。

---
### 2. hash

官方定义：

> 使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器。
> 
> 使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载。

特征：

- url中包含#符号
- 可以从任何路由入口进入页面（可以刷新，刷新相当于重新进入该路由入口）

解读：

每一个配置了路由的url，计算其hash值，然后进行映射，就像一个map，当从任意路由入口进入页面时，由url得到对应路由，并加载页面，因此称为“hash mode”。由于路由路径是相对路径，需要有一个根节点，“#”符号便是根节点的标识。

优点是路由灵活，缺点是url不美观，以及第三方web分享时url会出问题，稍后将介绍到。

---
### 3. history

官方定义：

> 依赖 HTML5 History API 和服务器配置。
> 
> 这种模式充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面，不过这种模式要玩好，还需要后台配置支持。

特征：

- url为不包含#符号的常规链接
- 只能从首页进入页面，其他路由入口进入会无法正常显示页面内容（可能只显示页面背景之类的），不能刷新（刷新相当于从其他路由入口重新进入）

解读：

从首页开始，将路由对应url构造成一条历史记录栈，路由的切换其实是栈的切换，当直接从非首页路由入口进入页面时，由于此时还未构造历史栈，因此浏览器无法执行路由操作，页面便不能正确加载，当刷新页面时，会清除历史栈数据，需要重新从首页进入并构造历史栈，因此称为“history mode”。由于“首页进入”这种强制性要求，加上历史栈的关联性，也就不再需要“#”符号了。

优点是url美观，第三方分享能保证url完整性，缺点是路由局限性严重，如果要解决非首页入口进入问题，需要服务端配合，协助实现路由分发。

---
## 三、 第三方分享

### 1. 问题

以网页分享到QQ和QQ空间为例，假如我们希望分享的url是*https://universezy.github.io/universezy/dist/index.html#/blog/display/RouterModeAndShareOnVue_js*，当我们分享到QQ好友或者QQ空间后，点开看，却来到了*https://universezy.github.io/universezy/dist/index.html#/*，为什么“#”后面的内容被截断了呢？这就回到了“hash mode”的定义，虽然我们看见的url是包含“#”后面的内容，但实际上那只是浏览器模拟出来“欺骗”访问者的链接，即使是我们传入包含“#”后面内容的url字符串，同样会是这样，因为公网没有包含“#”后面内容对应的这个地址，这个地址是我们代码中动态改变并显示在地址栏的，浏览器只会去寻找这个地址上可用的index.html文件，也就是*https://universezy.github.io/universezy/dist/index.html#/*。

然后通过上网查阅资料，或者直接通过学习“history mode”，我们知道了该模式下，url可以完整使用并跳转，然后我们兴致勃勃地在代码中修改加上history：
```javascript
export default new Router({
  mode: history,
  routes: [
    {
      path: '/',
      name: 'home-default',
      redirect: '/home',
      component: home
    },
    {
      path: '/blog/display/:id',
      name: '/blog/display',
      component: display
    },
    {
      path: '/blog/display',
      name: 'display-error',
      redirect: '/blog',
      component: blog
    }
  ]
})
```

打开首页*https://universezy.github.io/universezy/dist/index.html/*，没问题，url也符合需求，美观！然后我们把*https://universezy.github.io/universezy/dist/index.html/blog/display/RouterModeAndShareOnVue_js*这个链接分享到QQ和QQ空间，并点开，问题出现了，什么都没有，只有index.html中设置的页面背景！这就是“history mode”中讲到的找不到历史栈的缘故。

---
### 2. 解决方案

(1) history下的解决方案

如果实在想丢掉“#”，那就只能使用history模式，然后需要服务端配合，具体实现和服务端环境有关，因此需要读者根据自己使用的服务端环境自行查找相关解决方案，也可以将有效的方案通过评论或者github issues给我留言，我会补充在此处。

(2) hash下的解决方案

如果不想搞服务端，或者像我一样，SPA部署在github.io上，没法自己搞服务端，那么就可以试试这种“骚操作”。“#”后面的内容，可能是路由，也可能是路由参数，总之是一些值，结合http get请求方式，我们把这些值以get请求附加参数的形式，跟在原始路径之后，然后在原始路径对应的index.html文件中，处理这些值，进行重定向。当浏览器加载带有参数的原始路径时，会将url转换为路由对应的首页的url，并把参数附加在尾部，之后如果进行路由切换，末尾的参数可不会消失，因为他们的位置是在“#”之前，这时url会变得非常难看，为了解决这个问题，可以在首页中，处理这个参数，并进行第二次重定向，以打开新网页而不是路由的方式，重定向到路由之后的页面，这样一来，既可以跳到我们最终希望打开的页面，又可以让url不至于太丑陋。这种方式需要掌握[动态路由匹配](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html#%E5%8A%A8%E6%80%81%E8%B7%AF%E7%94%B1%E5%8C%B9%E9%85%8D)，如果读者不清楚，可以先看官方文档熟悉掌握。

示例：

这是我希望分享的链接处理之后的形式：

> https://universezy.github.io/?blogId=RouterModeAndShareOnVue_js

然后在我的index.html文件中：
```javascript
var redirectUrl = "universezy/dist/index.html";
var url = window.location.href;
var index = url.indexOf('?blogId=');
if (index > 0) {
    var params = url.substring(index);
    redirectUrl += params;
}

window.location.href=redirectUrl;
```

这时会重定向到：

> https://universezy.github.io/universezy/dist/index.html?blogId=RouterModeAndShareOnVue_js#

然后在路由对应的首页Vue文件中：
```javascript
var url = window.location.href
var start = url.indexOf('?blogId=')
var end = url.indexOf('#')
if (start > 0 && end > start) {
    var blogId = url.substring(start + '?blogId='.length, end)
    window.location.href = 'https://universezy.github.io/universezy/dist/index.html#/blog/display/' + blogId
}
```

这操作是不是很“骚”？另外说一下，QQ空间的网页分享，会截断url中的键值对，因此“=”后面内容会丢失，读者可以自己寻找替代符号，将“=”换成别的不被截断的字符或字符串。

---
## 四、 参考文献

- [Router 构建选项 - mode](https://router.vuejs.org/zh/api/#mode)
- [HTML5 History 模式](https://router.vuejs.org/zh/guide/essentials/history-mode.html#html5-history-%E6%A8%A1%E5%BC%8F)
- [SPA （单页应用程序）](https://baike.baidu.com/item/SPA/17536313#viewPageContent)

