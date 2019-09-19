import request from '@/utils/request'

let prexUri = '/api';

export function getList(data) {
  return request({
    url: prexUri + '/jobRate',
    method: data ? 'post' : 'get',
    data:data
  })
}

export function store(data,params) {
  return request({
    url: prexUri + '/jobRate/store',
    method: 'post',
    data:data,
    params:params,
  })
}
