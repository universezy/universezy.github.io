# 基于Gerrit的Git常用命令

## 摘要

本文介绍日常开发中常用的git命令，从初阶到高阶都有，以及相关git、gerrit原理，以提升协同开发效率。

---
## 简介

1. git是一种VCS（version control system）工具，类似于SVN等，由Linux发明人林纳斯在两周内开发出来。

2. gerrit是一种代码review平台，处于本地仓库和远程仓库之间的临时仓库，部署好gerrit服务器后，本地代码无法直接push到远程仓库，需要先push到gerrit，然后经过review（+1、+2）、merge，才能合入远程仓库。基于这种特性，gerrit为我们提供了很多便利，比如当做自己本地提交的备份，以防本地修改丢失无法找回。

3. 提交记录讲解：
一条提交记录主要包含以下几个信息：
- Commit Message：该记录的描述信息。
- Commit Id：该记录的节点hash，可变。rebase时可能修改。
- Parent Id：该记录的上一条记录的Commit Id，可变。rebase时可能修改。
- Change Id：该记录的唯一标识符，不变。常附于Commit Message末尾，用于在Gerrit上更新提交记录。但是cherrypick时注意删除或修改，否则会将该提交之前依赖的所有提交一起同步过去。
- Author：创建该记录的人，不变。
- Committer：最后一次更新该提交的人，可变。

---
## 一、 clone
### 示例1
> git clone "xxxxxxxx"

解读：
拷贝一个git仓库到本地。

---
## 二、 branch
### 示例1
> git branch -a
```shell
D:\demo>git branch -a
  master
* temp/feature/demo
  remotes/origin/HEAD -> origin/master
  remotes/origin/master
```

解读：
`-a`就是-all的意思，查看本地仓库的所有分支（包括本地自己创建的分支和远程服务器的所有分支）。`*`表示当前分支。`master`为默认创建的基础分支。

---
### 示例2
> git branch -D demo/master

解读：
删除本地仓库中名为`demo/master`的这个分支，执行这个命令之前，需要先切换到别的分支，该操作需谨慎使用。

---
## 三、 checkout
### 示例1
> git checkout -t remotes/origin/temp/feature/demo
```shell
D:\demo>git checkout -t remotes/origin/temp/feature/demo
Switched to a new branch 'temp/feature/demo'
Branch 'temp/feature/demo' set up to track remote branch 'temp/feature/demo' from 'origin'.
```

解读：
基于远程仓库的`origin`这个根节点下的`temp/feature/demo`分支，创建一个同名本地分支，即，本地创建一个名为`temp/feature/demo`的分支，关联到远程的`origin/temp/feature/demo`分支。

---
### 示例2
> git checkout origin/master

解读：
切换到本地仓库中名为`origin/master`的分支，执行这个命令前，需要先处理当前分支已有的修改，可以通过提交保存、放弃修改来处理。

---
### 示例3
> git checkout -- .

解读：
放弃当前分支所有修改。

---
## 四、 fetch
### 示例1
> git fetch origin
```shell
D:\demo>git fetch origin
Fetching origin
remote: Counting objects: 773, done
remote: Finding sources: 100% (586/586)
remote: Total 586 (delta 286), reused 516 (delta 286)
Receiving objects: 100% (586/586), 250.79 KiB | 7.17 MiB/s, done.
Resolving deltas: 100% (286/286), completed with 61 local objects.
From xxxxxxxx
   23176be..21cbecc  temp/feature/demo -> origin/temp/feature/demo
   ff3b558..cf30d71  temp/feature/demo2  -> origin/temp/feature/demo2
```

解读：
获取远程仓库下`origin`这个根节点下的所有分支信息并同步到本地仓库，当远程仓库新建了分支或更新了提交记录时，通过这个命令可以同步信息到本地。

---
### 示例2
> git fetch --all

解读：
获取远程仓库所有分支信息并同步到本地仓库。

---
## 五、 status
### 示例1
> git status 

```shell
D:\demo>git status
On branch temp/feature/demo
Your branch is up to date with 'origin/temp/feature/demo'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   src/com/zengyu/demo/Demo.java

no changes added to commit (use "git add" and/or "git commit -a")
```

解读：
查看当前git状态，包括分支状态、文件状态和操作状态。

---
## 六、 add
### 示例1
> git add src/com/zengyu/demo/Demo.java src/com/zengyu/demo/Demo2.java

解读：
将本地修改的文件添加到本地暂存区，多个文件之间用空格隔开。

---
### 示例2
> git add .

解读：
将本地修改的所有文件添加到本地暂存区。

---
## 七、 commit
### 示例1
> git commit -a

