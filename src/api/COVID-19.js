import request from '@/utils/request'

export function getAll(data) {
  return request({
    url: 'GetXgdcall',
    method: 'post',
    data
  })
}
