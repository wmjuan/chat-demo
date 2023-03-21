import request from '@/utils/request'
import API from '../contants/api'
// 创建会话
export function createSession(data) {
  return request({
    url: '/conversations',
    method: 'post',
    data
  })
}
// 会话列表
export function sessionList() {
  return request({
    url: '/conversations',
    method: 'get'
  })
}
// 查询会话下所有消息
export function history(id) {
  return request({
    url: '/messages',
    method: 'get',
    params: {
      conversation_id: id
    }
  })
}

// 发送问题
// export function send(data) {
//   return request({
//     url: '/messages',
//     method: 'post',
//     data
//   })
// }

export function send(params) {
  return request({
    url: '/messages/stream',
    method: 'get',
    params: {
      conversation_id: params.conversation_id,
      user_content: params.user_content
    }
  })
}

// 修改会话
export const updataChat = ({ id, data }) => request({
  url: API.UPDATA_API.replace('{id}', id),
  method: 'put',
  data
})

// 删除会话
export const deleteSession = id => request({
  url: API.DELETE_API.replace('{id}', id),
  method: 'delete'
})
// 查询会话详情
export const checkSession = id => request({
  url: API.CHECK_API.replace('{id}', id),
  method: 'get'
})

