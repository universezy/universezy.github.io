<template>
  <comBase active="blog">
    <div class="div_blog">
      <Tabs type="card" :value="tabValue">
        <TabPane name="overview" label="总览" icon="md-list-box">
          <comOverview showIcon></comOverview>
        </TabPane>
        <TabPane name="category" label="类别" icon="md-pricetags">
          <div class="div_category" v-for="item in categories" :key="item.name" @click="clickCategory(item.name)">
            <comCategory :category="item"></comCategory>
          </div>
        </TabPane>
        <TabPane name="column" label="专栏" icon="md-star">
          <div class="div_column" v-for="item in columns" :key="item.name" @click="clickColumn(item.name)">
            <comColumn :column="item"></comColumn>
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
      tabs: ['overview', 'category', 'column'],
      categories: [],
      columns: []
    }
  },
  created () {
    if (mCategories.categories !== null && mCategories.categories.length > 0) {
      this.categories = mCategories.categories
    }
    if (mColumns.columns !== null && mColumns.columns.length > 0) {
      this.columns = mColumns.columns
    }
  },
  computed: {
    tabValue: function () {
      let tab = this.$route.query.tab
      if (tab !== null && this.tabs.indexOf(tab) !== -1) {
        return tab
      } else {
        return this.tabs[0]
      }
    }
  },
  methods: {
    clickCategory: function (name) {
      this.$router.push('/blog/category?category=' + name)
    },
    clickColumn: function (name) {
      this.$router.push('blog/column?column=' + name)
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
