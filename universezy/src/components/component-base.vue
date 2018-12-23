<template>
  <div class="layout">
    <Layout style="min-height:100vh;">
      <Sider collapsible :collapsed-width="78" v-model="isCollapsed">
        <Row>
          <Card style="width:auto">
            <div style="text-align:center">
              <img :class="imgClass" src="../../static/logo.png">
              <h3>曾宇</h3>
            </div>
          </Card>
        </Row>
        <Row>
          <Menu theme="dark" width="auto" :class="menuitemClasses" active-name="active">
            <MenuItem name="home">
            <Icon type="md-home"></Icon>
            <span class="span_nav">主页</span>
            </MenuItem>
            <MenuItem name="biography">
            <Icon type="md-person"></Icon>
            <span class="span_nav">简介</span>
            </MenuItem>
            <MenuItem name="blog">
            <Icon type="md-document"></Icon>
            <span class="span_nav">博客</span>
            </MenuItem>
            <MenuItem name="favorite">
            <Icon type="md-bookmark"></Icon>
            <span class="span_nav">收藏</span>
            </MenuItem>
            <MenuItem name="friendlink">
            <Icon type="md-link"></Icon>
            <span class="span_nav">友链</span>
            </MenuItem>
            <MenuItem name="about">
            <Icon type="md-information-circle"></Icon>
            <span class="span_nav">关于</span>
            </MenuItem>
          </Menu>
        </Row>
        <Divider />
        <Row class="row_nav">
          <a href="https://github.com/universezy" target="_blank">
            <span class="span_nav">
              <Icon type="logo-github" size="20"></Icon>
            </span>
          </a>
          <a href="https://blog.csdn.net/zy13608089849" target="_blank">
            <span class="span_nav">
              <Icon type="ios-link" size="20"></Icon>
            </span>
          </a>
          <a href="http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&amp;email=VWRnZGZtZGFnZmcVJCR7Njo4" target="_blank">
            <span class="span_nav">
              <Icon type="md-mail" size="20"></Icon>
            </span>
          </a>
        </Row>
        <Divider />
        <Row class="row_nav" v-show="!isCollapsed">
          <span class="span_nav">2018 &copy; ZengYu</span>
        </Row>
        <Row class="row_nav" v-show="!isCollapsed">
          <a href="https://github.com/universezy/universezy.github.io" target="_blank">
            <span class="span_nav">
              <Icon type="logo-github" size=16></Icon> universezy.github.io
            </span>
          </a>
        </Row>
      </Sider>
      <Layout>
        <!-- <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}"></Header> -->
        <Content :style="{padding: '0 16px 16px'}">
          <slot></slot>
        </Content>
      </Layout>
    </Layout>
    <BackTop></BackTop>
  </div>
</template>

<script>
export default {
  name: 'component-base',
  props: [
    'active'
  ],
  data () {
    return {
      isCollapsed: false
    }
  },
  computed: {
    imgClass: function () {
      return this.isCollapsed ? 'img_avatar' : 'img_avatar_large'
    },
    menuitemClasses: function () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
  }
}
</script>

<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.layout-con {
  height: 100%;
  width: 100%;
}

.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width .2s ease .2s;
}

.menu-item i {
  transform: translateX(0px);
  transition: font-size .2s ease, transform .2s ease;
  vertical-align: middle;
  font-size: 16px;
}

.collapsed-menu span {
  width: 0px;
  transition: width .2s ease;
}

.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size .2s ease .2s, transform .2s ease .2s;
  vertical-align: middle;
  font-size: 22px;
}

.img_avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
}

.img_avatar_large {
  width: 80px;
  height: 80px;
  border-radius: 40px;
  transition: all .2s ease .2s;
}

.row_nav {
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
}

.span_nav {
  color: white;
}
</style>
