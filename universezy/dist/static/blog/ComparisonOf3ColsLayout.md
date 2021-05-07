# 固比固三栏式布局对比

## 一、 摘要
固比固三栏式布局对比：传统布局、圣杯布局、双飞翼布局。

---
## 二、 实现过程
### 1. 传统布局

参考《[css+js实现banner图片轮播](https://universezy.gitee.io/#/blog/display/WebBanner)》，其中banner实现过程即为传统布局，按照左-中-右顺序渲染。

**html部分**

```html
<div class="pt">
  <div class="left">
    Left
  </div>
  <div class="main">
    Main
  </div>
  <div class="right">
    Right
  </div>
</div>
```

**css部分**

```css
.pt {
    display: -webkit-flex;
    display: flex;
}

.pt .left {
    width: 250px;
    height: 40px;
    background: #E79F6D;
}

.pt .main {
    width: 100%;
    height: 50px;
    flex:1;
    background: #D6D6D6;
}

.pt .right {
    width: 300px;
    height: 30px;
    background: #77BBDD;
}
```

### 2. 圣杯布局

参考《[【聊一聊】css中的经典布局——圣杯布局](http://www.cnblogs.com/hl-520/p/5753075.html)》，按照博主教程逐步尝试，并加以理解。

**html部分**

```html
<div class="sb">
  <div class="main">
    Main
  </div>
  <div class="left">
    Left
  </div>
  <div class="right">
    Right
  </div>
</div>
```

**css部分**

```css
.sb {
    padding-left: 250px;
    padding-right: 300px;
}

.sb .main {
    width: 100%;
    height: 50px;
    float: left;
    background: #D6D6D6;
}

.sb .left {
    width: 250px;
    height: 40px;
    background: #E79F6D;
    float: left;
    margin-left: -100%;
    position: relative;
    left: -250px;
}

.sb .right {
    float: left;
    width: 300px;
    height: 30px;
    background: #77BBDD;
    margin-left: -300px;
    position: relative;
    right: -300px;
}
```

### 3. 双飞翼布局

参考《[【聊一聊】css中的经典布局——双飞翼布局](https://www.cnblogs.com/hl-520/p/5754111.html)》，在圣杯布局基础上改造。

**html部分**

```html
<div class="sfy">
  <div class="main">
    <div class="inner">
      Main
    </div>
  </div>
  <div class="left">
    Left
  </div>
  <div class="right">
    Right
  </div>
</div>
```

**css部分**

```css
.sfy {
}

.sfy .main {
    width: 100%;
    float: left;
}

.sfy .left {
    width: 250px;
    height: 40px;
    background: #E79F6D;
    float: left;
    margin-left: -100%;
}

.sfy .right {
    height: 30px;
    float: left;
    width: 300px;
    background: #77BBDD;
    margin-left: -300px;
}

.sfy .inner {
    height: 50px;
    margin-left: 250px;
    margin-right: 300px;
    background: #D6D6D6;
}
```

---
## 三、 对比总结
### 1. 总宽度：

Left 250px + Main + Right 300px。

![](static/blog/image/ThreeColumnLayout1.png)

---
### 2. 第一个临界值：700px，即 Main = Left 时：

**圣杯布局** 被挤乱。

![](static/blog/image/ThreeColumnLayout2.png)

---
### 3. 第二个临界值：550px + Main容纳文字的最小宽度：

**传统布局** 中Left和Right被压缩，Main固定为最小宽度；

**圣杯布局** 中Main被压缩，整个布局混乱；

**双飞翼布局** 中Main被压缩，整个布局保持秩序。

![](static/blog/image/ThreeColumnLayout3.png)

---
### 4. 第三个临界值：550px，即 Main = 0 时：

**圣杯布局** 整个布局混乱；

**双飞翼布局** 中Main消失，Left和Right相互遮挡。

![](static/blog/image/ThreeColumnLayout4.png)

---
### 5. 对比：

**传统布局** 能很好地保持整个三栏式布局的格式，在无需将Main优先渲染的情况下可以使用；

**圣杯布局** 在将整个布局最小宽度设置为第一个临界值的情况下和双飞翼布局没有区别；

**双飞翼布局** 至少需要将整个布局最小宽度设置为第三个临界值，即Main完全消失时，保证左右栏布局完整。

---
### 6. 总结：

**传统布局** 保证了Main内容完整，牺牲了左右栏布局；

**圣杯布局** 保证了左右栏布局完整，牺牲了整个布局；

**双飞翼布局** 保证了左右栏相对位置完整，牺牲了Main内容。

---
## 四、 在线体验

[ThreeColumnLayout on-line](https://universezy.github.io/demo/threecolumnlayout.html)

---
## 五、 源码

[ThreeColumnLayout](https://github.com/universezy/ThreeColumnLayout)
