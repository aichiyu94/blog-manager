import Vue from 'vue'
import router from './router/'
import store from './store/'
import './registerServiceWorker'
import './plugins/vuetify'
import './theme/default.sass'

import App from './App.vue'
import vuetify from './plugins/vuetify'
import '@mdi/font/css/materialdesignicons.css'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// use
Vue.use(mavonEditor)
Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
})
Vue.prototype.t = (key, ...parrams) => {
  return app.$vuetify.lang.translator(key, ...parrams)
}

app.$mount('#app')
