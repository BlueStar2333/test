import request from '@/utils/Orequest'

export function getRoutes() {
  return request({
    url: process.env.VUE_APP_BASE_API+'/reagentcabinetmanagement/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: process.env.VUE_APP_BASE_API+'/reagentcabinetmanagement/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: process.env.VUE_APP_BASE_API+'/reagentcabinetmanagement/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/reagentcabinetmanagement/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/reagentcabinetmanagement/role/${id}`,
    method: 'delete'
  })
}
