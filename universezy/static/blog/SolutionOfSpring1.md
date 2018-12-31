## 一、 问题描述

SpringMVC搭建的服务器，前端请求时返回的中文乱码。

---
## 二、 问题原因

有以下三种可能的原因：

### 1. 数据库编码设置

检查数据库的编码是否为UTF8，如果不是，以MySQL为例，设置编码格式，参考：《[MySQL修改表中字段编码格式](https://universezy.github.io/universezy/dist/index.html#/blog/display/ModifyCharsetOnMySQL)》

---
### 2. JDBC编码设置

以MySQL为例，在url后面附加编码参数：
```xml
jdbc:mysql://localhost:3306/zengyu?useUnicode=true&amp;characterEncoding=UTF-8
```

---
### 3. 响应头设置

以Postman为例，检查返回的响应头：
```
content-length →98
content-type →text/plain;charset=ISO-8859-1
date →Sun, 08 Apr 2018 11:22:52 GMT
```
确认编码不是UTF8。

在后端处理请求的Controller类的"@RequestMapping"注解中加入编码设置，例如：
```java
@Controller
@RequestMapping(value = "/Account", produces = { "text/html;charset=UTF-8;", "application/json;charset=UTF-8;" })
public class AccountController {
	@RequestMapping(value = "/signIn", method = RequestMethod.POST)
	@ResponseBody
	public String signIn(@RequestParam String id, @RequestParam String password) {
		return "Get " + id + "from server";
	}
}
```

---
## 三、 参考文献

- [彻底解决Spring MVC 中文乱码 问题 ](https://blog.csdn.net/kalision/article/details/46441081/)
- [SpringMvc 遇到的坑,返回中文乱码以及Ajax跨域](https://blog.csdn.net/u010979495/article/details/50610856)