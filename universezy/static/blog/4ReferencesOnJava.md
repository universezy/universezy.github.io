## 一、 四种引用类型

### 1. 强引用

```java
Object obj;
```
我们像这样直接声明的一个引用都是强引用。

如果一个对象只被强引用方式引用，只有当这个对象的所有引用都失效（主动或者被动置空），这个对象才可以被GC回收（置空的对象并非立即被回收，当GC轮询到该对象发现其为空时才会主动回收它，不过我们可以调用System.gc()主动通知GC轮询）。

---
### 2. 软引用

```java
Object obj = new Object();
SoftReference<Object> softRef = new SoftReference<Object>(obj);
```
通过SoftReference构造一个软引用，也可放入引用队列作为第二个构造参数，软引用被回收之前，会被放入该引用队列中。

软引用在OOM之前会被GC主动回收，之后调用softRef.get()返回的null，而在内存充足时，不会被回收，因此返回的是obj。

软引用属于可有可无的引用，常用于内存上做高速缓存数据。

---
### 3. 弱引用

```java
Object obj = new Object();
WeakReference<Object> weakRef = new WeakReference<Object>(obj);
```
通过WeakReference构造一个弱引用，也可放入引用队列作为第二个构造参数，弱引用被回收之前，会被放入该引用队列中。

弱引用用于解决持有引用的对象生命周期大于该引用，导致内存泄漏的问题，例如非静态内部类的实例持有外部类的强引用，当外部类的实例被销毁时，由于内部类还持有该引用，则无法及时回收外部类实例。

---
### 4. 虚引用

```java
Object obj = new Object();
ReferenceQueue refQueue = new ReferenceQueue();
PhantomReference<Object> phantomRef = new PhantomReference<Object>(obj, refQueue);
```
通过PhantomReference构造一个虚引用，构造时必须传入一个引用队列，虚引用被回收之前，会被放入该引用队列中。

虚引用属于虚假的引用，在仅被虚引用的前提下，GC轮询到虚引用指向的对象时，一定会回收该对象。因此我们可以通过判断引用队列中是否存在该引用，从而得知该引用是否即将被回收。

---
## 二、 强弱关系

四种引用方式强弱关系依次递减：

强引用 > 软引用 > 弱引用 > 虚引用

---
## 三、参考文献

- [Java四种引用包括强引用，软引用，弱引用，虚引用。](https://www.cnblogs.com/yw-ah/p/5830458.html)

- [java强引用、软引用、弱引用、虚引用](https://www.cnblogs.com/javaee6/p/4763190.html)