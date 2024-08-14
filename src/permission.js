import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']
//路由守卫，在创建路由之前执行
router.beforeEach(async(to, from, next) => {
  NProgress.start()

  //设置页面标题
  document.title = getPageTitle(to.meta.title)

  const hasToken = getToken()
  const hasUser = store.state.user.userInfo.Number

  // console.log("******hastoken");
  // console.log(hasToken,hasUser,25);

  if (hasToken && hasUser) {
    if (to.path === '/login') {
      // 如果登录 跳转到家目录
      next({ path: '/' })
      NProgress.done()
    } else {
      //获取权限
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          const { roles } = await store.dispatch('user/getInfo')
          // console.log("******roles",5656);
          // console.log(roles)

          // 生成角色路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 添加路由
          router.addRoutes(accessRoutes)

          next({ ...to, replace: true })
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    /*没有token的*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在白名单里面的，直接跳转
      next()
    } else {
      //其他没有访问权限的页面被重定向到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
