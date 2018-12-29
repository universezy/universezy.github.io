升级重启后显示"Failed to start Load Kernel Modules"，并且没有图形界面，但是命令窗口1-6（可以按ctrl+alt+F1等进行切换）可以正常使用，解决方案如下：

1. ctrl+alt+F1 切换到命令窗口1；
2. root模式下（先su）或者每行命令都使用sudo输入以下：

```shell
apt-get update
dpkg --configure -a
apt-get dist-upgrade
apt-get -f install
reboot
```

重新配置系统设置耗时很长，耐心等待，途中遇到对话框，回车确认就行。

参考文献：[ubuntu 14.04在升级16.04时候，出现Failed to start Load Kernel Modules 解决方法](https://blog.csdn.net/hello_java_android/article/details/54091293)