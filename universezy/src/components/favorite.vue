<template>
  <comBase :active="active">
    <div class="div_favorite">
      <comFavorite class="com_favorite" v-for="item in favoriteBooks" :key="item.src" :favoriteBook="item"></comFavorite>
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
      active: 'favorite',
      favoriteBooks: null
    }
  },
  created () {
    this.favoriteBooks = mFavorites.favoriteBooks
  }
}
</script>

<style scoped>
.com_favorite{
  float: left;
  margin: 10px;
}

.div_favorite{
  padding: 10px 50px;
}
</style>
