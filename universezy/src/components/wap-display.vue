<template>
  <div>
    <div class="div_container">
      <h1 class="h2_title">{{current.title}}</h1>
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
        :codeStyle="settingsMd.codeStyle" />
    </div>
    <div class="div_backtop">
      <BackTop></BackTop>
    </div>
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
        codeStyle: 'xcode' // 配色方案
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
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped>
.div_container {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: auto;
  position: fixed;
  overflow-y: scroll;
  overflow-x: hidden;
  text-align: left;
}

.h2_title {
  color: #f8f8f9;
  margin: 30px 15px 15px 15px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.div_info {
  color: #e8eaec;
  margin: 0 15px;
  font-family:"Times New Roman",Times,serif;
  font-size: 20px;
}

.span_author {
  display: inline;
  color: #5cadff;
  margin-right: 15px;
  cursor: pointer;
}

.markdown {
  width: auto;
  min-width: 180px;
  margin-bottom: 100px;
  display: flex;
  z-index: 10;
}

.div_backtop {
  position: relative;
  z-index: 20;
}
</style>
