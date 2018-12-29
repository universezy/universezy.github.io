在web.xml文件中加入以下配置：
```xml
<!-- spring-filter -->
<filter>  
  <filter-name>httpPutFormContentFilter</filter-name>  
  <filter-class>org.springframework.web.filter.HttpPutFormContentFilter</filter-class>  
</filter>  
  
<filter-mapping>  
  <filter-name>httpPutFormContentFilter</filter-name>  
  <url-pattern>/*</url-pattern>  
</filter-mapping>  
```

这是SpringMVC针对该问题专门提供的解决方案。