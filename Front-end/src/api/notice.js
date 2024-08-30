import request from '@/utils/request'

export function getNoticeList() {
  return request({
    url: 'notice/noticeList',
    method: 'post'
  })
}

export function addNotice(data) {
  return request({
    url: 'notice/publishNotice',
    method: 'post',
    data
  })
}

export function deleteNotice(data) {
  return request({
    url: 'notice/deleteNotice',
    method: 'post',
    data
  })
}
