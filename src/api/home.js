import request from '@/utils/request'

export function getLoginLog() {
  return request({
    url: 'LoginLog/GetLoginLog',
    method: 'post'
  })
}

export function getTrainingNum(data) {
  return request({
    url: 'LearnTask/GetLearnTaskbyTrainees',
    method: 'post',
    data
  })
}

export function getLearnTaskcountYue1(data) {
  return request({
    url: 'LearnTask/GetLearnTaskcountYue1',
    method: 'post',
    data
  })
}

export function getLearnTaskSumTrainees1() {
  return request({
    url: 'LearnTask/GetLearnTaskSumTrainees1',
    method: 'post'
  })
}

export function getLearnTaskcountYue3(data) {
  return request({
    url: 'LearnTask/GetLearnTaskcountYue3',
    method: 'post',
    data
  })
}

export function getLearnTaskbyTraineesAll(data) {
  return request({
    url: 'LearnTask/GetLearnTaskbyTraineesAll',
    method: 'post',
    data
  })
}

export function getTaskDetailsbyName(data) {
  return request({
    url: 'TaskDetails/GetTaskDetailsbyName',
    method: 'post',
    data
  })
}

export function getHomeCount(data) {
  return request({
    url: 'GetHomeCount',
    method: 'post',
    data
  })
}

export function getMessageData(data) {
  return request({
    url: 'GetMessageData',
    method: 'post',
    data
  })
}

export function getLineChartData(data) {
  return request({
    url: 'GetLineChartData',
    method: 'post',
    data
  })
}

