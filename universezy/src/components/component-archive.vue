<template>
  <div class="div_archive">
    <Timeline>
      <TimelineItem color="green">
        <Icon type="ios-trophy" slot="dot" size="16"></Icon>
        <p class="content">2017年04月26日，发布第一篇文章，开始了博客生涯</p>
      </TimelineItem>
      <TimelineItem v-for="(archive, index) in archives" :key="index">
        <p class="content">{{archive.year}}年，共完成了{{archive.count}}篇博客</p>
        <div>
          <Collapse simple>
            <Panel v-for="(detail, index) in archive.details" :key="index" :name="''+index">
              {{detail.month}}月 {{detail.count}}篇
              <div slot="content">
                <p class="p_test" v-for="(article, index) in detail.articles" :key="index" @click="clickArticle(article.id)">{{article.title}}</p>
              </div>
            </Panel>
          </Collapse>
        </div>
      </TimelineItem>
      <TimelineItem>
        <p class="content">未完待续</p>
        </TimelineItem>
    </Timeline>
  </div>
</template>

<script>
import mBlogs from '../data/blogs'
import {globalRouters} from '../api/routers'

export default {
  name: 'component-archive',
  data () {
    return {
      archives: [
        {
          year: 2017,
          count: 7,
          details: [
            {
              month: 4,
              count: 2,
              articles: [
                {
                  id: 'Openlayers3Cluster',
                  title: 'Openlayers3学习心得之Cluster'
                },
                {
                  id: 'Openlayers3LineString',
                  title: 'Openlayers3学习心得之Cluster'
                }
              ]
            }
          ]
        },
        {
          year: 2018,
          count: 64,
          details: []
        },
        {
          year: 2019,
          count: 8,
          details: []
        }
      ]
    }
  },
  created () {
    mBlogs.blogs.forEach(element => {
      var date = new Date(element.timestamp)
      var year = date.getFullYear()
      var month = date.getMonth()
      this.appendArchive(year, month, element.id, element.title)
    })
  },
  methods: {
    appendArchive: function (year, month, id, title) {
      // TODO
    },
    clickArticle: function (id) {
      this.$router.push(globalRouters.getDisplayRouter(id))
    }
  }
}
</script>

<style scoped>
.div_archive {
  text-align: left;
  padding: 30px;
  background: white;
}

.content {
  font-size: 14px;
  font-weight: bold;
  padding-left: 5px;
}

.p_test{
  font-size: 14px;
  margin: 3px;
  cursor: pointer;
}
</style>
