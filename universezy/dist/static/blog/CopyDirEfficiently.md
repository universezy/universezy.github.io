# Queue+FileChannel实现非递归高效率目录拷贝

## 一、 摘要

本文介绍非递归目录遍历的实现、FileChannel的使用，从而实现非递归的、安全的目录拷贝。

---
## 二、 非递归目录遍历 - Queue

对于文件夹拷贝，我们常用的目录遍历方式是递归，在一个方法体中调用File.listFiles()，然后对每一个子file再调用该方法体，这样实现起来看似简单，实际上有很大的隐患。

当我们的目录层次过大时，会抛出StackOverflowError错误，此处不作分析，可以参考这两篇文章，总结得相当好：

- [深入理解JVM—JVM内存模型](https://www.cnblogs.com/dingyingsi/p/3760447.html)
- [递归引发的jvm栈溢出的理解--堆和栈的概念整理](https://blog.csdn.net/typing_yes_no/article/details/50961559)

因此，我们需要使用递归的替代——队列。直接上代码，里面有注释作为解释：
```java
public void copyDir(String absSrcBase, String absDesBase) throws Exception {
    Queue<File> fileQueue = new LinkedList<>();
    File srcRootFile = new File(absSrcBase);
    // 判断原路径是否有效
    if (!srcRootFile.exists())
        throw new InvalidPathException(srcRootFile.getAbsolutePath(), "Nothing to copy.");
    if (!srcRootFile.isDirectory()) 
        throw new InvalidPathException(srcRootFile.getAbsolutePath(), "Only a directory path accepted.");
    File desRootFile = new File(absDesBase);
    // 判断目标路径是否有效
    if (desRootFile.exists() && !desRootFile.isDirectory())
        throw new InvalidPathException(desRootFile.getAbsolutePath(), "Couldn't copy a directory to a file.");
    // 目标路径文件夹不存在则创建
    if (!desRootFile.exists())
        if (!desRootFile.getParentFile().mkdirs()) throw new IOException("Make dirs failed.");
    // 加入原文件夹根节点
    fileQueue.offer(srcRootFile);
    // 当队列不为空时一直循环
    while (!fileQueue.isEmpty()) {
        // 队首取出一个节点
        File nodeFile = fileQueue.poll();
        if (nodeFile == null) continue;
        // 相对路径则直接用nodeFile.getPath()创建File对象
        File desFile = new File(getAbsDesPath(absSrcBase, nodeFile.getAbsolutePath(), absDesBase));
        // 原文件节点是文件类型
        if (nodeFile.isFile()) {
            // 此例采用覆盖的方式处理已有文件
            if (desFile.exists()) desFile.delete();
            try {
                if (desFile.createNewFile()) {
                    // 复制的具体实现稍后讲解
                    fastCopyFile(nodeFile, desFile);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else 
        // 原文件节点是文件夹类型
        if (nodeFile.isDirectory()) {
            if (!desFile.exists()) desFile.mkdirs();
            File[] childFiles = nodeFile.listFiles();
            // File.listFiles必须判空，并非默认返回空数组
            if (childFiles != null) {
                for (File file : childFiles) {
                    // 每一个子文件入列
                    fileQueue.offer(file);
                }
            }
        }
    }
}

/**
 * 以根节点为基础，截取相对路径，拼接到目标路径尾部
 * @param absSrcBase 
 * @param absSrc
 * @param absDesBase
 * @return
 */
private String getAbsDesPath(String absSrcBase, String absSrc, String absDesBase) {
    return absDesBase + absSrc.substring(absSrc.indexOf(absSrcBase) + absSrcBase.length());
}
```

---
## 三、 高效率IO - FileChannel

关于FileChannel，JDK中如此描述（节选）：
```java
/**
 * A channel for reading, writing, mapping, and manipulating a file.
 *
 * File channels are safe for use by multiple concurrent threads.  The
 * {@link Channel#close close} method may be invoked at any time, as specified
 * by the {@link Channel} interface.  Only one operation that involves the
 * channel's position or can change its file's size may be in progress at any
 * given time; attempts to initiate a second such operation while the first is
 * still in progress will block until the first operation completes.  Other
 * operations, in particular those that take an explicit position, may proceed
 * concurrently; whether they in fact do so is dependent upon the underlying
 * implementation and is therefore unspecified.
 *
 * <p> A file channel is created by invoking one of the {@link #open open}
 * methods defined by this class. A file channel can also be obtained from an
 * existing {@link java.io.FileInputStream#getChannel FileInputStream}, {@link
 * java.io.FileOutputStream#getChannel FileOutputStream}, or {@link
 * java.io.RandomAccessFile#getChannel RandomAccessFile} object by invoking
 * that object's <tt>getChannel</tt> method, which returns a file channel that
 * is connected to the same underlying file. Where the file channel is obtained
 * from an existing stream or random access file then the state of the file
 * channel is intimately connected to that of the object whose <tt>getChannel</tt>
 * method returned the channel.
 */
```

可知，FileChannel是多线程情况下并发安全的，任何时候，只会有一个涉及通道的位置或可以更改其文件大小的操作在进行；在第一个操作仍在进行时，尝试发起第二个这样的操作将会阻塞，直到第一个操作完成。其他操作，尤其是特定位置的操作，可以同时进行。

除了通过FileChannel.open来获取一个实例，还可以通过FileInputStream、FileOutputStream、RandomAccessFile等对象的getChannel方法获得对应文件的通道。

因此读者可以尝试使用线程池+LinkedBlockingQueue实现多线程目录拷贝，针对单个文件体积过大的情况，效率可以进一步提升。

此例中我们要用到一个重要的方法transferTo：
```java
/**
 * Transfers bytes from this channel's file to the given writable byte
 * channel.
 *
 * <p> This method is potentially much more efficient than a simple loop
 * that reads from this channel and writes to the target channel.  Many
 * operating systems can transfer bytes directly from the filesystem cache
 * to the target channel without actually copying them.  </p>
 *
 */
public abstract long transferTo(long position, long count,
                                WritableByteChannel target)
    throws IOException;
```

翻译过来就是，这个方法可能比从这个通道读取并写入目标通道的常规循环更有效。许多操作系统可以直接将字节从文件系统缓存传输到目标通道，而不需要实际复制它们。

然后直接上代码：
```java
public static void fastCopyFile(File srcFile, File desFile)
			throws NonReadableChannelException, NonWritableChannelException {
    // 检查原文件是否可读
    if (!srcFile.canRead()) throw new NonReadableChannelException();
    // 检查目标文件是否可写
    if (!desFile.canWrite()) throw new NonWritableChannelException();
    FileInputStream fis = null;
    FileOutputStream fos = null;
    FileChannel fcInput = null;
    FileChannel fcOutput = null;
    try {
        fis = new FileInputStream(srcFile);
        fos = new FileOutputStream(desFile);
        fcInput = fis.getChannel();
        fcOutput = fos.getChannel();
        fcInput.transferTo(0, fcInput.size(), fcOutput);
    } catch (IOException e) {
        e.printStackTrace();
    } finally {
        if (fis != null) {
            try {
                fis.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        if (fcInput != null) {
            try {
                fcInput.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        if (fos != null) {
            try {
                fos.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        if (fcOutput != null) {
            try {
                fcOutput.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

比较简单，不再详细讲解。

---
## 四、 对比测试

这一篇文章对FileWriter、BufferedWriter、FileOutputStream、BufferedOutputStream、FileChannel进行了详细的比较：

[java中多种写文件方式的效率对比实验](http://www.cnblogs.com/daoqidelv/p/6864403.html)
