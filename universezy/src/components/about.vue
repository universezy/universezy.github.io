<template>
  <comBase :active="active">测试slot功能:{{active}}</comBase>
</template>

<script>
import comBase from './component-base.vue'

export default {
  name: 'about',
  components: {
    comBase
  },
  data () {
    return {
      active: 'about'
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
