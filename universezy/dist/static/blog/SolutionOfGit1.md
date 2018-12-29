## 一、 问题日志
```shell
$ git push origin master
error: src refspec master does not match any.
error: failed to push some refs to 'https://github.com/XXXXX/XXXXXX.git'
```

---
## 二、 问题原因

push的内容为空，所以需要先添加并提交内容

---
## 三、 解决方案

push之前先"git add"，再"git commit"，然后才"git push"
参考我的：
```shell
$ git add -A

$ git commit -a -m"init"
[master (root-commit) e6ba444] init
 27 files changed, 312 insertions(+)
 xxxxx

$ git push origin master
Counting objects: 39, done.
xxxxx
```
