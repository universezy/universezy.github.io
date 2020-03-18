# 多用户原理及流程分析

## 一、 问题描述

`ActivityManager.getService().registerUserSwitchObserver`这个API的回调是一个阻塞式接口，也就是说框架那边遍历注册的observer，依次回调，每个observer执行完后框架才会回调下一个，直到全部执行结束，才会以安全的状态切换多用户。

当任意一处回调出现了耗时严重、卡顿、ANR问题甚至超时，都会严重影响系统切换多用户的过程。

---
## 二、 流程分析

### 2.1 基本概念

多用户相关逻辑，由AMS委派给`UserController`类控制：
```java
// 注册的IUserSwitchObserver接口保存在其中
private final RemoteCallbackList<IUserSwitchObserver> mUserSwitchObservers
        = new RemoteCallbackList<>();

UserController(Injector injector) {
    mInjector = injector;
    // 回调所使用的Handler在构造方法中赋值
    mHandler = mInjector.getHandler(this);
    mUiHandler = mInjector.getUiHandler(this);
    // User 0 is the first and only user that runs at boot.
    final UserState uss = new UserState(UserHandle.SYSTEM);
    // ...
}

/**
 * 这四个dispatch方法分别对应UserSwitchObserver的四个回调方法
 */
public boolean handleMessage(Message msg) {
    switch (msg.what) {
        case REPORT_USER_SWITCH_MSG:
            dispatchUserSwitch((UserState) msg.obj, msg.arg1, msg.arg2);
            break;
        case FOREGROUND_PROFILE_CHANGED_MSG:
            dispatchForegroundProfileChanged(msg.arg1);
            break;
        case REPORT_USER_SWITCH_COMPLETE_MSG:
            dispatchUserSwitchComplete(msg.arg1);
            break;
        case REPORT_LOCKED_BOOT_COMPLETE_MSG:
            dispatchLockedBootComplete(msg.arg1);
            break;
        // ...
    }
}
```

`RemoteCallbackList`由名字可知是跟binder相关：
```java
// 保存的应用层注册的binder回调
public class RemoteCallbackList<E extends IInterface> {
    /*package*/ ArrayMap<IBinder, Callback> mCallbacks
            = new ArrayMap<IBinder, Callback>();
}
```

`Injector`是`UserController`的内部类：
```java
static class Injector {
    private final ActivityManagerService mService;
    private UserManagerService mUserManager;
    private UserManagerInternal mUserManagerInternal;

    Injector(ActivityManagerService service) {
        mService = service;
    }

    protected Handler getHandler(Handler.Callback callback) {
        return new Handler(mService.mHandlerThread.getLooper(), callback);
    }

    protected Handler getUiHandler(Handler.Callback callback) {
        return new Handler(mService.mUiHandler.getLooper(), callback);
    }
}
```

`mService.mHandlerThread`是AMS中用于执行业务的子线程：
```java
public ActivityManagerService(Context systemContext, ActivityTaskManagerService atm) {
    mInjector = new Injector();
    mHandlerThread = new ServiceThread(TAG,
            THREAD_PRIORITY_FOREGROUND, false /*allowIo*/);
    mHandlerThread.start();
    mHandler = new MainHandler(mHandlerThread.getLooper());
    mUiHandler = mInjector.getUiHandler(this);
    // ...
}
```

下面分析多用户切换整个过程，以首次创建子用户为例。

---
### 2.2 创建用户

