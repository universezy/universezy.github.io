# 自定义Android截屏命令

## 一、 背景

在日常开发中，我们有时需要对手机截屏，并拷出到电脑中，常规的做法有这些：
1. 手机截屏，通过adb命令或IDE的文件管理，将截图文件拷贝到电脑
2. 手机截屏，通过即时通讯软件发送到电脑上的客户端

本文的目的，便是解决以上繁琐的流程，只需要一个命令，便完成截图、拷贝两件事。

---
## 二、 方案

### 1. 实现shell脚本

这里以我个人的Mac为例：
- 创建一个名为`Custom`的文件夹，统一存放自定义脚本，以便今后新增文件
> mkdir /Applications/Custom

- 创建一个名为`cap.sh`的shell文件
> touch /Applications/Custom/cap.sh

- 编写脚本内容（如果不会vim命令，则用文本编辑器打开文件）：
> vim /Applications/Custom/cap.sh

- 写入并保存
```shell
#!/bin/bash
# 定义手机截图默认系统文件夹，不同手机可能有区别，这里的示例是OPPO手机
DIR_CAP=/sdcard/DCIM/Screenshots/
# 当前系统时间，格式为：年月日时分秒，例：20210805163130
time=$(date "+%Y%m%d%H%M%S")
# 文件完整输出路径
path="${DIR_CAP}${time}.png"
# 截图保存到输出路径
adb shell /system/bin/screencap -p $path
# 拷贝截图到当前命令执行的目录
adb pull $path
```

- 修改文件执行的权限
> sudo chmod 777 /Applications/Custom/cap.sh

---
### 2. 定义shell命令别名

- 打开zsh配置文件
> sudo vim ~/.zshrc

- 添加别名
> alias cap='/Applications/Custom/cap.sh'

- 使其生效
> source ~/.zshrc

---
## 三、 运行示例

在终端中输入`cap`：

![](static/blog/image/CustomAndroidCap.png)