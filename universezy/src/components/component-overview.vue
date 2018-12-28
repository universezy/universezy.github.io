<template>
  <div>
    <div class="div_microblog" v-for="item in microBlogs" :key="item.id">
      <comMicroBlog v-show="item.show" :microblog="item" wide :showIcon="propShowIcon"></comMicroBlog>
    </div>
    <Page
      class-name="page_microblog"
      :total="blogCount"
      :page-size="pageSize"
      show-total
      show-elevator
      @on-change="changePage"/>
  </div>
</template>

<script>
import comMicroBlog from './component-microblog.vue'
import mBlogs from '../data/blogs'
import mColumns from '../data/columns'

const FilterTypes = ['all', 'category', 'column', 'tag']

export default {
  name: 'component-overview',
  components: {
    comMicroBlog
  },
  props: {
    showIcon: {
      type: Boolean,
      default: false
    },
    filter: {
      type: Object,
      default: function () {
        return {
          type: 'all',
          value: ''
        }
      },
      validator: function (value) {
        return value !== null && FilterTypes.indexOf(value.type) !== -1
      }
    },
    keyword: {
      type: String,
      default: '',
      validator: function (value) {
        return value !== null
      }
    }
  },
  data () {
    return {
      microBlogs: [],
      propShowIcon: this.showIcon,
      pageSize: 10,
      blogCount: 0
    }
  },
  created () {
    this.initBlogs()
  },
  watch: {
    keyword: function () {
      this.filterKeyword(this.keyword)
    }
  },
  methods: {
    initBlogs: function () {
      if (mBlogs.blogs !== null && mBlogs.blogs.length > 0) {
        mBlogs.blogs.forEach(element => {
          this.microBlogs.push(element)
        })
        this.filterBlogs()
        this.blogCount = this.microBlogs.length
      }
    },
    changePage: function (page) {
      console.log('page = ' + page)
    },
    filterBlogs: function () {
      if (this.filter.type === 'all') {
        this.filterAll(true)
        return
      } else if (this.filter.type === 'category') {
        this.filterCategory(this.filter.value)
      } else if (this.filter.type === 'column') {
        this.filterColumn(this.filter.value)
      } else if (this.filter.type === 'tag') {
        this.filterTag(this.filter.value)
      }
      for (var i = this.microBlogs.length - 1; i >= 0; i--) {
        if (!this.microBlogs[i].show) {
          this.microBlogs.splice(i, 1)
        }
      }
    },
    filterAll: function (show) {
      this.microBlogs.forEach(element => {
        element.show = show
      })
    },
    filterCategory: function (value) {
      this.microBlogs.forEach(element => {
        element.show = element.category === value
      })
    },
    filterColumn: function (value) {
      var column = null
      for (var i = 0; i < mColumns.columns.length; i++) {
        if (mColumns.columns[i].name === value) {
          column = mColumns.columns[i]
          break
        }
      }
      if (column === null || column.articles.length === 0) {
        this.filterAll(false)
      } else {
        this.microBlogs.forEach(element => {
          element.show = column.articles.indexOf(element.id) !== -1
        })
      }
    },
    filterTag: function (value) {
      this.microBlogs.forEach(element => {
        element.show = element.tags.indexOf(value) !== -1
      })
    },
    filterKeyword: function (keyword) {
      var count = 0
      for (var i = 0; i < this.microBlogs.length; i++) {
        var element = this.microBlogs[i]
        if (keyword === '' || element.title.indexOf(keyword) !== -1 || element.abstract.indexOf(keyword) !== -1) {
          element.show = true
          count++
        } else {
          element.show = false
        }
        this.$set(this.microBlogs, i, element)
      }
      this.blogCount = count
    }
  }
}
</script>

<style scoped>
.div_microblog {
  margin: 20px;
  text-align: left;
}

.page_microblog{
  margin-top: 60px;
}
</style>
