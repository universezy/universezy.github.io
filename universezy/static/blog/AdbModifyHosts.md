## 一、 教程
1. 获取root权限
```shell
adb root
```
2. 重新挂载为可读可写设备
```shell
adb remount
```
3. 将原hosts文件拷到本地

本地先创建一个空文件，然后再把手机中的hosts拷贝到该文件中。
```shell
touch <local file> && adb pull /system/etc/hosts <local file>
```
5. 修改hosts文件

6. 将修改后的hosts文件拷回手机
```shell
adb push <local file> /system/etc/hosts
```
7. 重启
```shell
adb reboot
```

---
## 二、 示例
```shell
adb root
adb remount
touch /home/zengyu/hosts && adb pull /system/etc/hosts /home/zengyu/hosts
/** 修改hosts文件 **/
adb push /home/zengyu/hosts /system/etc/hosts
adb reboot
```