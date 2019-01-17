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
                <p>Blog1</p>
                <p>Blog2</p>
              </div>
            </Panel>
          </Collapse>
        </div>
      </TimelineItem>
    </Timeline>
  </div>
</template>

<script>
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
              count: 2
            },
            {
              month: 5,
              count: 1
            },
            {
              month: 7,
              count: 2
            },
            {
              month: 8,
              count: 1
            },
            {
              month: 10,
              count: 1
            }
          ]
        }
      ]
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
</style>
