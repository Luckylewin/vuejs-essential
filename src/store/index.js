import Vue from 'vue'
import Vuex from 'vuex'
import ls from '../utils/localStorage'
import router from '../router'
// 引入 actions.js 的所有导出
import * as moreActions from './actions'

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

const store = new Vuex.Store({
    state,
    mutations,
    actions
})

export default store