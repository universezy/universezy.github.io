## 一、 问题日志
```shell
zengyu@zengyu-Precision-T1700:~$ cnpm -v
未找到 'cnpm' 命令，您要输入的是否是：
 命令 'npm' 来自于包 'npm' (universe)
 命令 'cxpm' 来自于包 'xpmutils' (universe)
 命令 'cpm' 来自于包 'cpm' (universe)
cnpm：未找到命令
```

---
## 二、 问题原因
未建立软链接。

---
## 三、 解决方案
将"node目录 - bin - cnpm" 链接到 "/usr/local/bin/"，参考我的：
```shell
zengyu@zengyu-Precision-T1700:~$ sudo ln -s /home/zengyu/node-v6.11.3-linux-x64/bin/cnpm /usr/local/bin/
```

然后"cnpm -v"查看版本，如果显示这样就说明成功了：
```shell
zengyu@zengyu-Precision-T1700:~$ cnpm -v
cnpm@5.2.0 (/home/zengyu/node-v6.11.3-linux-x64/lib/node_modules/cnpm/lib/parse_argv.js)
npm@5.6.0 (/home/zengyu/node-v6.11.3-linux-x64/lib/node_modules/cnpm/node_modules/npm/lib/npm.js)
node@6.11.3 (/home/zengyu/node-v6.11.3-linux-x64/bin/node)
npminstall@3.3.0 (/home/zengyu/node-v6.11.3-linux-x64/lib/node_modules/cnpm/node_modules/npminstall/lib/index.js)
prefix=/home/zengyu/node-v6.11.3-linux-x64 
linux x64 4.4.0-116-generic 
registry=https://registry.npm.taobao.org
```

---
## 四、 参考文献
- [ linux下安装node环境以及cnpm ](https://blog.csdn.net/a1104258464/article/details/52273774)
