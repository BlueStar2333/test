// 自定义表单模块

import Layout from '@/layout'

const employeeFileRouter = {
  path: '/notice',
  component: Layout,
  redirect: 'noRedirect',
  name: '公告',
  meta: {
    title: '公告',
    icon: 'notice'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/pages/notice/index'),
      name: '公告',
      meta: { title: '公告', noCache: true }
    }
  ]
}

export default employeeFileRouter

