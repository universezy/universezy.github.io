<template>
  <a :href="book.link" target="_blank">
    <Card>
      <div class="div_favorite">
        <img class="img_favorite" :src="imgSrc">
        <Divider/>
        <p class="p_favorite"><b>{{book.name}}</b></p>
      </div>
    </Card>
  </a>
</template>

<script>
export default {
  name: 'component-favorite',
  props: [
    'favoriteBook'
  ],
  data () {
    return {
      book: {
        src: '#',
        link: '#',
        name: 'null'
      }
    }
  },
  created () {
    if (this.favoriteBook !== null && this.favoriteBook.src !== null) {
      this.book = this.favoriteBook
    }
  },
  computed: {
    imgSrc: function () {
      return './static/favorite/' + this.book.src
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
