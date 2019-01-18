<template>
  <div class="div_archive">
    <Timeline>
      <TimelineItem color="green">
        <Icon type="ios-trophy" slot="dot" size="16"></Icon>
        <p class="content">{{first.year}}年{{first.month}}月{{first.day}}日，发布第一篇文章，开始了博客生涯</p>
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
      first: {
        year: 1970,
        month: 1,
        day: 1
      },
      archives: []
    }
  },
  created () {
    var firstTime = new Date(mBlogs.blogs[0].timestamp)
    this.first = {
      year: firstTime.getFullYear(),
      month: firstTime.getMonth() + 1,
      day: firstTime.getDate()
    }
    mBlogs.blogs.forEach(element => {
      var date = new Date(element.timestamp)
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      this.appendArchive(year, month, element.id, element.title)
    })
  },
  methods: {
    appendArchive: function (year, month, id, title) {
      var yearExist = false
      for (var i = 0; i < this.archives.length; i++) {
        if (this.archives[i].year === year) {
          yearExist = true
          var monthExist = false
          for (var j = 0; j < this.archives[i].details.length; j++) {
            var detail = this.archives[i].details[j]
            if (detail.month === month) {
              monthExist = true
              var articleItem = this.createArticleItem(id, title)
              detail.articles.push(articleItem)
              detail.count++
              break
            }
          }
          if (!monthExist) {
            var monthItem = this.createMonthItem(month, id, title)
            this.archives[i].details.push(monthItem)
          }
          this.archives[i].count++
          break
        }
      }
      if (!yearExist) {
        var yearItem = this.createYearItem(year, month, id, title)
        this.archives.push(yearItem)
      }
    },
    createYearItem: function (year, month, id, title) {
      return {
        year: year,
        count: 1,
        details: [
          this.createMonthItem(month, id, title)
        ]
      }
    },
    createMonthItem: function (month, id, title) {
      return {
        month: month,
        count: 1,
        articles: [
          this.createArticleItem(id, title)
        ]
      }
    },
    createArticleItem: function (id, title) {
      return {
        id: id,
        title: title
      }
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
