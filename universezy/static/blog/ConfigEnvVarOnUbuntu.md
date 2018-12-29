以设置java环境变量为例：

## 1. 打开配置文件

> sudo gedit /etc/profile

---
## 2. 输入环境变量

```shell
export JAVA_HOME=/usr/local/lib/jdk1.8.0_152
export JRE_HOME=$JAVA_HOME/jre
export PATH=$JAVA_HOME/bin:$JAVA_HOME/jre/bin:$PATH
export CLASSPATH=$CLASSPATH:.:$JAVA_HOME/lib:$JAVA_HOME/jre/lib
```

需要注意的是，用冒号“:”而不是分号“;”来分隔变量。

## 3. 配置生效

> source /etc/profile
