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
              <span class="span_month">{{detail.month}}月</span><span class="span_count">{{detail.count}}篇</span>
              <div slot="content">
                <p class="span_article" v-for="(article, index) in detail.articles" :key="index" @click="clickArticle(article.id)">{{article.title}}</p>
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
      var archive = this.archives.find(element => {
        return element.year === year
      })
      if (archive) {
        yearExist = true
        var monthExist = false
        var detail = archive.details.find(element => {
          return element.month === month
        })
        if (detail) {
          monthExist = true
          var articleItem = this.createArticleItem(id, title)
          detail.articles.push(articleItem)
          detail.count++
        }
        if (!monthExist) {
          var monthItem = this.createMonthItem(month, id, title)
          archive.details.push(monthItem)
        }
        archive.count++
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

.span_month{
  width: 50px;
  display: inline-block;
  color: orange;
}

.span_count{
  color: orange;
}

.span_article{
  width: auto;
  margin: 5px 0;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
}

.span_article:hover{
  color: red;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
}
</style>
