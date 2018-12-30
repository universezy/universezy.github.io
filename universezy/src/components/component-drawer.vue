<template>
  <div class="div_drawer">
    <Divider style="font-weight: bold;">分享</Divider>
    <Row>
      <div class="div_share">
        <Tooltip placement="bottom" @on-popper-show="showQrcode">
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
    <span>开发中，敬请期待！</span>
    <Divider class="divider_drawer">更多</Divider>
    <ButtonGroup size="large">
      <Poptip trigger="hover" word-wrap width="200" placement="bottom">
        <div class="div_poptip" slot="content">{{settings.prevTitle}}</div>
        <Button type="primary" :disabled="settings.prevDisabled" @click="shiftBlog(prev.id)">
          <Icon type="ios-arrow-back"></Icon>
          上一篇
        </Button>
      </Poptip>
      <Poptip trigger="hover" word-wrap width="200" placement="bottom">
        <div class="div_poptip" slot="content">{{settings.nextTitle}}</div>
        <Button type="primary" :disabled="settings.nextDisabled" @click="shiftBlog(next.id)">
          下一篇
          <Icon type="ios-arrow-forward"></Icon>
        </Button>
      </Poptip>
    </ButtonGroup>
    <Divider class="divider_drawer">跳转</Divider>
    <ButtonGroup size="large">
      <Button type="primary" ghost to="/blog?tab=overview">总览</Button>
      <Button type="primary" ghost to="/blog?tab=category">类别</Button>
      <Button type="primary" ghost to="/blog?tab=column">专栏</Button>
    </ButtonGroup>
    <Divider class="divider_drawer">评论</Divider>
    <span>开发中，敬请期待！</span>
  </div>
</template>

<script>
import {blogApi, shareApi} from '../api/urls'
import {globalRouters} from '../api/routers'
import QRCode from 'qrcodejs2'

var qrcode = null

export default {
  name: 'component-drawer',
  props: {
    current: {
      type: Object,
      default: null
    },
    prev: {
      type: Object,
      default: null
    },
    next: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      settings: {
        prevTitle: '已经是第一篇',
        prevDisabled: false,
        nextTitle: '已经是最后一篇',
        nextDisabled: false
      }
    }
  },
  created () {
    if (this.prev === null) {
      this.settings.prevDisabled = true
    } else {
      this.settings.prevTitle = this.prev.title
    }
    if (this.next === null) {
      this.settings.nextDisabled = true
    } else {
      this.settings.nextTitle = this.next.title
    }
  },
  methods: {
    getValidUrl: function () {
      var id = this.current === null ? null : this.current.id
      return blogApi.getPageUrl(id)
    },
    showQrcode: function () {
      if (qrcode !== null) return
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
      console.log('shareUrl = ' + shareUrl)
      this.showErrorNotice()
      // window.open(shareUrl)
    },
    shareToQZone: function () {
      let shareUrl = shareApi.getQZoneUrl(this.current)
      console.log('shareUrl = ' + shareUrl)
      this.showErrorNotice()
      // window.open(shareUrl)
    },
    shareToWeibo: function () {
      this.showErrorNotice()
    },
    shiftBlog: function (id) {
      this.$router.push(globalRouters.getDisplayRouter(id))
      this.$router.go(0)
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
