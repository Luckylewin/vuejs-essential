<template>
    <div>
        <Message :show.sync="msgShow" :type="msgType" :msg="msgText"/>
        <!-- 帖子列表 -->
<div class="col-md-9 topics-index main-col">
  <div class="panel panel-default">
    <div class="panel-heading">
      <ul class="list-inline topic-filter">
        <li v-for="item in filters">
            <router-link v-title="item.title" :class="{ active: filter === item.filter }" :to="`/topics?filter=${item.filter}`">{{ item.name }}</router-link>
        </li>
      </ul>
      <div class="clearfix"></div>
    </div>

    <div class="panel-body remove-padding-horizontal">
      <ul class="list-group row topic-list">
        <li v-for="article in articles" :key="article.articleId" class="list-group-item">
          <router-link :to="`/articles/${article.articleId}/content`" tag="div" class="reply_count_area hidden-xs pull-right">
            <div class="count_set">
              <span class="count_of_votes" title="投票数">{{ article.likeUsers ? article.likeUsers.length : 0 }}</span>
              <span class="count_seperator">/</span>
              <span class="count_of_replies" title="回复数">{{ article.comments ? article.comments.length : 0 }}</span>
              <span class="count_seperator">|</span>
              <abbr class="timeago">{{ article.date | moment('from') }}</abbr>
            </div>
          </router-link>
          <router-link :to="`/${article.name}`" tag="div" class="avatar pull-left">
            <img :src="article.uavatar" class="media-object img-thumbnail avatar avatar-middle">
          </router-link>
          <router-link :to="`/articles/${article.articleId}/content`" tag="div" class="infos">
            <div class="media-heading">
              {{ article.title }}
            </div>
          </router-link>
        </li>
      </ul>
    </div>

  </div>
</div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Home',
    data() {
        return {
            msgText: '',
            msgType: '',
            msgShow: false,
            articles: [], 
            filter:'default',
            filters: [
                { filter: 'default', name: '活跃', title: '最后回复排序'},
                { filter: 'excellent', name: '精华', title: '只看加精的话题'},
                { filter: 'vote', name: '投票', title: '点赞数排序'},
                { filter: 'recent', name: '最近', title: '发布时间排序'},
                { filter: 'noreply', name: '零回复', title: '无人问津的话题'}
            ]
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
               
                switch (fromName) {
                    // 显示注册成功
                    case 'Register':
                        vm.showMsg('注册成功')
                    break
                    case 'Login':
                        vm.showMsg('登录成功')
                    break    

                }    
            } else if (logout) {
                // logout 返回 true 的时候，显示操作成功
                vm.showMsg('操作成功')
            }

            // 确认渲染该组件的对应路由时，设置相关的数据
            vm.setDataByFilter(to.query.filter)
        })
    },
    computed: {
        ...mapState([
            'auth',
            'user'
        ]),
       
    },
    watch: {
        // 
        auth(value) {
            if (value === false) {
                this.showMsg('操作成功')
            }
        },
        // 监听 ‘$route’ 在查询参数变化后，设置相关数据
        '$route'(to) {
            this.setDataByFilter(to.query.filter)
        }
    },
    methods: {
        showMsg(msg, type = 'success') {
            this.msgText = msg
            this.msgType = type
            this.msgShow = true 
        },

        // 设置相关数据
        setDataByFilter(filter = 'default') {
            // 设置当前过滤方式为查询参数的filter
            this.filter = filter
            // 设置文章列表为过滤后的所有文章
            this.articles = this.$store.getters.getArticlesByFilter(filter)
        }
    }
}
</script>
