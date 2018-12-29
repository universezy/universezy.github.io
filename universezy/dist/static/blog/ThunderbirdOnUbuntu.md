## 一、 安装Thunderbird

**Terminal直接安装：**

> sudo  apt-get install thunderbird

查看版本：

> thunderbird -v

**如果安装的是旧版本，可先安装Thunderbird仓库：**

> sudo add-apt-repository ppa:ubuntu-mozilla-security/ppa

更新：

> sudo apt-get update

安装thunderbird：

> sudo  apt-get install thunderbird

**如果要从官网下载最新版手动安装：**

[Thunderbird](https://www.thunderbird.net/zh-CN/)

---
## 二、 开启QQ邮箱第三方服务

**1. 登录自己的QQ邮箱，前往**

- 设置
- 账户
- POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务

![](https://github.com/universezy/Thunderbird-Teaching/blob/master/img/001.png?raw=true)

---
**2. 开启**

- POP3/SMTP服务
- IMAP/SMTP服务

![](https://github.com/universezy/Thunderbird-Teaching/blob/master/img/002.png?raw=true)

该操作需要验证密保。

---
**3. 下方提示 “生成授权码”，这个16位授权码便是第三方邮箱服务中登录QQ邮箱时需要输入的密码，而不是自己的QQ密码**

![](https://github.com/universezy/Thunderbird-Teaching/blob/master/img/003.png?raw=true)

---
## 三、 设置Thunderbird

**1. 打开Thunderbird界面**

在桌面左上角的搜索里输入Thunderbird或者Terminal中输入Thunderbird即可打开图形化界面。

![](https://github.com/universezy/Thunderbird-Teaching/blob/master/img/004.png?raw=true)

---
**2. 创建账户**
- 本地文件夹 - 账户 - 创建新账户 - 电子邮件
- 跳过并使用已有的电子邮箱

![](https://github.com/universezy/Thunderbird-Teaching/blob/master/img/005.png?raw=true)

---
**3. 设置账户**

名字可以随意，将作为发件人显示在邮件中。

电子邮件即为你的QQ邮箱地址。

密码输入刚才QQ邮箱中的授权码，如果失效了，请重新生成。

点击“继续”。

![](https://github.com/universezy/Thunderbird-Teaching/blob/master/img/006.png?raw=true)

---
**4. 验证**

点击完成将验证信息，成功后便可以开始使用Thunderbird来管理你的QQ邮箱了。

---
## 四、 参考文献

- [Ubuntu安装新版的 Thunderbird 邮件客户端](http://blog.csdn.net/gatieme/article/details/78174372)
- [在 Linux 中安装新版的Thunderbird 邮件客户端](http://blog.csdn.net/looper66/article/details/54981739)
- [在 Linux 中安装新版的Thunderbird 邮件客户端](http://www.linuxprobe.com/install-thunderbird-client.html)
- [Thunderbird（雷鸟）收取qq邮箱邮件的方法](http://www.pc0359.cn/article/jiaocheng/71607.html)

