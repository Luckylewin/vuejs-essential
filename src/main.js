// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './directives/index'
import './components/index'
import store from './store'
// 引入alert插件
import VueSweetalert2 from './plugins/vue-sweetalert2'
// 引入消息插件
import Message from './plugins/message'
// 引入 filter 过滤器
import './filters/index'
import { mockArticles } from './mock/data'
import ls from './utils/localStorage'
// 运行 mock/index.js
import './mock/index'
// 引入 axios的默认值
import axios from 'axios'

// 将 axios 添加到 Vue.prototype 上，使其在实例内部所有组件可以使用
Vue.prototype.$axios = axios

// 使用 alert 插件
Vue.use(VueSweetalert2)
// 使用 message 插件
Vue.use(Message)

Vue.config.productionTip = false

const AddMockData = (() => {
  // 是否加入测试数据
  const isAddMockData = true
  // 用户数据
  let userArticles = ls.getItem('articles')

  if (Array.isArray(userArticles)) {
    userArticles = userArticles.filter(article => parseInt(article.uid) === 1)
  } else {
    userArticles = []
  }

  if (isAddMockData) {
    // 合并用户数据和测试数据，使用合并值作为所有文章
    store.commit('UPDATE_ARTICLES', [...userArticles, ...mockArticles(60)])
  } else {
    // 使用用户数据作为所有文章
    store.commit('UPDATE_ARTICLES', userArticles)
  }
})()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})


