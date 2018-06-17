import Vue from 'vue'
import Vuex from 'vuex'
import ls from '../utils/localStorage'
import router from '../router'

Vue.use(Vuex)

const state = {
    user: ls.getItem('user'),
    auth: ls.getItem('auth') // 添加 auth 来保存当前用户的登录状态
}

const mutations = {
    
    UPDATE_USER(state, user) {
        state.user = user
        ls.setItem('user', user)
    },

    UPDATE_AUTH(state, auth) {
        state.auth = auth
        ls.setItem('auth', auth)
    }

}

const actions = {
    login(context, user) {
        if (user) context.commit('UPDATE_USER', user)
        // 更新当前用户的登录状态为已登录
        context.commit('UPDATE_AUTH', true)
        router.push('/')
    }
}

const store = new Vuex.Store({
    state,
    mutations,
    actions
})

export default store