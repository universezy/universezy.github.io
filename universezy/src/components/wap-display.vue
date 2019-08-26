<template>
  <div class="div_top">
    <h2 class="h2_title">{{current.title}}</h2>
    <div class="div_info">
      <span class="span_author" @click="clickAuthor">{{author}}</span>
      <Time :time="current.timestamp" type="date" />
    </div>
    <Divider dashed />
    <mavon-editor
      class="markdown"
      v-model="blogData"
      :subfield="settingsMd.subfield"
      :defaultOpen="settingsMd.defaultOpen"
      :toolbarsFlag="settingsMd.toolbarsFlag"
      :navigation="settingsMd.navigation"
      :toolbars="settingsMd.toolbars" />
  </div>
</template>

<script>
import mBlogs from '../data/blogs'
import requestApi from '../api/requestApi'
import {markdownApi} from '../api/urls'

export default {
  name: 'wap-display',
  data () {
    return {
      settingsMd: {
        subfield: false, // 单双栏模式
        defaultOpen: 'preview', // 默认展示
        toolbarsFlag: false, // 工具栏是否显示
        navigation: false, // 导航目录
        toolbars: {
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          help: true, // 帮助
          navigation: true // 导航目录
        }
      },
      id: 0,
      author: null,
      current: null,
      blogData: '请求资源中......'
    }
  },
  created () {
    this.init()
  },
  methods: {
    init: function () {
      this.id = this.$route.params.id
      if (this.check()) {
        this.load()
      } else {
        this.blogData = '请求资源失败。'
      }
    },
    check: function () {
      if (mBlogs.blogs !== null && mBlogs.blogs.length > 0) {
        var index = mBlogs.blogs.findIndex(element => {
          return element.id === this.id
        })
        if (index >= 0) {
          this.current = mBlogs.blogs[index]
          return true
        }
      }
      return false
    },
    load: function () {
      let _this = this
      requestApi.fetch(markdownApi.getBlogUrl(this.id))
        .then(response => {
          if (response.status === 200) {
            _this.blogData = response.data
            _this.setData()
          } else if (response.status === 404) {
            this.blogData = '请求资源失败。'
          } else {
            _this.requestFailed()
          }
        })
        .catch(error => {
          console.log(error)
          _this.requestFailed()
        })
    },
    requestFailed: function (msg) {
      this.$Message.error('请求服务器失败，请稍后再试。')
      this.blogData = '请求服务器失败，请稍后再试。'
    },
    setData: function () {
      document.title = this.current.title + ' - ' + this.$store.state.GlobalData.title
      this.author = this.$store.state.GlobalData.title
    },
    clickAuthor: function () {
      // TODO
    }
  }
}
</script>

<style scoped>
.div_top {
  float: left;
  text-align: left;
}

.h2_title {
  color: #f8f8f9;
  margin-top: 30px;
  margin-bottom: 15px;
}

.div_info {
  display: inline-block;
  color: #e8eaec;
}

.span_author {
  color: #5cadff;
  margin-right: 15px;
  cursor: pointer;
}

.markdown {
  z-index: 10;
}
</style>
