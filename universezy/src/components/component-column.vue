<template>
  <Card class="card_column">
    <span class="span_column" slot="title">
      <img class="img_column" :src="column.src" />
      <h3 class="span_title">{{column.title}}</h3>
    </span>
    <div class="div_desc">
      <span class="span_desc">{{column.desc}}</span>
    </div>
  </Card>
</template>

<script>
export default {
  name: 'component-column',
  props: [
    'blogColumn'
  ],
  data () {
    return {
      column: {
        src: '#',
        name: 'null',
        title: 'null',
        desc: 'null',
        articles: []
      }
    }
  },
  created () {
    if (this.blogColumn !== null && this.blogColumn.category !== null) {
      this.column = this.blogColumn
    }
  }
}
</script>

<style scoped>
.card_column{
  max-width: 600px;
  margin: 10px auto 25px auto;
  padding: 0 5px;
}

.span_column{
  display: flex;
  display: -webkit-flex;
  align-items: center;
}

.img_column {
  width: 60px;
  height: 60px;
  display: flex;
}

.span_title {
  margin-left: 25px;
}

.div_desc{
  width: 100%;
  text-align: start;
}

.span_desc {
  font-size: 16px;
  color: #515a6e;
}
</style>
