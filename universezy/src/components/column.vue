<template>
  <comBase active="blog">
    <div class="div_column">
      <Breadcrumb class="breadcrumb_column">
        <BreadcrumbItem :to="'/blog?tab=column'">
          <Icon type="md-star"></Icon> 专栏
        </BreadcrumbItem>
        <BreadcrumbItem>
          {{propColumn}}
        </BreadcrumbItem>
      </Breadcrumb>
        <comColumn :column="column" wide></comColumn>
        <Divider/>
      <comOverview></comOverview>
    </div>
  </comBase>
</template>

<script>
import comBase from './component-base.vue'
import comColumn from './component-column.vue'
import comOverview from './component-overview.vue'
import mColumns from '../data/columns'

export default {
  name: 'column',
  components: {
    comBase,
    comColumn,
    comOverview
  },
  data () {
    return {
      propColumn: this.$route.query.column
    }
  },
  computed: {
    column: function () {
      if (mColumns.columns !== null && mColumns.columns.length > 0) {
        for (var i = 0; i <= mColumns.columns.length; i++) {
          if (mColumns.columns[i].name === this.propColumn) {
            return mColumns.columns[i]
          }
        }
      }
      return null
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.div_column{
  margin: 20px 30px;
}

.breadcrumb_column{
  text-align: start;
}
</style>
