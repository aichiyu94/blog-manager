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
      url: `/blog/article/save`,
      method: 'post',
      data: data
    }).then((resp) => {
      return resp
    })
  },
  delArticle(context, data) {
    return request({
      url: `/blog/article/del`,
      method: 'post',
      data: data
    }).then((resp) => {
      return resp
    })
  },
  uploadImage(context, data) {
    var form = new FormData();
    form.append('file', data.file);
    form.append('resourceId', data.resourceId);
    return request({
      url: `/blog/uploadImage`,
      method: 'post',
      data: form
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
