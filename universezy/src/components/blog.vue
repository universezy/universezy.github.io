<template>
  <comBase :active="active">
    <div class="div_blog">
      <Tabs type="card" :value="tabValue">
        <TabPane name="overview" label="总览" icon="md-list-box">
          <comOverview></comOverview>
        </TabPane>
        <TabPane name="category" label="类别" icon="md-pricetags">
          <div class="div_category" v-for="item in categoryImgs" :key="item.name" @click="clickCategory(item.name)">
            <comCategory :blogCategory="item"></comCategory>
          </div>
        </TabPane>
        <TabPane name="column" label="专栏" icon="md-star">
          <div class="div_column" v-for="item in columnImgs" :key="item.name" @click="clickColumn(item.name)">
            <comColumn :blogColumn="item"></comColumn>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </comBase>
</template>

<script>
import comBase from './component-base.vue'
import comOverview from './component-overview.vue'
import comCategory from './component-category.vue'
import comColumn from './component-column.vue'
import mCategories from '../data/categories'
import mColumns from '../data/columns'

export default {
  name: 'blog',
  components: {
    comBase,
    comOverview,
    comCategory,
    comColumn
  },
  data () {
    return {
      active: 'blog',
      tabValue: 'overview',
      categoryImgs: null,
      columnImgs: null
    }
  },
  created () {
    this.categoryImgs = mCategories.categoryImgs
    this.columnImgs = mColumns.columnImgs
  },
  methods: {
    clickCategory: function (name) {
      console.log('category: ' + name)
    },
    clickColumn: function (name) {
      console.log('column: ' + name)
    }
  }
}
</script>

<style scoped>
.div_blog {
  margin: 20px 30px;
}

.div_category {
  float: left;
  display: inline;
  margin: 20px;
  cursor: pointer;
}

.div_column {
  cursor: pointer;
}
</style>
