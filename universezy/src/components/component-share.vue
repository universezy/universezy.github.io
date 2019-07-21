<template>
  <Modal :title="propShowData.title" v-model="propShow" class-name="vertical-center-modal" @on-ok="clickOk"
    @on-cancel="clickCancel">
    <div class="div_container">
    <Row>
      <div class="div_share">
        <Tooltip placement="bottom" max-width="200">
          <span class="span_qrcode" slot="content">微信扫描下方二维码，然后点击右上角分享按钮</span>
          <img class="img_share" src="../assets/wechat.svg" />
        </Tooltip>
      </div>
      <div class="div_share">
        <img class="img_share" src="../assets/qq.svg" @click="shareToQQ" />
      </div>
      <div class="div_share">
        <img class="img_share" src="../assets/qzone.svg" @click="shareToQZone" />
      </div>
      <div class="div_share">
        <img class="img_share" src="../assets/weibo.svg" @click="shareToWeibo" />
      </div>
    </Row>
    <Divider />
    <Row>
      <div v-bind:id="qrcodeId" class="shareQrCode"></div>
    </Row>
    </div>
  </Modal>
</template>

<script>
import {shareOtherApi} from '../api/urls'
import QRCode from 'qrcodejs2'

export default {
  name: 'component-share',
  props: {
    showData: {
      type: Object,
      default: function () {
        return {
          title: 'null',
          src: '',
          desc: null
        }
      }
    },
    shareData: {
      type: Object,
      default: function () {
        return {
          title: 'null',
          src: '',
          url: '',
          desc: null
        }
      }
    },
    show: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      qrcodeId: '' + new Date().getTime(),
      propShowData: this.showData,
      propShareData: this.shareData,
      propShow: false,
      qrcode: null
    }
  },
  mounted () {
    this.createQrcode()
  },
  destroy () {
    if (this.qrcode !== null) {
      this.qrcode.clear()
      this.qrcode = null
    }
  },
  watch: {
    show: function () {
      this.propShow = true
    }
  },
  methods: {
    createQrcode: function () {
      this.qrcode = new QRCode(this.qrcodeId, {
        text: this.propShareData.url,
        width: 100,
        height: 100,
        colorDark: '#17233d',
        colorLight: '#f8f8f9',
        correctLevel: QRCode.CorrectLevel.H
      })
    },
    clickOk: function () {
      this.propShow = false
    },
    clickCancel: function () {
      this.propShow = false
    },
    shareToQQ: function () {
      let shareUrl = shareOtherApi.getQQUrl(this.propShareData)
      window.open(shareUrl)
    },
    shareToQZone: function () {
      let shareUrl = shareOtherApi.getQZoneUrl(this.propShareData)
      window.open(shareUrl)
    },
    shareToWeibo: function () {
      let shareUrl = shareOtherApi.getWeiboUrl(this.propShareData)
      window.open(shareUrl)
    }
  }
}
</script>

<style scoped lang="less">
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}

.div_container {
  text-align: center;
}

.div_share {
  width: auto;
  height: auto;
  margin: 0 10px;
  display: inline-block;
}

.img_share {
  cursor: pointer;
}

.shareQrCode {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.span_qrcode {
  width: auto;
  font-size: 14px;
}
</style>
