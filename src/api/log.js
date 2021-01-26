import request from '@/utils/request'

export function getLogs(params) {
  return request({
    url: '/log',
    method: 'get',
    params
  })
}

export function getLog(id) {
  return request({
    url: `/log/${id}`,
    method: 'get'
  })
}
