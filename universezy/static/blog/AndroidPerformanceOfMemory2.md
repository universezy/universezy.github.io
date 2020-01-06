# Android性能优化之内存优化——内存泄漏篇

## 一、 简介

内存泄露（Memory Leak）简单来说，就是该释放或回收的资源没有主动去释放或回收，导致GC也无法回收，最后永远无法正常回收，造成系统资源浪费。内存泄露会积累放大影响，严重时会导致内存溢出，引起程序卡死崩溃等。

和内存泄露有关的常见场景如下：
- 非静态内部类
- 匿名内部类
- BroadcastReceiver
- ContentObserver
- Cursor
- Handler的延时任务
- View的延时任务
- Timer的延时任务
- HandlerThread
- Thread
- Bitmap
- 单例模式

下面将结合示例代码、MAT分析、源码，对以上常见情况逐一讲解。

---
## 二、 非静态内部类

![](static/blog/image/APM_ML_1.0.png)

定义一个最简单的非静态内部类，执行`javac`编译其class文件：

![](static/blog/image/APM_ML_1.1.png)

尽管写在了一个java文件中，编译后仍然拆分成两个class文件，并且观察内部类的class文件，发现编译器自动生成了一个有参构造器，参数为外部类，因此，当在外部类中实例化内部类对象时，类加载器会调用该构造器传入外部类的`this`引用，即非静态内部类持有外部引用。

当内部类的生命周期大于外部类时，外部类就无法进行销毁，导致内存泄露，下面举例说明：

![](static/blog/image/APM_ML_1.2.png)

在Activity中，通过非静态内部类的方式定义线程类，实例化其对象并运行，Activity主动调用`finish`方法进行销毁，抓取hprof文件：

![](static/blog/image/APM_ML_1.3.png)

**DemoActivity**实例的GC最短路径：

![](static/blog/image/APM_ML_1.4.png)

**InnerClass**实例的GC最短路径：

![](static/blog/image/APM_ML_1.5.png)

由于`mInnerClass`对象还在执行线程活动，它又持有外部类**DemoActivity**实例的引用，因此`this$0`即外部**DemoActivity**的实例无法被回收。

综上，当我们使用非静态内部类时，一定要在外部类销毁时主动释放内部类的资源，避免因内部类生命周期大于外部类导致内存泄露，而对于像线程这种无法主动停止、释放资源的例子，可采用静态内部类+弱引用的方式实现。

---
## 三、 匿名内部类

![](static/blog/image/APM_ML_2.0.png)

定义一个匿名内部类，执行`javac`编译其class文件：

![](static/blog/image/APM_ML_2.1.png)

观察匿名内部类的class文件，发现编译器自动生成了一个有参构造器，参数为外部类，结合上一节内容，可得知，匿名内部类同样持有外部类的实例，同样存在内存泄露的风险，原理相同，此处不再赘述。

---
## 四、 BroadcastReceiver

![](static/blog/image/APM_ML_3.0.png)

在Activity中，以静态内部类的方式定义广播接收器，实例化其对象并注册广播，Activity主动调用`finish`方法进行销毁，抓取hprof文件无任何内存泄露现象，分析`registerReceiver`源码：

![](static/blog/image/APM_ML_3.1.png)

- **Activity**的`registerReceiver`方法具体实现位于**ContextImpl**类中
- 注册时如果没有传入**Handler**对象，默认使用主线程的Handler
- receiver会被封装在**ReceiverDispatcher**对象中
- `mPackageInfo`会在**ContextImpl**对象实例化时赋值，因此通常是通过`mPackageInfo`去获得**ReceiverDispatcher**实例，但是如果首次调用没有获取到实例，则仍然会创建该实例

![](static/blog/image/APM_ML_3.2.png)

**ReceiverDispatcher**对象内部包含了当前调用方的主线程（`mActivityThread`）和用于传给AMS进行注册的binder（`mIIntentReceiver`）。

![](static/blog/image/APM_ML_3.3.png)

由于入参`registered`为true，因此**InnerReceiver**在实例化时通过弱引用方式持有receiver对象，这也就解释了为什么我们的**DemoActivity**实例在销毁时没有出现`mReceiver`对象的内存泄露。

