// 科室管理

import Layout from '@/layout'

const deptManageRouter = {
    path: '/deptmanage',
    component: Layout,
    redirect: 'noRedirect',
    name: '科室管理',
    meta: {
        title: '科室管理',
        icon: 'dept'
    },
    children: [
        {
            path: 'deptmanagement',
            component: () => import('@/pages/deptmanage'),
            name: '科室管理',
            meta: { title: '科室管理', noCache: true }
        }
    ]
}

export default deptManageRouter

