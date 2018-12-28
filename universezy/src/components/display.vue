<template>
  <comBase active="blog">
    <div v-if="showBlog" class="div_display">
      <Affix :offset-top="0">
        <div class="div_affix">
          <Card>
            <div class="div_title" slot="title">
              <img class="img_category" :src="imgSrc" />
              <span><b>{{blog.title}}</b></span>
            </div>
            <Row class="row_microblog">
              <Tag color="primary" v-for="item in blog.tags" :key="item.tag">
                <span>{{item.tag}}</span>
              </Tag>
            </Row>
            <Divider />
            <Row>
              <div class="div_buttons">
                <Button type="primary">
                  评论
                </Button>
                <ButtonGroup shape="circle">
                  <Button type="primary">
                    <Icon type="ios-arrow-back"></Icon>
                    上一篇
                  </Button>
                  <Button type="primary">
                    下一篇
                    <Icon type="ios-arrow-forward"></Icon>
                  </Button>
                </ButtonGroup>
              </div>
            </Row>
            <Row class="row_time">
              <Time :time="blog.timestamp" type="date" />
            </Row>
          </Card>
        </div>
      </Affix>
      <mavon-editor
        v-model="blogData"
        :subfield="settings.subfield"
        :defaultOpen="settings.defaultOpen"
        :toolbarsFlag="settings.toolbarsFlag"
        :navigation="settings.navigation"
        :toolbars="settings.toolbars"/>
    </div>
    <div v-else class="div_no_data">
      <span>没有这个资源</span>
    </div>
  </comBase>
</template>

<script>
import comBase from './component-base.vue'
import mBlogs from '../data/blogs'
import requestApi from '../api/requestApi'
import {markdownApi} from '../api/urls'

export default {
  name: 'display',
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
      showBlog: true,
      id: this.$route.query.id,
      prevBlog: null,
      nextBlog: null,
      blog: null,
      blogData: '请求资源中......'
    }
  },
  computed: {
    imgSrc: function () {
      return './static/category/' + this.blog.category + '.png'
    }
  },
  created () {
    if (this.check()) {
      this.load()
    } else {
      this.showBlog = false
    }
  },
  methods: {
    check: function () {
      if (mBlogs.blogs !== null && mBlogs.blogs.length > 0) {
        this.originBlogs = mBlogs.blogs
        for (var i = mBlogs.blogs.length - 1; i >= 0; i--) {
          if (mBlogs.blogs[i].id === this.id) {
            this.blog = mBlogs.blogs[i]
            if (i - 1 >= 0) {
              this.prevBlog = mBlogs.blogs[i - 1]
            }
            if (i + 1 <= mBlogs.blogs.length - 1) {
              this.nextBlog = mBlogs.blogs[i + 1]
            }
            return true
          }
        }
      }
      return false
    },
    load: function () {
      try {
        let _this = this
        requestApi.fetch(markdownApi.getBlogUrl(this.id)).then(function (response) {
          if (response.status === 200) {
            _this.blogData = response.data
            _this.setData()
          } else {
            _this.requestFailed()
            console.log('response status: ' + response.status)
          }
        })
      } catch (error) {
        this.requestFailed()
        console.log('request error: ' + error)
      }
    },
    requestFailed: function () {
      this.$Message.error('请求服务器失败，请稍后再试。')
    },
    setData: function () {
      document.title += ' - ' + this.blog.title
    }
  }
}
</script>

<style scoped>
.div_display {
  padding: 10px;
}

.div_title {
  height: auto;
  display: flex;
  display: -webkit-flex;
  align-items: center;
}

.img_category {
  width: 35px;
  height: 35px;
  margin-right: 15px;
}

.row_microblog{
  text-align: left;
}

.row_time{
  text-align: right;
}
</style>
