## 一、 摘要
Android Studio启动时报"Please check your firewall settings and restart Android Studio"的解决方案。

---
## 二、 问题日志
```shell
Cannot start internal HTTP server. Git integration, JavaScript debugger and LiveEdit may operate with errors. Please check your firewall settings and restart Android Studio
```

---
## 三、 解决方案

以win10系统为例：
1. "控制面板\所有控制面板项\Windows Defender 防火墙\允许的应用"或者设置和Cortana里搜索"防火墙"；
2. 更改设置；
3. 找到"Android Studio"，全部打勾；
4. 如果没有，"允许其他应用"里找到安装目录手动添加studio.exe或studio64.exe
5. 重启Android Studio。
