import request from '@/utils/request'

let prexUri = '/api';

export function getList(data) {
  return request({
    url: prexUri + '/partment',
    method: data ? 'post' : 'get',
    data:data,
  })
}

export function getInfo(id) {
  return request({
    url: prexUri + '/partment/info',
    method: 'get',
    params:{id:id},
  })
}

export function store(data,params) {
  return request({
    url: prexUri + '/partment/store',
    method: 'post',
    data:data,
    params:params,
  })
}

export function del(data,params) {
  return request({
    url: prexUri + '/partment/del',
    method: data ? 'post' : 'get',
    data:data,
    params:params,
  })
}