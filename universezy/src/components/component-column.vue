<template>
  <Card class="card_column">
    <span class="span_column" slot="title">
      <img class="img_column" :src="propColumn.src" />
      <h3 class="span_title">{{propColumn.title}}</h3>
    </span>
    <div class="div_desc">
      <span class="span_desc">{{propColumn.desc}}</span>
    </div>
  </Card>
</template>

<script>
export default {
  name: 'component-column',
  props: {
    column: {
      type: Object,
      default: function () {
        return {
          src: '#',
          name: 'null',
          title: 'null',
          desc: 'null',
          articles: []
        }
      }
    }
  },
  data () {
    return {
      propColumn: this.column
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
