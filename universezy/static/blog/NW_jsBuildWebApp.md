# Ubuntu环境下使用NW.js对web应用封装

## 前言

相对于偏向应用的windows系统，Linux系统更偏向于开发，因此对于依赖Windows应用的人来说，缺了很多常用软件会很不习惯，本文的目的便是通过两个Demo来引出后面的教程——通过NW.js来封装你想要的Web应用。以Ubuntu 16.04为例（14.04可能无法兼容部分依赖）。

---
## 关于NW.js

- 官网：[https://nwjs.io/](https://nwjs.io/)

- github：[https://github.com/nwjs/nw.js](https://github.com/nwjs/nw.js)

---
## 1. Demo - Wechat

![](static/blog/image/NWjsDemo_wechat.png)

---
## 2. Demo - YoudaoDict

![](static/blog/image/NWjsDemo_youdaodict.png)

---
## 3. 准备工作

**安装nodejs**

> sudo apt-get install nodejs

使用 'nodejs --version' 可以查看安装成功的版本

---
**安装npm**

> sudo apt-get install npm

使用 'npm --version' 可以查看安装成功的版本

---
**安装NW.js**

> sudo npm install nw -g

安装成功后会显示目录结构，使用 'nw --version' 可以查看安装成功的版本

---
## 4. NW.js使用教程

(1) 创建一个html文件，里面嵌入你想定制的web应用链接

```html
<html>

<head>
  <meta charset="utf-8">
  <title>Wechat</title>
</head>

<body>
  <iframe src="https://wx.qq.com/" />
</body>

</html>
```

---
(2) 创建一个名为package的json文件，这是固定名称

```json
{
	"name":"Wechat",
	"main":"Wechat.html",
	"window":{
        "title":"Wechat",
        "toolbar":false,
        "frame":true,
        "position":"center",
        "always-on-top":true,
        "width":1000,
        "height":800
    }
}
```

---
(3) 将二者打包成nw文件

> sudo cat package.json Wechat.html > Wechat.nw

---
(4) 将所需文件放在nw程序同级目录中

---
(5) 创建一个sh启动脚本，路径请改为自己的nw程序路径和应用路径

```shell
#!/bin/bash
cd /usr/local/lib/nwjs-sdk-v0.27.5-linux-x64
./nw /home/zengyu/git/NWJS-Demo/Wechat/Wechat.nw
```

---
(6) 在/usr/share/applications/下创建一个后缀名为desktop的快捷方式文件，其中内容的路径请改为自己的启动脚本路径和图标路径

> sudo gedit /usr/share/applications/Wechat.desktop

```
[Desktop Entry]
Encoding=UTF-8
Name=Wechat
Exec=sh /home/zengyu/git/NWJS-Demo/Wechat/Wechat.sh
Icon=/home/zengyu/git/NWJS-Demo/Wechat/Wechat.jpg
Categories=GTK;Network;message;
Comment=Wechat
Terminal=false
Type=Application
```

---
(7) 开始使用你定制的应用，双击快捷方式，启动后右键单击图标锁定到启动器

---
## 5. NW.js安装及运行过程中可能出现的问题及解决方案

(1) 缺少部分依赖

> sudo apt-get install -f
	
可以自动安装缺少的依赖

---
(2) nw安装失败

从官网下载sdk：[https://nwjs.io/](https://nwjs.io/)

---
(3) 无法加载以下来源的扩展程序：xxxxxx\xxx.nw.清单文件缺失或不可读
		
- 可能原因1：检查所有相关文件编码，采用中文编码会导致该问题
- 可能原因2：html文件、json文件、nw文件是否都位于nwjs目录下的nw程序同级目录中

---
## 6. 推荐一些基于electron封装的应用以供使用和学习借鉴

**关于electron**

- 官网：[https://electronjs.org/](https://electronjs.org/)
- github：[https://github.com/electron/electron](https://github.com/electron/electron)

---
1. [钉钉：DingTalk](https://github.com/nashaofu/dingtalk)
2. [微信：Wechat](https://github.com/geeeeeeeeek/electronic-wechat)

---
## 7. 参考文献

1. [为什么微信没有for linux？](https://www.zhihu.com/question/39977685)
2. [Ubuntu环境下的nwjs安装使用 ](http://blog.csdn.net/running_meng/article/details/78180930)
3. [NW.js打包Axure原型（HTML）文件常见问题](http://www.raedme.cn/tutorial/333.html)
4. [nwjs安装演示](https://www.npmjs.com/package/nwjs)

---
## 8. 源码

[Ubuntu环境下使用NW.js对web应用封装](https://github.com/universezy/NW.js-Demo)
