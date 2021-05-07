# css+js实现banner图片轮播

## 1. 摘要

css实现banner布局，js实现图片轮播，附带按钮二级效果、banner响应式缩放。

---
## 2. html部分

- 从左往右依次放置按钮、图片、按钮，两个按钮和图片处于同一div中。

```html
<!-- banner --> 
<div class="div_banner" onmouseover="bannerOver()" onmouseout="bannerOut()"> 
    <button class="btn_shift" name="btn_shift" onclick="clickPrev()">&lt;</button> 
        <img class="img_banner" id="banner" src="banner_internship.jpeg" width="1000" height="600" /> 
    <button class="btn_shift" name="btn_shift" onclick="clickNext()">&gt;</button> 
</div>
```

---
## 3. css部分
- 两个按钮和图片所处的div设置子控件垂直居中。
- 按钮的层级一定要在图片之上，即z-index值更大。
- 图片设置flex为1。
- 图片margin值为负数，大小等于按钮宽度。
```css
.div_banner {
    width: 100%;
    height: auto;
    padding: 0;
    display: -webkit-flex;
    display: flex;
    align-items: center;
}

.btn_shift {
    width: 40px;
    height: 80px;
    margin: 0;
    padding: 0;
    border: none;
    display: inline-block;
    text-align: center;
    align-items: center;
    text-decoration: none;
    font-size: 35px;
    visibility: hidden;
    background-color: #111;
    opacity: 0.7;
    -webkit-transition-duration: 0.5s;
    transition-duration: 0.5s;
    cursor: pointer;
    z-index: 8999;
}

.btn_shift:hover {
    background-color: #efefef;
    opacity: 0.7;
}

.img_banner {
    width: 100%;
    height: 100%;
    max-height: 600px;
    flex: 1;
    margin-left: -40px;
    margin-right: -40px;
    cursor: pointer;
}
```

---
## 4. js部分
- 以json格式存放banner图片资源。
- 通过visibility值来控制按钮是否隐藏。
- 使用setInterval来实现图片轮播，点击按钮切换图片时，先clearInterval再重新启动。

```javascript
/********** 常量 **********/

/**
 * banner切换时间间隔
 */
var timeout = 5000;

/**
 * banner下标
 */
var bannerIndex = 1000;

/**
 * banner定时器
 */
var bannerInterval;

/**
 * banner内容json
 */
var bannerJson = [{
    "imgUrl": "banner_internship.jpeg",
    "desUrl": "https://frogfans.github.io/blog.html?blogId=18"
},
{
    "imgUrl": "banner_recruit.jpg",
    "desUrl": "https://frogfans.github.io/blog.html?blogId=18"
}
];

/********** 函数 **********/

/**
 * banner单次执行内容
 */
function interval() {
    if(bannerIndex > 1000) bannerIndex -= 1000;
    if(bannerIndex < 0) bannerIndex += 1000;
    var banner = document.getElementById("banner");
    banner.src = bannerJson[bannerIndex % bannerJson.length].imgUrl;
    banner.setAttribute("desUrl", bannerJson[bannerIndex % bannerJson.length].desUrl)
    banner.onclick = function(){
        window.open(this.getAttribute("desUrl"));
    }

    bannerIndex++;
}

/**
 * banner启动
 */
function startBanner() {
    interval();
    bannerInterval = setInterval('interval()', timeout);
}

/**
 * 鼠标悬停banner
 */
function bannerOver() {
    var btn = document.getElementsByName('btn_shift');
    for (var i = 0; i < btn.length; i++) {
        btn[i].style = 'visibility:visible;';
    }
}

/**
 * 鼠标移出banner
 */
function bannerOut() {
    var btn = document.getElementsByName('btn_shift');
    for (var i = 0; i < btn.length; i++) {
        btn[i].style = 'visibility:hidden;';
    }
}

/**
 * 点击上一项
 */
function clickPrev() {
    clearInterval(bannerInterval);
    bannerIndex-=2;
    startBanner();
}

/**
 * 点击下一项
 */
function clickNext() {
    clearInterval(bannerInterval);
    startBanner();
}
```

---
## 5. 效果图

![](static/blog/image/Banner1.png)

---
## 6. 在线体验
[Banner-Demo on-line](https://universezy.github.io/demo/banner-demo.html)

---
## 7. 进阶
- [【聊一聊】css中的经典布局——双飞翼布局](https://www.cnblogs.com/hl-520/p/5754111.html)
- [【聊一聊】css中的经典布局——圣杯布局](http://www.cnblogs.com/hl-520/p/5753075.html)
- [双飞翼布局和圣杯布局解析 ](https://www.cnblogs.com/Trista-l/p/6821664.html)
- [圣杯布局和双飞翼布局（前端面试必看）](https://www.jianshu.com/p/f9bcddb0e8b4)

---
## 8. 源码
[Banner-Demo](https://github.com/universezy/Banner-Demo)
