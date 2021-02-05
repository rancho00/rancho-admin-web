import request from '@/utils/request'

export function getServerDatas() {
  return request({
    url: '/admin/actuator/info',
    method: 'get'
  })
}
