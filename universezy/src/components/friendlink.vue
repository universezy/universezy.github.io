<template>
  <comBase active="friendlink">
    <div class="div_friendlink" v-for="item in friendlinks" :key="item.link">
      <comFriendlink :friendlink="item"></comFriendlink>
    </div>
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
.div_friendlink {
  margin: 15px auto;
}
</style>
