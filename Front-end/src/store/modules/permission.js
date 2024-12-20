import { asyncRoutes, constantRoutes } from '@/router'
import store from '../'

/**
 * 使用meta。确定当前用户是否具有权限
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    console.log(663)
    return true
  }
}

/**
 * 通过递归过滤异步路由表
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    console.log(tmp, 888)
    if (roles.includes(tmp.name)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      console.log(accessedRoutes,896)
      // switch (store.state.user.userInfo.power) {
      //   case 0:
      //     accessedRoutes.splice(2, 1)
      //     break
      //   case 1:
      //     accessedRoutes.splice(1, 1)
      //     // accessedRoutes.splice(3, 1)
      //     break
      // }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
