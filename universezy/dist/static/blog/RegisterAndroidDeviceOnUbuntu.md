## 1. 查看串口信息
打开终端，输入命令"lsusb"：
```shell
zengyu@zengyu-Precision-T1700:~$ lsusb
Bus 002 Device 003: ID 0bda:0184 Realtek Semiconductor Corp. RTS5182 Card Reader
Bus 002 Device 002: ID 8087:8000 Intel Corp. 
Bus 002 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 001 Device 013: ID 2a45:0c02 Meizu Corp. MX Phone (MTP & ADB)
Bus 001 Device 004: ID 0461:4e22 Primax Electronics, Ltd 
Bus 001 Device 003: ID 413c:2107 Dell Computer Corp. 
Bus 001 Device 002: ID 8087:8008 Intel Corp. 
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 004 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 003 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

找到Android设备对应的串口信息，ID对应的值是串口编号。
```shell
Bus 001 Device 013: ID 2a45:0c02 Meizu Corp. MX Phone (MTP & ADB)
```

---
## 2. 新建规则文件
在"/etc/udev/rules.d/"目录下新建一个文件名为"xx-android.rules"的文件，其中xx用于区分你的每台设备，为一个数字，并在其中输入设备的注册信息：
```shell
zengyu@zengyu-Precision-T1700:~$ cd /etc/udev/rules.d/
zengyu@zengyu-Precision-T1700:/etc/udev/rules.d$ sudo cat>>92-android.rules
SUBSYSTEM=="usb", SYSFS{idVendor}=="2a45", MODE="0666"
```

其中的"2a45"就是刚才获取到的串口编号前半段值，按"Ctrl + d"保存并退出。

---
## 3. 修改文件权限
```shell
sudo chmod a+x 92-android.rules
```

---
## 4. 重启设备管理器
```shell
sudo /etc/init.d/udev restart
```

---
## 5. 重启adb
在Android Studio的终端窗口：
```shell
adb kill-server && adb start-server
```

或者自己跳转到adb所在文件夹（Android SDK -> platform-tools）打开终端窗口：
```shell
sudo ./adb kill-server && sudo ./adb start-server
```

---
## 6. 扩展知识

- 设备编号
USB设备编号分为前后两部分，分别为Vender ID和Product ID，Vender ID是设备制造商的标识，Product ID是制造商的产品标识。

- 设备管理器
udev是Linux的设备管理器，它在新设备连接时执行规则文件，即"/etc/udev/rules.d/"目录下以".rules"结尾的文件，某些Linux系统中，默认规则文件名为"50-udev.rules"，而udev是按照字母升序执行这些规则文件，因此如果你希望自定义的规则文件在默认文件执行之后再执行，就要让文件名开头大于50。

---
## 7. 参考文献

- [Ubuntu 下真机调试 Android](https://blog.csdn.net/w19961009/article/details/54952777)

- [为什么是“51-android.rules”？](http://www.cnblogs.com/frydsh/archive/2013/03/07/2949089.html)


