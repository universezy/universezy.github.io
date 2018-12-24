<template>
  <Card class="card_microblog">
    <div class="div_title" slot="title">
      <img class="img_category" :src="imgSrc" @click="clickImgCategory"/>
      <span class="span_title" @click="clickTitle"><b>{{blog.title}}</b></span>
    </div>
    <Row class="row_microblog">
      <Tag class="tag" color="primary" v-for="item in blog.tags" :key="item.tag"><span @click="clickTag(item.tag)">{{item.tag}}</span></Tag>
    </Row>
    <Row class="row_microblog row_abstract">
      <span>{{blog.abstract}}</span>
    </Row>
    <Row class="row_time">
      <Time :time="blog.timestamp" type="date" />
    </Row>
  </Card>
</template>

<script>
export default {
  name: 'component-microblog',
  props: [
    'microblog'
  ],
  data () {
    return {
      blog: {
        category: 'null',
        title: 'null',
        tags: [],
        abstract: 'null',
        timestamp: 1545613813626
      }
    }
  },
  created () {
    if (this.microblog !== null && this.microblog.category !== null) {
      this.blog = this.microblog
    }
  },
  computed: {
    imgSrc: function () {
      return '../../static/category/' + this.blog.category + '.png'
    }
  },
  methods: {
    clickImgCategory: function () {
      console.log('clickImgCategory: ' + this.blog.category)
      // TODO
    },
    clickTitle: function () {
      console.log('clickTitle: ' + this.blog.title)
      // TODO
    },
    clickTag: function (tag) {
      console.log('clickTag: ' + tag)
      // TODO
    }
  }
}
</script>

<style scoped>
.card_microblog {
  max-width: 400px;
  min-width: 300px;
  height: auto;
  text-align: left;
}

.div_title {
  height: auto;
  display: flex;
  display: -webkit-flex;
  align-items: center;
}

.img_category {
  width: 35px;
  height: 35px;
  cursor: pointer;
}

.span_title {
  margin-left: 15px;
  cursor: pointer;
}

.row_microblog{
  margin-bottom: 10px;
}

.tag {
  cursor: pointer;
}

.row_abstract{
  min-height: 64px;
}

.row_time{
  text-align: right;
}
</style>
