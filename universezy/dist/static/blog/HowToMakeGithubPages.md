# Vue.js+Github打造个人网站GithubPages

## 一、 前言

**github.io**是每个Github账号可以免费拥有的一个域名，这个域名上部署的页面，称之为**Github Pages**，用户有高度自主权去DIY自己的“个人网站”。

通常，用户会将其用来作为自己的博客网站，存放一些博客、收藏、简历等，业界比较成熟的个人博客网站模板是[Hexo](https://hexo.io/zh-cn/)，它基于Node.js，能快速生成一套可运行成博客页面的代码，用户将自己的文章加入并配置好相关信息，然后编译，推送到github.io仓库中，Github会自动将页面部署到服务器。不仅如此，Hexo上提供丰富多样的模板主题，可供选择。

如果使用这样的主题，可能和别人“撞衫”，毕竟很多人经常看到模板一样的页面。为了有独一无二的网站，博主曾经自己实现了一个博客网站——[universezy.github.io](https://universezy.github.io)，配合开源的UI库，也能达到不错的效果。之后也有同事对此感兴趣，想尝试，所以决定通过本文介绍如何自己打造一个独一无二的GithubPages。

---
## 二、 准备工作

在此之前，你需要具备以下知识：
- H5+ES6+CSS3: 由于是web页面，需要有前端开发的基础。
- Vue.js: 本文基于三大主流前端框架中的Vue.js进行开发，因为其易学上手快的特点，适合速成新人。
- Node.js: 工程的构建基于Node.js，因此需要有一定的Node基础，能配置参数和编译调试工程。
- Http/Https: 网页中涉及到的资源请求、页面路由等，需要有基本的网络编程基础。
- Github: 最后，也是最重要的环节，需要一个Github账号，以及有一定的使用经验。

在以上准备工作之外，你还需要一些知识，用以完成几个核心功能，这将在后续功能实现中提到。

整个开发周期可能需要一周到一个月以上，中间会遇到各种疑难问题，因此需要有足够的耐心和学习能力。

---
## 三、 创建仓库

在Github中创建一个仓库，名字有固定格式：帐号名+“.github.io”：

![](static/blog/image/GP_create_repo.png)

Github会将其识别为你的个人网页，并将其部署到服务器：

![](static/blog/image/GP_create_detail.png)

通过访问你的域名：帐号名+“.github.io”，可以看到当前部署的页面，由于缺少`index.html`文件，所以显示的是`README.md`文件的内容：

![](static/blog/image/GP_create_display.png)

接下来便正式开发前端页面。

---
## 四、 架构设计

### 4.1 技术选型

首先，需要对整个工程所依赖的主要技术进行选型：

- 基于Vue.js开发，那么我使用[Vue-CLI](https://cli.vuejs.org)脚手架来创建工程
- 要想有漂亮的界面，还得依靠三方UI库，这里推荐[iView](https://www.iviewui.com)（现叫View UI）
- 数据交互选用Json
- 统计上报推荐使用[Google Analytics](https://developers.google.cn/analytics/devguides/platform)，文中不作介绍，读者可自行学习

---
### 4.2 核心功能

参考Hexo的模板、几个主流开源博客网站平台，主要包括了以下几个功能模块：

- 导航栏：用来在不同模块之间切换
- 主页：展示近期更新的内容、通知公告等
- 个人资料：展示一些个人信息简介，也可以放简历，以便感兴趣的人伸出橄榄枝
- 博客：写的博客，分享的内容等
- 收藏：推荐的好书、网站等
- 友链：好友间相互推广的渠道之一
- 关于：该网页的一些信息

---
### 4.3 B/S架构

我们的博客资源、图片等，最终是存放在Github仓库上，那么网络请求这些资源时，就需要清楚资源的请求地址。

即便我们不清楚Github的服务器上的仓库架构，我们通过经验也能推测出来一个合理的架构：

![](static/blog/image/GP_BS_Structure.png)

(1) 资源请求

一个git仓库看做是一个文件夹：

- 对于工程内部，基于目录结构，使用相对路径进行访问。
- 对于外部网络，基于url，使用绝对地址进行访问。

(2) 工程位置

后台服务器加载的是仓库根目录下的index.html文件，那么我们初始化的工程需要以仓库根目录为根目录，否则需要自己处理重定向。

---
### 4.4 工程架构

![](static/blog/image/GP_Project_Structure.png)

整个网页工程，包括三大顶层结构：
- Base：服务器直接加载的部分
- Component&Data：网页UI组件和本地配置数据
- Service：支撑整个网页基础功能的服务

下面将详细介绍。

---
#### 1. Base

这一层以服务器加载页面所需的index.html为中心，js中可以处理重定向相关逻辑，页面事件监听等，而css可以做一些全局的背景效果。

按照Vue.js工程默认结构，index.html中的id为`app`的块，便是后面所有UI组件的顶层父布局。

因此这一层理解为**顶层容器**。

---
#### 2. Component&Data

按照Vue.js模块化设计的思想，上面的核心功能分别对应一个模块，即vue文件，进行组装或替换，以实现我们需要的UI效果。

由于会涉及到一些本地数据，例如：博客配置（标题，摘要，分类，标签，日期等），横幅，通知告示等，这些可以以Json格式保存于文件中。

除此之外，一些本地图片资源也需要保存于资源目录下。

所以，这一层主要是负责**页面内容**。

---
#### 3. Service

一个可交互的网页，必不可少的基础能力包括：路由管理、状态管理、网络请求等，除此之外，通常还会支持三方分享和统计上报。

- 路由管理：核心功能之前切换，或者子页面tab切换，均需要使用路由
- 状态管理：相当于一个临时缓存的全局变量管理，比如导航栏的展开-收起状态，广告位的关闭事件
- 网络请求：每一篇博客Markdown文件、图片资源，都需要通过网络请求拉取
- 三方分享：将博客分享到主流社交平台，或生成二维码进行传播
- 统计上报：为了更好地知道我们的网页有多少人浏览，每个子页面的访问情况，可以接入统计上报的js库

由此可见，该层属于**基础能力**。

---
## 五、 功能实现

依照上面的功能点和架构，下面对核心技术方案进行讲解。

### 5.1 路由管理

(1) 页面路由

使用默认的[Router](https://router.vuejs.org/zh/)库，每一个模块对应一个页面，例：
```javascript
import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import blog from '@/components/blog'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/blog',
      name: 'blog',
      component: blog
    }
  ]
})
```

(2) 容错机制

考虑到默认url地址下没有路由，以及无法匹配的路由地址，需要加入默认情况和异常情况：
```javascript
  [
    {
      path: '*',
      name: 'error',
      redirect: '/home',
      component: home
    },
    {
      path: '/',
      name: 'home-default',
      redirect: '/home',
      component: home
    }
  ]
```

将其重定向到正确的路由。

(3) 携带参数

比如我们想在url中拼接博客的id，然后直接打开对应页面，则可以先在路由中处理参数：
```javascript
  [
    {
      path: '/blog/display/:id',
      name: '/blog/display',
      component: display
    }
  ]
```

这样一来，url中`/blog/display/`后面紧跟的字符串将被识别为参数，同时还需要在Vue文件中获取参数：
```javascript
export default {
  data () {
    return {
      id: 0
    }
  },
  created () {
    this.init()
  }
  methods: {
    init: function () {
      this.id = this.$route.params.id
    }
  }
}
```

通过`this.$route.params.xxx`的方式获取路由参数。

---
### 5.2 状态管理

使用官方推荐的[Vuex](https://vuex.vuejs.org/zh/)，除了可以保存一些全局变量，还可以缓存网络请求的资源，避免重复请求带来的开销，例如，我定义了一个名为**GlobalDtata**的js，其中可以缓存网络请求的bio文件，也定义了网页标题常量：
```javascript
import * as types from '../mutation-types'

const state = {
  bio: null,
  title: '进击的小宇宙'
}

const mutations = {
  [types.SAVE_BIO] (state, bio) {
    state.bio = bio
  }
}

const actions = {
  saveBio ({commit}, bio) {
    commit(types.SAVE_BIO, bio)
  }
}

export default {
  state,
  mutations,
  actions
}
```

那么在获取该bio文件的地方：
```javascript
export default {
  data () {
    return {
      bio: 'Loading...'
    }
  },
  created () {
    this.load()
  }
  methods: {
    load: function () {
      if (this.$store.state.GlobalData.bio !== null) {
        this.bio = this.$store.state.GlobalData.bio
      } else {
        // request source
      }
    }
  }
}
```

---
### 5.3 网络请求

官方推荐的是基于promise的HTTP客户端[axios](https://cn.vuejs.org/v2/cookbook/using-axios-to-consume-apis.html)，其使用非常简单，首先是封装通用请求方法：
```javascript
import axios from 'axios'

export default {
  fetch (url) {
    return axios({
      method: 'get',
      url: url,
      timeout: 10000,
      withCredentials: false
    })
  }
}
```

然后调用并处理回调：
```javascript
requestApi.fetch(markdownApi.getBioUrl())
  .then((response) => {
    if (response.status === 200) {
      _this.bio = response.data
      _this.$store.dispatch('saveBio', response.data)
    } else {
      _this.requestFailed()
      console.log('response status: ' + response.status)
    }
  })
  .catch(error => {
    console.log(error)
  })
}
```

---
### 5.4 三方分享

以常用的QQ、QQ空间、微信、微博分享为例介绍，除了微信只能以二维码形式打开，其余均可以支持web分享方式：
```javascript
const baseQQShareUrl = 'http://connect.qq.com/widget/shareqq/index.html'
const baseQZoneShareUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey'
const baseWeiboShareUrl = 'http://service.weibo.com/share/share.php'

export const shareBlogApi = {
  getQQUrl: (blog) => {
    var url = baseQQShareUrl +
      '?url=' + blog.url +
      '&pics=' + blog.pic +
      '&title=' + blog.title +
      '&summary=' + blog.abstract
    return encodeURI(url)
  },
  getQZoneUrl: (blog) => {
    var url = baseQZoneShareUrl +
      '?url=' + blog.url +
      '&pics=' + blog.pic +
      '&title=' + blog.title +
      '&summary=' + blog.abstract
    return encodeURI(url)
  },
  getWeiboUrl: (blog) => {
    var url = baseWeiboShareUrl +
      '?url=' + blog.url +
      '&pic=' + blog.pic +
      '&title=' + blog.title +
      '&content=' + 'utf-8'
    return encodeURI(url)
  }
}
```

---
### 5.5 二维码生成

博主推荐开源库[qrcodejs](https://github.com/davidshimjs/qrcodejs)。

首先通过npm引入至工程依赖（[npm版本信息](https://www.npmjs.com/package/qrcodejs2)）：
```shell
npm install qrcodejs2 --save
```

提供一块显示区域：
```html
<div id="qrcode"></div>
```

然后在js中动态生成：
```javascript
import QRCode from 'qrcodejs2'

var qrcode = null

export default {
  methods: {
    createQrcode: function () {
      qrcode = new QRCode('qrcode', {
        text: this.getValidUrl(),
        width: 100,
        height: 100,
        colorDark: '#17233d',
        colorLight: '#f8f8f9',
        correctLevel: QRCode.CorrectLevel.H
      })
    },
    updateQrcode: function () {
      if (qrcode === null) {
        this.createQrcode()
      } else {
        qrcode.clear()
        qrcode.makeCode(this.getValidUrl())
      }
    }
  }
}
```

---
### 5.6 Markdown展示

博客页面毫无疑问选用Markdown格式，这里推荐开源库[mavonEditor](https://github.com/hinesboy/mavonEditor)。

仍然是先通过npm引入（[npm版本信息](https://www.npmjs.com/package/mavon-editor)）:
```shell
npm install mavon-editor --save
```

在页面中使用组件：
```html
<mavon-editor
  class="markdown"
  v-model="blogData"
  :subfield="settingsMd.subfield"
  :defaultOpen="settingsMd.defaultOpen"
  :navigation="settingsMd.navigation"
  :codeStyle="settingsMd.codeStyle"
  :boxShadow="settingsMd.boxShadow"
  :previewBackground="settingsMd.previewBackground"
  :toolbarsFlag="settingsMd.toolbarsFlag"
  :toolbars="settingsMd.toolbars"/>
```

在js中置相关属性：
```javascript
export default {
  data () {
    return {
      settingsMd: {
        subfield: false, // 单双栏模式
        defaultOpen: 'preview', // 默认展示
        navigation: false, // 导航目录
        codeStyle: 'xcode', // 配色方案
        boxShadow: false, // 开启边框阴影
        previewBackground: '#f9f5f9', // 预览框背景颜色
        toolbarsFlag: false, // 工具栏是否显示
        toolbars: {
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          help: true, // 帮助
          navigation: true // 导航目录
        }
      },
      blogData: 'Loading...'
    }
  }
}
```

---
### 5.7 响应式布局

为了让我们的网页能较好地展示在不同设备（PC，Phone等）上，需要在开发时考虑布局的实现方式，而响应式布局便是为了解决这个问题。

通常实现响应式布局有两个方向：
- 弹性布局flex：使用flex相关的H5组件和css属性，使得页面展示时被动改变样式，这里不举例，读者可自行查阅资料。
- 媒体查询media：设置各种阈值监听，使得页面主动改变样式，下面以一个简单例子为介绍。

在`App.vue`中设置样式：
```css
@media screen and (max-width: 1500px) {
  #app {
    margin: 0 100px;
    -webkit-transition: all 0.5s;
    -moz-transition: all 0.5s;
    transition: all 0.5s;
  }
}

@media screen and (max-width: 1200px) {
  #app {
    margin: 0 50px;
    -webkit-transition: all 0.5s;
    -moz-transition: all 0.5s;
    transition: all 0.5s;
  }
}

@media screen and (max-width: 1000px) {
  #app {
    margin: 0;
    -webkit-transition: all 0.5s;
    -moz-transition: all 0.5s;
    transition: all 0.5s;
  }
}
```

这段代码表示，对id为app的组件有以下效果：
- 当屏幕宽度在1200-1500像素时，其左右外边距为100像素
- 当屏幕宽度在1000-1200像素时，其左右外边距为50像素
- 当屏幕宽度在1000像素以内时，其左右外边距为0像素

---
### 5.8 数据配置

不管是Hexo还是自定义博客，都免不了对博客数据的配置，即每篇博客的id、类别、标题、标签、摘要、时间戳等。

以博主的个人主页为例，创建一个`blogs.js`的文件，专用于配置所有博客信息：
```javascript
const blogs = [
  {
    id: 'AndroidPerformanceOfMemory1',
    category: 'Android',
    title: 'Android性能优化之内存优化',
    tags: [
      {tag: '性能优化'},
      {tag: '内存优化'}
    ],
    abstract: '本章内容基于Android Q，介绍Android性能优化中的内存优化方面，通过排查、检测、规避和表现等四个方面的讲解，让更多的开发者有能力去改善或设计出更优质的程序。',
    timestamp: 1578310912658
  },
  {
    id: 'AndroidPerformanceOfMemory2',
    category: 'Android',
    title: 'Android性能优化之内存优化——内存泄漏篇',
    tags: [
      {tag: '性能优化'},
      {tag: '内存优化'},
      {tag: '内存泄漏'}
    ],
    abstract: '本文介绍Android开发中的常见内存泄漏场景和解决方案。',
    timestamp: 1578311006725
  }
]

export default {
  blogs
}
```

在展示博客的页面，通过路由获取博客id，然后网络请求获取对应Markdown资源并展示。

而在总览页面，需要显示所有博客Item时，先定义每个Item的样式，以便列表复用，这里省略布局展示。

然后在父容器中获取博客js数据，并加载到列表中：
```javascript
import mBlogs from '../data/blogs'

export default {
  data () {
    return {
      originBlogs: []
    }
  }
  methods: {
    loadOriginBlogs: function () {
      this.originBlogs = []
      for (var i = mBlogs.blogs.length - 1; i >= 0; i--) {
        this.originBlogs.push(mBlogs.blogs[i])
      }
    }
  }
}
```

中间可能会经过一些过滤操作，最后通过`props`属性将item传给子组件：
```html
<div class="div_microblog" v-for="item in displayBlogs" :key="item.id">
  <comMicroBlog :microblog="item" wide :showIcon="propShowIcon"></comMicroBlog>
</div>
```

---
## 六、 发布

当我们全部开发完后，对Vue.js工程进行编译，然后将整个github.io仓库push到远程仓库，稍后github服务器将自动替换新的资源。

至此，我们的基于Vue.js开发的个人网页Github Pages便大功告成。

---
## 七、 总结

独立完成一个博客网站的工作量确实较重，期间还会踩非常多的坑，因此需要足够的耐心和毅力，除此之外，涉及的技术栈也是蛮多的，对知识的成长也能起到较大的帮助，最后，希望感兴趣的读者也能开发出自己满意的网站，如果有问题，可通过邮件与我联系，很乐意与你交流！