import request from '@/utils/request'

export function getServes(params) {
  return request({
    url: '/serve',
    method: 'get',
    params
  })
}

export function addServe(data) {
  return request({
    url: '/serve',
    method: 'post',
    data

  })
}

export function updateServe(id, data) {
  return request({
    url: `/serve/${id}`,
    method: 'put',
    data
  })
}

export function deleteServe(id) {
  return request({
    url: `/serve/${id}`,
    method: 'delete'
  })
}
