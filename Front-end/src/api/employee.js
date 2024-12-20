import request from '@/utils/request'


export function getUserinfoByName(data) {
  return request({
    url: 'user/userList',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: 'user/editInfo',
    method: 'post',
    data
  })
}

export function addUserInfo(data) {
  return request({
    url: 'admin/register',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: 'user/deleteUser',
    method: 'post',
    data
  })
}

export function getLogByData(data) {
  return request({
    url: 'log/searchByData',
    method: 'post',
    data
  })
}
