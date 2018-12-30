import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import about from '@/components/about'
import biography from '@/components/biography'
import blog from '@/components/blog'
import category from '@/components/category'
import column from '@/components/column'
import display from '@/components/display'
import favorite from '@/components/favorite'
import friendlink from '@/components/friendlink'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home-default',
      redirect: '/home',
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
      name: 'blog-default',
      redirect: '/blog/tab/overview',
      component: blog
    },
    {
      path: '/blog/tab/:tab',
      name: 'blog/tab',
      component: blog
    },
    {
      path: '/blog/tab/',
      name: 'blog-error',
      redirect: '/blog/tab/overview',
      component: blog
    },
    {
      path: '/blog/category/:category',
      name: '/blog/category',
      component: category
    },
    {
      path: '/blog/category',
      name: 'category-error',
      redirect: '/blog',
      component: blog
    },
    {
      path: '/blog/column/:column',
      name: '/blog/column',
      component: column
    },
    {
      path: '/blog/column',
      name: 'column-error',
      redirect: '/blog',
      component: column
    },
    {
      path: '/blog/display/:id',
      name: '/blog/display',
      component: display
    },
    {
      path: '/blog/display',
      name: 'display-error',
      redirect: '/blog',
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
