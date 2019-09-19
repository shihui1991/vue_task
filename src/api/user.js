import request from '@/utils/request'

let prexUri = '/api';

export function login(data,params) {
  return request({
    url: prexUri + '/login',
    method: 'post',
    data:data,
    params:params,
  })
}

export function logout(data,params) {
  return request({
    url: prexUri + '/login/logout',
    method: data ? 'post' : 'get',
    data:data,
    params:params,
  })
}


export function getList(data) {
  return request({
    url: prexUri + '/user',
    method: data ? 'post' : 'get',
    data:data,
  })
}

export function getInfo(id) {
  return request({
    url: prexUri + '/user/info',
    method: 'get',
    params:{id:id},
  })
}

export function store(data,params) {
  return request({
    url: prexUri + '/user/store',
    method: 'post',
    data:data,
    params:params,
  })
}

export function del(data,params) {
  return request({
    url: prexUri + '/user/del',
    method: data ? 'post' : 'get',
    data:data,
    params:params,
  })
}

export function updateUserRole(data,params) {
  return request({
    url: prexUri + '/user/role',
    method: data ? 'post' : 'get',
    data:data,
    params:params,
  })
}