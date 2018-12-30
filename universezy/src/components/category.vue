<template>
  <comBase active="blog">
    <div class="div_category">
      <div class="div_head">
        <Breadcrumb class="breadcrumb_category">
          <BreadcrumbItem to="/blog/tab/category">
            <Icon type="md-pricetags"></Icon> 类别
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
      </div>
      <comOverview :filter="filter" v-bind:keyword="keyword"></comOverview>
    </div>
  </comBase>
</template>

<script>
import comBase from './component-base.vue'
import comOverview from './component-overview.vue'
import mCategories from '../data/categories'
import {imageApi} from '../api/urls'

export default {
  name: 'category',
  components: {
    comBase,
    comOverview
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
      keyword: ''
    }
  },
  created () {
    this.loadResource()
  },
  methods: {
    loadResource: function () {
      if (mCategories.categories !== null && mCategories.categories.length > 0) {
        for (var i = 0; i <= mCategories.categories.length; i++) {
          if (mCategories.categories[i].name === this.propCategory) {
            this.showImg = true
            this.imgSrc = imageApi.getCategoryUrl(this.propCategory)
            break
          }
        }
      }
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

.div_search {
  margin-left: auto;
  margin-right: 0;
  float: right;
}
</style>
