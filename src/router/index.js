import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'

import List from '@/components/List'

import Test from '@/components/CodeEdit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect:'/list'
    },
    {
      path: '/edit',
      name: 'Edit',
      component: Index
    },
    {
      path: '/list',
      name: 'List',
      component: List
    },
    {
      path: '/test',
      name: 'Test',
      component:  Test
    }
  ]
})
