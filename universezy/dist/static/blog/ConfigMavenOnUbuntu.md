## 前言

本文以Ubuntu16.04LTS为例，介绍Maven的下载配置过程。

## 一、 下载

### 1. 从[官网](http://maven.apache.org/download.cgi)下载二进制文件

我下载的是tar.gz格式："apache-maven-3.5.3-bin.tar.gz"。

** **
### 2. 将压缩包放到系统目录下

例如："/usr/local/lib/apache-maven-3.5.3-bin.tar.gz"：
```shell
sudo mv apache-maven-3.5.3-bin.tar.gz /usr/local/lib/
```

** **
### 3. 解压

```shell
tar zxvf apache-maven-3.5.3-bin.tar.gz
```

---
## 二、 配置

### 1. 打开配置文件

```shell
sudo vim /etc/profile
```

** **
### 2. 添加环境变量

```shell
export M2_HOME=/usr/local/lib/apache-maven-3.5.3
export PATH=$M2_HOME/bin
```
已有PATH的情况下直接在末尾追加，注意使用英文冒号":"分隔，不是分号";"，路径写自己解压后的路径。

** **
### 3. 生效

```shell
source /etc/profile
```
---
## 三、 检验

```shell
echo $M2_HOME

echo $PATH

mvn -v
```
输出两个环境变量值和Maven版本信息，均正确则表示已经配置完成。
