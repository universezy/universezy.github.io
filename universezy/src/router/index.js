import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import about from '@/components/about'
import biography from '@/components/biography'
import blog from '@/components/blog'
import favorite from '@/components/favorite'
import friendlink from '@/components/friendlink'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/about',
      name: 'about',
      component: about
    },
    {
      path: '/biography',
      name: 'biography',
      component: biography
    },
    {
      path: '/blog',
      name: 'blog',
      component: blog
    },
    {
      path: '/favorite',
      name: 'favorite',
      component: favorite
    },
    {
      path: '/friendlink',
      name: 'friendlink',
      component: friendlink
    }
  ]
})
