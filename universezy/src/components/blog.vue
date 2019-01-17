<template>
  <comBase active="blog">
    <div class="div_blog">
      <Tabs v-model="tabValue" :animated="false">
        <TabPane name="overview" label="总览" icon="md-list-box">
          <comOverview showIcon v-bind:keyword="keyword"></comOverview>
        </TabPane>
        <TabPane name="category" label="类别" icon="ios-archive">
          <div class="div_category" v-for="item in categories" :key="item.name" @click="clickCategory(item.name)">
            <comCategory :category="item"></comCategory>
          </div>
        </TabPane>
        <TabPane name="column" label="专栏" icon="md-folder">
          <div class="div_column" v-for="item in columns" :key="item.name" @click="clickColumn(item.name)">
            <comColumn :column="item"></comColumn>
          </div>
        </TabPane>
        <TabPane name="tag" label="标签" icon="md-pricetags">
          <div class="div_tag" v-for="item in tags" :key="item.tag">
            <comTag :tag="item"></comTag>
          </div>
        </TabPane>
        <TabPane name="archive" label="归档" icon="md-calendar">
          <comArchive></comArchive>
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
import comTag from './component-tag.vue'
import comArchive from './component-archive.vue'
import mCategories from '../data/categories'
import mColumns from '../data/columns'
import mBlogs from '../data/blogs'
import {globalRouters} from '../api/routers'

export default {
  name: 'blog',
  components: {
    comBase,
    comOverview,
    comCategory,
    comColumn,
    comTag,
    comArchive
  },
  data () {
    return {
      tabs: ['overview', 'category', 'column', 'tag', 'archive'],
      tabValue: '',
      showSearchView: true,
      keyword: '',
      categories: [],
      columns: [],
      tags: []
    }
  },
  created () {
    /** Init Category and Tag */
    this.categories = mCategories.categories
    this.tags = []
    var categoryMap = new Map()
    var tagMap = new Map()
    mBlogs.blogs.forEach(element => {
      var categoryCount = categoryMap.get(element.category) || 0
      categoryMap.set(element.category, categoryCount + 1)
      element.tags.forEach(element => {
        var key = encodeURI(element.tag)
        var tagCount = tagMap.get(key) || 0
        tagMap.set(key, tagCount + 1)
      })
    })
    this.categories.forEach(element => {
      element.count = categoryMap.get(element.name)
    })
    categoryMap = null
    tagMap.forEach((value, key, map) => {
      this.tags.push({
        name: decodeURI(key),
        count: value
      })
    })
    tagMap = null
    /** Init Column */
    this.columns = mColumns.columns
    /** Init Tab */
    let tab = this.$route.params.tab
    this.tabValue = tab !== null && this.tabs.indexOf(tab) !== -1 ? tab : this.tabs[0]
  },
  watch: {
    tabValue: function () {
      this.showSearchView = this.tabValue === this.tabs[0]
      this.$router.push(globalRouters.getBlogTabRouter(this.tabValue))
    }
  },
  methods: {
    getCount: function (name) {
      return this.categoryMap.get(name)
    },
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
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
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
  padding: 0 50px;
}

.div_tag{
  float: left;
  display: inline-block;
  margin: 10px 5px;
}

@media screen and (max-width: 1000px) {
  .div_blog {
    margin: 10px 15px;
    -webkit-transition: all 0.5s;
    -moz-transition: all 0.5s;
    transition: all 0.5s;
  }
}
</style>
