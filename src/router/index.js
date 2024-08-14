import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

import FormListRouter from '@/router/modules/form-list'
import EmployeeRouter from '@/router/modules/employee'
import DeptManageRouter from '@/router/modules/deptmanagement'
import UploadFile from '@/router/modules/uploadFile'
import CustomModuleRouter from '@/router/modules/custom-module'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/pages/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/pages/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/pages/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/pages/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/pages/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/guide',
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/pages/home'),
        name: '职业暴露统计分析',
        meta: { title: '职业暴露统计分析', icon: '首页', noCache: true }
      }
    ]
  }

]

export const asyncRoutes = [
  CustomModuleRouter,
  FormListRouter,
  EmployeeRouter,
  DeptManageRouter,
  UploadFile,

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
  mode: 'hash'
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
