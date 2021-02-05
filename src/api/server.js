import request from '@/utils/request'

export function getServers(params) {
  return request({
    url: '/server',
    method: 'get',
    params
  })
}

export function addServer(data) {
  return request({
    url: '/server',
    method: 'post',
    data

  })
}

export function updateServer(id, data) {
  return request({
    url: `/server/${id}`,
    method: 'put',
    data
  })
}

export function deleteServer(id) {
  return request({
    url: `/server/${id}`,
    method: 'delete'
  })
}

export function connectServer(data) {
  return request({
    url: '/server/connect',
    method: 'post',
    data

  })
}
