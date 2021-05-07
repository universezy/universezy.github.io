# 使用DOM实现批量化布局装载的动态加载网页

## 一、 摘要
以博客栏为例，使用DOM实现批量化布局装载的动态加载网页，另附可收缩侧栏效果。

---
## 二、 动态加载实现方法

**1. 先用html划分一块区域，用于装填item**
```html
<div id="rightcontent" class="div_parent">  </div> 
```

**2. 在区域内用html+css实现一个item的布局**
```html
<div id="rightcontent" class="div_parent">
    <!-- Ubuntu下使用Thunderbird收发QQ邮箱 -->
    <a href="ubuntu_5.html">
         <div class="blog_item">
            <b class="item_parent b_title">Ubuntu下使用Thunderbird收发QQ邮箱</b>
            <div>
                <em class="item_parent em_catalog">Ubuntu</div>
                <div class="item_parent div_keyword">thunderbird</div>
                <div class="item_parent div_keyword">email</div>
            </div>
            <div class="item_parent div_digest">Ubuntu下使用Thunderbird收发QQ邮箱。</div>
            <div class="item_parent div_date">2018年01月29日</div>
        </div>
    </a>
</html>
```

**3. 将元素和属性以及文本存为json数组格式**
```javascript
var blogJson = [{
    "title": "Ubuntu下使用Thunderbird收发QQ邮箱",
    "catalog": "Ubuntu",
    "keywords": [{
        "keyword": "thunderbird"
    },
    {
        "keyword": "email"
    }],
    "digest": "Ubuntu下使用Thunderbird收发QQ邮箱。",
    "date": "2018年01月29日",
    "href": ""
}];
```

**4. 在js中创建一个函数，将item从外向内（或者从内向外）按照DOM语法构建组装**
```javascript
function initBlog(type) {
    var rightcontent = document.getElementById('rightcontent');

    for (var i = 0; i < blogJson.length; i++) {
        calcBlogNum(blogJson[i].catalog);

        if (type == 'Total') {} else if (type != blogJson[i].catalog) {
            continue;
        }
        var a = document.createElement('a');
        a.setAttribute('href', blogJson[i].href);

        var blog_item = document.createElement('div');
        blog_item.setAttribute('class', 'blog_item');

        var b_title = document.createElement('b');
        b_title.setAttribute('class', 'item_parent b_title');

        var title = document.createTextNode(blogJson[i].title);
        b_title.appendChild(title);

        var div_temp = document.createElement('div');

        var em_catalog = document.createElement('em');
        em_catalog.setAttribute('class', 'item_parent em_catalog');
            
        var catalog = document.createTextNode(blogJson[i].catalog);
        em_catalog.appendChild(catalog);
        div_temp.appendChild(em_catalog);

        var keywordJson = blogJson[i].keywords;

        for (var j = 0; j < keywordJson.length; j++) {
            var div_keyword = document.createElement('div');
            div_keyword.setAttribute('class', 'item_parent div_keyword');
            var keyword = document.createTextNode(keywordJson[j].keyword);
            div_keyword.appendChild(keyword);
            div_temp.appendChild(div_keyword);
        }

        var div_digest = document.createElement('div');
        div_digest.setAttribute('class', 'item_parent div_digest');
        var digest = document.createTextNode(blogJson[i].digest);
        div_digest.appendChild(digest);

        var div_date = document.createElement('div');
        div_date.setAttribute('class', 'item_parent div_date');
        var date = document.createTextNode(blogJson[i].date);
        div_date.appendChild(date);

        blog_item.appendChild(b_title);
        blog_item.appendChild(div_temp);
        blog_item.appendChild(div_digest);
        blog_item.appendChild(div_date);
        a.appendChild(blog_item);
        rightcontent.appendChild(a);
    }
}
```

**5. 在需要装填item的地方调用函数**
```html
<script type="text/javascript">
    window.onload = function(){
        initBlog('Total');
        initCatalog('Total');
    }
</script> 
```

---
## 三、 可收缩侧栏实现方法

**1. css创建侧栏和主栏div的父类**
```css
.div_parent {
    flex: none;
    overflow: auto;
    transition: all 0.3s ease-in-out 0.2s;
    -webkit-transition-duration: 0.5s;
    /* Safari */
    transition-duration: 0.5s;
}
```

**2. 侧栏固定宽度和位置**
```css
#leftnav {
    list-style-type: none;
    height: 1000px;
    margin: 0;
    padding: 0;
    width: 200px;
    background-color: #f6f6f6;
    position: absolute;
}
```

**3. 主栏不设置宽度，使用"margin"来保持和侧栏的距离**
```css
#rightcontent {
    height: 1000px;
    margin-left: 200px;
    padding: 20px 40px;
    background-color: #ebebeb;
}
```

**4. js用boolean值来判断开关状态，DOM改变元素值**
```javascript
var switchStatus = true;

function switchBtn() {
    if (switchStatus) {
        switchOff();
        switchStatus = false;
    } else {
        switchOn();
        switchStatus = true;
    }
}

function switchOff() {
    document.getElementById('leftnav').style = "width: 50px;";
    document.getElementById('rightcontent').style = "margin-left: 50px;";
    document.getElementById('switch').innerHTML = "+";
}

function switchOn() {
    document.getElementById('leftnav').style = "width: 200px;";
    document.getElementById('rightcontent').style = "margin-left: 200px;";
    document.getElementById('switch').innerHTML = "-";
}
```

---
## 四、 效果图

![](static/blog/image/DomLoading1.png)

---
## 五、 在线体验
[DOM-Demo on-line](https://universezy.github.io/demo/dom-demo.html)

---
## 六、 参考文献
[HTML DOM 教程](http://www.runoob.com/htmldom/htmldom-tutorial.html)

---
## 七、 源码
[DOM-Demo](https://github.com/universezy/DOM-Demo)
