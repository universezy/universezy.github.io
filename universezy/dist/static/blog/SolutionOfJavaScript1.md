# 前言
之所以说是"伪深克隆(复制、拷贝)"，原因很简单，JSON.stringify破坏了对象结构，导致其中一些方法丢失，请看下面这个例子：

## 1. 创建一个对象

```javascript
var obj = {
  name: 'obj',
  date: new Date()
}
```

## 2. 打印原对象

```javascript
console.log('date in obj: ' + obj.date)
```

## 3. 克隆该对象

```javascript
var objCopy = JSON.parse(JSON.stringify(obj))
```

## 4. 打印克隆对象

```javascript
console.log('date in objCopy: ' + objCopy.date)
```

## 5. 日志

```
date in obj: Tue Mar 20 2018 14:40:41 GMT+0800 (CST)
date in objCopy: 2018-03-20T06:40:41.184Z
```

## 6. 解读

Date对象被破坏结构后丢失了时区的相关信息，所以再次输出的值是不包含时区的，那么我们可以利用Date的构造方法重新创建Date对象来为其设置时区（这个时区以本地计算机为准）

## 7. 解决方案

```javascript
objCopy.date = new Date(objCopy.date) 
```

## 8. 再次打印

```
date in obj: Tue Mar 20 2018 14:49:30 GMT+0800 (CST)
date in objCopy: 2018-03-20T06:49:30.282Z
date in updated objCopy: Tue Mar 20 2018 14:49:30 GMT+0800 (CST)
```

## 9. 总结

使用JSON序列化实现的克隆，可以满足很多场景，尤其是对于由基本数据类型构成的一维表单数据，但是如果包含一些带有构造器或者其他方法的二维数据，要想实现深克隆，只能递归所有属性对象进入内部克隆。
