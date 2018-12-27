<template>
  <div>
    <div class="div_microblog" v-for="item in microBlogs" :key="item.timestamp">
      <comMicroBlog :microblog="item"></comMicroBlog>
    </div>
    <Page
      class-name="page_microblog"
      :total="microBlogs.length"
      :page-size="pageSize"
      show-total
      show-elevator
      @on-change="changePage"/>
  </div>
</template>

<script>
import comMicroBlog from './component-microblog.vue'
import mBlogs from '../data/blogs'

export default {
  name: 'component-overview',
  components: {
    comMicroBlog
  },
  data () {
    return {
      microBlogs: [],
      pageSize: 10
    }
  },
  created () {
    if (mBlogs.blogs !== null && mBlogs.blogs.length > 0) {
      this.microBlogs = mBlogs.blogs
    }
  },
  methods: {
    changePage: function (page) {
      console.log('page = ' + page)
    }
  }
}
</script>

<style scoped>
.div_microblog {
  margin: 10px;
  text-align: left;
}

.page_microblog{
  margin-top: 100px;
}
</style>
