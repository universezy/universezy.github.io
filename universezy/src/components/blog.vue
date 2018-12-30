<template>
  <comBase active="blog">
    <div class="div_blog">
      <Tabs v-model="tabValue" :animated="false">
        <TabPane name="overview" label="总览" icon="md-list-box">
          <comOverview showIcon v-bind:keyword="keyword"></comOverview>
        </TabPane>
        <TabPane name="category" label="类别" icon="md-pricetags">
          <div class="div_category" v-for="item in categories" :key="item.name" @click="clickCategory(item.name)">
            <comCategory :category="item"></comCategory>
          </div>
        </TabPane>
        <TabPane name="column" label="专栏" icon="md-folder">
          <div class="div_column" v-for="item in columns" :key="item.name" @click="clickColumn(item.name)">
            <comColumn :column="item"></comColumn>
          </div>
        </TabPane>
        <Input
          v-show="showSearchView"
          search
          enter-button
          slot="extra"
          @on-search="search"/>
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
import {globalRouters} from '../api/routers'

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
      tabValue: '',
      showSearchView: true,
      keyword: '',
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
    let tab = this.$route.params.tab
    this.tabValue = tab !== null && this.tabs.indexOf(tab) !== -1 ? tab : this.tabs[0]
  },
  watch: {
    tabValue: function () {
      this.showSearchView = this.tabValue === this.tabs[0]
    }
  },
  methods: {
    clickCategory: function (name) {
      this.$router.push(globalRouters.getCategoryRouter(name))
    },
    clickColumn: function (name) {
      this.$router.push(globalRouters.getColumnRouter(name))
    },
    search: function (value) {
      this.keyword = value
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
  margin: 20px auto;
  text-align: center;
  cursor: pointer;
}
</style>
