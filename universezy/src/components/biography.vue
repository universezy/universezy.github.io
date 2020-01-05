<template>
  <comBase active="biography">
    <div class="div_biography">
      <mavon-editor
        class="markdown"
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
        toolbarsFlag: false, // 工具栏是否显示
        navigation: false // 导航目录
      },
      bio: 'Loading...'
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
        let _this = this
        requestApi.fetch(markdownApi.getBioUrl())
          .then((response) => {
            if (response.status === 200) {
              _this.bio = response.data
              _this.$store.dispatch('saveBio', response.data)
            } else {
              _this.requestFailed()
              console.log('response status: ' + response.status)
            }
          })
          .catch(error => {
            console.log(error)
            _this.requestFailed()
          })
      }
    },
    requestFailed: function () {
      this.$Message.error('Loading failed, retry later.')
      this.bio = 'Loading failed, retry later.'
    }
  }
}
</script>

<style scoped>
.div_biography {
  padding: 0px;
}

.markdown {
  z-index: 10;
}
</style>
