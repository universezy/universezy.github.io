<template>
  <Card class="card_category">
    <div class="div_category">
      <img class="img_category" :src="imgSrc">
      <h3>{{propCategory.name}}</h3>
    </div>
  </Card>
</template>

<script>
import {imageApi} from '../api/urls'

export default {
  name: 'component-category',
  props: {
    category: {
      type: Object,
      default: function () {
        return {
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
  },
  computed: {
    imgSrc: function () {
      return imageApi.getCategoryUrl(this.propCategory.name)
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
