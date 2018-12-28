<template>
  <Card class="card_category">
    <div class="div_category">
      <img class="img_category" :src="propCategory.src">
      <h3>{{propCategory.name}}</h3>
    </div>
  </Card>
</template>

<script>
export default {
  name: 'component-category',
  props: {
    category: {
      type: Object,
      default: function () {
        return {
          src: '',
          name: 'null'
        }
      },
      validator: function (value) {
        return value !== null
      }
    }
  },
  data () {
    return {
      propCategory: this.category
    }
  }
}
</script>

<style scoped>
.card_category{
  width: 120px;
  height: auto;
}

.div_category {
  text-align: center;
}

.img_category {
  width: 60px;
  height: 60px;
}
</style>
