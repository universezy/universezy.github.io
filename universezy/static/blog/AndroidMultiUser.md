# Android多用户适配

## 一、 简介

本文基于Android Q，介绍安卓原生的多用户功能适配相关内容，供开发者学习参考。

多用户不同于多进程、多线程，前者是**本地数据**的差异，后两者是**运行时内存数据**的差异。

因此多用户适配，主要是适配本地保存的数据相关的IO操作，以及监听多用户切换的事件，包括用户创建、用户切换、用户展示等。

---
## 二、 调试命令

- 获取所有用户
> adb shell pm list users

- 创建用户
> 普通用户：adb shell pm create-user test
> 访客用户：adb shell pm create-user --guest test

- 切换用户
> adb shell am switch-user [userId]

- 获取当前用户
> adb shell am get-current-user

- 删除用户
> adb shell pm remove-user [userId]

- 获取所有用户信息
> adb shell dumpsys user

- 获取同时运行最大用户数
> adb shell pm get-max-running-users

- 获取最大用户数
> adb shell pm get-max-users

---
## 三、 大致原理

![](static/blog/image/multiuser_1.png)

- data目录下的两个user目录下，是存放每个用户的应用数据的，通过userId进行区分。
- 当新建用户时，会先新建userId命名的目录，然后拷贝系统用户（userId等于0）的应用数据到新用户，具体是通过安装还是复制内容，待读者去分析。
- 这一过程仅在新建用户时会执行，比较耗时，所以会很卡。
- 新建用户结束后，是切换用户过程，该过程下，原先用户的进程会进入冻结状态或杀死状态，此时用户是locked状态。对于独立应用，会在新用户下创建新的进程，因此无需额外处理，自然适配；对于部分系统应用，会保留进程，仅切换userId，因此需要主动适配。这个过程中，应用不得向本地本件进行IO操作，否则会导致异常，例如：
> java.lang.IllegalStateException: SharedPreferences in credential encrypted storage are not available until after user is unlocked
- 切换用户之后，才会展示用户，即系统及应用整体初始化完成，此时用户才是unlocked状态，应用可以进行本地文件IO操作。

---
## 四、 常用方法

### 4.1 UserId和UserHandle

**UserHandle**是UserId的包装类，UserId有几个常用常量，且各自有对应的包装类：
- USER_ALL = -1：非确切id，标识任意用户
- USER_CURRENT = -2：非确切id，标识当前用户
- USER_SYSTEM = 0：确切id，标识系统用户，即主用户、机主
- 其他大于1的值：确切id，标识子用户，包括访客等

---
### 4.2 获取UserId

#### (1) Context
```java
int userId = context.getUserId();
```
但是这个方法仅对有进程区分的应用有效，因为进程创建时，实例化的context对象中会包含当前系统所处的UserId，而某些特殊的不会有进程区分的应用，context中的UserId并没有更新，仍是系统用户值。

#### (2) UserHandle
```java
int userId = UserHandle.myUserId();
```
这个方法是通过uid计算，同方法(1)，不适用于保留进程的特殊应用。

#### (3) AMS
```java
public int getCurrentUserId() {
    UserInfo ui;
    try {
        ui = ActivityManager.getService().getCurrentUser();
        return ui != null ? ui.id : 0;
    } catch (RemoteException e) {
        throw e.rethrowFromSystemServer();
    }
}
```
这个方法是通过AMS去拿框架层中的UserId，因此一定是正确的。

---
### 4.3 多用户广播

广播的filer为**Intent**类中以*ACTION_USER*为前缀的常量。具体含义见对应注释。

---
### 4.4 用户状态

**UserManager**类中的方法。

---
### 4.5 创建Context

在**Context**类中，有一个方法`createPackageContextAsUser`用于创建指定用户下的context实例。
```java
public static Context getCurrentUserContext(Context context, int userId) {
    if (context.getUserId() == userId) {
        return context;
    }
    try {
        return context.createPackageContextAsUser(context.getPackageName(), 0, UserHandle.of(userId));
    } catch (PackageManager.NameNotFoundException e) {
        return null;
    }
}
```

---
### 4.6 判断当前用户是否unlock

```java
public static boolean isCurrentUserUnlocked(Context context, int userId) {
    UserManager um = UserManager.get(context);
    return um.isUserUnlocked(userId);
}
```

---
## 五、 主要适配点

以比较特殊的保留进程的应用为例，列举主要的适配点：
1. 本地数据
- SharedPreferences
2. 内存数据
- Settings共享数据库
3. 运行时对象
- BroadcastReceiver
- ContentObserver
- SystemService
- View
- Toast

以下分别介绍。

---
### 5.1 SharedPreferences

- SP没有指定UserId进行操作的API，而是通过获取SP实例时传入的**Context**实例进行用户区分，实现在对应id目录下的IO操作。对于独立应用，由于其在各自用户下创建的进程，因此context中便是对应的UserId，无需特殊处理，即能实现SP操作；对于保留进程的特殊系统应用，需要通过构造新的**Context**实例（见4.5），使其包含正确的UserId，来获取SP实例，但是该方式有一点需要注意，SP在获取实例时会通过传入的context去获取ApplicationContext，如果获取不到，则无法正常IO。

- 对于上述方案不可行的情况下，一种临时的、不太规范的方案，是通过`Context#startActivityAsUser`去启动一个空白的activity，然后在onCreate中进行SP的IO操作，并在适当时候及时finish。

- 其他方案期待读者研究交流。

---
### 5.2 Settings共享数据库

Settings值分为三大类：

- System：系统权限的值，用于一些系统核心功能，区分用户存储
- Secure：安全权限的值，通常自定义字段使用，区分用户存储
- Global：开放权限的值，常用于三方应用可访问的场景，不区分用户存储

在IO时，前两者需要调用形如`Settings.Secure.putIntForUser`的API进行操作。

---
### 5.3 BroadcastReceiver

广播接收器在注册时，可以指定UserId，对于独立应用，无需指定，默认当前用户，对于保留进程的特殊系统应用，在主用户注册后，切换到子用户并不会重新注册，因此如果子用户也需要收到这个广播，需在注册时指定UserId为ALL。

---
### 5.4 ContentObserver

**ContentProvider**数据库跟UserId有关（Settings值见[5.2]），每个用户有自己的数据，因此不同用户下通常需要分别监听Uri。因此，需要监听多用户切换，及时反注册和重新注册observer。

---
### 5.5 SystemService

SystemService本质上是从框架层获取对应的binder实例，而binder中包含了UserId信息，因此，不同的用户下，需要用对应的context去获取SystemService，否则会导致功能异常。

---
### 5.6 View

对于新增窗口，需要设置flag，才能在子用户下正常显示：
```java
WindowManager.LayoutParams windowParams = new WindowManager.LayoutParams();
windowParams.privateFlags |= WindowManager.LayoutParams.PRIVATE_FLAG_SHOW_FOR_ALL_USERS;
```

---
### 5.7 Toast

同5.6，设置flag：
```java
Toast toast = new Toast(getContext());
toast.getWindowParams().privateFlags |= WindowManager.LayoutParams.PRIVATE_FLAG_SHOW_FOR_ALL_USERS;
```

---
## 六、 常见问题

### 6.1 窗口自定义View/Toast显示不出来

见[5.6]和[5.7]

---
### 6.2 IO时抛IllegalStateException异常

见[三]，解决方案为：IO时增加unlock判断，方法见[4.6]

---
### 6.3 使用四大基本组件抛SecurityException异常

用户已经处于stoped状态时，不可使用四大基本组件。
