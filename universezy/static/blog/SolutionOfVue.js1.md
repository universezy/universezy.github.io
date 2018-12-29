## 一、 问题日志
```shell
  ✘  https://google.com/#q=vue%2Frequire-v-for-key  Elements in iteration expect to have 'v-bind:key' directives  
  src/components/home.vue:36:13
              <li v-for="year in objective">
               ^

```

---
## 二、 问题原因
在vue新版本中，v-for迭代语法有变动，需要加入key值。

---
## 三、 解决方案
```html
v-for="year in objective"
```
后面加上key值定义，注意有个空格
```html
v-for="year in objective" :key="year.num"
```

---
## 四、 参考文献
- [require v-bind:key with v-for directives (vue/require-v-for-key)](https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/require-v-for-key.md)
- ['v-for' directives require 'v-bind:key' directives.](https://github.com/vuejs/vetur/issues/261)
