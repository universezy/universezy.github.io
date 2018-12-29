## 前言

本文环境为Ubuntu16.04LTS，Tomcat版本为9.0。在此之前，请确保你已经安装并且配置好了Java环境，如果没有，可以参考[Ubuntu设置系统环境变量](https://blog.csdn.net/zy13608089849/article/details/79099018)。

---
## 一、 下载

### 1. 从[官网](https://tomcat.apache.org/download-90.cgi)下载最新版本

我下载的是"apache-tomcat-9.0.6.tar.gz"。

---
### 2. 移动到系统文件夹中

例如"/usr/local/lib/apache-tomcat-9.0.6.tar.gz"：
```shell
sudo mv apache-tomcat-9.0.6.tar.gz /usr/local/lib/
```

---
### 3. 解压

```shell
sudo tar zxvf apache-tomcat-9.0.6.tar.gz
```

---
## 二、 配置

### 1. 打开配置文件

```shell
sudo vim /etc/profile
```

---
### 2. 添加环境变量

```shell
export CATALINA_HOME=/usr/local/lib/apache-tomcat-9.0.6
```

---
### 3. 生效

```shell
source /etc/profile
```

---
### 4. 设置Tomcat配置信息

进入tomcat文件夹下的bin文件夹中，编辑startup.sh文件：
```shell
sudo vim startup.sh
```
在上面一大堆的注释说明后面添加配置信息：
```shell
#Java
export JAVA_HOME=/usr/local/lib/jdk1.8.0_152
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH

#Tomcat
export TOMCAT_HOME=/usr/local/lib/apache-tomcat-9.0.6
```
JAVA_HOME和TOMCAT_HOME的路径替换为自己的安装路径。

---
## 三、 运行

### 1. 启动

```shell
./startup.sh
```
打开浏览器，url输入"http://localhost:8080/"，如果显示Tomcat页面则正确。

---
### 2. 关闭

```shell
./shuntdown.sh
```

---
## 四、 参考文献

- [Ubuntu16.04 Tomcat9的安装](https://blog.csdn.net/efregrh/article/details/52903673)
