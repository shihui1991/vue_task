import request from '@/utils/request'

let prexUri = '/api';

export function getMine(data,params) {
  return request({
    url: prexUri + '/taskReply/mine',
    method: data ? 'post' : 'get',
    data:data,
    params:params,
  })
}

export function markRead(data,params) {
  return request({
    url: prexUri + '/taskReply/read',
    method: data ? 'post' : 'get',
    data:data,
    params:params,
  })
}

export function getTaskReply(taskId) {
  return request({
    url: prexUri + '/taskReply/task',
    method: 'get',
    params:{task_id : taskId},
  })
}

export function store(data,params) {
  return request({
    url: prexUri + '/taskReply/store',
    method: 'post',
    data:data,
    params:params,
  })
}

export function del(data,params) {
  return request({
    url: prexUri + '/taskReply/del',
    method: data ? 'post' : 'get',
    data:data,
    params:params,
  })
}