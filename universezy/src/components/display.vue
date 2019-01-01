<template>
  <comBase active="blog">
    <div v-if="showBlog" class="div_display">
      <Card>
        <div class="div_info" slot="title">
          <img class="img_category" :src="imgSrc" @click="clickCategory"/>
          <div class="div_title"><b>{{current.title}}</b></div>
        </div>
        <Button type="warning" shape="circle" large icon="md-menu" slot="extra" @click="clickMore"></Button>
        <Row class="row_microblog">
          <Tag color="primary" v-for="item in current.tags" :key="item.tag">
            <span>{{item.tag}}</span>
          </Tag>
        <div class="div_time">
          <Time :time="current.timestamp" type="date" />
        </div>
        </Row>
      </Card>
      <Divider />
      <mavon-editor
        class="markdown"
        v-model="blogData"
        :subfield="settingsMd.subfield"
        :defaultOpen="settingsMd.defaultOpen"
        :toolbarsFlag="settingsMd.toolbarsFlag"
        :navigation="settingsMd.navigation"
        :toolbars="settingsMd.toolbars"/>
    </div>
    <div v-else class="div_no_data">
      <Alert type="error" show-icon>请求的资源不存在</Alert>
    </div>
    <Drawer width="320" :closable="false" v-model="showDrawer">
      <div class="div_drawer">
        <Divider style="font-weight: bold;">分享</Divider>
        <Row>
          <div class="div_share">
            <Tooltip placement="bottom">
              <div class="div_qrcode" slot="content">
                <div id="qrcode"></div>
                <span class="span_qrcode">微信扫一扫</span>
              </div>
              <img class="img_share" src="../assets/wechat.svg"/>
            </Tooltip>
          </div>
          <div class="div_share">
            <img class="img_share" src="../assets/qq.svg" @click="shareToQQ"/>
          </div>
          <div class="div_share">
            <img class="img_share" src="../assets/qzone.svg" @click="shareToQZone"/>
          </div>
          <div class="div_share">
            <img class="img_share" src="../assets/weibo.svg" @click="shareToWeibo"/>
          </div>
        </Row>
        <Divider class="divider_drawer">更多</Divider>
        <ButtonGroup size="large">
          <Poptip trigger="hover" word-wrap width="200" placement="bottom">
            <div class="div_poptip" slot="content">{{settingsDr.prevTitle}}</div>
            <Button type="primary" :disabled="settingsDr.prevDisabled" @click="shiftBlog(-1)">
              <Icon type="ios-arrow-back"></Icon>
              上一篇
            </Button>
          </Poptip>
          <Poptip trigger="hover" word-wrap width="200" placement="bottom">
            <div class="div_poptip" slot="content">{{settingsDr.nextTitle}}</div>
            <Button type="primary" :disabled="settingsDr.nextDisabled" @click="shiftBlog(1)">
              下一篇
              <Icon type="ios-arrow-forward"></Icon>
            </Button>
          </Poptip>
        </ButtonGroup>
        <Divider class="divider_drawer">跳转</Divider>
        <ButtonGroup size="large">
          <Button type="primary" ghost to="/blog/tab/overview">总览</Button>
          <Button type="primary" ghost to="/blog/tab/category">类别</Button>
          <Button type="primary" ghost to="/blog/tab/column">专栏</Button>
        </ButtonGroup>
        <Divider class="divider_drawer">评论</Divider>
        <span>开发中，敬请期待！</span>
      </div>
    </Drawer>
  </comBase>
</template>

<script>
import comBase from './component-base.vue'
import mBlogs from '../data/blogs'
import requestApi from '../api/requestApi'
import {markdownApi, imageApi, blogApi, shareApi} from '../api/urls'
import {globalRouters} from '../api/routers'
import QRCode from 'qrcodejs2'

var qrcode = null

