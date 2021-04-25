import request from '@/util/request'

const state = {
  resourceId: null
}

// getters
const getters = {
  getEditedId: (state) => { return state.resourceId }
}

// actions
const actions = {
  fetchArticles(context, pagination) {
    return request({
      url: `/blog/articleList`,
      method: 'post',
      data: pagination
    })
  },
  getArticleById({ commit }, data) {
    return request({
      url: `/blog/article`,
      method: 'post',
      data: data
    }).then((resp) => {
      return resp
    })
  },
  updateArticle(context, data) {
    return request({
      url: `/blog/article`,
      method: 'put',
      data: data
    }).then((resp) => {
      return resp
    })
  },
  delArticle(context, data) {
    return request({
      url: `/blog/article`,
      method: 'delete',
      data: data
    }).then((resp) => {
      return resp
    })
  },
  updateBanner(context, data){
    return request({
      url: `/blog/banner`,
      method: 'put',
      data: data
    }).then((resp) => {
      return resp
    })
  },
  deleteBanner(context, data){
    return request({
      url: `/blog/banner`,
      method: 'delete',
      data: data
    }).then((resp) => {
      return resp
    })
  }
}

// mutations
const mutations = {
  SET_RESOURCE_ID(state, resourceId) {
    state.resourceId = resourceId
  }
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}
