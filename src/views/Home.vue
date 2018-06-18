<template>
    <div>
        <Message :show.sync="msgShow" :type="msgType" :msg="msgText"/>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            msgText: '',
            msgType: '',
            msgShow: false 
        }
    },
    // 组件内的路由导航守卫
    beforeRouteEnter(to, from, next) {
        // 路由的名称， 对应路由配置中的 name
        const fromName = from.name
        // 获取 logout 参数
        const logout = to.params.logout
        // 确认导航
        next(vm => {
            // 通过 vm 参数访问组件实例，已登录时，评估路由名称
            if (vm.$store.state.auth) {
                console.log(fromName)
                switch (fromName) {
                    // 显示注册成功
                    case 'Register':
                    vm.showMsg('注册成功')
                    break
                }    
            } else if (logout) {
                // logout 返回 true 的时候，显示操作成功
                vm.showMsg('操作成功')
            }
        });
    },
    computed: {
        auth() {
            return this.$store.state.auth
        }
    },
    watch: {
        // 
        auth(value) {
            if (value === false) {
                this.showMsg('操作成功')
            }
        }
    },
    methods: {
        showMsg(msg, type = 'success') {
            this.msgText = msg
            this.msgType = type
            this.msgShow = true 
        }
    }
}
</script>
