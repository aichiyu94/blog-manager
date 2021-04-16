import request from '@/util/request'
import colors from 'vuetify/es5/util/colors'

const randomColor = () => {
  const temp = Object.keys(colors)
  const key = temp[Math.floor(Math.random() * temp.length)]
  const color = colors[key].base
  return color
}

const state = {
  token: null,
  token_type: 'bearer',
  username: null,
  wxOpenId: null,
  avatar: null,
  userColor: '#2196f3',
  status: 'online'
}
const getters = {
  getToken: (state) => {
    return state.token
  },
  getAvatar: (state) => state.avatar,
  getUsername: (state) => state.username,
  getUserStatus: (state) => state.status
}
const actions = {
  login({ commit, dispatch }, { username, phone }) {
    return request({
      url: '/user/management',
      method: 'post',
      data: {
        username,
        phone
      }
    }).then((resp) => {
      commit('SET_LOGIN', resp.data)
      setInterval(() => {
        dispatch('refreshToken')
      }, (1000 * 60));

      dispatch('fetchProfile')
    })
  },
  refreshToken({ commit }) {
    return request({
      url: `/user/refreshToken`,
      method: 'get'
    }).then(r => {
      commit('SET_TOKEN', r.data)
    }).catch(c => {
      debugger
    })
  },
  register({ commit, dispatch }, data) {
    return request({
      url: '/auth/register',
      method: 'post',
      data: data
    }).then((resp) => {
      commit('SET_LOGIN', resp)
      dispatch('closeConnection')
      // if (!rootState.socket) {
      //   dispatch('initSocket')
      // }
      return resp
    })
  },
  logout({ commit, dispatch }) {
    commit('SET_TOKEN', null)
  },
  // get current login user info
  fetchProfile({ commit, dispatch, rootState }) {
    return request({
      url: 'user/me',
      method: 'post'
    }).then((resp) => {
      commit('SET_LOGIN_PROFILE', resp.data)
      if (!rootState.socket) {
        dispatch('initSocket')
      }
      return resp
    })
  }
}
const mutations = {
  SET_LOGIN(state, { token, avatar, loginName, wxOpenId }) {
    state.token = token
    state.username = loginName
    state.avatar = avatar
    state.wxOpenId = wxOpenId
    state.color = randomColor()
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  UPDATE_SELF_STATUS(state, status) {
    state.status = status
  },
  SET_LOGIN_PROFILE(state, payload) {
    state.username = payload.nickname
    state.avatar = payload.avatar
    state.color = randomColor()
  }
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}
