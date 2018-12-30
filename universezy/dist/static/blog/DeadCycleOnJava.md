## 一、 摘要

在Java代码中，对于死循环有两种常见的方式：

- for( ; ; )
- while(true)

那么二者到底有什么区别呢？

---
## 二、 实践

### 1. 首先编写一个java文件，内容如下：
```java
public class Demo {
    public void demo1() {
        for (;;) {}
    }

    public void demo2() {
        while (true) {}
    }
}
```

### 2. 然后编译为class文件，并显示字节码：
```shell
zengyu@zengyu-Precision-T1700:~$ javac Demo.java
zengyu@zengyu-Precision-T1700:~$ javap -verbose Demo.class
Classfile /home/zengyu/Demo.class
  Last modified 2018-9-12; size 314 bytes
  MD5 checksum 5f959c0d031d1c2b2503d75222b0e94e
  Compiled from "Demo.java"
public class Demo
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #3.#13         // java/lang/Object."<init>":()V
   #2 = Class              #14            // Demo
   #3 = Class              #15            // java/lang/Object
   #4 = Utf8               <init>
   #5 = Utf8               ()V
   #6 = Utf8               Code
   #7 = Utf8               LineNumberTable
   #8 = Utf8               demo1
   #9 = Utf8               StackMapTable
  #10 = Utf8               demo2
  #11 = Utf8               SourceFile
  #12 = Utf8               Demo.java
  #13 = NameAndType        #4:#5          // "<init>":()V
  #14 = Utf8               Demo
  #15 = Utf8               java/lang/Object
{
  public Demo();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 1: 0

  public void demo1();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=0, locals=1, args_size=1
         0: goto          0
      LineNumberTable:
        line 3: 0
      StackMapTable: number_of_entries = 1
        frame_type = 0 /* same */

  public void demo2();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=0, locals=1, args_size=1
         0: goto          0
      LineNumberTable:
        line 7: 0
      StackMapTable: number_of_entries = 1
        frame_type = 0 /* same */
}
SourceFile: "Demo.java"
```

### 3. 分析指令：
```
  public void demo1();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=0, locals=1, args_size=1
         0: goto          0
      LineNumberTable:
        line 3: 0
      StackMapTable: number_of_entries = 1
        frame_type = 0 /* same */

  public void demo2();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=0, locals=1, args_size=1
         0: goto          0
      LineNumberTable:
        line 7: 0
      StackMapTable: number_of_entries = 1
        frame_type = 0 /* same */
```

可以看出二者在编译为字节码后是完全一致的。

---
## 三、 结论

对于java而言，使用for(;;)和while(true)进行死循环是相同效果的，看个人喜好选择。
另外补充一点，在C中，使用release编译出来的二者也是完全一致的，但是用debug编译出来的，while(true)会比for(;;)多一些操作指令，读者可以自己去研究，此处不展开讨论。