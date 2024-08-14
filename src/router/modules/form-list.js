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
      path: 'exposure',
      component: () => import('@/pages/exposure/OccupationalExposure'),
      name: '职业暴露',
      meta: { title: '职业暴露', noCache: true }
    },
    {
      path: 'influenza',
      component: () => import('@/pages/influenza'),
      name: '流感相关',
      meta: { title: '流感相关', noCache: true }
    },
    {
      path: 'COVID-19',
      component: () => import('@/pages/COVID-19'),
      name: '新冠相关',
      meta: { title: '新冠相关', noCache: true }
    },
    {
      path: 'diarrhea',
      component: () => import('@/pages/diarrhea'),
      name: '腹泻调查',
      meta: { title: '腹泻调查', noCache: true }
    }
  ]
}

export default FormListRouter