解读：
将本地暂存区所有内容提交生成一条记录，执行该命令会进入vim界面提示输入commit message，按`Insert`键进入编辑模式，如果不熟悉vim命令，请不要使用任何快捷键组合，因为可能触发vim命令导致不可预料问题，编辑完成后，先按`Esc`退出编辑模式，再输入`:wq`保存修改并退出（write and quit）

---
### 示例2
> git commit -a --amend

解读：
和示例1不同的是，该命令会把提交记录合并到上一条提交记录。用于追加修改或者解冲突后合并修改。

---
## 八、 push
### 示例1
> git push origin HEAD:refs/for/temp/feature/demo

解读：
将本地所有提交记录都推送到gerrit服务器上`origin`根节点下的`temp/feature/demo`分支。

---
## 九、 pull
### 示例1
> git pull

解读：
拉取远程仓库对应当前分支的提交记录到本地，可能和本地提交记录或当前未保存的修改冲突。

### 示例2
> git pull --rebase

解读：
在示例1的基础上执行变基操作，假设情景：本地同步到远程最新，然后本地修改并提交记录，他人有推送并合入到远程仓库，在没有冲突的情况下，当拉取远程提交记录到本地并变基时，会将本地提交记录节点移动到更新的远程记录之后。常用于同步最新代码。如果无法处理好解冲突操作，请使用后面的cherrypick方式来同步。

---
## 十、 rebase
### 示例1
> git rebase

解读：
单纯的变基操作，当你发现本地仓库git记录线性图很奇怪时，可以尝试。通常在执行`git pull`并解决冲突后执行该命令。

---
### 示例2
> git rebase -i

解读：
处理本地仓库当前分支中，所有未同步到远程分支的提交记录，执行该命令会进入vim页面，根据提示可以选择需要合并的提交。

---
## 十一、 cherrypick
### 示例1
> git fetch "xxxxxx" refs/changes/1/12345/222 && git cherry-pick FETCH_HEAD

解读：
在gerrit上提交记录中找到cherrypick的命令。该命令可以将某一条提交记录同步到本地仓库，注意处理冲突，解决完冲突时执行`git cherry-pick --continue`，解不了冲突选择放弃时执行`git cherry-pick --abort`。需要注意的是，cherrypick的提交记录中可能包含changeId，因此需要对本地的该记录处理一下提交信息，通过`git commit --amend`进入vim页面删除或修改changeId，为何需要修改changeId见简介。

---
## 十二、 stash
### 示例1
> git stash

解读：
将当前所有修改存入一个changeList，通常用于保存一些无需推送到服务器但是经常修改的内容，比如sdk配置、keystore配置的修改。执行该命令后，本地修改将重置。

---
### 示例2
> git stash apply

解读：
将changeList中的顶部修改记录还原到本地，注意冲突问题。

---
### 示例3
> git stash list

解读：
查看changeList中所有记录，可以通过在示例1基础上追加记录编号的方式指定还原的修改记录`git stash apply 1`。

---
## 十三、 reset
### 示例1
> git reset --hard

解读：
重置当前所有修改，慎用。

---
### 示例2
> git reset --hard origin/temp/feature/demo

解读：
回退当前分支所有提交记录，即同步到之前更新的远程仓库的分支节点，仅在本地提交的记录将全部丢失，慎用。如果先执行`git fetch origin`，接着执行该命令，再执行`git pull`，可将当前分支同步到远程仓库最新状态，在这之前，先处理好本地的修改（放弃or保存在gerrit）

---
### 示例3
> git reset --hard 00f0587

解读：
根据提交的hash，指定回退到那笔提交记录。查询hash见`git log`或者`git reflog`。该命令是误操作的后悔药。

---
### 示例4
> git reset --hard HEAD~3

解读：
指定回退几个提交记录。

---
## 十四、 log
### 示例1
> git log

解读：
查看本地仓库当前分支所有提交记录，如果记录太多显示不全，命令行出现`:`的时候按`q`退出。

---
### 示例2
> git log --oneline -5

解读：
在示例1的基础上，简化记录为单行显示，并限制条数。

---
## 十五、 reflog
### 示例1
> git reflog

解读：
查看本地仓库所有操作记录，其他操作同十四。

---
## 日常开发（针对不熟练的）

1. 本地修改后推送到gerrit上备份。
2. `git fetch --all && git reset --hard origin/XXXXXX && git pull`同步代码到远程仓库最新。
3. cherry-pick刚才备份的那笔提交到本地，并解冲突。追加commit message时把gerrit上备份记录的change id附在末尾，这样就将该提交和gerrit上备份那笔关联起来了，之后再推送时，就不会生成多的提交记录。

---
## 总结

- 熟能生巧，忌用GUI。
- 不耻下问，勤做笔记。
- 学无止境。
- Enjoy work


