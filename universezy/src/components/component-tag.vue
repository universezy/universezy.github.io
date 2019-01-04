<template>
  <Tag :color="tagColor" @click="clickTag">
    <span @click="clickTag">{{propTag.name}}</span>
  </Tag>
</template>

<script>
import {globalRouters} from '../api/routers'

const DefaultColors = ['primary', 'success']
const Colors = [
  'magenta', 'red', 'red', 'volcano', 'orange', 'gold', 'yellow',
  'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple', 'default'
]

export default {
  name: 'component-tag',
  props: {
    tag: {
      type: Object,
      default: function () {
        return {
          name: 'null',
          count: 0
        }
      }
    }
  },
  data () {
    return {
      propTag: this.tag
    }
  },
  computed: {
    tagColor: function () {
      if (this.propTag.count > 10) {
        return DefaultColors[0]
      } else if (this.propTag.count > 5) {
        return DefaultColors[1]
      } else {
        var randomIndex = Math.floor(Math.random() * Colors.length)
        return Colors[randomIndex]
      }
    }
  },
  methods: {
    clickTag: function () {
      this.$router.push(globalRouters.getTagRouter(this.propTag.name))
    }
  }
}
</script>

<style scoped>
</style>