选择新建子用户时，执行`UserManager#createUser`，在`UserManagerService`中经过权限校验，最后调用到了`createUserInternalUnchecked`方法：
```java
private UserInfo createUserInternalUnchecked(...) {
    // ...
    // 分配UserId，从10开始
    userId = getNextAvailableId();
    // 以UserId为文件夹名创建子用户的系统数据根目录
    Environment.getUserSystemDirectory(userId).mkdirs();
    // ...
    // 写入用户配置文件数据
    writeUserLP(userData);
    writeUserListLP();
    // ...
    // 创建用户密钥
    final StorageManager storage = mContext.getSystemService(StorageManager.class);
    storage.createUserKey(userId, userInfo.serialNumber, userInfo.isEphemeral());
    // 准备用户数据，调用到native层进行，包括DE（设备加密）分区和CE（凭据加密）分区
    // 切换多用户后，需要等到unlock状态，才可进行CE的IO操作（例如SP），否则会抛出异常
    mUserDataPreparer.prepareUserData(userId, userInfo.serialNumber,
            StorageManager.FLAG_STORAGE_DE | StorageManager.FLAG_STORAGE_CE);
    // PMS创建子用户相关的数据
    mPm.createNewUser(userId, disallowedPackages);
    // ...
    // 发送USER_ADDED广播，表明此时fwk中用户创建完成
    Intent addedIntent = new Intent(Intent.ACTION_USER_ADDED);
    addedIntent.putExtra(Intent.EXTRA_USER_HANDLE, userId);
    mContext.sendBroadcastAsUser(addedIntent, UserHandle.ALL,
            android.Manifest.permission.MANAGE_USERS);
    // ...
}
```

整个过程多处加锁，以避免此时产生新数据的影响。

PMS中：
```java
/** Called by UserManagerService */
void createNewUser(int userId, String[] disallowedPackages) {
    synchronized (mInstallLock) {
        // 创建子用户的Settings数据库
        mSettings.createNewUserLI(this, mInstaller, userId, disallowedPackages);
    }
    synchronized (mPackages) {
        scheduleWritePackageRestrictionsLocked(userId);
        scheduleWritePackageListLocked(userId);
        primeDomainVerificationsLPw(userId);
    }
}
```

---
### 2.3 切换用户

AMS去切换用户，最后还是到了`UserController`中：
```java
boolean switchUser(final int targetUserId) {
    // ...
    // mUserSwitchUiEnabled一开始为true
    if (mUserSwitchUiEnabled) {
        // ...
        mUiHandler.removeMessages(START_USER_SWITCH_UI_MSG);
        mUiHandler.sendMessage(mHandler.obtainMessage(
                START_USER_SWITCH_UI_MSG, userNames));
    } else {
        // ...
    }
}

// handle事件START_USER_SWITCH_UI_MSG
// 提示正在切换用户
private void showUserSwitchDialog(...) {
    // The dialog will show and then initiate the user switch by calling startUserInForeground
    mInjector.showUserSwitchingDialog(fromToUserPair.first, fromToUserPair.second,
            getSwitchingFromSystemUserMessage(), getSwitchingToSystemUserMessage());
}
```

dialog显示后通过handler又调回`UserController`中：
```java
/**
 * Start user, if its not already running, and bring it to foreground.
 */
void startUserInForeground(final int targetUserId) {
    boolean success = startUser(targetUserId, /* foreground */ true);
    // ...
}
```

接下来是将新用户切换到前台。

---
### 2.4 启动用户

