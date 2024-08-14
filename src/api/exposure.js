import request from '@/utils/request'

export function getTemplateContentData(data) {
  return request({
    url: 'GetTemplateContentData',
    method: 'post',
    data
  })
}
export function addTemplateContentData(data) {
  return request({
    url: 'AddTemplateContentData',
    method: 'post',
    data
  })
}
export function getBloodFluidExposeData(data) {
  return request({
    url: 'GetBloodFluidExposeData',
    method: 'post',
    data
  })
}
export function getSharpsInjuryData(data) {
  return request({
    url: 'GetSharpsInjuryData',
    method: 'post',
    data
  })
}
export function editTemplateContentState(data) {
  return request({
    url: 'EditTemplateContentState',
    method: 'post',
    data
  })
}

export function editTemplateContentData(data) {
  return request({
    url: 'EditTemplateContentData',
    method: 'post',
    data
  })
}
export function delTemplateContentData(data) {
  return request({
    url: 'DelTemplateContentData',
    method: 'post',
    data
  })
}