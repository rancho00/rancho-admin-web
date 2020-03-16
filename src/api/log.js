import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/log',
    method: 'get',
    params
  })
}

export function get(id) {
  return request({
    url: `/log/${id}`,
    method: 'get'
  })
}
