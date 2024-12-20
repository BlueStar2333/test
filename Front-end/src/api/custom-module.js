import request from '@/utils/request'
// 添加普通自定义表
export function addCustomTable(data) {
  return request({
    url: 'diy/saveDiyForm',
    method: 'post',
    data
  })
}
// 修改普通自定义表
export function editCustomTable(data) {
  return request({
    url: 'diy/editDiyForm',
    method: 'post',
    data
  })
}
// 修改普通自定义表
export function changeCustomTable(data) {
  return request({
    url: 'diy/changeState',
    method: 'post',
    data
  })
}
// 修改普通自定义表填写人员
export function changePermissions(data) {
  return request({
    url: 'diy/changePermissions',
    method: 'post',
    data
  })
}
// 查询本医院普通自定义表
export function getCustomTable(data) {
  return request({
    url: 'diy/diyList',
    method: 'post',
    data
  })
}
// 删除普通自定义表
export function deleteCustomTable(data) {
  return request({
    url: 'diy/deleteDiyForm',
    method: 'post',
    data
  })
}
