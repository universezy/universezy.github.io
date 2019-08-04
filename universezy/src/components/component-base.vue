<template>
  <div class="layout">
    <Layout class="layout_base">
      <Sider
        class="sider_base"
        collapsible
        :collapsed-width="78"
        v-model="isCollapsed">
        <Row class="row_avator">
          <Card style="width:auto">
            <div style="text-align:center">
              <img :class="imgClass" src="../assets/logo.png">
              <transition name="slide-fade">
                <Row class="row_nav" v-show="!isCollapsed">
                  <h3>{{author}}</h3>
                </Row>
              </transition>
            </div>
          </Card>
        </Row>
        <Row>
          <Menu
            theme="dark"
            width="auto"
            :class="menuitemClasses"
            :active-name="propActive"
            @on-select="clickNav">
            <MenuItem v-for="item in navList" :key="item.name" :name="item.name">
              <Icon :type="item.icon" size="18"></Icon>
              <span class="span_nav">{{item.desc}}</span>
            </MenuItem>
          </Menu>
        </Row>
        <Divider />
        <Row class="row_nav">
          <Tooltip placement="top" v-for="item in navOthers" :key="item.desc" :content="item.desc">
            <a :href="item.link" target="_blank">
              <span class="span_nav">
                <Icon :type="item.icon" size="20"></Icon>
              </span>
            </a>
          </Tooltip>
        </Row>
        <Divider />
        <transition name="slide-fade">
          <Row class="row_nav" v-show="!isCollapsed">
            <span class="span_nav">2018-2019 &copy; ZengYu</span>
          </Row>
        </transition>
        <transition name="slide-fade">
          <Row class="row_nav" v-show="!isCollapsed">
            <a href="https://github.com/universezy/universezy.github.io" target="_blank">
              <span class="span_nav">
                <Icon type="logo-github" size=16></Icon> universezy.github.io
              </span>
            </a>
          </Row>
        </transition>
      </Sider>
      <Layout>
        <Content class="content_base">
          <slot></slot>
        </Content>
      </Layout>
    </Layout>
    <BackTop></BackTop>
    <comShare v-bind:show="showShareModal" :showData="showData" :shareData="shareData"></comShare>
  </div>
</template>

<script>
import comShare from './component-share.vue'
import {originUrl, imageApi} from '../api/urls'

const NavItems = ['home', 'biography', 'blog', 'favorite', 'friendlink', 'about', 'share']

export default {
  name: 'component-base',
  components: {
    comShare
  },
  props: {
    active: {
      type: String,
      default: NavItems[0],
      validator: function (value) {
        return NavItems.indexOf(value) !== -1
      }
    }
  },
  data () {
    return {
      propActive: this.active,
      isCollapsed: this.$store.state.GlobalState.isCollapsed,
      navList: [
        {
          name: 'home',
          icon: 'md-home',
          desc: '主页'
        },
        {
          name: 'biography',
          icon: 'md-person',
          desc: '简历'
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
        },
        {
          name: 'share',
          icon: 'md-share-alt',
          desc: '分享'
        }
      ],
      navOthers: [
        {
          desc: 'Github',
          link: 'https://github.com/universezy',
          icon: 'logo-github'
        },
        {
          desc: 'CSDN',
          link: 'https://blog.csdn.net/zy13608089849',
          icon: 'ios-link'
        },
        {
          desc: 'Email',
          link: 'http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=VWRnZGZtZGFnZmcVJCR7Njo4',
          icon: 'md-mail'
        }
      ],
      author: '进击的小宇宙',
      sign: 'Too young too simple, sometimes naive.',
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
  watch: {
    isCollapsed: function () {
      this.$store.dispatch('changeSider', this.isCollapsed)
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
  },
  created () {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    document.title = this.$store.state.GlobalData.title
    this.loadShareModal()
  },
  methods: {
    loadShareModal: function () {
      this.showData = {
        title: '分享 Github Pages [' + this.$store.state.GlobalData.title + ']',
        src: imageApi.getLogoUrl,
        desc: this.sign
      }
      this.shareData = {
        title: '分享 Github Pages [' + this.$store.state.GlobalData.title + ']',
        src: imageApi.getLogoUrl,
        url: originUrl,
        desc: this.sign,
        qrcode: originUrl
      }
    },
    clickNav: function (name) {
      if (name === 'share') {
        this.showShareModal++
      } else {
        this.$router.push('/' + name)
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

.layout_base {
  min-height: 100vh;
}

.layout-con {
  height: 100%;
  width: 100%;
}

.sider_base {
  padding-bottom: 20px;
  z-index: 5;
}

.row_avator {
  background: #f5f7f9;
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
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
}

.row_nav {
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
}

.span_nav {
  color: white;
}

.content_base {
  padding: 10px;
}

.slide-fade-leave-active {
  transition: all .2s ease
}

.slide-fade-enter-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(-40px);
  opacity: 0;
}
</style>
