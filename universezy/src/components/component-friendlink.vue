<template>
  <Card class="card_friendlink">
    <span class="span_title" slot="title">
      <img class="img_avator" :src="friend.src" />
      <span class="span_name">{{friend.name}}</span>
    </span>
    <a :href="friend.link" :target="friend.target" slot="extra">
      <Icon type="md-open" size=24></Icon>
    </a>
    <div class="div_desc">
      <span class="span_desc">{{friend.desc}}</span>
    </div>
  </Card>
</template>

<script>
export default {
  name: 'component-friendlink',
  props: [
    'friendlink'
  ],
  data () {
    return {
      friend: {
        link: '#',
        target: '',
        src: '#',
        name: 'null',
        desc: 'null'
      }
    }
  },
  created () {
    if (this.friendlink !== null && this.friendlink.link !== null) {
      this.friend = this.friendlink
    }
  }
}
</script>

<style scoped>
.card_friendlink{
  max-width: 600px;
  margin: 10px auto 25px auto;
  padding: 5px;
}

.span_title{
  display: flex;
  display: -webkit-flex;
  align-items: center;
}

.img_avator {
  width: 50px;
  height: 50px;
  display: flex;
}

.span_name {
  margin-left: 25px;
  font-size: 18px;
  color: #17233d;
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
