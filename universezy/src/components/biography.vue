<template>
  <comBase :active="active">
    <div class="div_bio">
      <mavon-editor v-model="bio"
      :subfield="settings.subfield"
      :defaultOpen="settings.defaultOpen"
      :toolbarsFlag="settings.toolbarsFlag"
      :navigation="settings.navigation"
      :toolbars="settings.toolbars"/>
    </div>
  </comBase>
</template>

<script>
import comBase from './component-base.vue'
import markdownApi from '../request/markdownApi'
import {bioUrl} from '../request/urls'

export default {
  name: 'biography',
  components: {
    comBase
  },
  data () {
    return {
      active: 'biography',
      settings: {
        subfield: false, // 单双栏模式
        defaultOpen: 'preview', // 默认展示
        toolbarsFlag: true, // 工具栏是否显示
        navigation: true, // 导航目录
        toolbars: {
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          help: true, // 帮助
          navigation: true // 导航目录
        }
      },
      bio: 'Hello world!'
    }
  },
  created () {
    this.load()
  },
  methods: {
    load: function () {
      let _this = this
      try {
        markdownApi.request(bioUrl.getUrl()).then(function (response) {
          console.log('status=' + response.status)
          if (response.status === 200) {
            _this.bio = response.data
          }
        })
      } catch (error) {
        console.log('error=' + error)
      }
    }
  }
}
</script>

<style scoped>
.div_bio{
  padding: 20px;
}
</style>
