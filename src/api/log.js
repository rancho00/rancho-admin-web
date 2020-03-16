import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/log',
    method: 'get',
    params
  })
}
