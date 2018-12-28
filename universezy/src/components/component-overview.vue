<template>
  <div>
    <div class="div_microblog" v-for="item in displayBlogs" :key="item.id">
      <comMicroBlog v-show="item.show" :microblog="item" wide :showIcon="propShowIcon"></comMicroBlog>
    </div>
    <Page
      class-name="page_microblog"
      :current.sync="settings.current"
      :total="settings.total"
      :page-size="settings.size"
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
      originBlogs: [],
      showBlogs: [],
      displayBlogs: [],
      propShowIcon: this.showIcon,
      settings: {
        current: 1,
        total: 0,
        size: 2
      }
    }
  },
  created () {
    this.initBlogs()
  },
  watch: {
    keyword: function () {
      this.filterShowByKeyword(this.keyword)
      this.settings.total = this.showBlogs.length
      this.settings.current = 1
      this.updateDisplayBlogs()
    }
  },
  methods: {
    initBlogs: function () {
      if (mBlogs.blogs !== null && mBlogs.blogs.length > 0) {
        this.loadOriginBlogs()
        this.filterOriginBlogs()
        this.originBlogs.forEach(element => {
          this.showBlogs.push(element)
        })
        this.settings.total = this.showBlogs.length
        this.updateDisplayBlogs()
      }
    },
    loadOriginBlogs: function () {
      for (var i = mBlogs.blogs.length - 1; i >= 0; i--) {
        this.originBlogs.push(mBlogs.blogs[i])
      }
    },
    filterOriginBlogs: function () {
      if (this.filter.type === 'all') {
        this.filterOriginForAll(true)
        return
      } else if (this.filter.type === 'category') {
        this.filterOriginByCategory(this.filter.value)
      } else if (this.filter.type === 'column') {
        this.filterOriginByColumn(this.filter.value)
      } else if (this.filter.type === 'tag') {
        this.filterOriginByTag(this.filter.value)
      }
      for (var i = this.originBlogs.length - 1; i >= 0; i--) {
        if (!this.originBlogs[i].show) {
          this.originBlogs.splice(i, 1)
        }
      }
    },
    filterOriginForAll: function (show) {
      this.originBlogs.forEach(element => {
        element.show = show
      })
    },
    filterOriginByCategory: function (value) {
      this.originBlogs.forEach(element => {
        element.show = element.category === value
      })
    },
    filterOriginByColumn: function (value) {
      var column = null
      for (var i = 0; i < mColumns.columns.length; i++) {
        if (mColumns.columns[i].name === value) {
          column = mColumns.columns[i]
          break
        }
      }
      if (column === null || column.articles.length === 0) {
        this.filterOriginForAll(false)
      } else {
        this.originBlogs.forEach(element => {
          element.show = column.articles.indexOf(element.id) !== -1
        })
      }
    },
    filterOriginByTag: function (value) {
      this.originBlogs.forEach(element => {
        element.show = element.tags.indexOf(value) !== -1
      })
    },
    filterShowByKeyword: function (keyword) {
      this.showBlogs = []
      this.originBlogs.forEach(element => {
        var show = keyword === '' || element.title.indexOf(keyword) !== -1 || element.abstract.indexOf(keyword) !== -1
        element.show = show
        if (show) {
          this.showBlogs.push(element)
        }
      })
    },
    updateDisplayBlogs: function () {
      this.displayBlogs = []
      var index = (this.settings.current - 1) * this.settings.size
      var count = 0
      while (count < this.settings.size && index < this.showBlogs.length) {
        this.$set(this.displayBlogs, count++, this.showBlogs[index++])
      }
    },
    changePage: function (page) {
      this.updateDisplayBlogs()
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
