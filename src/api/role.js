import request from '@/utils/request'

export function pageInfo() {
  return request({
    url: '/role/pageInfo',
    method: 'get'
  })
}

export function list() {
  return request({
    url: '/role/list',
    method: 'get'
  })
}

export function save(data) {
  return request({
    url: '/role/save',
    method: 'post',
    data:
      {
        name: data.name,
        description: data.description,
        status: data.status,
        smsMenuList: data.menuListData
      }

  })
}

export function getById(id) {
  return request({
    url: `/role/${id}/getById`,
    method: 'get'
  })
}

export function update(id,data) {
  return request({
    url: '/role/${id}/update',
    method: 'put',
    data:
      {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status,
        smsMenuList: data.menuListData
      }
  })
}

export function del(id) {
  return request({
    url: `/role/${id}/delete`,
    method: 'delete'
  })
}
