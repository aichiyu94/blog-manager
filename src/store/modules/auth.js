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
            dispatch('fetchProfile')
        })
    },
    logout({ commit, dispatch }) {
        return request({
            url: '/user/logoutManagement',
            method: 'get'
        }).then((resp) => {
            commit('SET_TOKEN', null)
        })
    },
    refreshToken({ commit, dispatch }) {
        return request({
            url: `/user/refreshToken`,
            method: 'get'
        }).then(r => {
            commit('SET_TOKEN', r.data)
            setTimeout(() => {
                dispatch('refreshToken')
            }, (1000 * 60) * 59)
        }).catch(c => {
            //refresh failed redirect to login page
            dispatch('logout')
            window.location.reload();
        })
    },
    // get current login user info
    fetchProfile({ commit, dispatch, rootState }) {
        return request({
            url: 'user/me',
            method: 'get'
        }).then((resp) => {
            commit('SET_LOGIN_PROFILE', resp.data)
            dispatch('refreshToken')
            if (!rootState.socket) {
                // dispatch('initSocket')
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