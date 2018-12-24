<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

html {
  height: 100%;
  min-width: 800px;
  min-height: 800px;
  padding: 0;
  margin: 0;
}

body {
  width: 100%;
  height: 100%;
  min-width: 800px;
  min-height: 800px;
  padding: 0 20px 0 20px;
  margin: 0;
  background: #f8f8f9;
}
</style>
