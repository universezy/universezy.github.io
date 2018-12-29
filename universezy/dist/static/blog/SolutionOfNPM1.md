## 一、 问题日志
```shell
zengyu@zengyu-Precision-T1700:~$ npm install vue
/home/zengyu
└── vue@2.5.13 

npm WARN enoent ENOENT: no such file or directory, open '/home/zengyu/package.json'
npm WARN zengyu No description
npm WARN zengyu No repository field.
npm WARN zengyu No README data
npm WARN zengyu No license field.
```

此时会发现当前目录下多了一个叫"node_modules"的文件夹，里面有一个"vue"文件夹。

---
## 二、 解决方案

1. 将"node_modules"文件夹删除，然后命令行到你安装node的文件夹下；
2. 进到 lib —— node_modules —— npm，然后再安装vue；
3. 参考我的路径是"/home/zengyu/node-v6.11.3-linux-x64/lib/node_modules/npm"；
4. 安装好后再进这个目录的"node_modules"文件夹中，就能找到"vue"文件夹了。

---
## 三、 参考文献

- [npm WARN enoent ENOENT: no such file or directory, open 'E:\Program Files\nodejs \package.json' npm](http://blog.csdn.net/ltg01/article/details/60135489)
- [npm WARN enoent ENOENT: no such file or directory, open 'h:\...'](http://www.5imoban.net/jiaocheng/nodejs/2017/1026/2994.html)
