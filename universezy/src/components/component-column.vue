<template>
  <Card :class="cardClasses">
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
      validator: function (value) {
        return value !== null
      },
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
    },
    wide: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      propColumn: this.column
    }
  },
  computed: {
    cardClasses: function () {
      return [
        'card_column', this.wide ? '' : 'card_column_small'
      ]
    }
  }
}
</script>

<style scoped>
.card_column {
  margin: auto;
  padding: 0 5px;
}

.card_column_small {
  max-width: 600px;
}

.span_column {
  display: flex;
  display: -webkit-flex;
  align-items: center;
}

.img_column {
  width: 35px;
  height: 35px;
  display: flex;
}

.span_title {
  margin-left: 25px;
}

.div_desc {
  width: 100%;
  text-align: start;
}

.span_desc {
  font-size: 16px;
  color: #515a6e;
}
</style>
