# 使用Git Hook配置提交模板

## 一、 简介

Hook理解为程序特定动作时回调的一个接口，Git中的Hook用于在特定的重要动作发生时，触发脚本。

在开发中，为了规范化提交信息，以便追溯修改和理解修改内容，通常会采用统一的提交信息模板来约束开发人员。因此可以通过配置git，来提升便利性。

---
## 二、 关于Git Hook

进入工程的git hook目录
```shell
zengyu@MacBook-Pro universezy.github.io % cd .git/hooks
zengyu@MacBook-Pro hooks % ls -a
.                               post-update.sample              pre-rebase.sample
..                              pre-applypatch.sample           pre-receive.sample
applypatch-msg.sample           pre-commit.sample               prepare-commit-msg.sample
commit-msg.sample               pre-merge-commit.sample         update.sample
fsmonitor-watchman.sample       pre-push.sample
```

hooks目录是存放git运行时关键动作执行脚本的地方，sample是默认的示例文件，在init一个git仓库时生成，每一个sample文件对应一个git动作，我们可以参照sample写一个自己的脚本，以去掉sample后缀命名，便可以执行对应的功能。

---
## 三、 默认提交信息模板

通过配置一个提交信息的模板，避免每次提交时需要复制粘贴带来的不便。

我们定义一个如下模板：
```
[Module.SubModule.Tag][feature/bug][Id:000][Desc:example]

[分析]
[方案]
[影响范围]
[测试建议]
[适用范围]
[依赖链接]
```

满足开发过程中的主要场景：需求（feature）和修复（bug），有工程对应的模块、子模块、标签，id，描述，以及详细内容。

然后保存到hooks目录中（为了仅对当前工程生效，如果想对所有工程生效，需要保存在本地独立目录下，且git config时加上`--global`，具体可以阅读参考文献）：
```shell
zengyu@MacBook-Pro hooks % vim commit-template        
zengyu@MacBook-Pro hooks % cat commit-template 
[Module.SubModule.Tag][feature/bug][Id:000][Desc:example]

[分析]
[方案]
[影响范围]
[测试建议]
[适用范围]
[依赖链接]
```

然后在仓库根目录配置模板使其生效：
```shell
zengyu@MacBook-Pro hooks % cd ../../
zengyu@MacBook-Pro universezy.github.io % git config commit.template .git/hooks/commit-template
```

接下来修改任意内容后，提交修改：
```shell
zengyu@MacBook-Pro universezy.github.io % git status
On branch master
Your branch is up to date with 'origin/master'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   universezy/README.md

zengyu@MacBook-Pro universezy.github.io % git commit -a
```

会显示配置的模板信息：
![](static/blog/image/CT_template_msg.png)

---
## 四、 提交信息校验

提供模板之后，开发人员可能修改提交信息后不满足规范，因此还需要使用脚本强制约束。

刚才在hooks目录下看到的`commit-msg.sample`文件便是该约束脚本的示例：
```shell
zengyu@MacBook-Pro universezy.github.io % cat .git/hooks/commit-msg.sample 
#!/bin/sh
#
# An example hook script to check the commit log message.
# Called by "git commit" with one argument, the name of the file
# that has the commit message.  The hook should exit with non-zero
# status after issuing an appropriate message if it wants to stop the
# commit.  The hook is allowed to edit the commit message file.
#
# To enable this hook, rename this file to "commit-msg".

# Uncomment the below to add a Signed-off-by line to the message.
# Doing this in a hook is a bad idea in general, but the prepare-commit-msg
# hook is more suited to it.
#
# SOB=$(git var GIT_AUTHOR_IDENT | sed -n 's/^\(.*>\).*$/Signed-off-by: \1/p')
# grep -qs "^$SOB" "$1" || echo "$SOB" >> "$1"

# This example catches duplicate Signed-off-by lines.

test "" = "$(grep '^Signed-off-by: ' "$1" |
         sort | uniq -c | sed -e '/^[   ]*1[    ]/d')" || {
        echo >&2 Duplicate Signed-off-by lines.
        exit 1
}
```

修改默认脚本，使其要求必须符合我们定义的模板格式：
```shell
zengyu@MacBook-Pro universezy.github.io % cd .git/hooks 
zengyu@MacBook-Pro hooks % cp commit-msg.sample commit-msg        
zengyu@MacBook-Pro hooks % vim commit-msg
```

