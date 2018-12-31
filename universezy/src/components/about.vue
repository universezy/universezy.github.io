<template>
  <comBase active="about">
    <div class="div_about">
      <div class="div_inner">
        <Card :bordered="false">
          <Divider />
          <span class="span_about">赶在2018年最后一天，修复了几个主要问题，现已正式上线β版本。</span>
          <Divider />
          <span class="span_date">2018年12月31日</span>
          <Divider />
          <span class="span_about">博客导入工作结束，开始修复已知bug并开发新功能。</span>
          <Divider />
          <span class="span_date">2018年12月30日</span>
          <Divider />
          <span class="span_about">今天完成了所有基础功能，非常激动，整体效果不输于一些专业博客网站，分享和评论功能后期陆续开放，请给我点时间。</span>
          <Divider />
          <span class="span_about">这周每天白天上班时抽空写点，中午不吃饭，把时间利用起来，下班回去接着写，一点之前不睡觉，看着项目一点点推进，功能一个个实现，心里非常高兴，成就感就是最大的精神粮食！</span>
          <Divider />
          <span class="span_about">接下来要花较长时间把过去一年多时间里写的70余篇博客导进来，然后继续维护和增加新功能，主页轮播图bug已经发现了，还没提issue，欢迎读者帮我提上去。</span>
          <Divider />
          <span class="span_date">2018年12月29日</span>
          <Divider />
          <span class="span_about">最近换了Github账号名，因此旧版的github.io无法再使用了，加之旧版视觉上实在是不好看（原谅我的审美），还有就是旧版是通过js的DOM操作实现博客展示，我得预先把每一篇博客手动转html格式，维护起来相当困难，后面也因此没再更新博客上去，借此机会，决定用Vue.js重新设计一个github-page。</span>
          <Divider />
          <span class="span_about">前端框架选用Vue.js，因为三大主流框架我只会这个。UI库选用的iView，整体效果看上去还不错吧（如果对比了我第一版和第二版就知道这第三版简直太棒了！前两版越早越丑）。Markdown库选用的mavon-editor，感谢作者的劳动付出！</span>
          <Divider />
          <span class="span_about">这个版本最大的难度在于博客文章的处理吧，打算试下网络请求读取仓库里的Markdown文件从而实现动态加载博客，这样的话今后维护起来就轻松多了。然后就是评论功能，由于没有后端支持，想了下干脆和仓库的Issues关联起来，nice！至于最终能达成什么样的效果，心里也没底，大致思路是这样，试试看。</span>
          <Divider />
          <span class="span_about">如果有读者对这个项目感兴趣，欢迎通过左侧导航栏的联系方式或这个仓库的Issues给我留言。如果觉得不错，点个Star，非常感谢！</span>
          <Divider />
          <span class="span_date">2018年12月25日</span>
        </Card>
      </div>
    </div>
  </comBase>
</template>

<script>
import comBase from './component-base.vue'

export default {
  name: 'about',
  components: {
    comBase
  }
}
</script>

<style scoped>
.div_about{
  width: 100%;
  height: 100%;
  margin: auto;
  padding: 20px 100px;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
}

.div_inner{
  background: #eee;
  padding: 40px;
}

.span_about{
  display: block;
  font-size: 18px;
  text-align: left;
}

.span_date{
  display: block;
  font-size: 18px;
  text-align: right;
}

@media screen and (max-width: 1200px) {
  .div_about {
    padding: 0 50px;
    -webkit-transition: all 0.5s;
    -moz-transition: all 0.5s;
    transition: all 0.5s;
  }
}
</style>
