// 文件管理

import Layout from '@/layout'

const deptManageRouter = {
    path: '/file',
    component: Layout,
    redirect: 'noRedirect',
    name: '文件管理',
    meta: {
        title: '文件管理',
        icon: 'file'
    },
    children: [
        {
            path: 'uFile',
            component: () => import('@/pages/file/index'),
            name: '文件管理',
            meta: { title: '文件管理', noCache: true }
        }
    ]
}

export default deptManageRouter

