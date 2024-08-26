import defaultSettings from '@/settings'

//设置页标题
const title = defaultSettings.title || '试剂柜管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
