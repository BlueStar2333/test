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
      component: () => import('@/pages/custom-module/ordinary-form'),
      name: '普通表',
      meta: { title: '普通表', noCache: true }
    },
    {
      path: 'ProcessForm',
      component: () => import('@/pages/custom-module/process-form'),
      name: '流程表',
      meta: { title: '流程表', noCache: true }
    }
  ]
}

export default employeeFileRouter

