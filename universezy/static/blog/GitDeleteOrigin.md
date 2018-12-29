先切换到别的分支，然后删除那个分支。

示例：
```shell
zengyu@zengyu-Precision-T1700:~/private/Demo$ git branch -a
* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/branch1
  remotes/origin/master
zengyu@zengyu-Precision-T1700:~/private/Demo$ git push origin --delete branch1
To git@github.com:frogfans/Demo.git
 - [deleted]         branch1
zengyu@zengyu-Precision-T1700:~/private/Demo$ git branch -a
* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/master
```