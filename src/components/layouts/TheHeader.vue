<template>
    <div class="navbar navbar-default topnav">
        <div class="container">
            <button type="button" class="navbar-toggle" @click="toggleNav">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <div class="navbar-header">
                <a href="/" class="navbar-brand">
                   <span class="title">
                       {{ logo.title }}    
                   </span>
                   <img :src="logo.src" :alt="logo.title">
                </a>
            </div>

            <div id="top-navbar-collapse" :class="['collapse', 'navbar-collapse', { in: showCollapseNav }]">
                <ul class="nav navbar-nav">
                    <li v-for="(item, index) in navList" :class="{ active: index === activeNavIndex }">
                        <a href="#" @click="changeNavIndex(index)">{{ item }}</a>    
                    </li>       
                </ul>
            </div>    

        </div>
    </div>
</template>

<script>
export default {
    name: 'TheHeader',
    data() {
        return {
            logo: {
                src: `${this.uploaderUrl}sites/ByvFbNlQYVwhvTyBgLdqitchoacDNznN.jpg`,
                title: 'VuejsCaff'
            },
            navList: ['社区', '头条', '问答', '教程'],
            activeNavIndex: 0,
            showCollapseNav: false

        }
    },
    beforeCreate() {
        this.uploaderUrl = 'https://vuejscaffcdn.phphub.org/uploads/';
    },
    methods: {
        changeNavIndex(index) {
            this.activeNavIndex = index
        },
        toggleNav() {
            this.showCollapseNav = !this.showCollapseNav
        }
    }
}
</script>

<style lang="scss" scoped>
.title { display: none;} 
.navbar-default .navbar-nav > .active > a { background: rgba(0,0,0,.03);}
</style>