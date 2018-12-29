# 关于jar打包时的几个问题的汇总

## 1. 读文件 ##
由于jar包是作为一个文件存在的，不是文件夹，那么用常规的路径是找不到内部文件的，通常可以这样来获取资源：

```java
InputStream inputStream = this.getClass().getResourceAsStream(PATH);
```
得到文件的输入流；
或者是：

```java
URL url = this.getClass().getResource(PATH);
```
得到文件的url。

---
## 2. 中文乱码 ##
需要对原始编码进行转码，将二进制流放到InputStreamReader里面：

```java
InputStreamReader inputStreamReader = new InputStreamReader(inputStream, "UTF-8");
```

---
## 3. 找不到文件 ##
- 没搞清楚目录结构，将路径写错；
- 相对路径还是绝对路径；
- 前面该不该加斜杠/；
- 资源文件是在src下还是src同级目录里。

---
## 4. 资源文件位置 ##
- 如果资源文件在jar内部，那么只能采用<1>里面的方法去读文件而不能写文件。因为jar现在是作为一个文件存在的。
- 如果资源文件在jar外部，那么按照常规方法读写文件。

---
*以上如有错误，欢迎指正。*
