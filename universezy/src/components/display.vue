<template>
  <comBase active="blog">
    <div v-if="showBlog" class="div_display">
      <Card>
        <div class="div_info" slot="title">
          <img class="img_category" :src="imgSrc" @click="clickCategory"/>
          <div class="div_title"><b>{{current.title}}</b></div>
        </div>
        <Button icon="md-menu" slot="extra" @click="clickMore">More</Button>
        <Row class="row_microblog">
          <Tag color="primary" v-for="item in current.tags" :key="item.tag">
            <span @click="clickTag(item.tag)">{{item.tag}}</span>
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
        :navigation="settingsMd.navigation"
        :codeStyle="settingsMd.codeStyle"
        :boxShadow="settingsMd.boxShadow"
        :previewBackground="settingsMd.previewBackground"
        :toolbarsFlag="settingsMd.toolbarsFlag"
        :toolbars="settingsMd.toolbars"/>
    </div>
    <div v-else class="div_no_data">
      <Alert type="error" show-icon>Resource not found</Alert>
    </div>
    <Drawer width="400" :closable="false" v-model="showDrawer">
      <div class="div_drawer">
        <Divider style="font-weight: bold;">Share</Divider>
        <Row>
          <div class="div_share">
            <Tooltip placement="bottom">
              <div class="div_qrcode" slot="content">
                <div id="qrcode"></div>
                <span class="span_qrcode">Wechat Scan</span>
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
        <Divider style="font-weight: bold;" class="divider_drawer">Others</Divider>
        <ButtonGroup shape="circle">
          <Button type="primary" :disabled="settingsDr.prevDisabled" @click="shiftBlog(prev.id)">
            <Poptip trigger="hover" word-wrap width="200" placement="bottom">
              <div class="div_poptip" slot="content">{{settingsDr.prevTitle}}</div>
              <Icon type="ios-arrow-back"></Icon>
              Last
            </Poptip>
          </Button>
          <Button type="primary" :disabled="settingsDr.nextDisabled" @click="shiftBlog(next.id)">
            <Poptip trigger="hover" word-wrap width="200" placement="bottom">
              <div class="div_poptip" slot="content">{{settingsDr.nextTitle}}</div>
              <Icon type="ios-arrow-forward"></Icon>
              Next
            </Poptip>
          </Button>
        </ButtonGroup>
        <Divider style="font-weight: bold;" class="divider_drawer">Navigation</Divider>
        <ButtonGroup>
          <Button size="large" v-for="item in jumpBtns" :key="item.tab" :to="item.tab">
            <Poptip trigger="hover" placement="bottom">
              <div class="div_poptip" slot="content">{{item.name}}</div>
              <Icon :type="item.icon"></Icon>
            </Poptip>
          </Button>
        </ButtonGroup>
        <Divider style="font-weight: bold;" class="divider_drawer">Comment</Divider>
        <span>Developing</span>
      </div>
    </Drawer>
  </comBase>
</template>

<script>
import comBase from './component-base.vue'
import mBlogs from '../data/blogs'
import requestApi from '../api/requestApi'
import {markdownApi, imageApi, blogApi, shareBlogApi} from '../api/urls'
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
        navigation: false, // 导航目录
        codeStyle: 'xcode', // 配色方案
        boxShadow: false, // 开启边框阴影
        previewBackground: '#f9f5f9', // 预览框背景颜色
        toolbarsFlag: false, // 工具栏是否显示
        toolbars: {
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          help: true, // 帮助
          navigation: true // 导航目录
        }
      },
      settingsDr: {
        prevTitle: 'It\'s first one',
        prevTitleDefault: 'It\'s first one',
        prevDisabled: true,
        nextTitle: 'It\'s last one',
        nextTitleDefault: 'It\'s last one',
        nextDisabled: true
      },
      showDrawer: false,
      showBlog: true,
      id: 0,
      prev: null,
      next: null,
      current: null,
      blogData: 'Loading...',
      jumpBtns: [
        {
          tab: '/blog/tab/overview',
          name: 'Overview',
          icon: 'md-list-box'
        },
        {
          tab: '/blog/tab/category',
          name: 'Category',
          icon: 'ios-archive'
        },
        {
          tab: '/blog/tab/column',
          name: 'Column',
          icon: 'md-folder'
        },
        {
          tab: '/blog/tab/tag',
          name: 'Tag',
          icon: 'md-pricetags'
        },
        {
          tab: '/blog/tab/archive',
          name: 'Archive',
          icon: 'md-calendar'
        }
      ]
    }
  },
  watch: {
    '$route': function () {
      this.init()
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
      this.id = this.$route.params.id
      if (this.check()) {
        this.load()
      } else {
        this.showBlog = false
      }
    },
    check: function () {
      if (mBlogs.blogs !== null && mBlogs.blogs.length > 0) {
        var index = mBlogs.blogs.findIndex(element => {
          return element.id === this.id
        })
        if (index >= 0) {
          this.current = mBlogs.blogs[index]
          if (index - 1 >= 0) {
            this.prev = mBlogs.blogs[index - 1]
          } else {
            this.prev = null
          }
          if (index + 1 <= mBlogs.blogs.length - 1) {
            this.next = mBlogs.blogs[index + 1]
          } else {
            this.next = null
          }
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
      this.$Message.error('Loading failed, retry later.')
      this.blogData = 'Loading failed, retry later.'
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
    clickTag: function (name) {
      this.$router.push(globalRouters.getTagRouter(name))
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
      let shareUrl = shareBlogApi.getQQUrl(this.current)
      window.open(shareUrl)
    },
    shareToQZone: function () {
      let shareUrl = shareBlogApi.getQZoneUrl(this.current)
      window.open(shareUrl)
    },
    shareToWeibo: function () {
      let shareUrl = shareBlogApi.getWeiboUrl(this.current)
      window.open(shareUrl)
    },
    shiftBlog: function (id) {
      this.$router.push(globalRouters.getDisplayRouter(id))
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
  background: #f9f5f9; /* f9f5f9 */
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
