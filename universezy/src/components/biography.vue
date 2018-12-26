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
import markdownApi from '../api/markdownApi'
import {bioApi} from '../api/urls'

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
        navigation: false, // 导航目录
        toolbars: {
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          help: true, // 帮助
          navigation: true // 导航目录
        }
      },
      bio: '内容加载中。。。',
      bioError: '请求资源失败。'
    }
  },
  created () {
    this.load()
  },
  methods: {
    load: function () {
      let temp = this.$store.state.GlobalData.bio
      if (temp !== null) {
        this.bio = temp
      } else {
        try {
          let _this = this
          markdownApi.fetch(bioApi.getUrl()).then(function (response) {
            if (response.status === 200) {
              _this.bio = response.data
              _this.$store.dispatch('saveBio', response.data)
            } else {
              console.log('response status: ' + response.status)
              _this.bio = _this.bioError
            }
          })
        } catch (error) {
          console.log('request error: ' + error)
          this.bio = this.bioError
        }
      }
    }
  }
}
</script>

<style scoped>
.div_bio{
  padding: 10px;
}
</style>
