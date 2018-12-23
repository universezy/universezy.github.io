<template>
  <comBase :active="active">测试slot功能:{{active}}</comBase>
</template>

<script>
import comBase from './component-base.vue'

export default {
  name: 'blog',
  components: {
    comBase
  },
  data () {
    return {
      active: 'blog'
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
