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
      <div class="div_carousel">
        <div class="div_inner">
          <Carousel
            v-model="settings.value"
            :autoplay="settings.autoplay"
            :autoplay-speed="settings.autoplaySpeed"
            :loop="settings.loop"
            :dots="settings.dots"
            :radius-dot="settings.radiusDot"
            :trigger="settings.trigger"
            :arrow="settings.arrow">
            <CarouselItem v-for="item in banners" :key="item.id">
              <img
                class="img_banner"
                :src="getImgSrc(item.id)"
                :title="item.title"
                @click="clickBanner(item.id)"/>
            </CarouselItem>
          </Carousel>
        </div>
      </div>
      <Divider orientation="left">最近更新</Divider>
      <div class="div_microblog" v-for="item in microblogs" :key="item.id">
        <comMicroBlog :microblog="item" showIcon></comMicroBlog>
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
import {blogApi, imageApi} from '../api/urls'
// import {globalRouters} from '../api/routers'

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
        autoplaySpeed: 4000,
        loop: true,
        dots: 'inside',
        radiusDot: false,
        trigger: 'click',
        arrow: 'hover'
      },
      banners: [],
      microblogs: [],
      displaySize: 10
    }
  },
  created () {
    this.handleRedirect()
    if (mNotice.notice !== null) {
      this.notice = mNotice.notice
    }
    if (mBanners.banners !== null && mBanners.banners.length > 0) {
      for (var i = mBanners.banners.length - 1; i >= 0; i--) {
        this.banners.push(mBanners.banners[i])
      }
    }
    if (mBlogs.blogs !== null && mBlogs.blogs.length > 0) {
      var index = mBlogs.blogs.length - 1
      var count = 0
      while (index >= 0 && count < this.displaySize) {
        this.microblogs.push(mBlogs.blogs[index--])
        count++
      }
    }
  },
  computed: {
    mountNotice: function () {
      return this.notice.display && this.$store.state.GlobalState.isNoticeShow
    }
  },
  methods: {
    handleRedirect: function () {
      var url = window.location.href
      var start = url.indexOf('?blogId=')
      var end = url.indexOf('#')
      if (start > 0 && end > start) {
        var blogId = url.substring(start + '?blogId='.length, end)
        window.location.href = blogApi.getPageUrl(blogId)
      }
    },
    closeNotice: function () {
      this.$store.dispatch('closeNotice')
    },
    clickBanner: function (id) {
      this.$router.push('/blog/display/' + id)
    },
    getImgSrc: function (id) {
      return imageApi.getBannerUrl(id)
    }
  }
}
</script>

<style scoped>
.div_home{
  padding: 0 50px;
}

.alert_notice {
  margin: 5px 0;
  text-align: left;
}

.div_carousel{
  width: 100%;
  height: auto;
  margin: 20px 0;
  display: inline-block;
  position: relative;
  text-align: center;
  background: #e8eaec;
  overflow: hidden;
}

.div_inner{
  width: 500px;
  height: 300px;
  margin: 0 auto;
  text-align: center;
  align-items: center;
}

.img_banner {
  height: 100%;
  cursor: pointer;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
}

.div_microblog {
  width: 360px;
  float: left;
  display: inline;
  margin: 10px;
  text-align: left;
}
</style>