```java
boolean startUser(...) {
    // ...
    // foreground为true
    if (foreground && mUserSwitchUiEnabled) {
        // WMS冻结屏幕，包括：冻结input事件，cancel动画，冻结显示屏幕画面
        mInjector.getWindowManager().startFreezingScreen(
                R.anim.screen_user_exit, R.anim.screen_user_enter);
    }
    // ...
    if (foreground) {
        // ...
        // 更新子用户的Configuration
        mInjector.updateUserConfiguration();
        // ...
        // Once the internal notion of the active user has switched, we lock the device
        // with the option to show the user switcher on the keyguard.
        if (mUserSwitchUiEnabled) {
            // 关闭生物识别解锁，准备锁屏
            mInjector.getWindowManager().setSwitchingUser(true);
            mInjector.getWindowManager().lockNow(null);
        }
    } else {
        // ...
    }
    // ...
    if (foreground) {
        mHandler.sendMessage(mHandler.obtainMessage(SYSTEM_USER_CURRENT_MSG, userId,
                oldUserId));
        mHandler.removeMessages(REPORT_USER_SWITCH_MSG);
        mHandler.removeMessages(USER_SWITCH_TIMEOUT_MSG);
        // REPORT_USER_SWITCH_MSG即刚才handler分发的dispatchUserSwitch方法
        mHandler.sendMessage(mHandler.obtainMessage(REPORT_USER_SWITCH_MSG,
                oldUserId, userId, uss));
        // 发送超时事件，超时时间为3秒
        mHandler.sendMessageDelayed(mHandler.obtainMessage(USER_SWITCH_TIMEOUT_MSG,
                oldUserId, userId, uss), USER_SWITCH_TIMEOUT_MS);
    }
    if (needStart) {
        // 发送USER_STARTED广播，表明此时fwk中用户启动完成
        // Send USER_STARTED broadcast
        Intent intent = new Intent(Intent.ACTION_USER_STARTED);
        intent.addFlags(Intent.FLAG_RECEIVER_REGISTERED_ONLY
                | Intent.FLAG_RECEIVER_FOREGROUND);
        intent.putExtra(Intent.EXTRA_USER_HANDLE, userId);
        mInjector.broadcastIntent(...);
    }
    if (foreground) {
        moveUserToForeground(uss, oldUserId, userId);
    } else {
        finishUserBoot(uss);
    }
    if (needStart) {
        // 发送USER_STARTING广播，表明此时fwk中用户正在启动
        Intent intent = new Intent(Intent.ACTION_USER_STARTING);
        intent.addFlags(Intent.FLAG_RECEIVER_REGISTERED_ONLY);
        intent.putExtra(Intent.EXTRA_USER_HANDLE, userId);
        mInjector.broadcastIntent(...);
    }
    // ...
}

// handle事件USER_SWITCH_TIMEOUT_MSG
private void timeoutUserSwitch(UserState uss, int oldUserId, int newUserId) {
    synchronized (mLock) {
        Slog.e(TAG, "User switch timeout: from " + oldUserId + " to " + newUserId);
        mTimeoutUserSwitchCallbacks = mCurWaitingUserSwitchCallbacks;
        mHandler.removeMessages(USER_SWITCH_CALLBACKS_TIMEOUT_MSG);
        // 超时时中断事件分发，继续往后执行
        sendContinueUserSwitchLU(uss, oldUserId, newUserId);
        // Report observers that never called back (USER_SWITCH_CALLBACKS_TIMEOUT)
        mHandler.sendMessageDelayed(mHandler.obtainMessage(USER_SWITCH_CALLBACKS_TIMEOUT_MSG,
                oldUserId, newUserId), USER_SWITCH_CALLBACKS_TIMEOUT_MS);
    }
}

private void moveUserToForeground(UserState uss, int oldUserId, int newUserId) {
    boolean homeInFront = mInjector.stackSupervisorSwitchUser(newUserId, uss);
    if (homeInFront) {
        // 启动桌面
        mInjector.startHomeActivity(newUserId, "moveUserToForeground");
    } else {
        mInjector.stackSupervisorResumeFocusedStackTopActivity();
    }
    EventLogTags.writeAmSwitchUser(newUserId);
    sendUserSwitchBroadcasts(oldUserId, newUserId);
}

void sendUserSwitchBroadcasts(int oldUserId, int newUserId) {
    // ...
    // 发送USER_SWITCHED广播，表明此时fwk中用户切换完成
    intent = new Intent(Intent.ACTION_USER_SWITCHED);
    intent.addFlags(Intent.FLAG_RECEIVER_REGISTERED_ONLY
            | Intent.FLAG_RECEIVER_FOREGROUND);
    intent.putExtra(Intent.EXTRA_USER_HANDLE, newUserId);
    mInjector.broadcastIntent(...);
    // ..
}

// handle事件REPORT_USER_SWITCH_MSG
void dispatchUserSwitch(final UserState uss, final int oldUserId, final int newUserId) {
    final int observerCount = mUserSwitchObservers.beginBroadcast();
    if (observerCount > 0) {
        // ...
        final IRemoteCallback callback = new IRemoteCallback.Stub() {
            @Override
            public void sendResult(Bundle data) throws RemoteException {
                synchronized (mLock) {
                    long delay = SystemClock.elapsedRealtime() - dispatchStartedTime;
                    if (delay > USER_SWITCH_TIMEOUT_MS) {
                        Slog.e(TAG, "User switch timeout: observer "  + name
                                + " sent result after " + delay + " ms");
                    }
                    curWaitingUserSwitchCallbacks.remove(name);
                    // Continue switching if all callbacks have been notified and
                    // user switching session is still valid
                    // IUserSwitchObserver回调结束之后会执行这里，当所有应用层observer都在超时时间内回调后，会继续执行下一步
                    // 这里是应用层在onUserSwitching中耗时严重导致切换过程缓慢的原因
                    if (waitingCallbacksCount.decrementAndGet() == 0
                            && (curWaitingUserSwitchCallbacks
                            == mCurWaitingUserSwitchCallbacks)) {
                        sendContinueUserSwitchLU(uss, oldUserId, newUserId);
                    }
                }
            }
        };
        // 回调IUserSwitchObserver的onUserSwitching方法
        mUserSwitchObservers.getBroadcastItem(i).onUserSwitching(newUserId, callback);
        // ...
    } else {
        synchronized (mLock) {
            sendContinueUserSwitchLU(uss, oldUserId, newUserId);
        }
    }
    mUserSwitchObservers.finishBroadcast();
}

void sendContinueUserSwitchLU(UserState uss, int oldUserId, int newUserId) {
    mCurWaitingUserSwitchCallbacks = null;
    // 移除超时
    mHandler.removeMessages(USER_SWITCH_TIMEOUT_MSG);
    mHandler.sendMessage(mHandler.obtainMessage(CONTINUE_USER_SWITCH_MSG,
            oldUserId, newUserId, uss));
}

// handle事件CONTINUE_USER_SWITCH_MSG
void continueUserSwitch(UserState uss, int oldUserId, int newUserId) {
    Slog.d(TAG, "Continue user switch oldUser #" + oldUserId + ", newUser #" + newUserId);
    if (mUserSwitchUiEnabled) {
        // WMS解冻屏幕
        mInjector.getWindowManager().stopFreezingScreen();
    }
    uss.switching = false;
    mHandler.removeMessages(REPORT_USER_SWITCH_COMPLETE_MSG);
    mHandler.sendMessage(mHandler.obtainMessage(REPORT_USER_SWITCH_COMPLETE_MSG,
            newUserId, 0));
    stopGuestOrEphemeralUserIfBackground(oldUserId);
    stopBackgroundUsersIfEnforced(oldUserId);
}

// handle事件REPORT_USER_SWITCH_COMPLETE_MSG
void dispatchUserSwitchComplete(int userId) {
    // 恢复锁屏功能
    mInjector.getWindowManager().setSwitchingUser(false);
    final int observerCount = mUserSwitchObservers.beginBroadcast();
    for (int i = 0; i < observerCount; i++) {
        try {
            // 回调IUserSwitchObserver的onUserSwitchComplete方法
            mUserSwitchObservers.getBroadcastItem(i).onUserSwitchComplete(userId);
        } catch (RemoteException e) {
        }
    }
    mUserSwitchObservers.finishBroadcast();
}
```

