# Android中singleInstance和taskAffinity的优先级

## Abstract

我们知道，singleInstance会让新建的activity实例放进新的task栈中，而taskAffinity又可以通过指定task栈来实现将activity实例放入指定task栈中，本文主要通过四个实例，对singleInstance和taskAffinity进行交叉对比，说明singleInstance和taskAffinity的优先级。

对比流程为，创建两个Activity分别名为MainActivity和SingleInstanceActivity，由MainActivity点击按钮启动SingleInstanceActivity，二者均在onCreate中打印日志。

为了便于读者阅读，代码、日志及终端结果均删掉了无关信息。

---
## Case 1

- LaunchMode: singleTask
- taskAffinity: same

#### Manifest
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="singleinstancedemo.zengyu.com.singleinstancedemo">

    <application
        android:name=".DemoApplication">
        <activity
            android:name=".MainActivity"
            android:taskAffinity="singleinstancedemo.zengyu.com.singleinstancedemo">
        </activity>
        <activity
            android:name=".SingleInstanceActivity"
            android:launchMode="singleTask"
            android:taskAffinity="singleinstancedemo.zengyu.com.singleinstancedemo" />
    </application>

</manifest>
```

#### Logcat
```shell
E/DemoApplication: process id = 21205
E/MainActivity: process id = 21205, task id = 1686
E/SingleInstanceActivity: process id = 21205, task id = 1686
```

#### Terminal
```shell
$ adb shell dumpsys activity | grep singleinstancedemo.zengyu.com.singleinstancedemo | grep Record
      TaskRecord{8b7c011 #1686 A=singleinstancedemo U=0 StackId=1 sz=2}
        Run #1: ActivityRecord{da0ab3e u0 singleinstancedemo.zengyu.com.singleinstancedemo/.SingleInstanceActivity t1686}
        Run #0: ActivityRecord{b2119 u0 singleinstancedemo.zengyu.com.singleinstancedemo/.MainActivity t1686}
```

#### Result

由于我们的task栈中没有SingleInstanceActivity的实例，因此此时launchMode不管是standard，singleTop还是singleTask，相对于singleInstance是没有区别的，都不会主动去创建一个新的task栈。

taskAffinity的缺省值是包名，所以此处注册清单中我们设置了两个相同值，和都不设置（缺省）的情况下，是一样的效果。

从日志和终端结果看出，非singleInstance且taskAffinity相同（缺省）的情况下，新建的activity实例是位于同一个task栈中。

---
## Case 2

- LaunchMode: singleTask
- taskAffinity: different

#### Manifest
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="singleinstancedemo.zengyu.com.singleinstancedemo">

    <application
        android:name=".DemoApplication">
        <activity
            android:name=".MainActivity"
            android:taskAffinity="singleinstancedemo.zengyu.com.singleinstancedemo">
        </activity>
        <activity
            android:name=".SingleInstanceActivity"
            android:launchMode="singleTask"
            android:taskAffinity="singleinstancedemo.zengyu.com.singleinstancedemo2" />
    </application>

</manifest>
```

#### Logcat
```shell
E/DemoApplication: process id = 21631
E/MainActivity: process id = 21631, task id = 1690
E/SingleInstanceActivity: process id = 21631, task id = 1691
```

#### Terminal
```shell
$ adb shell dumpsys activity | grep singleinstancedemo.zengyu.com.singleinstancedemo | grep Record
      TaskRecord{607a8af #1691 A=singleinstancedemo.zengyu.com.singleinstancedemo2 U=0 StackId=1 sz=1}
        Run #1: ActivityRecord{7d07683 u0 singleinstancedemo.zengyu.com.singleinstancedemo/.SingleInstanceActivity t1691}
      TaskRecord{d0254bc #1690 A=singleinstancedemo.zengyu.com.singleinstancedemo U=0 StackId=1 sz=1}
        Run #0: ActivityRecord{843c1a0 u0 singleinstancedemo.zengyu.com.singleinstancedemo/.MainActivity t1690}
```

#### Result

由于taskAffinity不同，因此新建的activity实例被放入了指定名称的task栈中。

---
## Case 3

- LaunchMode: singleInstance
- taskAffinity: same

#### Manifest
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="singleinstancedemo.zengyu.com.singleinstancedemo">

    <application
        android:name=".DemoApplication">
        <activity
            android:name=".MainActivity"
            android:taskAffinity="singleinstancedemo.zengyu.com.singleinstancedemo">
        </activity>
        <activity
            android:name=".SingleInstanceActivity"
            android:launchMode="singleInstance"
            android:taskAffinity="singleinstancedemo.zengyu.com.singleinstancedemo" />
    </application>

</manifest>
```

#### Logcat
```shell
E/DemoApplication: process id = 22358
E/MainActivity: process id = 22358, task id = 1698
E/SingleInstanceActivity: process id = 22358, task id = 1698
```

#### Terminal
```shell
$ adb shell dumpsys activity | grep singleinstancedemo.zengyu.com.singleinstancedemo | grep Record
      TaskRecord{6107ebf #1699 A=singleinstancedemo.zengyu.com.singleinstancedemo U=0 StackId=1 sz=1}
        Run #1: ActivityRecord{3293570 u0 singleinstancedemo.zengyu.com.singleinstancedemo/.SingleInstanceActivity t1699}
      TaskRecord{10508ea #1698 A=singleinstancedemo.zengyu.com.singleinstancedemo U=0 StackId=1 sz=1}
        Run #0: ActivityRecord{b34da09 u0 singleinstancedemo.zengyu.com.singleinstancedemo/.MainActivity t1698}
```

#### Result

在taskAffinity指定了相同的task栈前提下，singleInstance仍然将新建的activity实例放入了新的task栈中，因此可以得出singleInstance的优先级大于taskAffinity。

---
## Case 4

- LaunchMode: singleInstance
- taskAffinity: different

#### Manifest
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="singleinstancedemo.zengyu.com.singleinstancedemo">

    <application
        android:name=".DemoApplication">
        <activity
            android:name=".MainActivity"
            android:taskAffinity="singleinstancedemo.zengyu.com.singleinstancedemo">
        </activity>
        <activity
            android:name=".SingleInstanceActivity"
            android:launchMode="singleInstance"
            android:taskAffinity="singleinstancedemo.zengyu.com.singleinstancedemo2" />
    </application>

</manifest>
```

#### Logcat
```shell
E/DemoApplication: process id = 22541
E/MainActivity: process id = 22541, task id = 1702
E/SingleInstanceActivity: process id = 22541, task id = 1703
```

#### Terminal
```shell
$ adb shell dumpsys activity | grep singleinstancedemo.zengyu.com.singleinstancedemo | grep Record
      TaskRecord{2ae4244 #1703 A=singleinstancedemo.zengyu.com.singleinstancedemo2 U=0 StackId=1 sz=1}
        Run #1: ActivityRecord{9f03f08 u0 singleinstancedemo.zengyu.com.singleinstancedemo/.SingleInstanceActivity t1703}
      TaskRecord{fb1f2d #1702 A=singleinstancedemo.zengyu.com.singleinstancedemo U=0 StackId=1 sz=1}
        Run #0: ActivityRecord{603c9ff u0 singleinstancedemo.zengyu.com.singleinstancedemo/.MainActivity t1702}
```

#### Result

在既设置singleInstance，taskAffinity又不同的情况下，二者都是在新的task栈，理所当然新建的activity实例被放进了新的task栈中。

---
## Conclusion

即使taskAffinity相同，当LaunchMode为singleInstance时，仍然会在新的task中创建activity实例。因此singleInstance的优先级大于taskAffinity。

---
## Source

- [SingleInstanceDemo](https://github.com/universezy/SingleInstanceDemo)

---
## References

- [Android中Activity四种启动模式和taskAffinity属性详解](https://blog.csdn.net/zhangjg_blog/article/details/10923643#commentsedit)