export default {
  name: 'display',
  components: {
    comBase
  },
  data () {
    return {
      settingsMd: {
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
      settingsDr: {
        prevTitle: '已经是第一篇',
        prevTitleDefault: '已经是第一篇',
        prevDisabled: true,
        nextTitle: '已经是最后一篇',
        nextTitleDefault: '已经是最后一篇',
        nextDisabled: true
      },
      showDrawer: false,
      showBlog: true,
      id: this.$route.params.id,
      prev: null,
      next: null,
      current: null,
      blogData: '请求资源中......'
    }
  },
  computed: {
    imgSrc: function () {
      return imageApi.getCategoryUrl(this.current.category)
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.createQrcode()
  },
  destroyed () {
    qrcode = null
  },
  methods: {
    init: function () {
      if (this.check()) {
        this.load()
      } else {
        this.showBlog = false
      }
    },
    check: function () {
      if (mBlogs.blogs !== null && mBlogs.blogs.length > 0) {
        for (var i = mBlogs.blogs.length - 1; i >= 0; i--) {
          if (mBlogs.blogs[i].id === this.id) {
            this.current = mBlogs.blogs[i]
            if (i - 1 >= 0) {
              this.prev = mBlogs.blogs[i - 1]
            } else {
              this.prev = null
            }
            if (i + 1 <= mBlogs.blogs.length - 1) {
              this.next = mBlogs.blogs[i + 1]
            } else {
              this.next = null
            }
            return true
          }
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
            this.showBlog = false
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
      if (this.prev === null) {
        this.settingsDr.prevDisabled = true
        this.settingsDr.prevTitle = this.settingsDr.prevTitleDefault
      } else {
        this.settingsDr.prevDisabled = false
        this.settingsDr.prevTitle = this.prev.title
      }
      if (this.next === null) {
        this.settingsDr.nextDisabled = true
        this.settingsDr.nextTitle = this.settingsDr.nextTitleDefault
      } else {
        this.settingsDr.nextDisabled = false
        this.settingsDr.nextTitle = this.next.title
      }
      if (qrcode === null) {
        this.createQrcode()
      } else {
        qrcode.clear()
        qrcode.makeCode(this.getValidUrl())
      }
    },
    clickCategory: function () {
      this.$router.push(globalRouters.getCategoryRouter(this.current.category))
    },
    clickMore: function () {
      this.showDrawer = !this.showDrawer
    },
    getValidUrl: function () {
      var id = this.current === null ? null : this.current.id
      return blogApi.getPageUrl(id)
    },
    createQrcode: function () {
      qrcode = new QRCode('qrcode', {
        text: this.getValidUrl(),
        width: 100,
        height: 100,
        colorDark: '#17233d',
        colorLight: '#f8f8f9',
        correctLevel: QRCode.CorrectLevel.H
      })
    },
    shareToQQ: function () {
      let shareUrl = shareApi.getQQUrl(this.current)
      window.open(shareUrl)
    },
    shareToQZone: function () {
      let shareUrl = shareApi.getQZoneUrl(this.current)
      window.open(shareUrl)
    },
    shareToWeibo: function () {
      let shareUrl = shareApi.getWeiboUrl(this.current)
      window.open(shareUrl)
    },
    shiftBlog: function (value) {
      var id = 0
      if (value === 1) {
        id = this.next.id
      } else if (value === -1) {
        id = this.prev.id
      }
      this.$router.push(globalRouters.getDisplayRouter(id))
      this.id = id
      this.init()
    },
    submitComment: function () {
      console.log('submitComment')
      // TODO
    },
    showErrorNotice: function () {
      this.$Message.error('该分享功能开发中')
    }
  }
}
</script>

<style scoped>
.div_display {
  padding: 10px;
}

.div_info {
  height: auto;
  display: flex;
  display: -webkit-flex;
  align-items: center;
}

.img_category {
  width: 35px;
  height: 35px;
  margin-right: 15px;
  cursor: pointer;
}

.div_title {
  display: flex;
  margin-right: 50px;
  text-align: left;
}

.row_microblog {
  text-align: left;
}

.div_time {
  display: inline;
  float: right;
  text-align: right;
}

.markdown {
  z-index: 10;
}

.div_no_data {
  max-width: 200px;
  margin: 10px auto auto auto;
}

.div_drawer{
  text-align: center;
}

.divider_drawer{
  margin-top: 50px;
  font-weight: bold;
}

.div_poptip{
  color: #17233d;
  font-size: 14px;
  font-weight: bold;
}

.div_share{
  width: auto;
  height: auto;
  display: inline-block;
}

.img_share{
  cursor: pointer;
}

.div_qrcode{
  width: 120px;
  height: auto;
  padding: 10px;
  background: #f8f8f9;
  text-align: center;
}

#qrcode{
  margin-bottom: 5px;
}

.span_qrcode{
  color: #17233d;
  font-size: 14px;
  font-weight: bold;
}
</style>
