<template>
  <div>
    <div class="div_microblog" v-for="item in displayBlogs" :key="item.id">
      <comMicroBlog :microblog="item" wide :showIcon="propShowIcon"></comMicroBlog>
    </div>
    <Page
      class-name="page_microblog"
      :current.sync="settings.current"
      :total="settings.total"
      :page-size="settings.size"
      show-total
      show-elevator
      @on-change="changePage"
      simple/>
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
          type: FilterTypes[0],
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
      propKeyword: this.keyword,
      settings: {
        current: 1,
        total: 0,
        size: 10
      }
    }
  },
  created () {
    this.initBlogs()
  },
  watch: {
    keyword: function () {
      this.propKeyword = this.keyword
      this.filterShowByKeyword()
      this.updateDisplayBlogs()
    },
    filter: function () {
      this.propKeyword = ''
      this.initBlogs()
    }
  },
  methods: {
    initBlogs: function () {
      this.loadOriginBlogs()
      this.filterOriginBlogs()
      this.filterShowByKeyword()
      this.updateDisplayBlogs()
    },
    loadOriginBlogs: function () {
      this.originBlogs = []
      for (var i = mBlogs.blogs.length - 1; i >= 0; i--) {
        this.originBlogs.push(mBlogs.blogs[i])
      }
    },
    filterOriginBlogs: function () {
      if (this.filter.type === FilterTypes[0]) {
        // do nothing
      } else if (this.filter.type === FilterTypes[1]) {
        this.originBlogs = this.originBlogs.filter(item => {
          return item.category === this.filter.value
        })
      } else if (this.filter.type === FilterTypes[2]) {
        var column = mColumns.columns.find(item => {
          return item.name === this.filter.value
        })
        if (column && column.articles.length > 0) {
          this.originBlogs = this.originBlogs.filter(item => {
            return column.articles.indexOf(item.id) !== -1
          })
        }
      } else if (this.filter.type === FilterTypes[3]) {
        this.originBlogs = this.originBlogs.filter(item => {
          return item.tags.some(element => {
            return element.tag === this.filter.value
          })
        })
      }
    },
    filterShowByKeyword: function () {
      this.showBlogs = this.originBlogs.filter(item => {
        if (this.propKeyword === null ||
          this.propKeyword === '' ||
          item.title.indexOf(this.propKeyword) !== -1 ||
          item.abstract.indexOf(this.propKeyword) !== -1) {
          return true
        } else {
          return item.tags.some(element => {
            return element.tag === this.propKeyword
          })
        }
      })
      this.settings.total = this.showBlogs.length
      this.settings.current = 1
    },
    updateDisplayBlogs: function () {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
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

.page_microblog {
  margin-top: 60px;
}
</style>
