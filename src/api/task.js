import request from '@/utils/request'

let prexUri = '/api';

export function getToday() {
  return request({
    url: prexUri + '/task/today',
    method: 'get',
  })
}

export function getMine(data,params) {
  return request({
    url: prexUri + '/task/mine',
    method: data ? 'post' : 'get',
    data:data,
    params:params,
  })
}

export function store(data,params) {
  return request({
    url: prexUri + '/task/store',
    method: 'post',
    data:data,
    params:params,
  })
}

export function getInfo(id) {
  return request({
    url: prexUri + '/task/info',
    method: 'get',
    params:{id:id}
  })
}