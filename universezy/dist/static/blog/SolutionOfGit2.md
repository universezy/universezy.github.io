## 一、 问题日志
```shell
zengyu@zengyu-Precision-T1700:~/private$ repo init -u ssh://zengyu@xxx:123/example/manifest -b branch
fatal: Cannot get https://gerrit.googlesource.com/git-repo/clone.bundle
fatal: error [Errno 101] Network is unreachable
```

---
## 二、 问题原因
天朝墙的缘故，无法访问googlesource。

---
## 三、 解决方案
换个repo资源网站，使用清华大学镜像资源。

### 1. 打开repo配置文件
```shell
zengyu@zengyu-Precision-T1700:~$ which repo
/usr/bin/repo
zengyu@zengyu-Precision-T1700:~$ sudo gedit /usr/bin/repo
```

### 2. 查看顶部repo默认配置
可以看到默认资源是googlesource。此处我们不作修改。
```shell
# repo default configuration
#
import os
REPO_URL = os.environ.get('REPO_URL', None)
if not REPO_URL:
  REPO_URL = 'https://gerrit.googlesource.com/git-repo'
REPO_REV = 'stable'
```

### 3. 打开全局变量配置文件
```shell
zengyu@zengyu-Precision-T1700:~$ sudo gedit ~/.bashrc
```

### 4. 添加全局变量
我们在末尾添加这两行并保存：
```shell
# repo
export REPO_URL='https://mirrors.tuna.tsinghua.edu.cn/git/git-repo/'
```

### 5. 使配置文件生效
```shell
zengyu@zengyu-Precision-T1700:~$ source ~/.bashrc
```

---
## 四、 参考文献
- [Git Repo 镜像使用帮助](https://mirrors.tuna.tsinghua.edu.cn/help/git-repo/)