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

export function pageInfo(params) {
  return request({
    url: '/admin/pageInfo',
    method: 'get',
    params
  })
}

export function save(data) {
  return request({
    url: '/admin/save',
    method: 'post',
    data: data
  })
}

export function getById(id) {
  return request({
    url: `/admin/${id}/getById`,
    method: 'get'
  })
}

export function update(id, data) {
  return request({
    url: `/admin/${id}/update`,
    method: 'put',
    data
  })
}

export function updateStatus(id, status) {
  return request({
    url: `/admin/${id}/updateStatus/${status}`,
    method: 'put'
  })
}
