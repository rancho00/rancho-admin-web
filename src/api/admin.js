import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data: data
  })
}

export function getInfo() {
  return request({
    url: '/admin/info',
    method: 'get'
  })
}

export function getRoutes() {
  return request({
    url: '/admin/route',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

export function getAdmins(params) {
  return request({
    url: '/admin',
    method: 'get',
    params
  })
}

export function addAdmin(data) {
  return request({
    url: '/admin',
    method: 'post',
    data: data
  })
}

export function getAdmin(id) {
  return request({
    url: `/admin/${id}`,
    method: 'get'
  })
}

export function updateAdmin(id, data) {
  return request({
    url: `/admin/${id}`,
    method: 'put',
    data
  })
}

export function updateAdminStatus(id, params) {
  return request({
    url: `/admin/${id}/status`,
    method: 'put',
    params
  })
}

export function download(params) {
  return request({
    url: '/admin/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
