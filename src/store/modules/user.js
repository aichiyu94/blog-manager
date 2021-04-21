import request from '@/util/request'

const state = {}

// getters
const getters = {}

// actions
const actions = {
  fetchUser(context, query) {
    return request({
      url: `/user/users`,
      method: 'post',
      data: query
    })
  },
  getUserById(context, data) {
    return request({
      url: `/user/GetUserById`,
      method: 'post',
      data: data
    }).then((resp) => {
      return resp
    })
  }
}

// mutations
const mutations = {}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}
