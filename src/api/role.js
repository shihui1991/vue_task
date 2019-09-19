import request from '@/utils/request'

let prexUri = '/api';

export function getList(data) {
  return request({
    url: prexUri + '/role',
    method: data ? 'post' : 'get',
    data:data
  })
}

export function getInfo(id) {
  return request({
    url: prexUri + '/role/info',
    method: 'get',
    params:{id:id}
  })
}

export function store(data,params) {
  return request({
    url: prexUri + '/role/store',
    method: 'post',
    data:data,
    params:params,
  })
}

export function del(data,params) {
  return request({
    url: prexUri + '/role/del',
    method: data ? 'post' : 'get',
    data:data,
    params:params,
  })
}

export function updateRoleMenu(data,params) {
  return request({
    url: prexUri + '/role/menu',
    method: data ? 'post' : 'get',
    data:data,
    params:params,
  })
}