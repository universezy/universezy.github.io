## 一、 问题日志

```shell
W: 仓库 “http://cn.archive.ubuntu.com/ubuntu xenial Release” 没有 Release 文件。
N: 无法认证来自该源的数据，所以使用它会带来潜在风险。
N: 参见 apt-secure(8) 手册以了解仓库创建和用户配置方面的细节。
W: 仓库 “http://cn.archive.ubuntu.com/ubuntu xenial-updates Release” 没有 Release 文件。
N: 无法认证来自该源的数据，所以使用它会带来潜在风险。
N: 参见 apt-secure(8) 手册以了解仓库创建和用户配置方面的细节。
W: 仓库 “http://cn.archive.ubuntu.com/ubuntu xenial-backports Release” 没有 Release 文件。
N: 无法认证来自该源的数据，所以使用它会带来潜在风险。
N: 参见 apt-secure(8) 手册以了解仓库创建和用户配置方面的细节。
E: 无法下载 http://cn.archive.ubuntu.com/ubuntu/dists/xenial-backports/restricted/source/Sources  连接失败 [IP: *****]
E: 无法下载 http://cn.archive.ubuntu.com/ubuntu/dists/xenial/main/source/Sources  连接失败 [IP: *****]]
E: 无法下载 http://cn.archive.ubuntu.com/ubuntu/dists/xenial-updates/main/source/Sources  连接失败 [IP: *****]]
E: 部分索引文件下载失败。如果忽略它们，那将转而使用旧的索引文件。

```

---
## 二、 解决方案

把 "/etc/apt/sources.list" 中的： http://cn.archive.ubuntu.com/ubuntu

全部替换为可用的镜像，建议使用阿里云的： http://mirrors.aliyun.com/ubuntu/

全部镜像参考： https://launchpad.net/ubuntu/+archivemirrors

---
## 三、 参考文献：
- [求助！ubuntu16.04 update出现下面错误](http://forum.ubuntu.com.cn/viewtopic.php?t=481622)
