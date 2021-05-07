# Android进程间通信之AIDL

## 一、 摘要

本文介绍Android中的IPC方式之一——AIDL。

---
## 二、 关于AIDL

AIDL：Android Interface Definition Language，即Android接口定义语言。

Android系统中的进程之间不能共享内存，因此，需要提供一些机制在不同进程之间进行数据通信。

为了使其他的应用程序也可以访问本应用程序提供的服务，Android系统采用了远程过程调用（Remote Procedure Call，RPC）方式来实现。与很多其他的基于RPC的解决方案一样，Android使用一种接口定义语言（Interface Definition Language，IDL）来公开服务的接口。我们知道4个Android应用程序组件中的3个（Activity、BroadcastReceiver和ContentProvider）都可以进行跨进程访问，另外一个Android应用程序组件Service同样可以。因此，可以将这种可以跨进程访问的服务称为AIDL（Android Interface Definition Language）服务。

---
## 三、 编写一个Demo

### 1. AIDL接口

以Android Studio为例，鼠标在module上点击右键 - new - AIDL - AIDL File，之后，会在该module下自动创建一个名叫aidl的和src同级的文件夹，其中包含一个和src下同包名的aidl文件，这就是我们的服务接口。

![](static/blog/image/AIDL_structure.png)

我们编写完接口后，需要对module重新build一次，然后会自动生成和该aidl接口同名的java接口文件。关于aidl中接口的规范和约束，建议读者学习这篇文章：[你真的理解AIDL中的in，out，inout么？](https://www.jianshu.com/p/ddbb40c7a251)

![](static/blog/image/AIDL_aidl.png)

这个自动生成的同名java文件，请不要修改它，为了便于观察，我将其格式化，然后在注释中讲解：
```java
package com.zengyu.aidldemo;

public interface IDemo extends android.os.IInterface {
    /**
     * 继承Binder，这个很关键，Android中的IPC，底层都是基于Binder实现，
     * 这个静态内部类，实现了外部类的接口，但是由于是抽象类，所以没有真正实现，
     * 因此后面当我们使用这个Stub时，需要自己去实现外部类的接口，也就是aidl文件中的服务接口
     */
    public static abstract class Stub extends android.os.Binder implements com.zengyu.aidldemo.IDemo {
        private static final java.lang.String DESCRIPTOR = "com.zengyu.aidldemo.IDemo";

        /**
         * Stub主要做三件事：
         * 1. 将自身与Binder进行关联；
         * 2. 将方法名以字符串形式进行映射（因此aidl不支持方法的不同入参的重载）；
         * 3. 实现每个服务接口包裹化的读写
         * 这些都在自动生成时替我们完成了，我们无需关注具体内容
         */
        public Stub() {
            this.attachInterface(this, DESCRIPTOR);
        }

        /**
         * 从Binder到aidl接口的转换
         */
        public static com.zengyu.aidldemo.IDemo asInterface(android.os.IBinder obj) {
            if ((obj == null)) {
                return null;
            }
            android.os.IInterface iin = obj.queryLocalInterface(DESCRIPTOR);
            if (((iin != null) && (iin instanceof com.zengyu.aidldemo.IDemo))) {
                return ((com.zengyu.aidldemo.IDemo) iin);
            }
            return new com.zengyu.aidldemo.IDemo.Stub.Proxy(obj);
        }

        @Override
        public android.os.IBinder asBinder() {
            return this;
        }

        /**
         * 服务接口方法映射
         */
        @Override
        public boolean onTransact(int code, android.os.Parcel data, android.os.Parcel reply, int flags) throws android.os.RemoteException {
            java.lang.String descriptor = DESCRIPTOR;
            switch (code) {
                case INTERFACE_TRANSACTION: {
                    reply.writeString(descriptor);
                    return true;
                }
                case TRANSACTION_seyHello: {
                    data.enforceInterface(descriptor);
                    java.lang.String _arg0;
                    _arg0 = data.readString();
                    java.lang.String _result = this.seyHello(_arg0);
                    reply.writeNoException();
                    reply.writeString(_result);
                    return true;
                }
                default: {
                    return super.onTransact(code, data, reply, flags);
                }
            }
        }

        /**
         * 服务接口包裹化读写实现
         */
        private static class Proxy implements com.zengyu.aidldemo.IDemo {
            private android.os.IBinder mRemote;

            Proxy(android.os.IBinder remote) {
                mRemote = remote;
            }

            @Override
            public android.os.IBinder asBinder() {
                return mRemote;
            }

            public java.lang.String getInterfaceDescriptor() {
                return DESCRIPTOR;
            }

            @Override
            public java.lang.String seyHello(java.lang.String from) throws android.os.RemoteException {
                android.os.Parcel _data = android.os.Parcel.obtain();
                android.os.Parcel _reply = android.os.Parcel.obtain();
                java.lang.String _result;
                try {
                    _data.writeInterfaceToken(DESCRIPTOR);
                    _data.writeString(from);
                    mRemote.transact(Stub.TRANSACTION_seyHello, _data, _reply, 0);
                    _reply.readException();
                    _result = _reply.readString();
                } finally {
                    _reply.recycle();
                    _data.recycle();
                }
                return _result;
            }
        }

        static final int TRANSACTION_seyHello = (android.os.IBinder.FIRST_CALL_TRANSACTION + 0);
    }

    /**
     * 需要我们之后使用时去实现的服务接口
     */
    public java.lang.String seyHello(java.lang.String from) throws android.os.RemoteException;
}
```

---
### 2. 服务端

我们在Service中实例化一个Stub（两种启动方式的重载方法由读者自己实现，此处不展示）：
```java
public class AIDLService extends Service {
    private final IDemo.Stub mBinder = new IDemo.Stub() {
        @Override
        public String seyHello(String from) throws RemoteException {
            return "Hello client, I receive your msg: " + from;
        }
    };

    public AIDLService() {
    }

    @Override
    public IBinder onBind(Intent intent) {
        /**
         * Binder是IPC的基础，我们可以在各处见到它
         */
        return mBinder;
    }
}
```

别忘了在AndroidManifest中注册：
```xml
<service
    android:name=".AIDLService"
     <!--表示允许其他应用调用我们这个Service-->
    android:exported="true">
</service>
```

---
### 3. 客户端

客户端需要包含相同的aidl文件，也就是说，在客户端的module中，同样需要创建一个aidl文件，其路径、文件名、内容，应该与使用到的服务端的aidl保持一致。

然后我们在一个Activity中绑定远程的服务端Service：
```java
public class MainActivity extends AppCompatActivity {
    private IDemo iDemo = null;

    private ServiceConnection mServiceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            /**
             * 将服务端的Binder实例转换为客户端的aidl接口
             */
            iDemo = IDemo.Stub.asInterface(service);
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            iDemo = null;
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
        try {
            iDemo.seyHello("MainActivity");
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }
}
```

同样，别忘了检查我们的Activity是否在AndroidManifest中注册了。

---
## 四、 参考文献

- [百度百科-aidl](https://baike.baidu.com/item/aidl)
- [AIDL的使用、传递复杂对象以及回调客户端](https://www.jianshu.com/p/bc59061cc6fd)
- [Android IPC机制(二):AIDL的基本使用方法](http://www.open-open.com/lib/view/open1460533944217.html)