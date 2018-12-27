<template>
  <comBase active="friendlink">
    <comFriendlink v-for="item in friendlinks" :key="item.link" :friendlink="item"></comFriendlink>
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
      friendlinks: []
    }
  },
  created () {
    if (mFriendlinks.friendlinks !== null && mFriendlinks.friendlinks.length > 0) {
      this.friendlinks = mFriendlinks.friendlinks
    }
  }
}
</script>

<style scoped>
</style>
