import request from '@/util/request'

const state = {
    Users: []
}

// getters
const getters = {
    Users: (state) => state.Users
}

// actions
const actions = {
    fetchUser({ commit }, query) {
        return request({
            url: `/user/users`,
            method: 'post',
            data: query
        }).then((rep) => {
            const { data } = rep
            let users = [];
            for (const u of data.data) {
                users.push({ text: u.nickname, value: u.wxOpenId })
            }
            commit('SET_USERS', users)
            return rep
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
    },
    updateUser(context, data) {
        return request({
            url: `/user/modify`,
            method: 'put',
            data: data
        }).then((resp) => {
            return resp
        })
    }
}

// mutations
const mutations = {
    SET_USERS: (state, users) => {
        state.Users = users
    }
}

export default {
    namespace: true,
    state,
    getters,
    actions,
    mutations
}