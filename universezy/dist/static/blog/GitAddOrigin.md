## 1. 初始化
建立.git文件
```shell
git init
```
---
## 2. 添加内容
将变更的内容添加到版本管理
```shell
git add (参数，全部内容的话填'-A')
```
---
## 3. 提交内容
将变更的内容提交
```shell
git commit (参数，这里可以填一个'-a'表示all) -m(这里可以紧跟""里面填提交日志，也可以不跟，然后在vim里输入日志)
```
---
## 4. 建立连接
将本地仓库和远程仓库建立连接
```shell
git remote add origin (远程仓库的地址)
```
---
## 5. 推送
将请求推送到远程仓库
```shell
git push -u(第一次推送因为是初始化所以加这个参数，以后可以省略) origin master
```
---
## 6. 校验
提示输入你的账号和密码就完成了

---
## 7. 完整示例
```shell
git init

git add -A

git commit -a -m"init repo"

git remote add origin git@github.com:frogfans/test.git

git push -u origin master
```
---
