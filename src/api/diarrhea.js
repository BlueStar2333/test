import request from '@/utils/request'

export function getDiarrheaSurveyData(data) {
  return request({
    url: 'GetDiarrheaSurveyData',
    method: 'post',
    data
  })
}
