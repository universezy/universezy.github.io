<template>
  <Card class="card_friendlink">
    <span class="span_friendlink" slot="title">
      <Avatar size="large" shape="square" :src="propFriendlink.src" />
      <span class="span_name">{{propFriendlink.name}}</span>
    </span>
    <a :href="propFriendlink.link" :target="aTraget" slot="extra">
      <Icon type="md-open" size=24></Icon>
    </a>
    <div class="div_desc">
      <span class="span_desc">{{propFriendlink.desc}}</span>
    </div>
  </Card>
</template>

<script>
export default {
  name: 'component-friendlink',
  props: {
    friendlink: {
      type: Object,
      default: function () {
        return {
          link: '#',
          src: '#',
          name: 'null',
          desc: 'null'
        }
      },
      validator: function (value) {
        return value !== null
      }
    }
  },
  data () {
    return {
      propFriendlink: this.friendlink
    }
  },
  computed: {
    aTraget: function () {
      return this.propFriendlink.link === '#' ? '' : '_blank'
    }
  }
}
</script>

<style scoped>
.card_friendlink{
  max-width: 600px;
  margin: auto;
  padding: 5px 10px;
}

.span_friendlink{
  display: flex;
  display: -webkit-flex;
  align-items: center;
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