当有应用切换到前台（对于新建用户场景，即桌面），`ActivityStackSupervisor#activityIdleInternalLocked`中有：
```java
if (!booting) {
    // Complete user switch
    if (startingUsers != null) {
        for (int i = 0; i < startingUsers.size(); i++) {
            mService.mAmInternal.finishUserSwitch(startingUsers.get(i));
        }
    }
}
```

通过AMS最终调用到`UserController#finishUserSwitch`：
```java
void finishUserSwitch(UserState uss) {
    // This call holds the AM lock so we post to the handler.
    mHandler.post(() -> {
        finishUserBoot(uss);
        startProfiles();
        synchronized (mLock) {
            stopRunningUsersLU(mMaxRunningUsers);
        }
    });
}

private void finishUserBoot(UserState uss, IIntentReceiver resultTo) {
    // TODO
    maybeUnlockUser(userId);
}
```

之后是对用户解锁的过程。

---
### 2.5 解锁用户

`maybeUnlockUser`最终执行到`unlockUserCleared`：

```java
private boolean unlockUserCleared(...) {
    if (!StorageManager.isUserKeyUnlocked(userId)) {
        final UserInfo userInfo = getUserInfo(userId);
        final IStorageManager storageManager = mInjector.getStorageManager();
        try {
            // We always want to unlock user storage, even user is not started yet
            storageManager.unlockUserKey(userId, userInfo.serialNumber, token, secret);
        } catch (RemoteException | RuntimeException e) {
            Slog.w(TAG, "Failed to unlock: " + e.getMessage());
        }
    }
    // ...
    if (!finishUserUnlocking(uss)) {
        notifyFinished(userId, listener);
        return false;
    }
    // ...
}

/**
 * Step from {@link UserState#STATE_RUNNING_LOCKED} to
 * {@link UserState#STATE_RUNNING_UNLOCKING}.
 */
private boolean finishUserUnlocking(final UserState uss) {
    // Call onBeforeUnlockUser on a worker thread that allows disk I/O
    FgThread.getHandler().post(() -> {
        // ...
        // Dispatch unlocked to system services; when fully dispatched,
        // that calls through to the next "unlocked" phase
        mHandler.obtainMessage(SYSTEM_USER_UNLOCK_MSG, userId, 0, uss)
                .sendToTarget();
    });
    return true;
}

/**
  * Step from {@link UserState#STATE_RUNNING_UNLOCKING} to
 * {@link UserState#STATE_RUNNING_UNLOCKED}.
 */
// handle事件SYSTEM_USER_UNLOCK_MSG
void finishUserUnlocked(final UserState uss) {
    // Dispatch unlocked to external apps
    // 发送USER_UNLOCKED广播，表明此时fwk中用户解锁完成，可以访问CE分区数据
    final Intent unlockedIntent = new Intent(Intent.ACTION_USER_UNLOCKED);
    unlockedIntent.putExtra(Intent.EXTRA_USER_HANDLE, userId);
    unlockedIntent.addFlags(
            Intent.FLAG_RECEIVER_REGISTERED_ONLY | Intent.FLAG_RECEIVER_FOREGROUND);
    mInjector.broadcastIntent(...);
}
```

