import request from '@/utils/request'

export function addUserInfo(data) {
  return request({
    url: 'AddUserInfo',
    method: 'post',
    data
  })
}

export function getUserinfoByName(data) {
  return request({
    url: 'GetUserinfoByName',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: 'UpdateUserinfo',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: 'DeleteUserinfo',
    method: 'post',
    data
  })
}
