// 自定义表单模块

import Layout from '@/layout'

const employeeFileRouter = {
  path: '/custom',
  component: Layout,
  redirect: 'noRedirect',
  name: '自定义表单',
  meta: {
    title: '自定义表单',
    icon: 'customize'
  },
  children: [
    {
      path: 'CommonForm',
      component: () => import('@/pages/custom-module/index'),
      name: '自定义表单',
      meta: { title: '自定义表单', noCache: true }
    }
  ]
}

export default employeeFileRouter

