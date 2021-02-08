import request from '@/utils/request'

export function getDeploys(params) {
  return request({
    url: '/deploy',
    method: 'get',
    params
  })
}

export function addDeploy(data) {
  return request({
    url: '/deploy',
    method: 'post',
    data

  })
}

export function getDeploy(id) {
  return request({
    url: `/deploy/${id}`,
    method: 'get'
  })
}

export function updateDeploy(id,data) {
  return request({
    url: `/deploy/${id}`,
    method: 'put',
    data
  })
}

export function deleteDeploy(id) {
  return request({
    url: `/deploy/${id}`,
    method: 'delete'
  })
}

export function getServers() {
  return request({
    url: '/deploy/server',
    method: 'get'
  })
}

export function getServes() {
  return request({
    url: '/deploy/serve',
    method: 'get'
  })
}

export function getDeployHistorys(id,params) {
  return request({
    url: `/deploy/${id}/history`,
    method: 'get',
    params
  })
}

export function restore(historyId) {
  return request({
    url: `/deploy/restore?historyId=` + historyId,
    method: 'post'
  })
}

export function startServer(id) {
  return request({
    url: `/deploy/${id}/startServer`,
    method: 'post'
  })
}

export function stopServer(id) {
  return request({
    url: `/deploy/${id}/stopServer`,
    method: 'post'
  })
}

export function serverStatus(id) {
  return request({
    url: `/deploy/${id}/serverStatus`,
    method: 'post'
  })
}
