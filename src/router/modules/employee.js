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
      component: () => import('@/pages/employee'),
      name: '人员管理',
      meta: { title: '人员管理', noCache: true }
    }
  ]
}

export default employeeFileRouter

