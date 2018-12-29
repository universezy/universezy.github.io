## 前言
如果你的本地仓库和远程仓库没有建立连接，请先看[git将本地仓库上传到远程仓库](http://blog.csdn.net/zy13608089849/article/details/79461344)，如果你已经建立连接或者是直接clone到本地仓库的，请往下读：

---
## 1. 添加内容
```shell
git add (参数，全部内容的话填'-A')
```

---
## 2. 提交内容
```shell
git commit (参数，这里可以填一个'-a'表示all) -m(这里可以紧跟""里面填提交日志，也可以不跟，然后在vim里输入日志)
```

---
## 3. 推送
```shell
git push (默认push到master分支)
```
---
## 4. 校验
如果设置了global变量的用户名和密码，则跳过这步。

---
## 5. 完整实例
```shell
git add -A

git commit -a -m"update"

git push
```
