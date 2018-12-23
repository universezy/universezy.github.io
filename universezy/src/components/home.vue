<template>
  <comBase :active="active">
    <Alert class="alert_notice" show-icon banner closable v-show="noticeShow">
      <span class="span_notice_title">{{noticeTitle}}</span>
      <template slot="desc">{{noticeDesc}}</template>
    </Alert>
    <comMicroBlog></comMicroBlog>
  </comBase>
</template>

<script>
import comBase from './component-base.vue'
import comMicroBlog from './component-microblog.vue'

export default {
  name: 'home',
  components: {
    comBase,
    comMicroBlog
  },
  data () {
    return {
      active: 'home',
      noticeShow: true,
      noticeTitle: '网站升级中',
      noticeDesc: 'github账号名变更，旧版github.io已不可使用，新版采用Vue.js重新设计，敬请期待！'
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.alert_notice{
  text-align: left;
}
</style>
