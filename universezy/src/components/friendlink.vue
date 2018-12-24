<template>
  <comBase :active="active">
    <comFriendlink v-for="item in friendLinks" :key="item.link" :friendlink="item"></comFriendlink>
  </comBase>
</template>

<script>
import comBase from './component-base.vue'
import comFriendlink from './component-friendlink.vue'
import mFriendlinks from '../data/friendlinks'

export default {
  name: 'friendlink',
  components: {
    comBase,
    comFriendlink
  },
  data () {
    return {
      active: 'friendlink',
      friendLinks: null
    }
  },
  created () {
    this.friendLinks = mFriendlinks.friendLinks
  }
}
</script>

<style scoped>
</style>
