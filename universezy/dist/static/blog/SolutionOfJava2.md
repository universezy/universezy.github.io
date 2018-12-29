## 一、 问题日志

```shell
信息: Error parsing HTTP request header
 Note: further occurrences of HTTP request parsing errors will be logged at DEBUG level.
java.lang.IllegalArgumentException: Invalid character found in the request target. The valid characters are defined in RFC 7230 and RFC 3986
```

---
## 二、 问题原因

HTTP请求中含有服务器不允许的字符，例如json的引号，一些括号等。

高版本的Tomcat对请求的字符有了一些限制，网上很多教程教你改Tomcat配置中的过滤规则，但是这种方法治标不治本，换个环境重新部署又需要去改过滤规则，升级Tomcat版本也需要改规则，很麻烦。从源头上处理该问题，既然字符有问题，那就改一下字符，因此需要修改前端的请求。

---
## 三、 解决方案

笔者采用的方法是对前端的请求头加入参数：
```
Content-Type:application/x-www-form-urlencoded
```
以Vue.js的axios为例：
```javascript
return axios({
    method: 'post',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    url: 'xxxxx',
    data: data,
    withCredentials: true
})
```

这样设置后，请求就会先进行编码再传输。