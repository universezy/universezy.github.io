<template>
  <comBase :active="active">测试slot功能:{{active}}</comBase>
</template>

<script>
import comBase from './component-base.vue'

export default {
  name: 'biography',
  components: {
    comBase
  },
  data () {
    return {
      active: 'biography'
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
