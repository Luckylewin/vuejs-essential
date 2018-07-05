import Vue from 'vue'
import Vuex from 'vuex'
import ls from '../utils/localStorage'
import router from '../router'
// 引入 actions.js 的所有导出
import * as moreActions from './actions'
import * as moreGetters from './getters'

Vue.use(Vuex)

const state = {
    user: ls.getItem('user'),
    auth: ls.getItem('auth'), // 添加 auth 来保存当前用户的登录状态
    articles: ls.getItem('articles') // 所有文章状态
}

const mutations = {
    
    UPDATE_USER(state, user) {
        state.user = user
        ls.setItem('user', user)
    },

    UPDATE_AUTH(state, auth) {
        state.auth = auth
        ls.setItem('auth', auth)
    },

    // 更改所有文章的事件类型
    UPDATE_ARTICLES(state, article) {
        state.article = article
        ls.setItem('articles', article)
    }

}

const actions = {
    login(context, user) {
        if (user) context.commit('UPDATE_USER', user)
        // 更新当前用户的登录状态为已登录
        context.commit('UPDATE_AUTH', true)
        router.push('/')
    },
    logout(context) {
        context.commit('UPDATE_AUTH', false)
        router.push({ name: 'Home', params: { logout: true}})
    },
    // 更新个人信息
    updateUser(context, user) {
        const stateUser = context.state.user
        
        if (stateUser && typeof stateUser === 'object') {
            user = { ...stateUser, ...user }
            // 相当于合并新旧信息 
            // user = Object.assign({}, stateUser, user)
        }
     
        //更新个人信息
        context.commit('UPDATE_USER', user)
    },    
    // 使用对象展开运算符混入 moreActions
    ...moreActions
}

// 添加 getters 
const getters = {
    // 第一参数是 state，因为要传 id， 所以这里返回一个函数
    getArticleById: (state, getters) => (id) => {
        
        // 从仓库获取所有文章
        // let articles = state.articles

        // 使用派生状态 computedArticles 作为所有文章
        let articles = getters.computedArticles
    
        // 所有文章是一个数组时
        if (Array.isArray(articles)) {
            // 传进来的 id 和 文章的 articleId相同时，返回这些文章
            articles = articles.filter(article =>  parseInt(id)===parseInt(article.articleId))
            // 根据文章长度，返回文章或者null
            return articles.length ? articles[0] : null
        } else {
            return null
        }
    },
     // 混入 moreGetters, 你可以理解为 getters = Object.assign(getters, moreGetters)
    ...moreGetters
}

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters    // 注册 getter
})

export default store