虽然应用层没有泄露，但是框架层仍然有泄露问题，接下来看AMS中：
```java
    // Maximum number of receivers an app can register.
    private static final int MAX_RECEIVERS_ALLOWED_PER_APP = 1000;

    /**
     * Keeps track of all IIntentReceivers that have been registered for broadcasts.
     * Hash keys are the receiver IBinder, hash value is a ReceiverList.
     */
    final HashMap<IBinder, ReceiverList> mRegisteredReceivers = new HashMap<>();

    public Intent registerReceiver(IApplicationThread caller, String callerPackage,
            IIntentReceiver receiver, IntentFilter filter, String permission, int userId,
            int flags) {
        // TODO
        ReceiverList rl = mRegisteredReceivers.get(receiver.asBinder());
        if (rl == null) {
            rl = new ReceiverList(this, callerApp, callingPid, callingUid,
                    userId, receiver);
            if (rl.app != null) {
                // 如果该进程活跃的receiver数量达到1000，即AMS中该进程的接收器binder对象达到1000个，
                // 则会抛出该异常，这就印证了反注册广播接收器的必要性
                final int totalReceiversForApp = rl.app.receivers.size();
                if (totalReceiversForApp >= MAX_RECEIVERS_ALLOWED_PER_APP) {
                    throw new IllegalStateException("Too many receivers, total of "
                            + totalReceiversForApp + ", registered for pid: "
                            + rl.pid + ", callerPackage: " + callerPackage);
                }
                rl.app.receivers.add(rl);
            } else {
                // 如果进程已经挂掉，则销毁这些binder对象
                try {
                    receiver.asBinder().linkToDeath(rl, 0);
                } catch (RemoteException e) {
                    return sticky;
                }
                rl.linkedToDeath = true;
            }
            mRegisteredReceivers.put(receiver.asBinder(), rl);
        } else if (rl.uid != callingUid) {
            throw new IllegalArgumentException(
                    "Receiver requested to register for uid " + callingUid
                    + " was previously registered for uid " + rl.uid
                    + " callerPackage is " + callerPackage);
        } else if (rl.pid != callingPid) {
            throw new IllegalArgumentException(
                    "Receiver requested to register for pid " + callingPid
                    + " was previously registered for pid " + rl.pid
                    + " callerPackage is " + callerPackage);
        } else if (rl.userId != userId) {
            throw new IllegalArgumentException(
                    "Receiver requested to register for user " + userId
                    + " was previously registered for user " + rl.userId
                    + " callerPackage is " + callerPackage);
        }
        BroadcastFilter bf = new BroadcastFilter(filter, rl, callerPackage,
                    permission, callingUid, userId, instantApp, visibleToInstantApps);
        if (rl.containsFilter(filter)) {
            Slog.w(TAG, "Receiver with filter " + filter
                    + " already registered for pid " + rl.pid
                    + ", callerPackage is " + callerPackage);
        } else {
            rl.add(bf);
            // TODO
            mReceiverResolver.addFilter(bf);
        }
    }
```

![](static/blog/image/APM_ML_3.4.png)

- AMS内部维护了一个广播接收器的注册表`mRegisteredReceivers`，key为传过来的**IIntentReceiver**的binder对象，而value是由这个**IIntentReceiver**构造的注册数组**ReceiverList**。
- **ReceiverList**中保存了进程信息和接收器的filter。
- 当该广播接收器首次被注册时，会在AMS中创建一个对应的注册数组，然后将注册数组存入ASM的注册表中，最后再把接收器中的filter存入这个注册数组。
- 同一个广播接收器只能被一处注册一次，重复注册无效，他处注册会抛出异常
- 及时反注册接收器，防止AMS中过多无效binder引发异常

终上所述，当我们在应用层忘记反注册广播接收器时，虽然应用层不会因此导致内存泄露，但是框架层仍然发生了泄露，且该泄露会累积影响，严重时导致应用异常崩溃。

除此之外，我们也明白了为什么自Android O开始，不允许应用注册静态广播，原因之一便是静态广播对系统资源的浪费，我们无法主动去反注册该接收器。

![](static/blog/image/APM_ML_3.5.png)

