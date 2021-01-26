import request from '@/utils/request'

export function getTreeMenus(params) {
  return request({
    url: '/menu/treeMenus',
    method: 'get',
    params
  })
}

export function addMenu(data) {
  return request({
    url: '/menu',
    method: 'post',
    data
  })
}

export function getMenu(id) {
  return request({
    url: `/menu/${id}`,
    method: 'get'
  })
}

export function updateMenu(id, data) {
  return request({
    url: `/menu/${id}`,
    method: 'put',
    data
  })
}


export function deleteMenu(id) {
  return request({
    url: `/menu/${id}`,
    method: 'delete'
  })
}
