<template>
  <comBase active="blog">
    <div class="div_category">
      <Breadcrumb class="breadcrumb_category">
        <BreadcrumbItem :to="'/blog?tab=category'">
          <Icon type="md-pricetags"></Icon> 类别
        </BreadcrumbItem>
        <BreadcrumbItem>
          {{propCategory}}
        </BreadcrumbItem>
      </Breadcrumb>
      <comOverview></comOverview>
    </div>
  </comBase>
</template>

<script>
import comBase from './component-base.vue'
import comOverview from './component-overview.vue'

export default {
  name: 'category',
  components: {
    comBase,
    comOverview
  },
  data () {
    return {
      propCategory: this.$route.query.category
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.div_category{
  margin: 20px 30px;
}

.breadcrumb_category{
  text-align: start;
}
</style>
