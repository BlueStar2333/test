import Orequest from '@/utils/Orequest'
import request from '@/utils/request'

export function sendCode(data) {
  return request({
    url: 'admin/sendCode',
    method: 'post',
    data
  })
}
export function submitup(data) {
  return request({
    url: 'admin/submitup',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: 'admin/login',
    method: 'post',
    data
  })
}

export function Ologin(data) {
  return Orequest({
    url: process.env.VUE_APP_BASE_API + '/reagentcabinetmanagement/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return Orequest({
    url: process.env.VUE_APP_BASE_API + '/reagentcabinetmanagement/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return Orequest({
    url: process.env.VUE_APP_BASE_API + '/reagentcabinetmanagement/user/logout',
    method: 'post'
  })
}
