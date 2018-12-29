## 一、 问题日志

```shell
  ✘  https://google.com/#q=vue%2Fno-parsing-error  Parsing error: x-invalid-end-tag
  src\components\register.vue:45:11
            </Input>
             ^
```

---
## 二、 问题原因
iView将标签渲染为原生html标签时，由于这些标签是自闭合的，所以有end标签会报错。

---
## 三、 解决方案
修改配置文件，忽略该项检查：
> 根目录下 - .eslintrc.js - rules

添加一行：
> "vue/no-parsing-error": [2, { "x-invalid-end-tag": false }]

重启dev：
> npm run dev

---
## 四、 参考文献

- [[Bug Report]Col components are wrong in eslint-plugin-vue](https://github.com/iview/iview/issues/2828)
