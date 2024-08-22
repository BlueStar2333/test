import request from '@/utils/request'
// 添加普通自定义表
export function addCustomTable(data) {
  return request({
    url: 'AddCustomTable',
    method: 'post',
    data
  })
}
// 修改普通自定义表
export function editCustomTable(data) {
  return request({
    url: 'EditCustomTable',
    method: 'post',
    data
  })
}
// 删除普通自定义表
export function deleteCustomTable(data) {
  return request({
    url: 'DeleteCustomTable',
    method: 'post',
    data
  })
}
// 查询本医院普通自定义表
export function getCustomTablebydiyName(data) {
  return request({
    url: 'diy/diyList',
    method: 'get',
    data
  })
}
// 查询全部自定义表
// export function getCustomTableContent() {
//   return request({
//     url: 'GetCustomTableContent',
//     method: 'post'
//   })
// }

// 添加流程自定义表
export function addZCustomerTableData(data) {
  return request({
    url: 'AddZCustomerTableData',
    method: 'post',
    data
  })
}
// 修改流程自定义表
export function updateZCustomerTableData(data) {
  return request({
    url: 'UpdateZCustomerTableData',
    method: 'post',
    data
  })
}
// 删除流程自定义表
export function deleteZCustomerTableData(data) {
  return request({
    url: 'DeleteZCustomerTableData',
    method: 'post',
    data
  })
}
// 查询本医院流程自定义表
export function getZCustomerTableData(data) {
  return request({
    url: 'GetZCustomerTableData',
    method: 'post',
    data
  })
}