输入脚本：
```shell
MSG=$(awk '{printf("%s",$0)}' "$1")
REGEX="^\[(.+\.)+.+](\[.+])(\[Id:.+])(\[.+]).*([\s\S]*)\[分析].*([\s\S]*)\[方案].*([\s\S]*)\[影响范围].*([\s\S]*)\[测试建议].*([\s\S]*)\[适用范围].*([\s\S]*)\[依赖链接].*([\s\S]*)"
if [[ ! $MSG =~ $REGEX ]]; then
    echo "Commit msg does not comply with the specification!"
    exit 1
fi

exit 0
```

下面进行讲解：
```shell
MSG=$(awk '{printf("%s",$0)}' "$1")
```

- `“$1”`是调用该脚本的入参，也就是提交信息
- `awk`是一种文本处理语言，将文本逐行执行指令
- `$0`是域标记，$后面的数字表示该行第n个值，0表示全部
- 整行命令表示调用awk命令将提交信息全部以文本形式赋值给`MSG`，需要注意的是，shell下全局变量赋值时等号左右不能有空格

```shell
REGEX="^\[(.+\.)+.+](\[.+])(\[Id:.+])(\[.+]).*([\s\S]*)\[分析].*([\s\S]*)\[方案].*([\s\S]*)\[影响范围].*([\s\S]*)\[测试建议].*([\s\S]*)\[适用范围].*([\s\S]*)\[依赖链接].*([\s\S]*)"
```

这里采用了正则表达式的形式进行校验，关于正则表达式可以参考[《正则表达式 - 语法》](https://www.runoob.com/regexp/regexp-syntax.html)学习，此处不进行详解。

按照定义的提交模板，要求提交信息遵循以下格式：
- [Module.SubModule.Tag]：功能域
- [feature/bug]：修改类型
- [Id:000]：对应的id
- [Desc:example]：简单描述
- 以及其他几项提交信息

```shell
if [[ ! $MSG =~ $REGEX ]]; then
    echo "Commit msg does not comply with the specification!"
    exit 1
fi

exit 0
```

- `if-fi`是条件语句的首尾关键字，满足条件用`then`关键字执行
- `[[ ]]`搭配条件语句使用，中间是判断条件
- `=~`为正则表达式匹配
- 由于需要引用全局变量，使用`$`引用定义的变量
- `echo`是输出命令，用来打印信息
- `exit`返回0表示正常结束，1表示异常结束
- 这部分命令表示如果正则表达式不匹配，则输出提示并错误返回，否则正常返回

接下来尝试提交一个不符合规范的信息：
![](static/blog/image/CT_commit_msg_error.png)

会执行失败，并输出提示信息：

```shell
zengyu@MacBook-Pro universezy.github.io % git commit -a
Commit msg does not comply with the specification!
```

然后提交一个符合规范的信息：
![](static/blog/image/CT_commit_msg_correct.png)

执行成功：
```shell
zengyu@MacBook-Pro universezy.github.io % git commit -a            
[master 9550586] [Module.SubModule.Demo][bug][Id:0001][Correct demo of commit msg]
 1 file changed, 1 insertion(+)
```

博主的正则表达式部分还有待改进的地方，感兴趣的读者可以留言。

---
## 五、 参考文献

- [自定义Git-Git钩子](https://www.git-scm.com/book/zh/v2/自定义-Git-Git-钩子)
- [运用Git Hook 校验提交信息](https://zhuanlan.zhihu.com/p/37853023)
- [git hook 提交记录 格式控制](https://www.jianshu.com/p/4af24d0eb81a)
- [正则表达式中，[\s\S]* 什么意思。。。。“[ ]”不是范围描述符吗？](https://www.cnblogs.com/devcjq/articles/5875963.html)
- [awk命令详解](https://www.cnblogs.com/serendipity/archive/2011/08/01/2124118.html)
- [shell 中　exit0 exit1 的区别](https://blog.csdn.net/super_gnu/article/details/77099395)
- [【shell】shell中各种括号的作用()、(())、[]、[[]]、{}](https://www.cnblogs.com/qlqwjy/p/8684630.html)