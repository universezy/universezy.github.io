# Java学习笔记

## 摘要

本文记录一些学习Java过程中觉得重要的笔记，不定期更新扩充。如有错误，欢迎指正。

---
## 笔记

**1. 尽量使用fori循环而不是foreach或者迭代器iterator**

(1) foreach的底层也是由iterator实现的

(2) iterator效率很低，因为每一次遍历都要hasNext()

(3) iterator不是线程安全的，会抛出并发修改异常ConcurrentModificationException
 
---
**2. 使用ArrayList时，如果事先知道大致范围，那就在创建时设置长度**

(1) ArrayList可以自动扩容

(2) 扩容很耗时间耗内存

---
**3. 及时回收Bitmap**

(1) Bitmap很耗内存，更别说大量

(2) 不再引用Bitmap时，主动调用bitmap.recycler()告诉GC去回收它，及时释放内存，避免内存泄漏

---
**4. 避免循环体内高频率创建或销毁对象**

(1) 对于创建的对象，应尽量在循环体外创建

(2) 循环体内短时间高频率创建并销毁对象会导致内存抖动，严重则导致内存溢出

---
**5. 遍历时，对于多层引用的对象，应先声明，再操作**

(1) 逐层访问多层引用对象objectA.objectB.objectC，耗的时间是直接访问该对象objectC的很多倍

(2) 对该对象多次操作会放大这个时间差距，遍历又会再次累加这个时间差距

(3) 先声明一个实例，指向这个多层引用Object object = objectA.objectB.objectC，再对这个对象object直接操作

---
**6. 按照业务需求来选择LinkedList和ArrayList**

(1) LinkedList由链表（不连续的内存）实现，而ArrayList由数组（连续内存）实现

(2) 偏向于增删操作：使用LinkedList，因为ArrayList每一次非末端增删操作都会引起索引的移动，很耗时

(3) 偏向于查改操作：使用ArrayList，因为查找的时间复杂度LinkedList是O(n)，ArrayList是O(1)

---
**7. String，StringBuffer，StringBuilder的选取**

(1) 避免频繁修改String浪费内存，String是定长的，任意修改实际上是创建了新的对象，旧对象仍在内存中

(2) StringBuffer和StringBuilder适合频繁修改String的场景，因为不会产生多余的“垃圾”

(3) StringBuilder效率比StringBuffer高，但StringBuffer是线程安全的

---
**8. equal()，hashCode()，==的区别**

(1) equal是内容相等

(2) hashCode是由内容计算hash值，即使不同的内容，计算结果也可能相同

(3) ==是内存相等

---
**9. 关于多继承**

(1) 接口支持多继承：interface A extends B, C{} 正确

(2) 类不支持多继承：class A extends B, C{} 错误！假设B有方法func()，C也有方法func()，但二者具体实现不一样，试问：A中super.func()该调用谁的？

(3) 接口方法是抽象的，无具体实现，所以无上一条隐患

(4) 问：Java支持多继承吗？答：Java支持多继承，因为Java接口支持多继承，但Java类不支持多继承
