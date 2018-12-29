## 一、 实现一个双检锁
双检锁，顾名思义，两次检查一次锁：
```java
public class DoubleCheckLock {
    private static DoubleCheckLock instance;

    private DoubleCheckLock() {
    	// TODO
    }

    public static DoubleCheckLock getInstance() {
        if (instance == null) {
            synchronized (DoubleCheckLock.class) {
                if (instance == null) {
                    instance = new DoubleCheckLock();
                }
            }
        }
        return instance;
    }
}
```

---
## 二、 为什么线程不安全

当线程A执行到" instance = new DoubleCheckLock();"这一行，而线程B执行到外层"if (instance == null) "时，可能出现instance还未完成构造，但是此时不为null导致线程B获取到一个不完整的instance。

之所以会出现这种情况，要从JVM的指令重排序说起。

---
## 三、 关于指令重排序

指令重排序：是编译器在不改变执行效果的前提下，对指令顺序进行调整，从而提高执行效率的过程。
一个最简单的重排序例子：
```java
int a = 1;
String b = "b";
```

对于这两行毫无关联的操作指令，编译器可能会将其顺序调整为：
```java
String b = "b";
int a = 1;
```

此时该操作并不会影响后续指令的执行和执行结果。
再回过头看我们的双检锁内部，对于"instance = new DoubleCheckLock();"这一行代码，它分为三个步骤执行：

- 1.分配一块内存空间
- 2.在这块内存上初始化一个DoubleCheckLock的实例
- 3.将声明的引用instance指向这块内存

第2和第3个步骤都依赖于第1个步骤，但是2和3之间没有依赖关系，那么如果编译器将2和3调换顺序，变成了：

- 1.分配一块内存空间
- 2.将声明的引用instance指向这块内存
- 3.在这块内存上初始化一个DoubleCheckLock的实例

当线程A执行到第2步时，instance已经不为null了，因为它指向了这块内存，此时如果线程B走到了"if (instance == null)"，那么线程B其实拿到的还是一个null，因为这块内存还没有初始化，这就出现了问题。

指令重排序是导致出现线程不安全的直接原因，而根本原因则是对象实例化不是一个原子操作。

---
## 四、 关于原子操作

原子操作：不可划分的最小单位操作，不会被线程调度机制打断，不会有线程切换，整个操作要么不执行，一旦执行就会运行到结束。

我们来看一个简单的例子：
```java
Object a;
Object b = new Object();
a = b;
```

对于"a = b" 这一操作指令，将a这个引用指向b这一对象的内存，只需要改变a的指针，因此该直接赋值操作是一个不可划分的原子操作。

再看另一个例子：
```java
int i = 0;
i ++;
```

对于"i ++"这一操作指令，其实它分为三个步骤执行：

- 读取i的值
- 将i的值加1
- 将新的值赋值给i

类似的还有：
```java
boolean b = true;
b = !b;
```

对于这些涉及自身值的操作，由于其最终实现需要划分更小的操作单位，因此均不是原子操作。

对于非原子操作，在多线程下就可能出现线程安全问题，这也是我们的双检锁不安全的根本原因，实例化对象不是一个原子操作。

---
## 五、 实现线程安全的双检锁

我们只需要对instance加上一个volatile修饰符便可解决线程安全问题，关于volatile的知识请阅读参考文献对应内容。

```java
public class DoubleCheckLock {
    private static volatile DoubleCheckLock instance;

    private DoubleCheckLock() {
    	// TODO
    }

    public static DoubleCheckLock getInstance() {
        if (instance == null) {
            synchronized (DoubleCheckLock.class) {
                if (instance == null) {
                    instance = new DoubleCheckLock();
                }
            }
        }
        return instance;
    }
}
```

synchronized和volatile的完美配合，便实现了线程安全的双检锁单例模式。

---
## 六、 参考文献

- [JVM(十一)Java指令重排序](https://blog.csdn.net/yjp198713/article/details/78839698)

- [原子操作](https://baike.baidu.com/item/%E5%8E%9F%E5%AD%90%E6%93%8D%E4%BD%9C/1880992?fr=aladdin)

- [并发编程之ThreadLocal、Volatile、synchronized、Atomic关键字扫盲](https://blog.csdn.net/u010687392/article/details/50549236)

- [java-双重检查锁为什么多线程不安全](https://www.jianshu.com/p/17ed6a46ed85)

- [【Java学习笔记】线程安全的单例模式及双重检查锁—个人理解](https://www.cnblogs.com/jugg1024/p/4204965.html)