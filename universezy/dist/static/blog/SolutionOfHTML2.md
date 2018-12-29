## 1. 概述 ##
HTML中形如 **&amp;nbps;(空格)** 、 **&amp;lt;(<符号)** 、 **&amp;gt;(>符号)** 等都会被转义成对应的值，那么要想保留转义字符本身，比如在贴代码或者教学中，只有破坏转义字符本身的结构，即：将 **&** 符号再次转义。

---
## 2. 示例 ##
我想保留代码：

```html
&lt;html&gt;
    &lt;head&gt;
        &lt;meta charset=&quot;utf-8&quot;&gt;
        &lt;title&gt;Wechat&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
        &lt;iframe src=&quot;https://wx.qq.com/&quot;/&gt;
    &lt;/body&gt; 
&lt;/html&gt;
```
那么我需要将其中的 **&** 都替换为 **&ampamp;** :

```html
&amp;lt;html&amp;gt;
    &amp;lt;head&amp;gt;
        &amp;lt;meta charset=&amp;quot;utf-8&amp;quot;&amp;gt;
        &amp;lt;title&amp;gt;Wechat&amp;lt;/title&amp;gt;
    &amp;lt;/head&amp;gt;
    &amp;lt;body&amp;gt;
        &amp;lt;iframe src=&amp;quot;https://wx.qq.com/&amp;quot;/&amp;gt;
    &amp;lt;/body&amp;gt;
&amp;lt;/html&amp;gt;
```
