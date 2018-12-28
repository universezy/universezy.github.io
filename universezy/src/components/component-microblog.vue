<template>
  <Card>
    <div class="div_title" slot="title">
      <img v-if="propShowIcon" class="img_category" :src="imgSrc" @click="clickCategory"/>
      <span class="span_title" @click="clickTitle"><b>{{propMicroblog.title}}</b></span>
    </div>
    <Row class="row_microblog">
      <Tag class="tag" color="primary" v-for="item in propMicroblog.tags" :key="item.tag">
        <span @click="clickTag(item.tag)">{{item.tag}}</span>
      </Tag>
    </Row>
    <Row :class="abstractClassed">
      <div>{{propMicroblog.abstract}}</div>
    </Row>
    <Row class="row_time">
      <Time :time="propMicroblog.timestamp" type="date" />
    </Row>
  </Card>
</template>

<script>
export default {
  name: 'component-microblog',
  props: {
    microblog: {
      type: Object,
      default: function () {
        return {
          category: 'null',
          title: 'null',
          tags: [],
          abstract: 'null',
          timestamp: 1545613813626
        }
      }
    },
    wide: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      propMicroblog: this.microblog,
      propShowIcon: this.showIcon
    }
  },
  computed: {
    imgSrc: function () {
      return './static/category/' + this.propMicroblog.category + '.png'
    },
    abstractClassed: function () {
      return [
        'row_microblog',
        this.wide ? '' : 'row_abstract'
      ]
    }
  },
  methods: {
    clickCategory: function () {
      console.log('clickCategory: ' + this.propMicroblog.category)
      // TODO
    },
    clickTitle: function () {
      console.log('clickTitle: ' + this.propMicroblog.title)
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
.div_title {
  height: auto;
  display: flex;
  display: -webkit-flex;
  align-items: center;
}

.img_category {
  width: 35px;
  height: 35px;
  margin-right: 15px;
  cursor: pointer;
}

.span_title {
  cursor: pointer;
}

.row_microblog{
  margin-bottom: 10px;
}

.tag {
  cursor: pointer;
}

.row_abstract{
  height: 60px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row_time{
  text-align: right;
}
</style>
