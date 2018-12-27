<template>
  <comBase active="favorite">
    <div class="div_favorite">
      <comFavorite class="com_favorite" v-for="item in favorites" :key="item.src" :favorite="item"></comFavorite>
    </div>
  </comBase>
</template>

<script>
import comBase from './component-base.vue'
import comFavorite from './component-favorite.vue'
import mFavorites from '../data/favorites'

export default {
  name: 'favorite',
  components: {
    comBase,
    comFavorite
  },
  data () {
    return {
      favorites: []
    }
  },
  created () {
    if (mFavorites.favorites !== null && mFavorites.favorites.length > 0) {
      this.favorites = mFavorites.favorites
    }
  }
}
</script>

<style scoped>
.div_favorite{
  padding: 10px 50px;
}

.com_favorite{
  float: left;
  margin: 10px;
}
</style>
