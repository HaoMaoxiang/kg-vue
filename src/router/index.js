import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Search from '@/components/Search'
import API from '@/components/API'
import QA from '@/components/QA'
import About from '@/components/About'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/api',
      name: 'API',
      component: API
    },
    {
      path: '/qa',
      name: 'QA',
      component: QA
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})
