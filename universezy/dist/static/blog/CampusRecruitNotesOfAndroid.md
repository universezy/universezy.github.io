# Android校招面试知识点整理

## 前言

本来应该在秋招结束时就将整理出来的知识点发布博客的，结果忘了。好在现在不算晚，给春招的同学一点参考。

---
## 一、 Activity
### 1. lifecycle
- onCreate
- onStart
- onResume
- onPause
- onStop
- onDestroy
- onRestart

---
### 2. launchMode
- Standard
- SingleTop
- SingleTask
- SingleInstance

---
## 二、 Service
### 1. lifecycle
#### (1) start
- onCreate
- onStartCommand(2.0后)

---
#### (2) bind
- onCreate
- onBind
- onUnbind
- onDestroy

---
### 2. 启动方式
- startService
- bindSercice

---
### 3. IntentService
- 继承Service
- 轻量级

---
## 三、 Multi-Thread
### 1. HandlerThread
- 自带Looper
- Looper执行Message、Runnable
- MessageQueue

---
### 2. AsyncTask
#### (1) 串行(3.0后)

---
#### (2) 基本方法
- onPreExcute
- doInBackground
- onPostExcute
- cancel

---
### 3. ThreadPoolExecutor
- 定长
- 缓存
- 调度
- 单任务

---
### 4. IntentService
- 通过Intent传递
- 自毁

---
## 四、 View
### 1. View和ViewGroup的区别

---
### 2. 基本方法
- onMeasure
- onDraw
- onLayout
- onFinishInflate
- onSizeChanged
- invalidate

---
### 3. Adapter

---
### 4. 消息传递
- 拦截
- 消费

---
## 五、 Storage
- SQLite
- SharePreferences
- ContentProvider
- Local-file
- Internet-storage

---
## 六、 Framework
- Internet: Okhttp
- View: Glide、Picasso
- Redis: Jedis
- Json: Gson
- Rx: RxJava、RxAndroid
- Log: Logger
- Event: EventBus
- Xml: Dom、Sax、Pull
- ...
