<template>
  <comBase active="biography">
    <div class="div_biography">
      <mavon-editor
        v-model="bio"
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
import requestApi from '../api/requestApi'
import {markdownApi} from '../api/urls'

export default {
  name: 'biography',
  components: {
    comBase
  },
  data () {
    return {
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
      bio: '请求资源中......'
    }
  },
  created () {
    this.load()
  },
  methods: {
    load: function () {
      if (this.$store.state.GlobalData.bio !== null) {
        this.bio = this.$store.state.GlobalData.bio
      } else {
        try {
          let _this = this
          requestApi.fetch(markdownApi.getBioUrl()).then((response) => {
            if (response.status === 200) {
              _this.bio = response.data
              _this.$store.dispatch('saveBio', response.data)
            } else {
              _this.requestFailed()
              console.log('response status: ' + response.status)
            }
          })
        } catch (error) {
          this.requestFailed()
          console.log('request error: ' + error)
        }
      }
    },
    requestFailed: function () {
      this.$Message.error('请求服务器失败，请稍后再试。')
    }
  }
}
</script>

<style scoped>
.div_biography {
  padding: 10px;
}
</style>
