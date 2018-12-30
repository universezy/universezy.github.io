<template>
  <div class="div_drawer">
    <Divider style="font-weight: bold;">分享</Divider>
    <span>开发中，敬请期待！</span>
    <Divider class="divider_drawer">更多</Divider>
    <ButtonGroup size="large">
      <Poptip trigger="hover" word-wrap width="240" placement="bottom-start">
        <div class="div_poptip" slot="content">{{settings.prevTitle}}</div>
        <Button type="primary" :disabled="settings.prevDisabled" @click="clickPrev">
          <Icon type="ios-arrow-back"></Icon>
          上一篇
        </Button>
      </Poptip>
      <Poptip trigger="hover" word-wrap width="240" placement="bottom-end">
        <div class="div_poptip" slot="content">{{settings.nextTitle}}</div>
        <Button type="primary" :disabled="settings.nextDisabled" @click="clickNext">
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
export default {
  name: 'component-drawer',
  props: {
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
    clickPrev: function () {
      this.$router.push('/blog/display?id=' + this.prev.id)
      this.$router.go(0)
    },
    clickNext: function () {
      this.$router.push('/blog/display?id=' + this.next.id)
      this.$router.go(0)
    },
    submitComment: function () {
      console.log('submitComment')
      // TODO
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
</style>
