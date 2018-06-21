import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  linkExactActiveClass: 'active',
  routes
})

//全局前置守卫
router.beforeEach((to, from, next) => {
    const app = router.app
    const store = app.$options.store
    const auth = store.state.auth
    const articleId = to.params.articleId // 获取目标页面路由参数里的 articleId

    app.$message.hide()
   
    if (auth && to.path.indexOf('/auth/') !== -1 ||
       (!auth && to.meta.auth) ||
       (articleId && !store.getters.getArticleById(articleId)) // 有文章 articleId 且不能找到对应的文章时，跳转到首页
    ) {
       next('/')
    } else {
       next()
    }
})

router.afterEach((to, from) => {
  const app = router.app
  const store = app.$options.store
  const showMsg = to.params.showMsg

  if (showMsg) {
    if (typeof showMsg === 'string') {
      app.$message.show(showMsg)
    } else {
      app.$message.show('操作成功')
    }
  }

})

export default router