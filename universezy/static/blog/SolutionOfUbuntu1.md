今天从14.04升级到16.04后出现了这个问题：

```shell
正在设置 runit (2.1.2-3ubuntu1) ...
start: 无法连接到 Upstart: Failed to connect to socket /com/ubuntu/upstart: 拒绝连接
dpkg: 处理软件包 runit (--configure)时出错：
 子进程 已安装 post-installation 脚本 返回错误状态 1
dpkg: 依赖关系问题使得 git-daemon-run 的配置工作不能继续：
 git-daemon-run 依赖于 runit；然而：
  软件包 runit 尚未配置。

dpkg: 处理软件包 git-daemon-run (--configure)时出错：
 依赖关系问题 - 仍未被配置
因为错误消息指示这是由于上一个问题导致的错误，没有写入 apport 报告。
                                                                    在处理时有错误发生：
 runit
 git-daemon-run
```

贴一个可用的解决方案：（摘自[askubuntu](https://askubuntu.com/questions/765565/how-to-fix-processing-with-runit-and-git-daemon-run/772095)）

```shell
sudo apt-get purge runit
sudo apt-get purge git-all
sudo apt-get purge git
sudo apt-get autoremove
sudo apt update
sudo apt install git
```