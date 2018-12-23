<template>
  <comBase :active="active">测试slot功能:{{active}}</comBase>
</template>

<script>
import comBase from './component-base.vue'

export default {
  name: 'favorite',
  components: {
    comBase
  },
  data () {
    return {
      active: 'favorite'
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
