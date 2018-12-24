<template>
  <div id="app">
    <router-view/>
    <comBackground></comBackground>
  </div>
</template>

<script>
import comBackground from './components/component-background.vue'

export default {
  name: 'App',
  components: {
    comBackground
  }
}
</script>

<style>
#app {
  margin: 0 100px;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
