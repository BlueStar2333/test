// 自定义表单模块

import Layout from '@/layout'

const FormListRouter = {
  path: '/formList',
  component: Layout,
  redirect: 'noRedirect',
  name: '表单列表',
  meta: {
    title: '表单列表',
    icon: 'influenza'
  },
  children: [
    {
      path: 'influenza',
      component: () => import('@/pages/influenza'),
      name: '流感相关',
      meta: { title: '流感相关', noCache: true }
    }
  ]
}

export default FormListRouter

