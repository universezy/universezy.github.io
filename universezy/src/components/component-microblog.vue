<template>
  <Card class="card_microblog">
    <div class="div_title" slot="title">
      <img class="img_category" src="../../static/logo.png" />
      <span class="span_category">测试标题</span>
    </div>
    <Row class="row_microblog">
      <Tag color="primary">tag1</Tag>
      <Tag color="primary">tag2</Tag>
    </Row>
    <Row class="row_microblog">
      <span>测试内容</span>
    </Row>
    <Row>
      <Time :time="time_microblog" type="date" />
    </Row>
  </Card>
</template>

<script>
export default {
  name: 'component-microblog',
  data () {
    return {
      time_microblog: (new Date()).getTime()
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.card_microblog {
  width: 300px;
  text-align: left;
}

.div_title {
  height: auto;
  display: flex;
  display: -webkit-flex;
  align-items: center;
}

.img_category {
  width: 30px;
  height: 30px;
}

.span_category {
  margin-left: 15px;
}

.row_microblog{
  margin-bottom: 10px;
}
</style>
