import request from '@/utils/request'

export function getStaffContentTable(data) {
  return request({
    url: 'GetStaffContentTable',
    method: 'post',
    data
  })
}
