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

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

export function list(params) {
  return request({
    url: '/admin',
    method: 'get',
    params
  })
}

export function save(data) {
  return request({
    url: '/admin',
    method: 'post',
    data: data
  })
}

export function getById(id) {
  return request({
    url: `/admin/${id}`,
    method: 'get'
  })
}

export function update(id, data) {
  return request({
    url: `/admin/${id}`,
    method: 'put',
    data
  })
}

export function updateStatus(id, params) {
  return request({
    url: `/admin/${id}/status`,
    method: 'put',
    params
  })
}
