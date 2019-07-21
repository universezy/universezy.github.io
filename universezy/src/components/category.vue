<template>
  <comBase active="blog">
    <div class="div_category">
      <div class="div_head">
        <Breadcrumb class="breadcrumb_category">
          <BreadcrumbItem to="/blog/tab/category">
            <Icon type="ios-archive"></Icon> 类别
          </BreadcrumbItem>
          <BreadcrumbItem>
            <div class="div_info">
              <img v-if="showImg" class="img_category" :src="imgSrc" />
              <span>{{propCategory}}</span>
            </div>
          </BreadcrumbItem>
        </Breadcrumb>
        <div class="div_search">
          <Input search enter-button slot="extra" @on-search="search"/>
        </div>
        <div class="div_share">
          <Button icon="md-share" @click="clickShare">分享</Button>
        </div>
      </div>
      <comOverview :filter="filter" v-bind:keyword="keyword"></comOverview>
      <comShare v-bind:show="showShareModal" :showData="showData" :shareData="shareData"></comShare>
    </div>
  </comBase>
</template>

<script>
import comBase from './component-base.vue'
import comOverview from './component-overview.vue'
import comShare from './component-share.vue'
import mCategories from '../data/categories'
import {categoryApi, imageApi} from '../api/urls'

export default {
  name: 'category',
  components: {
    comBase,
    comOverview,
    comShare
  },
  data () {
    return {
      showImg: false,
      imgSrc: '',
      propCategory: this.$route.params.category,
      filter: {
        type: 'category',
        value: this.$route.params.category
      },
      keyword: '',
      showShareModal: 0,
      showData: {
        title: '',
        src: '',
        abstract: null
      },
      shareData: {
        title: '',
        src: '',
        url: '',
        abstract: null
      }
    }
  },
  created () {
    this.loadResource()
  },
  methods: {
    loadResource: function () {
      var category = mCategories.categories.find(element => {
        return element.name === this.propCategory
      })
      if (category) {
        this.showImg = true
        this.imgSrc = imageApi.getCategoryUrl(this.propCategory)
        this.showData = {
          title: '分享博客类别[' + category.name + ']',
          src: imageApi.getCategoryUrl(category.name),
          desc: null
        }
        this.shareData = {
          title: '分享博客类别[' + category.name + '] - ' + this.$store.state.GlobalData.title,
          src: imageApi.getLogoUrl,
          url: categoryApi.getRedirectUrl(category.name),
          desc: null,
          qrcode: categoryApi.getPageUrl(category.name)
        }
      }
    },
    clickShare: function () {
      this.showShareModal++
    },
    search: function (value) {
      this.keyword = value
    }
  }
}
</script>

<style scoped>
.div_category {
  margin: 20px 30px;
}

.div_head {
  width: 100%;
  height: auto;
  padding: 20px;
  display: flex;
  display: -webkit-flex;
  border: 5px solid #dcdee2;
  border-radius: 5px;
  background: #ffffff;
}

.breadcrumb_category {
  text-align: start;
  font-size: 18px;
  font-weight: bold;
}

.div_info {
  display: inline;
  align-items: center;
}

.img_category {
  width: 22px;
  height: 22px;
  margin-right: 5px;
  transform: translateY(5px)
}

.div_share {
  margin-left: 10px;
  margin-right: 0;
  float: right;
}

.div_search {
  margin-left: auto;
  margin-right: 0;
  float: right;
}
</style>
