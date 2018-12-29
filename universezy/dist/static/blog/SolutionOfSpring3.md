## 一、 问题日志

前端请求服务器，返回以下错误信息：

```
已拦截跨源请求：同源策略禁止读取位于 http://localhost:8080/xxxxx/demo/login 的远程资源。（原因：CORS 头缺少 'Access-Control-Allow-Origin'）。
```

---
## 二、 问题原因

设计这个机制是为了提高安全性。

---
## 三、 解决方案

### 方法一：

后端返回的响应头中加入参数：
```java
@RequestMapping(value = "/login", method = RequestMethod.POST)
@ResponseBody
public String signIn(@RequestParam String user, @RequestParam String password, HttpServletResponse response) {
	response.setHeader("Access-Control-Allow-Origin", "*");
	return accountService.signIn(user, password);
}
```

表示允许网站接收服务器返回的资源。

### 方法二：

使用"@CrossOrigin"注解，加在controller则对该controller下所有方法有效，加在具体方法则仅对该方法有效：
```java
@Controller
@RequestMapping(value = "/Account", produces = { "text/html;charset=UTF-8;", "application/json;charset=UTF-8;" })
@CrossOrigin(origins = "*", maxAge = 3600)
public class AccountController {
}
```

---
## 四、 参考文献

- [HTTP访问控制（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)

- [java spring后台如何解决跨域请求 No 'Access-Control-Allow-Origin' header is](http://www.jsjtt.com/java/JavaWebkaifa/130.html)

- [Access control allow origin 简单请求和复杂请求](https://blog.csdn.net/wangjun5159/article/details/49096445)

- [从零开始学 Java - Spring MVC 实现跨域资源 CORS 请求](https://www.cnblogs.com/mafly/p/cors.html)