至此，多用户切换的基本流程结束。

### 2.6 流程归纳

- 创建用户：数据准备，发送广播
- 切换用户
- 启动用户：WMS冻结，Keyguard锁定，WMS解冻，Keyguard恢复，切换前台应用，发送广播，回调binder接口
- 解锁用户：CE分区数据解锁，发送广播

---
## 三、 解决方案

应用层注册binder接口影响多用户切换过程位于`UserController#dispatchUserSwitch`中的超时机制，因此我们可以寻找替代方案来实现和框架层的异步回调。

推荐的方案是监听多用户广播，action包括`USER_SWITCH`和`USER_UNLOCKED`，前者在不涉及CE分区IO的情况下可以用于执行自己在子用户下的初始化逻辑，如果涉及IO，需要判断用户是否unlock以便延迟执行；后者为安全的时机去执行IO。

---
## 四、 参考文献

- [Android 9.x 多用户机制 1 #Profile user创建过程](https://www.jianshu.com/p/3ad2163f7d34)
- [Android 9.x 多用户机制 2 #Profile user启动过程](https://www.jianshu.com/p/12dd5408943a)
- [深入理解Android系统多用户](https://blog.csdn.net/qq_14978113/article/details/94654401)
- [Android加密之文件级加密](https://www.jianshu.com/p/d25f73805729)