<template>
  <comBase active="home">
    <div class="div_home">
      <Alert
        v-if="mountNotice"
        class="alert_notice"
        show-icon
        banner
        closable
        @on-close="closeNotice">
        <span class="span_notice_title">{{notice.title}}</span>
        <template slot="desc">{{notice.desc}}</template>
      </Alert>
      <Carousel
        class="carousel_home"
        v-model="settings.value"
        :autoplay="settings.autoplay"
        :autoplay-speed="settings.autoplaySpeed"
        :loop="settings.loop"
        :dots="settings.dots"
        :radius-dot="settings.radiusDot"
        :trigger="settings.trigger"
        :arrow="settings.arrow">
        <CarouselItem v-for="item in banners" :key="item.src">
          <div class="carousel_content">
            <a :href="item.link">
              <img class="img_banner" :src="item.src" :title="item.title" />
            </a>
          </div>
        </CarouselItem>
      </Carousel>
      <div class="div_microblog" v-for="item in testMicroblogs" :key="item.timestamp">
        <comMicroBlog :microblog="item"></comMicroBlog>
      </div>
    </div>
  </comBase>
</template>

<script>
import comBase from './component-base.vue'
import comMicroBlog from './component-microblog.vue'
import mNotice from '../data/notice'
import mBanners from '../data/banners'
import mBlogs from '../data/blogs'

export default {
  name: 'home',
  components: {
    comBase,
    comMicroBlog
  },
  data () {
    return {
      notice: {
        display: false
      },
      settings: {
        value: 0,
        autoplay: true,
        autoplaySpeed: 2000,
        loop: true,
        dots: 'inside',
        radiusDot: false,
        trigger: 'click',
        arrow: 'hover'
      },
      banners: [],
      testMicroblogs: []
    }
  },
  created () {
    if (mNotice.notice !== null) {
      this.notice = mNotice.notice
    }
    if (mBanners.banners !== null && mBanners.banners.length > 0) {
      this.banners = mBanners.banners
    }
    if (mBlogs.blogs !== null && mBlogs.blogs.length > 0) {
      this.testMicroblogs = mBlogs.blogs
    }
  },
  computed: {
    mountNotice: function () {
      return this.notice.dispatch && this.$store.state.GlobalState.isNoticeShow
    }
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

.div_microblog {
  max-width: 400px;
  min-width: 300px;
  float: left;
  display: inline;
  margin: 10px;
  text-align: left;
}
</style>
