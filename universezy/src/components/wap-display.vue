<template>
  <div>
    <div class="div_container">
      <div class="div_author" @click="clickAuthor">{{author}}</div>
      <div class="div_info">
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
    <div class="div_footer">
      <span>Copyright © 2020 ZengYu</span>
    </div>
    <BackTop></BackTop>
  </div>
</template>

<script>
import mBlogs from '../data/blogs'
import requestApi from '../api/requestApi'
import {imageApi, markdownApi} from '../api/urls'

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
      blogData: 'Loading...'
    }
  },
  created () {
    this.init()
  },
  computed: {
    imgSrc: function () {
      return imageApi.getCategoryUrl(this.current.category)
    }
  },
  methods: {
    init: function () {
      this.id = this.$route.params.id
      if (this.check()) {
        this.load()
      } else {
        this.blogData = 'Resource not found.'
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
            this.blogData = 'Resource not found.'
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
      this.$Message.error('Loading failed, retry later.')
      this.blogData = 'Loading failed, retry later.'
    },
    setData: function () {
      document.title = this.current.title
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
  overflow-y: hidden;
  overflow-x: hidden;
  text-align: left;
}

.div_author {
  display: inline-block;
  color: #5cadff;
  margin: 20px 15px;
  font-size: 24px;
  font-family: monospace,Georgia,serif,"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  cursor: pointer;
}

.div_info {
  color: #e8eaec;
  margin: 10px 15px;
  font-family:"Times New Roman",Times,serif;
  font-size: 20px;
}

.markdown {
  width: auto;
  min-width: 180px;
  margin-bottom: 60px;
  display: flex;
  z-index: 10;
}

.div_footer {
  color: #d7dde4;
  font-size: 16px;
  margin-bottom: 10px;
}
</style>
