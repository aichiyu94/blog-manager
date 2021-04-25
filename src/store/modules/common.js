import request from '@/util/request'

const state = {}

// getters
const getters = {}

// actions
const actions = {
  uploadCoverImage(context, data) {
    var form = new FormData();
    form.append('file', data.file);
    form.append('resourceId', data.resourceId);
    return request({
      url: `/common/uploadImage/cover`,
      method: 'post',
      data: form
    }).then((resp) => {
      return resp
    })
  },
  uploadArticleImage(context, file) {
    var form = new FormData();
    form.append('file', file);
    return request({
      url: `/common/uploadImage/article`,
      method: 'post',
      data: form
    }).then((resp) => {
      return resp
    })
  },
  uploadBannerImage(context, data) {
    var form = new FormData();
    form.append('file', data.file);
    form.append('resourceId', data.resourceId);
    return request({
      url: `/common/uploadImage/banner`,
      method: 'post',
      data: form
    }).then((resp) => {
      return resp
    })
  },
  deleteImage(context, data) {
    return request({
      url: `/common/image`,
      method: 'delete',
      data: data
    }).then((resp) => {
      return resp
    })
  },
  refreshBlogSettings() {
    return request({
      url: `/common/reloadSysConfig`,
      method: 'get',
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
