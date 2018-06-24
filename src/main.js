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

// 使用 alert 插件
Vue.use(VueSweetalert2)
// 使用 message 插件
Vue.use(Message)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
