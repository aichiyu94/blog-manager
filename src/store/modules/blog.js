import request from '@/util/request'

const state = {}

// getters
const getters = {}

// actions
const actions = {
  fetchArticles(context, pagination) {
    return request({
      url: `/blog/articleList`,
      method: 'post',
      data: pagination
    })
  },
  getArticleById(context, data) {
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
const mutations = {}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}
