import request from '@/utils/request'

export function getRoles() {
  return request({
    url: '/role',
    method: 'get'
  })
}

export function getAllRoles() {
  return request({
    url: '/role/simpleList',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data

  })
}

export function getRoleMenus(id) {
  return request({
    url: `/role/${id}/menu`,
    method: 'get'
  })
}

export function updateRole(id, data) {
  return request({
    url: `/role/${id}`,
    method: 'put',
    data
  })
}

export function updateRoleMenu(id, data) {
  return request({
    url: `/role/${id}/menu`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}
