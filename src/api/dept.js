import request from '@/utils/request'

export function getDept(data) {
  return request({
    url: 'GetXGDicDeptall',
    method: 'post',
    data
  })
}

export function getDeptByName(data) {
  return request({
    url: 'GetXGDicDeptbyName',
    method: 'post',
    data
  })
}

export function AddDept(data) {
  return request({
    url: 'AddXGDicDept',
    method: 'post',
    data
  })
}

export function UpdateDept(data) {
  return request({
    url: 'EditXGDicDept',
    method: 'post',
    data
  })
}

export function DeleteDept(data) {
  return request({
    url: 'DeleteXGDicDept',
    method: 'post',
    data
  })
}