import request from '@/utils/request'

export function getLogs() {
  return request({
    url: '/actuator/log',
    method: 'get'
  })
}

