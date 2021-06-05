import request from '@/util/request'

const state = {
        propertyTypes: [{
                text: "数字",
                value: 'DIGITAL'
            },
            {
                text: "文字",
                value: 'STRING'
            },
            {
                text: "布尔",
                value: 'BOOLEAN'
            }
        ],
        whetherDefine: [
            { text: 'True', value: "1" },
            { text: 'False', value: "0" }
        ],
        propertyDefine: [],
        fundPropertyDefine: [],
        stockPropertyDefine: []
    }
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
    },
    fetchSysProperties({ commit }) {
        return request({
            url: `/common/getSysProperties`,
            method: 'get',
        }).then((resp) => {
            const { data } = resp;
            let properties = [];
            for (const p of data) {
                properties.push({ text: p.propertyName, value: p.propertyId, description: p.description })
            }
            commit('SET_PROPERTY_DEFINE', properties)
            return resp
        })
    },
    fetchFundProperties({ commit }) {
        return request({
            url: `/finance/fund/propertyList`,
            method: 'get',
        }).then((resp) => {
            const { data } = resp;
            let properties = [];
            for (const p of data) {
                properties.push({ text: p, value: p })
            }
            commit('SET_FUND_PROPERTY_DEFINE', properties)
            return resp
        })
    },
    fetchStockProperties({ commit }) {
        return request({
            url: `/finance/stock/propertyList`,
            method: 'get',
        }).then((resp) => {
            const { data } = resp;
            let properties = [];
            for (const p of data) {
                properties.push({ text: p, value: p })
            }
            commit('SET_STOCK_PROPERTY_DEFINE', properties)
            return resp
        })
    },
    getSysPropertyById({ commit }, propertyId) {
        return request({
            url: `/common/getSysPropertyById/${propertyId}`,
            method: 'get',
        })
    },
    fetchConfigurations() {
        return request({
            url: `/common/getConfigurations`,
            method: 'get',
        }).then((resp) => {
            return resp
        })
    },
    getConfigurationByName({ commit }, data) {
        return request({
            url: `/common/getConfigurationByName/${data.key}/${data.name}`,
            method: 'get',
        })
    },
    bulkModifySysProperties(data) {
        return request({
            url: `/common/bulkUpdateSysProperties`,
            method: 'put',
            data: data
        }).then((resp) => {
            return resp
        })
    },
    bulkDeleteSysProperties() {
        return request({
            url: `/common/bulkDeleteSysProperties`,
            method: 'delete',
        }).then((resp) => {
            return resp
        })
    },
    modifyProperty(context, sysProperty) {
        return request({
            url: `/common/modifyProperty`,
            method: 'put',
            data: sysProperty
        }).then((resp) => {
            return resp
        })
    },
    modifyConfiguration(context, configuration) {
        return request({
            url: `/common/modifyConfiguration`,
            method: 'put',
            data: configuration
        }).then((resp) => {
            return resp
        })
    },
}

// mutations
const mutations = {
    SET_PROPERTY_DEFINE: (state, propertyDefine) => {
        state.propertyDefine = propertyDefine
    },
    SET_FUND_PROPERTY_DEFINE: (state, fundProperty) => {
        state.fundPropertyDefine = fundProperty
    },
    SET_STOCK_PROPERTY_DEFINE: (state, stockProperty) => {
        state.stockPropertyDefine = stockProperty
    }
}

// getters
const getters = {
    PropertyTypes: (state) => state.propertyTypes,
    WhetherDefine: (state) => state.whetherDefine,
    PropertyDefine: (state) => state.propertyDefine,
    FundPropertyDefine: (state) => state.fundPropertyDefine,
    StockPropertyDefine: (state) => state.stockPropertyDefine
}


export default {
    namespace: true,
    state,
    getters,
    actions,
    mutations
}