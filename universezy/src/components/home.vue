<template>
  <comBase :active="active">
    <div class="div_home">
      <Alert v-show="notice.show" class="alert_notice" show-icon banner closable @on-close="closeNotice">
        <span class="span_notice_title">{{notice.title}}</span>
        <template slot="desc">{{notice.desc}}</template>
      </Alert>
      <Carousel class="carousel_home" v-model="setting.value" :autoplay="setting.autoplay" :autoplay-speed="setting.autoplaySpeed"
        :loop="setting.loop" :dots="setting.dots" :radius-dot="setting.radiusDot" :trigger="setting.trigger" :arrow="setting.arrow">
        <CarouselItem v-for="banner in banners" :key="banner.src">
          <div class="carousel_content">
            <a :href="banner.link"><img class="img_banner" :src="banner.src" :title="banner.title" /></a>
          </div>
        </CarouselItem>
      </Carousel>
      <comMicroBlog class="com_microblog" v-for="item in testMicroblogs" :key="item.timestamp" :microblog="item"></comMicroBlog>
    </div>
  </comBase>
</template>

<script>
import comBase from './component-base.vue'
import comMicroBlog from './component-microblog.vue'
import mBanners from '../data/banners'

export default {
  name: 'home',
  components: {
    comBase,
    comMicroBlog
  },
  data () {
    return {
      active: 'home',
      notice: {
        show: true,
        title: '网站升级中',
        desc: 'github账号名变更，旧版github.io已不可使用，新版采用Vue.js重新设计，敬请期待！'
      },
      setting: {
        value: 0,
        autoplay: true,
        autoplaySpeed: 2000,
        loop: true,
        dots: 'inside',
        radiusDot: false,
        trigger: 'click',
        arrow: 'hover'
      },
      banners: null,
      testMicroblogs: [
        {
          category: 'Java',
          title: '这是一个测试标题',
          tags: [
            {
              tag: '设计原则'
            },
            {
              tag: '里氏替换原则'
            }
          ],
          abstract: '这是一段测试摘要内容：里氏代换原则，只有当衍生类可以替换掉基类，软件单位的功能不受到影响时，基类才能真正被复用，而衍生类也能够在基类的基础上增加新的行为。',
          timestamp: 1545613813626
        },
        {
          category: 'Android',
          title: '这是一个测试标题',
          tags: [
            {
              tag: 'PackageManager'
            }
          ],
          abstract: '这是一段测试摘要内容：PackageManager获取的信息即来自AndroidManifest.XML。',
          timestamp: 1545619294133
        },
        {
          category: 'Git',
          title: '这是一个测试标题',
          tags: [
            {
              tag: 'rebase'
            }
          ],
          abstract: 'rebase可以对某一段线性提交历史进行编辑、删除、复制、粘贴；因此，合理使用rebase命令可以使我们的提交历史干净、简洁！',
          timestamp: 1545624734835
        },
        {
          category: 'Vue.js',
          title: '这是一个测试标题',
          tags: [
            {
              tag: 'slot'
            }
          ],
          abstract: 'Vue 实现了一套内容分发的 API，这套 API 基于当前的 Web Components 规范草案，将 <slot> 元素作为承载分发内容的出口。',
          timestamp: 1545629734835
        }
      ]
    }
  },
  created () {
    this.notice.show = this.$store.state.GlobalState.isNoticeShow
    this.banners = mBanners.bannerImgs
  },
  methods: {
    closeNotice: function () {
      this.$store.dispatch('closeNotice')
    }
  }
}
</script>

<style scoped>
.div_home{
  padding: 0 50px;
}

.alert_notice {
  margin: 5px 10px;
  text-align: left;
}

.carousel_home {
  margin: 20px 10px;
  width: auto;
  height: auto;
}

.carousel_content {
  height: 300px;
  line-height: 300px;
  position: relative;
  font-size: 20px;
  background: #e8eaec;
}

.img_banner {
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
}

.com_microblog {
  float: left;
  margin: 10px;
}
</style>
