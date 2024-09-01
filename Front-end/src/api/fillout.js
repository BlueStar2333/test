import request from '@/utils/request'

export function getStaffContentTable(data) {
  return request({
    url: 'formIn/inquireByData',
    method: 'post',
    data
  })
}
export function getDrawerNumData(data) {
  return request({
    url: 'formIn/getNumData',
    method: 'post',
    data
  })
}

export function deleteContentTable(data) {
  return request({
    url: 'formIn/deleteData',
    method: 'post',
    data
  })
}

export function addContentTable(data) {
  return request({
    url: 'formIn/addData',
    method: 'post',
    data
  })
}

export function editContentTable(data) {
  return request({
    url: 'formIn/editData',
    method: 'post',
    data
  })
}

