<template>
  <Card class="card_category">
    <div class="div_category">
      <img class="img_category" :src="category.src">
      <h3>{{category.name}}</h3>
    </div>
  </Card>
</template>

<script>
export default {
  name: 'component-category',
  props: [
    'blogCategory'
  ],
  data () {
    return {
      category: {
        src: '',
        name: 'null'
      }
    }
  },
  created () {
    if (this.blogCategory !== null && this.blogCategory.src !== null) {
      this.category = this.blogCategory
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
