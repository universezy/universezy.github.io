<template>
  <comBase active="blog">
    <div class="div_column">
      <div class="div_head">
        <div class="div_breadcrumb">
          <Breadcrumb class="breadcrumb_column">
            <BreadcrumbItem to="/blog/tab/column">
              <Icon type="md-folder"></Icon> 专栏
            </BreadcrumbItem>
          </Breadcrumb>
          <div class="div_share">
            <Button icon="md-share" @click="clickShare">分享</Button>
          </div>
          <div class="div_search">
            <Input search enter-button slot="extra" @on-search="search"/>
          </div>
        </div>
        <comColumn :column="dataColumn" wide></comColumn>
      </div>
      <comOverview :filter="filter" v-bind:keyword="keyword"></comOverview>
      <comShare v-bind:show="showShareModal" :showData="showData" :shareData="shareData"></comShare>
    </div>
  </comBase>
</template>

<script>
import comBase from './component-base.vue'
import comColumn from './component-column.vue'
import comOverview from './component-overview.vue'
import comShare from './component-share.vue'
import mColumns from '../data/columns'
import {columnApi, imageApi} from '../api/urls'

export default {
  name: 'column',
  components: {
    comBase,
    comColumn,
    comOverview,
    comShare
  },
  data () {
    return {
      dataColumn: null,
      propColumn: this.$route.params.column,
      filter: {
        type: 'column',
        value: this.$route.params.column
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
      let paramColumn = this.propColumn
      if (paramColumn === null) return
      var column = mColumns.columns.find(element => {
        return element.name === paramColumn
      })
      if (column) {
        this.dataColumn = column
        this.showData = {
          title: '分享博客专栏[' + column.title + ']',
          src: imageApi.getCategoryUrl(column.name),
          desc: column.desc
        }
        this.shareData = {
          title: '分享博客专栏[' + column.title + '] - ' + this.$store.state.GlobalData.title,
          src: imageApi.getLogoUrl,
          url: columnApi.getRedirectUrl(column.name),
          desc: column.desc,
          qrcode: columnApi.getPageUrl(column.name)
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
.div_column {
  margin: 20px 30px;
}

.div_head {
  width: 100%;
  height: auto;
  padding: 20px;
  border: 5px solid #dcdee2;
  border-radius: 5px;
  background: #ffffff;
}

.div_breadcrumb {
  margin-bottom: 20px;
  text-align: start;
}

.breadcrumb_column {
  display: inline;
  font-size: 18px;
  font-weight: bold;
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
