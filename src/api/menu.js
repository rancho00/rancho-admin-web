import request from '@/utils/request'

export function getHierarchyList(params) {
  return request({
    url: '/menu/hierarchyList',
    method: 'get',
    params
  })
}

export function list(params) {
  return request({
    url: '/menu',
    method: 'get',
    params
  })
}

export function save(data) {
  return request({
    url: '/menu',
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: `/menu/${id}`,
    method: 'get'
  })
}

export function update(id, data) {
  return request({
    url: `/menu/${id}`,
    method: 'put',
    data
  })
}

export function updateStatus(id, params) {
  return request({
    url: `/menu/${id}/status`,
    method: 'put',
    params
  })
}

export function del(id) {
  return request({
    url: `/menu/${id}`,
    method: 'delete'
  })
}
