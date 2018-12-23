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
          <Menu theme="dark" width="auto" :class="menuitemClasses" :active-name="activeItem" @on-select="clickNav">
            <MenuItem v-for="item in navList" :key="item.name" :name="item.name">
              <Icon :type="item.icon"></Icon>
              <span class="span_nav">{{item.desc}}</span>
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
      activeItem: 'home',
      isCollapsed: false,
      navList: [
        {
          name: 'home',
          icon: 'md-home',
          desc: '主页'
        },
        {
          name: 'biography',
          icon: 'md-person',
          desc: '简介'
        },
        {
          name: 'blog',
          icon: 'md-document',
          desc: '博客'
        },
        {
          name: 'favorite',
          icon: 'md-bookmark',
          desc: '收藏'
        },
        {
          name: 'friendlink',
          icon: 'md-link',
          desc: '友链'
        },
        {
          name: 'about',
          icon: 'md-information-circle',
          desc: '关于'
        }
      ]
    }
  },
  created () {
    this.activeItem = this.active
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
  },
  methods: {
    clickNav: function (activeItem) {
      switch (activeItem) {
        case 'biography':
          this.$router.push('/biography')
          break
        case 'blog':
          this.$router.push('/blog')
          break
        case 'favorite':
          this.$router.push('/favorite')
          break
        case 'friendlink':
          this.$router.push('/friendlink')
          break
        case 'about':
          this.$router.push('/about')
          break
        case 'home':
        default:
          this.$router.push('/home')
      }
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
