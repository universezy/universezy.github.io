<template>
  <a :href="propFavorite.link" target="_blank">
    <Card>
      <div class="div_favorite">
        <img class="img_favorite" :src="imgSrc">
        <Divider/>
        <p class="p_favorite"><b>{{propFavorite.name}}</b></p>
      </div>
    </Card>
  </a>
</template>

<script>
import {imageApi} from '../api/urls'

export default {
  name: 'component-favorite',
  props: {
    favorite: {
      type: Object,
      default: function () {
        return {
          id: 'null',
          link: '#',
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
      propFavorite: this.favorite
    }
  },
  computed: {
    imgSrc: function () {
      return imageApi.getFavorite(this.propFavorite.id)
    }
  }
}
</script>

<style scoped>
.div_favorite {
  text-align: center;
}

.img_favorite {
  width: 150px;
  height: 150px;
}

.p_favorite{
  color: #515a6e;
  font-size: 18px;
}
</style>
