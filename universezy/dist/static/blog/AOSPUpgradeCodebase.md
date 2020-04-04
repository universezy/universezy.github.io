# AOSP升级codebase疑难总结

## 一、 摘要

本文讲述笔者在升级codebase时遇到的一些疑难问题和解决思路。

---
## 二、 流程

### 2.1 准备源码

整个升级的策略为两个步骤：
- 升级后版本**源码**与升级前版本**源码**进行diff得到patch
- 将patch应用于vendor自己的节点并解冲突

因此，第一步是准备升级前后两个版本的**源码**。

---
### 2.2 配置git仓库

配置git仓库的目的，是为了利用git进行diff，之所以不使用Linux自带的diff命令，是因为下一步所述问题。

将升级前版本**源码**初始化为git仓库，可提交服务器（gerrit）

---
### 2.3 源码替换

这是最坑的一步。原先笔者将升级前代码删光，然后将升级后代码直接复制过来，心想git立马就能检测出差异，差异即升级内容，然后笔者提交至服务器，review发现，出现了大量内容完全一致的修改。

google一下后，了解到，出现该问题是因为两份代码的换行符格式不同，简单介绍一下：

换行符有两种：

- CR(Carriage Return)，即`\r`
- LF(Line Feed)，即`\n`

不同的OS上使用的换行符：
- Unix/Linux：LF，十六进制为`0x0A`
- MacOS：CR，十六进制为`0x0D`
- Dos/Windows：CRLF，十六进制为`0x0D0A`

由于换行符差异，Linux自带的`diff`命令便不好使了，而git本身也是基于`diff`封装的VCS，所以diff这条路行不通（或者说只是笔者没找到办法，不知道如何在diff时忽略换行符差异，读者可自行研究）。

笔者在Linux服务器上下载的AOSP，之后修改是在Windows，因此当使用某些IDE（比如AS，如果自己配置的不是强制LF）打开或者编辑过文件后，会被转成CRLF，这就导致最后提交时，内容看似完全一样的两份文件，其实换行符编码格式已经被偷偷改了，从而被git识别为修改过。（用Windows开发Android实属笑话，笔者也很无奈）

于是笔者心想，既然最初是LF，那么我就只在Linux服务器上操作，这样就可以避免被强转。

旧版本回退到升级前，删光所有文件，从新版本cp目录过去，git提交，一气呵成。

review代码一看，这不还是跟之前一样的吗？为什么没起作用呢？并且注意到一个提示：
```
old mode 100644
new mode 100755
```

仍然是google大法，最后在stackoverflow找到了解决方案。

---
### 2.4 修改git配置

- 忽略文件模式（权限）差异
> git config --global core.filemode false

- 禁止自动转换换行符格式
> git config --global core.autocrlf false

- 禁止提交包含混合换行符的文件
> git config --global core.safecrlf true

---
### 2.5 提交patch

然后重复前面的步骤：旧版本回退到升级前，删光所有文件，从新版本cp目录过去，git提交，review一看，搞定！

至此，得到了codebase升级的差异。

---
### 2.6 应用patch

切回vendor自己的版本节点，从gerrit上将差异cherry-pick下来，解冲突。

至此，codebase升级完成。

---
## 三、 总结思考

- 换行符格式：这个坑一言难尽，开发者还是尽量保持同一个OS环境吧
- Linux命令：对于常用的命令还是需要熟练使用
- Git命令：同上

---
## 四、 参考文献

- [Git 多平台换行符问题(LF or CRLF)](http://kuanghy.github.io/2017/03/19/git-lf-or-crlf)
- [Git 进阶 | 3分钟学会优雅处理换行符](https://www.jianshu.com/p/fa4d5963b6c8)
- [linux复制指定目录下的全部文件到另一个目录中，linux cp 文件夹](https://www.cnblogs.com/zdz8207/p/linux-cp-dir.html)
- [How do I remove files saying “old mode 100755 new mode 100644” from unstaged changes in Git?](https://stackoverflow.com/questions/1257592/how-do-i-remove-files-saying-old-mode-100755-new-mode-100644-from-unstaged-cha)
- [CR，LF，CR/LF，回车，换行](https://www.jianshu.com/p/8d33019d1c69)
