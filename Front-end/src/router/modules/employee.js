// 员工档案

import Layout from '@/layout'

const employeeFileRouter = {
  path: '/EmployeeFile',
  component: Layout,
  redirect: 'noRedirect',
  name: '人员管理',
  meta: {
    title: '人员管理',
    icon: 'employee'
  },
  children: [
    {
      path: 'PersonnelManagement',
      component: () => import('@/pages/employee/index'),
      name: '人员管理',
      meta: { title: '人员管理', noCache: true }
    },
    {
      path: 'LogRecording',
      component: () => import('@/pages/employee/log'),
      name: '日志记录',
      meta: { title: '日志记录', noCache: true }
    }
  ]
}

export default employeeFileRouter

