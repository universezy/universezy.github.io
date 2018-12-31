## 1. 推荐

推荐使用[davidshimjs](https://github.com/davidshimjs)的[qrcodejs](https://github.com/davidshimjs/qrcodejs)，可查看作者的API文档。

---
## 2. 安装

注意qrcodejs2和qrcodejs不一样，名字别错了。
```shell
npm install qrcodejs2 --save
```

---
## 3. 导入

在需要使用的Vue页面或者js文件中导入：
```javascript
import QRCode from 'qrcodejs2'
```

---
## 4. 示例
template部分
```html
<div id="qrcode"></div>
```

script部分
```javascript
var qrcode = new QRCode('qrcode', { // 第一个入参是组件id
    text: 'Hello Vue.js!', // 生成二维码的文本
    width: 100,
    height: 100,
    colorDark: '#000000', // 二维码色
    colorLight: '#ffffff', // 背景色
    correctLevel: QRCode.CorrectLevel.H // 容错等级，H是heigh，最高，所以二维码看起来很密
})
```

---
## 5. 原理

第一个入参传入一个组件的id，然后通过jquery操作DOM在这个id组件中创建一个img子组件，并绘制二维码。

---
## 6. 注意

1. 如果传入的id对应的组件还未加载或者不可见，会报错提示无法向空对象增加子组件，所以在new这个实例时，务必确保此时组件可见，建议在mounted生命周期之后调用。

2. 如果只是想绘制这个二维码，不对这个对象进行别的操作，仅实例化，可以先声明一个引用为null，实例化之前判空返回，例如：
```javascript
var qrcode = null

export default {
    mounted () {
        this.showQrcode()
    },
    methods: {
        showQrcode: function () {
            if (qrcode !== null) return
            qrcode = new QRCode('qrcode', {
            text: 'Hello Vue.js!',
            width: 100,
            height: 100,
            colorDark: '#17233d',
            colorLight: '#f8f8f9',
            correctLevel: QRCode.CorrectLevel.H
          })
       }
    }
}
```