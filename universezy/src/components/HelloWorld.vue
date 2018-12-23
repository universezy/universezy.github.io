<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>{{ desc }}</h2>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '网站开发中',
      desc: '修改了github账号名，原github.io已无法再使用，新版采用Vue.js重新设计'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
  margin-top: 20px;
}
</style>
