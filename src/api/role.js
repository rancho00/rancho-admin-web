import request from '@/utils/request'

export function list() {
  return request({
    url: '/role',
    method: 'get'
  })
}

export function getRoleList() {
  return request({
    url: '/role/simpleList',
    method: 'get'
  })
}

export function save(data) {
  return request({
    url: '/role',
    method: 'post',
    data

  })
}

export function get(id) {
  return request({
    url: `/role/${id}`,
    method: 'get'
  })
}

export function update(id, data) {
  return request({
    url: `/role/${id}`,
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}
