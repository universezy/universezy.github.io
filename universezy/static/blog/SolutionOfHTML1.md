## 1. 概述
&lt;pre&gt;标签中保留空格和换行，常用来展示代码片段，但如果直接嵌套HTML标签，会被浏览器解析，所以需要使用转义字符将代码片段转换为不被解析的文本。

---
## 2. 示例
我想显示以下代码片段：

```html
<html>
    <head>
        <meta charset="utf-8">
        <title>Wechat</title>
    </head>
    <body>
        <iframe src="https://wx.qq.com/"/>
    </body>
</html>
```

用&lt;pre&gt;包裹后：

```html
<pre>
    <html>
        <head>
            <meta charset="utf-8">
            <title>Wechat</title>
        </head>
        <body>
            <iframe src="https://wx.qq.com/"/>
        </body>
    </html>
</pre>
```
那么浏览器将直接打开微信扫码登录页面，而这并不是我想要的效果。
正确的操作是将整个文本转义（网上很多在线转义工具）后放入&lt;pre&gt;标签：

```html
<pre>
    &lt;html&gt;
        &lt;head&gt;
            &lt;meta charset=&quot;utf-8&quot;&gt;
            &lt;title&gt;Wechat&lt;/title&gt;
        &lt;/head&gt;
        &lt;body&gt;
            &lt;iframe src=&quot;https://wx.qq.com/&quot;/&gt;
        &lt;/body&gt;
    &lt;/html&gt;
</pre>
```

---
## 3. 参考文献

 - [聊一聊HTML&lt;pre&gt;标签](https://www.cnblogs.com/wengxuesong/p/5541924.html)
 - [HTML&lt;pre&gt; 标签](http://www.w3school.com.cn/tags/tag_pre.asp)
