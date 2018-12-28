<template>
  <comBase active="blog">
    <div class="div_column">
      <Affix :offset-top="0">
        <div class="div_affix">
          <div class="div_breadcrumb">
            <Breadcrumb class="breadcrumb_column">
              <BreadcrumbItem :to="'/blog?tab=column'">
                <Icon type="md-folder"></Icon> 专栏
              </BreadcrumbItem>
            </Breadcrumb>
            <div class="div_search">
              <Input search enter-button slot="extra" @on-search="search"/>
            </div>
          </div>
          <comColumn :column="dataColumn" wide></comColumn>
        </div>
      </Affix>
      <comOverview :filter="filter" v-bind:keyword="keyword"></comOverview>
    </div>
  </comBase>
</template>

<script>
import comBase from './component-base.vue'
import comColumn from './component-column.vue'
import comOverview from './component-overview.vue'
import mColumns from '../data/columns'

export default {
  name: 'column',
  components: {
    comBase,
    comColumn,
    comOverview
  },
  data () {
    return {
      dataColumn: null,
      propColumn: this.$route.query.column,
      filter: {
        type: 'column',
        value: this.$route.query.column
      },
      keyword: ''
    }
  },
  created () {
    this.loadResource()
  },
  methods: {
    loadResource: function () {
      let paramColumn = this.propColumn
      if (paramColumn === null) return
      if (mColumns.columns !== null && mColumns.columns.length > 0) {
        for (var i = 0; i <= mColumns.columns.length; i++) {
          if (mColumns.columns[i].name === paramColumn) {
            this.dataColumn = mColumns.columns[i]
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
.div_column {
  margin: 20px 30px;
}

.div_affix {
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

.div_search {
  margin-left: auto;
  margin-right: 0;
  float: right;
}
</style>
