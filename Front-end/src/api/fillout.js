import request from '@/utils/request'
import axios from 'axios'
const CancelToken = axios.CancelToken
let cancel

export function getStaffContentTable(data, fn) {
  return request({
    url: 'formIn/inquireByData',
    method: 'post',
    data,
    timeout: 0,
    cancelToken: new CancelToken(function executor(c) {
      // executor 函数接收一个 cancel 函数作为参数
      cancel = c
      // setTimeout(function(){
      //   console.log(65)
      //   cancel()
      // },10000)
    }),
    onDownloadProgress: (progress) => {
      fn && fn(progress, cancel)
    }
  })
}
export function getDrawerNumData(data) {
  return request({
    url: 'formIn/getNumData',
    method: 'post',
    data
  })
}
export function getGraphicData(data) {
  return request({
    url: 'formIn/getGraphicData',
    method: 'post',
    data
  })
}
export function getBrokenLineData(data) {
  return request({
    url: 'formIn/getBrokenLineData',
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

