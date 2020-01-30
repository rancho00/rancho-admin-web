import request from '@/utils/request'

export function list() {
  return request({
    url: '/menu/list',
    method: 'get'
  })
}
