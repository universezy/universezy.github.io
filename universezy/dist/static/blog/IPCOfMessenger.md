# Android进程间通信之Messenger

## 一、 摘要

本文介绍Android中的IPC方式之一——Messenger。

---
## 二、 关于Messenger

SDK中如此描述：
```java
/**
 * Reference to a Handler, which others can use to send messages to it.
 * This allows for the implementation of message-based communication across
 * processes, by creating a Messenger pointing to a Handler in one process,
 * and handing that Messenger to another process.
 *
 * <p>Note: the implementation underneath is just a simple wrapper around
 * a {@link Binder} that is used to perform the communication.  This means
 * semantically you should treat it as such: this class does not impact process
 * lifecycle management (you must be using some higher-level component to tell
 * the system that your process needs to continue running), the connection will
 * break if your process goes away for any reason, etc.</p>
 */
```

大意是说，引用一个可以发送message的Handler。这允许基于message实现的跨进程通信，通过Handler创建一个Messanger，传递message到其他进程。需要注意的是，其实现仅仅是对Binder的简单包装。这意味着：Messenger不应该影响进程的生命周期管理（你必须用更高级别的组件来告诉系统你的进程需要继续执行），一旦你的进程因为任何原因中断，Messenger的连接也会断开。

整理出以下几个要点：

- Messenger的构造参数需要传入一个Handler实例
- Messenger基于Binder实现
- 注意你的组件的生命周期

除了使用Handler实例的构造器，我们查看API文档还能发现，也可以通过IBinder实例构造：
```java
/**
 * Create a Messenger from a raw IBinder, which had previously been
 * retrieved with {@link #getBinder}.
 * 
 * @param target The IBinder this Messenger should communicate with.
 */
public Messenger(IBinder target) {
    mTarget = IMessenger.Stub.asInterface(target);
}
```

简单地理解Messanger，顾名思义就是一个信使，客户端和服务端之间不直接进行消息通信，而是通过信使来传达消息。

---
## 三、 编写一个Demo

### 1. 服务端

我们在Service中实现一个Messanger：
```java
public class MessengerDemoService extends Service {
    private final static int MSG_RECEIVE_FROM_CLIENT_0 = 0;
    private final static int MSG_RECEIVE_FROM_CLIENT_1 = 1;
    private final static int MSG_REPLY_TO_CLIENT = 2;

    private final Messenger mMessenger = new Messenger(new Handler() {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case MSG_RECEIVE_FROM_CLIENT_0:
                    // 获取客户端发送的message中的数据
                    Bundle mBundle = msg.getData();
                    // TODO
                    break;
                case MSG_RECEIVE_FROM_CLIENT_1:
                    // 如果我们需要向客户端返回消息，则像这样：
                    Message msgReply = Message.obtain();
                    msgReply.what = MSG_REPLY_TO_CLIENT;
                    Bundle bundle = new Bundle();
                    // TODO 在bundle中放入回传数据
                    msgReply.setData(bundle);
                    try {
                        // msg.replyTo指向回传客户端的Messenger实例
                        msg.replyTo.send(msgReply);
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                    break;
                default:
                    break;
            }
        }
    });

    @Override
    public IBinder onBind(Intent intent) {
        /**
         * 通过返回Messenger实例的binder来和Service进行绑定，
         * 当客户端向该Service发送message时，便通过binder将消息发送至Messenger实例，
         * 即最终将消息分发到Messenger实例的handleMessage方法中
         */
        return mMessenger.getBinder();
    }
}
```

然后在AndroidManifest中注册Service：
```xml
 <service
    android:name=".MessengerDemoService"
     <!--表示允许其他应用调用我们这个Service-->
    android:exported="true">
</service>
```

---
### 2. 客户端

在客户端，我们需要声明两个Messenger，一个用来向服务端发送消息，一个用于接收服务端返回的消息。为什么在客户端不能像服务端那样直接使用replyTo的方式来回传呢？如果客户端和服务端都在接收消息后回传，两边可能就会一直传来传去，这样没完没了，程序就完了！并且按照C/S架构来讲，我们的两个Messenger分别对应request和response，而服务端收到request可能会进行response，如此描述，也就明白了吧。

我们在Activity中创建这两个Messenger实例：
```java
public class MessengerDemoClient extends AppCompatActivity {
    private final static int MSG_RECEIVE_FROM_CLIENT_0 = 0;
    private final static int MSG_RECEIVE_FROM_CLIENT_1 = 1;
    private final static int MSG_REPLY_TO_CLIENT = 2;

    // 这是客户端用于接收服务端返回的Messenger
    private Messenger mClientMessenger = new Messenger(new Handler() {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case MSG_REPLY_TO_CLIENT:
                    // 获取客户端返回的message中的数据
                    Bundle mBundle = msg.getData();
                    // TODO
                    break;
                default:
                    break;
            }
        }
    });

    // 这是客户端用于向服务端发送消息的Messenger
    private Messenger mServerMessenger;

    private ServiceConnection mServiceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            /**
             * 这里用到了Messenger的IBinder构造方式，
             * 通过绑定Service的binder，我们的Messenger实例，
             * 便可以通过该binder向Service发送消息
             */
            mServerMessenger = new Messenger(service);
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
        }
    };

    /**
     * 我们需要在Activity创建时绑定Service，通常在onCreate中
     */
    private void bindService() {
        Intent intent = new Intent();
        // 如果我们给Service添加了用于启动的filter：
        intent.setAction("启动的filter");
        // TODO 使用setComponent或者setPackage来指定Service所在的应用
        bindService(intent, mServiceConnection, Context.BIND_AUTO_CREATE);
    }

    private void testSending() {
        Message msgSend = Message.obtain();
        msgSend.what = MSG_RECEIVE_FROM_CLIENT_1;
        Bundle bundle = new Bundle();
        // TODO 在bundle中放入传给服务端的数据
        msgSend.setData(bundle);
        // 指定我们这次发送消息的返回信息由mClientMessenger来处理
        msgSend.replyTo = mClientMessenger;
        try { 
            mServerMessenger.send(msgSend); 
        } catch (RemoteException e) { 
            e.printStackTrace(); 
        }
    }
}
```

最后别忘了检查我们的Activity是否在AndroidManifest中注册了。

---
## 四、 参考文献

- [Android使用Messenger跨进程通信](https://blog.csdn.net/zxlworking1/article/details/80359448)