截取自[developers-广播限制](https://developer.android.com/about/versions/oreo/background?hl=zh-cn#broadcasts)

正确的做法是，在适当的时候反注册广播，及时释放相关资源：
```java
    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (mReceiver != null) {
            unregisterReceiver(mReceiver);
        }
    }
```

---
## 五、 ContentObserver

![](static/blog/image/APM_ML_4.0.png)

在Activity中，通过静态内部类的方式定义内容观察者，实例化其对象并注册监听，Activity主动调用`finish`方法进行销毁，抓取hprof文件：

![](static/blog/image/APM_ML_4.1.png)

**DemoObserver**实例的GC最短路径：

![](static/blog/image/APM_ML_4.2.png)

此处发生内存泄露的`mContentObserver`对象即`mObserver`自身，其被**ContentObserver**内部的**Transport**对象（本质上是一个binder）反向引用：

![](static/blog/image/APM_ML_4.3.png)

分析`registerContentObserver`源码：

![](static/blog/image/APM_ML_4.4.png)

然后调用到了框架层**ContentService**中：

```java
    private final ObserverNode mRootNode = new ObserverNode("");

    public void registerContentObserver(Uri uri, boolean notifyForDescendants,
            IContentObserver observer, int userHandle, int targetSdkVersion) {
        // TODO
        mRootNode.addObserverLocked(uri, observer, notifyForDescendants, mRootNode,
                uid, pid, userHandle);
        // TODO
    }
    
    public static final class ObserverNode {
        private class ObserverEntry implements IBinder.DeathRecipient {...}
        private ArrayList<ObserverNode> mChildren = new ArrayList<ObserverNode>();
        private ArrayList<ObserverEntry> mObservers = new ArrayList<ObserverEntry>();
        
        public void addObserverLocked(Uri uri, IContentObserver observer,
                                      boolean notifyForDescendants, Object observersLock,
                                      int uid, int pid, int userHandle) {
            addObserverLocked(uri, 0, observer, notifyForDescendants, observersLock,
                    uid, pid, userHandle);
        }
        
        private void addObserverLocked(Uri uri, int index, IContentObserver observer,
                                       boolean notifyForDescendants, Object observersLock,
                                       int uid, int pid, int userHandle) {
            // If this is the leaf node add the observer
            if (index == countUriSegments(uri)) {
                mObservers.add(new ObserverEntry(observer, notifyForDescendants, observersLock,
                        uid, pid, userHandle, uri));
                return;
            }

            // Look to see if the proper child already exists
            String segment = getUriSegment(uri, index);
            if (segment == null) {
                throw new IllegalArgumentException("Invalid Uri (" + uri + ") used for observer");
            }
            int N = mChildren.size();
            for (int i = 0; i < N; i++) {
                ObserverNode node = mChildren.get(i);
                if (node.mName.equals(segment)) {
                    node.addObserverLocked(uri, index + 1, observer, notifyForDescendants,
                            observersLock, uid, pid, userHandle);
                    return;
                }
            }

            // No child found, create one
            ObserverNode node = new ObserverNode(segment);
            mChildren.add(node);
            node.addObserverLocked(uri, index + 1, observer, notifyForDescendants,
                    observersLock, uid, pid, userHandle);
        }
    }
```

简而言之，将binder封装在**ObserverEntry**对象中，加入到`mObservers`数组，也就是说，框架层持有了应用层注册时的observer对象的binder引用，也就间接地持有了observer对象的引用，导致该observer对象无法回收，引起内存泄露。因此，我们应该主动去反注册observer，释放其资源：

```java
    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (mObserver != null) {
            getContentResolver().unregisterContentObserver(mObserver);
        }
    }
```

---
## 六、 Cursor

![](static/blog/image/APM_ML_5.0.png)

在Activity中，通过**ContentResolver**对象获取查询操作的**Cursor**对象，Activity主动调用`finish`方法进行销毁，抓取hprof文件无任何内存泄露现象，首先分析Activity中的`getContentResolver`方法：

`getContentResolver`具体实现位于**ContextImpl**类中，返回的对象为静态内部类**ApplicationContentResolver**的实例：

![](static/blog/image/APM_ML_5.1.png)

其实例化位于构造方法中。

接下来分析**ContentResolver**类中`query`源码：

```java
    public final @Nullable Cursor query(...) {
        try {
            // 默认构造方法实例化时mWrapped对象为null
            if (mWrapped != null) {
                return mWrapped.query(uri, projection, queryArgs, cancellationSignal);
            }
        } catch (RemoteException e) {
            return null;
        }
        IContentProvider unstableProvider = acquireUnstableProvider(uri);
        if (unstableProvider == null) {
            return null;
        }
        IContentProvider stableProvider = null;
        Cursor qCursor = null;
        try {
            // TODO
            // 分两种不同情况去获取qCursor对象
            try {
                qCursor = unstableProvider.query(mPackageName, uri, projection,
                        queryArgs, remoteCancellationSignal);
            } catch (DeadObjectException e) {
                unstableProviderDied(unstableProvider);
                stableProvider = acquireProvider(uri);
                if (stableProvider == null) {
                    return null;
                }
                qCursor = stableProvider.query(
                        mPackageName, uri, projection, queryArgs, remoteCancellationSignal);
            }
            if (qCursor == null) {
                return null;
            }
            // TODO
            // Wrap the cursor object into CursorWrapperInner object.
            final IContentProvider provider = (stableProvider != null) ? stableProvider
                    : acquireProvider(uri);
            // 此处采用委派模式，CursorWrapperInner本身也是实现的Cursor接口
            // 将qCursor对象包装成CursorWrapperInner对象
            final CursorWrapperInner wrapper = new CursorWrapperInner(qCursor, provider);
            stableProvider = null;
            qCursor = null;
            return wrapper;
            // TODO
        } catch (RemoteException e) {
            // Arbitrary and not worth documenting, as Activity
            // Manager will kill this process shortly anyway.
            return null;
        } finally {
            // 及时回收无用资源
            if (qCursor != null) {
                qCursor.close();
            }
            if (cancellationSignal != null) {
                cancellationSignal.setRemote(null);
            }
            if (unstableProvider != null) {
                releaseUnstableProvider(unstableProvider);
            }
            if (stableProvider != null) {
                releaseProvider(stableProvider);
            }
        }
    }
```

其中的`acquireUnstableProvider`和`acquireProvider`方法均为**ApplicationContentResolver**中的调用，并且都是调用的**ActivityThread**的`acquireProvider`方法：

![](static/blog/image/APM_ML_5.2.png)

- 如果ActivityThread中已有这个provider，则返回
- 如果没有，则通过AMS获取**ContentProviderHolder**对象
- 获取到**ContentProviderHolder**对象后保存provider并返回

![](static/blog/image/APM_ML_5.3.png)

**ContentProviderHolder**内部持有一个指向AMS中对应provider的`IContentProvider`实例和用于跟应用层通信的binder对象`connection`，其创建过程均位于框架层AMS中，此处不进行发散。

因此，当我们通过`ContentResolver`对ContentProvider进行操作时，框架层会返回binder对象，应用层会将其包装为**CursorWrapperInner**对象，那么，按理说如果我们没有主动释放资源，框架层将会发生内存泄露，这个binder未被及时回收，但是实际却没有发生，于是我们继续分析包装类**CursorWrapperInner**：

![](static/blog/image/APM_ML_5.4.png)

其中重写了`finalize`方法，这意味着当GC轮询到该对象时，会去执行`close`方法，也就是**Cursor**的`close`方法，对资源进行释放，回收binder。但是这样一来，问题就非常明显，尽管Android本身有这种保障机制进行回收，但其时机相对于主动释放，晚了许多，因此该方法中会抛出警告，提醒开发者及时调用`close`主动释放**Cursor**资源。

所以，当我们使用**Cursor**时，应该在操作结束后及时关闭：

```java
    Cursor cursor = null;
    try {
        cursor = getContentResolver().query(uri, projection, selection, selectionArgs, sortOrder, null);
        // TODO
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        if (cursor != null && !cursor.isClosed()) {
            cursor.close();
        }
    }
```

---

## 七、 Handler的延时任务

![](static/blog/image/APM_ML_6.0.png)

在Activity中，以静态内部类的方式定义一个Handler，实例化为`mHandler`并执行一个延时任务，在任务开始执行之前主动调用`finish`方法进行销毁，抓取hprof文件：

![](static/blog/image/APM_ML_6.1.png)

**StaticHandler**实例的GC最短路径：

![](static/blog/image/APM_ML_6.2.png)

主线程消息队列中有一个**Message**实例持有一个`target`强引用，这个`target`即`mHandler`，而**Message**实例也就是`sendMessageDelayed`传入的那个对象。

下面将结合**Handler**源码分析：
```java
    public final boolean sendMessageDelayed(@NonNull Message msg, long delayMillis) {
        // TODO
        return sendMessageAtTime(msg, SystemClock.uptimeMillis() + delayMillis);
    }

    public boolean sendMessageAtTime(@NonNull Message msg, long uptimeMillis) {
        // TODO
        return enqueueMessage(queue, msg, uptimeMillis);
    }

    private boolean enqueueMessage(@NonNull MessageQueue queue, @NonNull Message msg,
            long uptimeMillis) {
        // 此处Message反向引用了Handler对象
        msg.target = this;
        // TODO
        return queue.enqueueMessage(msg, uptimeMillis);
    }

    /**
     * post方法本质上是发送了一个匿名Message到消息队列中
     */
    public final boolean post(@NonNull Runnable r) {
       return sendMessageDelayed(getPostMessage(r), 0);
    }

    private static Message getPostMessage(Runnable r) {
        Message m = Message.obtain();
        m.callback = r;
        return m;
    }
```
由**Handler**内部的调用链可知，**Message**实例会持有**Handler**实例的强引用，用于消息队列轮询到该消息时执行回调，只要该**Message**实例没有消费结束被回收，**Handler**实例便无法回收，导致该对象内存泄露。

正确的做法是在适当的时候主动移除**Handler**中剩余的消息，释放资源，以便回收：
```java
    @Override
    protected void onDestroy() {
        super.onDestroy();
        mHandler.removeCallbacksAndMessages(null);
    }
```

---
## 八、 View的延时任务

![](static/blog/image/APM_ML_7.0.png)

自定义一个View，在Attach到窗口的回调中执行一个延时任务。在Activity布局中使用该自定义View，在延时任务开始执行之前主动调用`finish`方法进行销毁，抓取hprof文件：

![](static/blog/image/APM_ML_7.1.png)

**DemoTextView**实例的GC最短路径：

![](static/blog/image/APM_ML_7.2.png)

**DemoActivity**实例的GC最短路径：

![](static/blog/image/APM_ML_7.3.png)

**DemoRunnable**实例的GC最短路径：

![](static/blog/image/APM_ML_7.4.png)

- 主线程中有待执行的**Message**实例
- **Message**实例中的`target`成员变量为**ViewRootImpl**中的内部类**ViewRootHandler**实例
- 该**ViewRootHandler**实例持有外部**ViewRootImpl**实例的引用，可知其为非静态内部类
- **ViewRootImpl**实例间接引用了`activity`对象，即**DemoActivity**实例
- **DemoActivity**又引用了**DemoTextView**的实例`mDemo`对象
- **Message**实例中的`callback`成员变量指向了`mRunnable`对象。

因此只有当该**Message**实例被回收时，才能解引用，最终回收上述三个发生泄露的对象。

接下来结合**View**的源码分析，**Message**实例是如何导致`mDemo`对象泄露：

```java
    public boolean postDelayed(Runnable action, long delayMillis) {
        final AttachInfo attachInfo = mAttachInfo;
        if (attachInfo != null) {
            return attachInfo.mHandler.postDelayed(action, delayMillis);
        }
        // TODO
    }
```

根据**View**的绘制流程和异步消息流程，此处的`mAttachInfo`是在**ViewRootImpl**实例绘制**View**实例的第一帧时调用**View**的`dispatchAttachedToWindow`方法赋值的，因此分析**ViewRootImpl**源码：

```java
    final class ViewRootHandler extends Handler {...}

    final ViewRootHandler mHandler = new ViewRootHandler();

    public ViewRootImpl(Context context, Display display) {
        // TODO
        mAttachInfo = new View.AttachInfo(mWindowSession, mWindow, display, this, mHandler, this,
                context);
        // TODO
    }
```

- **ViewRootImpl**内部定义了一个非静态内部类**ViewRootHandler**用于向主线程发送事件，其实例持有外部类**ViewRootImpl**实例的引用
- `mAttachInfo`中的成员变量`mHandler`即**ViewRootHandler**的实例，因此间接持有**ViewRootImpl**实例的引用
- 因此**View**中发送的消息会持有**ViewRootImpl**实例的引用

**ViewRootImpl**中有一个方法，用于和**Activity**实例建立关联：
```java
    public void setActivityConfigCallback(ActivityConfigCallback callback) {
        mActivityConfigCallback = callback;
    }
```

这个方法由**PhoneWindow**对象调用：
```java
    /** Notify when decor view is attached to window and {@link ViewRootImpl} is available. */
    void onViewRootImplSet(ViewRootImpl viewRoot) {
        viewRoot.setActivityConfigCallback(mActivityConfigCallback);
    }
```

而这个方法又是由**DecorView**对象调用：
```java
    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        // TODO
        mWindow.onViewRootImplSet(getViewRootImpl());
    }
```

再分析`mActivityConfigCallback`对象的赋值过程，其位于**PhoneWindow**的构造方法中：
```java
    /**
     * Constructor for main window of an activity.
     */
    public PhoneWindow(Context context, Window preservedWindow,
            ActivityConfigCallback activityConfigCallback) {
        this(context);
        // Only main activity windows use decor context, all the other windows depend on whatever
        // context that was given to them.
        mUseDecorContext = true;
        if (preservedWindow != null) {
            mDecor = (DecorView) preservedWindow.getDecorView();
            // TODO
        }
        // TODO
        mActivityConfigCallback = activityConfigCallback;
    }
```

**PhoneWindow**对象的实例化过程位于**Activity**类中：
```java
    final void attach(...) {
        mWindow = new PhoneWindow(this, window, activityConfigCallback);
    }
```

由于以上部分涉及到**Activity**的加载机制，这里不再过多发散，以流程图的形式直接展示：

![](static/blog/image/APM_ML_7.5.png)

因此只有当通过**View**发送到主线程消息队列中的**Message**对象全部回收时，才能让**Message**对象中的`target`和`callback`等成员变量解引用，从而让**ViewRootImpl**实例解引用，最终让**Activity**实例和自定义View实例解引用，以便进行销毁。

同上一节，在适当的时候主动移除Handler中剩余的消息：
```java
    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        removeCallbacks(mRunnable);
    }
```

---
## 九、 Timer的延时任务

![](static/blog/image/APM_ML_8.0.png)

在Activity中，以静态内部类的方式定义一个TimeTask，实例化为`mTask`并通过Timer定时执行，主动调用`finish`方法进行销毁，抓取hprof文件：

![](static/blog/image/APM_ML_8.1.png)

**DemoTask**实例的GC最短路径：

![](static/blog/image/APM_ML_8.2.png)

该`mTask`对象发生内存泄露，其被**TimerThread**的实例所持有，分析**Timer**的源码：

```java
    private final TaskQueue queue = new TaskQueue();
    private final TimerThread thread = new TimerThread(queue);

    public Timer() {
        this("Timer-" + serialNumber());
    }
    
    public Timer(boolean isDaemon) {
        this("Timer-" + serialNumber(), isDaemon);
    }
    
    public Timer(String name) {
        thread.setName(name);
        thread.start();
    }
    
    public Timer(String name, boolean isDaemon) {
        thread.setName(name);
        thread.setDaemon(isDaemon);
        thread.start();
    }
```

![](static/blog/image/APM_ML_8.3.png)

- **Timer**内部有一个task队列和timer线程
- 不管是调用的哪种schedule，最终都是执行内部的同一个方法`sched`

接下来分析**TimerThread**源码：

![](static/blog/image/APM_ML_8.4.png)

- **TimerThread**本质上还是一个thread
- 内部执行死循环，用于轮询`queue`中的task
- 刚创建时会进入等待，当有task入队时，唤醒
- 当task出队时，如果队列为空，又进入等待
- 当标志位改变，且唤醒后队列为空，则中断循环，线程执行结束

因此，当我们需要销毁资源时，应该主动去调用方法，将调度的task移除，避免task泄露，但是销毁分两种方式，一种是**Timer**的`cancel`，另一种是**TimerTask**的`cancel`，下面我们分别进行介绍二者的区别。

先看**Timer**的`cancel`：

```java
    public void cancel() {
        synchronized(queue) {
            thread.newTasksMayBeScheduled = false;
            queue.clear();
            queue.notify();  // In case queue was already empty.
        }
    }
```

- 改变线程标志位，清空队列，唤醒线程，让其自然结束
- 调用该方法之后无法再添加任何task，也就是说该timer已经被销毁

然后是**TimerTask**的`cancel`：

```java
    public boolean cancel() {
        synchronized(lock) {
            boolean result = (state == SCHEDULED);
            state = CANCELLED;
            return result;
        }
    }
```

- 改变标志位，当该task下一次被轮询到时，会被从队列中移除
- 不影响timer本身的运行

所以，当我们需要完全销毁所有资源时，可以直接销毁timer：

```java
    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (mTimer != null) {
            mTimer.cancel();
        }
    }
```

---
## 十、 HandlerThread

![](static/blog/image/APM_ML_9.0.png)

在Activity中，以静态内部类的方式定义一个HandlerThread和Handler，实例化为`mHandler`并执行一个延时任务，主动调用`finish`方法进行销毁，抓取hprof文件：

![](static/blog/image/APM_ML_9.1.png)

**DemoHandlerThread**实例的GC最短路径：

![](static/blog/image/APM_ML_9.2.png)

**DemoHandler**实例的GC最短路径：

![](static/blog/image/APM_ML_9.3.png)

和**Handler**内存泄露原理一样，由于`mThread`中存在未执行的**Message**实例，其内部持有`mHandler`对象的引用，故在该**Message**实例执行结束之前，二者均无法回收。

下面分析**HandlerThread**的源码：

![](static/blog/image/APM_ML_9.4.png)

- **HandlerThread**本质上也是一个Thread
- 其内部有消息轮询对象`mLooper`
- 当线程开始时，便可以把轮询对象返回用于构造**Handler**实例来实现子线程调度
- 常用于构造和主线程并行的子线程消息队列，实现异步和并发能力

因此，当我们需要销毁资源时，应该移除`mHandler`中的消息，并退出线程：

```java
    @Override
    protected void onDestroy() {
        super.onDestroy();
        mHandler.removeCallbacksAndMessages(null);
        mThread.quit();
    }
```

---
## 十一、 Thread

![](static/blog/image/APM_ML_10.0.png)

在Activity中，以静态内部类的方式定义一个Thread，实例化为`mThread`并执行任务，Activity主动调用`finish`方法进行销毁，抓取hprof文件：

![](static/blog/image/APM_ML_10.1.png)

**Thread**实例的GC最短路径：

![](static/blog/image/APM_ML_10.2.png)

该`mThread`对象发生内存泄露，分析**Thread**源码：

![](static/blog/image/APM_ML_10.3.png)

调用`start`后，会通过JNI调用native层的创建方法：

![](static/blog/image/APM_ML_10.4.png)

![](static/blog/image/APM_ML_10.5.png)

这里对native层的Thread对象进行实例化，持有java层Thread对象的引用，并将内存地址指针赋值给java层的变量`nativePeer`：

![](static/blog/image/APM_ML_10.6.png)

当线程没有被创建/执行，或者已经被销毁时，这个native指针等于0。

接下来分析**Thread**的销毁过程：

![](static/blog/image/APM_ML_10.7.png)

java层**Thread**类的`stop`方法不再被支持用于强制结束线程，因为那将会导致一些不可预料的问题出现，例如：

> 数据库IO属于阻塞的、耗时的原子操作，如果在线程中强行中断，会引起严重问题

常见的做法是在主线程中调用子线程的`join`方法，将并行执行的任务变为顺序串行执行，并且需要确保这样调用后子线程的生命周期不会影响主线程的资源回收。

当线程自然执行结束后，由native层主动进行销毁：

![](static/blog/image/APM_ML_10.8.png)

将java层的变量`nativePeer`置为0，native层对java层解引用，之后，java层**Thread**对象便可以被GC回收。

java层**Thread**主要是做一些计时方面的操作、暴露一些api供上层调用，通过JNI调用native层方法，改变线程状态标志位，来影响CPU调度的时间片执行情况。而native层才是线程核心逻辑具体实现，控制线程整个生命周期和调度。

按照线程的设计，对于线程本身未执行结束造成的内存泄露，即子线程的执行无法被强制结束，我们只需要确保其不会对主线程或其他子线程的回收造成影响，当该子线程自然执行结束后，便可以被回收。另一方面，尽量避免这种使用方式，而是选择可控的方式进行程序设计：

- 在`run`方法中通过标志位进行控制，当需要结束线程时，改变标志位，及时执行结束

![](static/blog/image/APM_ML_10.9.png)

- 使用**HandlerThread**

---
## 十二、 Bitmap

![](static/blog/image/APM_ML_11.0.png)

在Activity中，通过**BitmapFactory**解析实例化**Bitmap**对象，Activity主动调用`finish`方法进行销毁，抓取hprof文件无任何内存泄露现象，分析**BitmapFactory**中的`decodeResource`方法：

![](static/blog/image/APM_ML_11.1.png)

其最终会走到`decodeStream`方法中：
- 如果是资源文件的位图，则走`nativeDecodeAsset`流程
- 如果是本地文件的位图，则走`nativeDecodeStream`流程

![](static/blog/image/APM_ML_11.2.png)

在native层，这俩方法最终都会走到`doDecode`中，这个方法代码较长，且我自己也理解地不透彻，因此仅简单介绍该方法中的要点：
- native层有可以复用的位图对象时，进行复用，即对其像素数据进行回收和重新设置
- native层没有可复用的位图对象时，分配新内存来创建对象

接下来，我们分析native层的**Bitmap**类。

对于创建位图：

![](static/blog/image/APM_ML_11.3.png)

直接调用了java层的位图构造方法创建对象：

![](static/blog/image/APM_ML_11.4.png)

- java层持有native层内存地址指针强引用，但从demo实际表现来看并没有出现内存泄露
- 创建了**NativeAllocationRegistry**对象，其用于将java层对象和native内存建立联系，当java层GC可达时，将执行传入的native层的Finalizer用于回收native内存，正是这种方式，即便没有在应用层主动调用`recycle`，也不会出现内存泄露问题

我们查看native层这个Finalizer：

![](static/blog/image/APM_ML_11.5.png)

直接销毁了对象。

接着，我们分析回收位图：

![](static/blog/image/APM_ML_11.6.png)

![](static/blog/image/APM_ML_11.7.png)

![](static/blog/image/APM_ML_11.8.png)

对位图中的像素数据进行释放，并重置对象的一些属性。

以上是通过分析**BitmapFactory**粗略了解到的关于位图的原理，除此之外，常用的实例化位图方式还有**Bitmap**中的`createBitmap`方法，其最终调用的仍然是native层**Bitmap**的`createBitmap`方法。

综上所述，当我们使用位图时，如果没有主动去回收对象，并不会造成内存泄露，原因是位图实例化时会通过**NativeAllocationRegistry**对象进行管控从而优化，但是如果我们主动回收，及时释放native层无用的像素数据，可以更好地节省内存，并且降低native层复用时才去回收像素数据的开销。

---
## 十三、 单例模式

单例模式本身不会有内存泄露问题，但是由于其生命周期过长的特点，尤其是对于饿汉式单例模式，生命周期更是与整个进程一样长，如果未及时销毁释放不再使用的资源，会造成不必要的内存浪费，另一方面，对于进程保活的情况下，热启动时并不会重置单例对象中的变量，导致出现数据错误。

因此，对于单例模式：
- 设计时，增加用于销毁资源的方法，在适当的时候调用，并将实例解引用置空
- 尽量避免饿汉式设计，静态代码块和静态声明实例化都是冷启动的负担

---
## 十四、 总结

- 有内存泄露

| 类型 | 典型场景 | 原因 |
| - | --- | -- |
| 内部类持有外部引用 | 1. 非静态内部类<br/>2. 匿名内部类 | 和外部类为依赖关系，实例无法单独存活，内部类实例存活导致外部类实例无法回收 |
| 框架层持有binder引用 | 1. BroadcastReceiver<br/>2. ContentObserver | 未主动对框架层解引用，导致binder对象泄露，框架层一定泄露，应用层可能泄露 |
| 其他 | 1. Handler-Message<br/>2. TimerTask<br/>3. 单例模式 | 生命周期过长未及时回收资源 |

- 无内存泄露

| 类型 | 规避策略 |
| - | -- |
| Cursor | 重写finalize，在GC轮询到时主动释放资源 |
| Bitmap | 使用NativeAllocationRegistry，在GC可达时主动释放native资源 |
