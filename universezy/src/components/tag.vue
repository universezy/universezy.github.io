<template>
  <comBase active="blog">
    <div class="div_tag">
      <div class="div_head">
        <Breadcrumb class="breadcrumb_tag">
          <BreadcrumbItem to="/blog/tab/tag">
            <Icon type="md-pricetags"></Icon> Tag
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Tag color="error">{{propTag}}</Tag>
          </BreadcrumbItem>
        </Breadcrumb>
        <div class="div_search">
          <Input search enter-button slot="extra" @on-search="search"/>
        </div>
      </div>
      <comOverview showIcon v-bind:filter="filter" v-bind:keyword="keyword"></comOverview>
    </div>
  </comBase>
</template>

<script>
import comBase from './component-base.vue'
import comOverview from './component-overview.vue'

export default {
  name: 'tag',
  components: {
    comBase,
    comOverview
  },
  data () {
    return {
      propTag: decodeURI(this.$route.params.tag),
      filter: {
        type: 'tag',
        value: decodeURI(this.$route.params.tag)
      },
      keyword: ''
    }
  },
  watch: {
    '$route': function () {
      this.propTag = decodeURI(this.$route.params.tag)
      this.filter = {
        type: 'tag',
        value: this.propTag
      }
    }
  },
  methods: {
    search: function (value) {
      this.keyword = value
    }
  }
}
</script>

<style scoped>
.div_tag {
  margin: 20px 30px;
}

.div_head {
  width: 100%;
  height: auto;
  padding: 20px;
  display: flex;
  display: -webkit-flex;
  border: 5px solid #dcdee2;
  border-radius: 5px;
  background: #ffffff;
}

.breadcrumb_tag {
  text-align: start;
  font-size: 18px;
  font-weight: bold;
}

.div_search {
  margin-left: auto;
  margin-right: 0;
  float: right;
}
</style>
