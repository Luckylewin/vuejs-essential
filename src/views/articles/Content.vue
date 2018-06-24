<template>
  <div class="blog-container" style="margin-top:20px">
    <div class="blog-pages">
      <div class="col-md-9 left-col pull-right">
        <div class="panel article-body content-body">
          <h1 class="text-center">{{ title }}</h1>
          <div class="article-meta text-center">
            <i class="fa fa-clock-o"></i> <abbr>{{ date | moment('from') }}</abbr></span>
          </div>
          <div class="entry-content">
            <div class="content-body entry-content panel-body ">
              <div class="markdown-body" v-html="content"></div>
              <div v-if="auth && uid === 1" class="panel-footer operate">
                    <div class="actions">
                          <a @click="deleteArticle" class="admin" href="javascript:;"><i class="fa fa-trash-o"></i></a>
                          <a @click="editArticle" class="admin" href="javascript:;"><i class="fa fa-pencil-square-o"></i></a>
                    </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SimpleMDE from 'simplemde'
import hljs from 'highlight.js'
import emoji from 'node-emoji'
// 引入 mapState 辅助函数
import { mapState } from 'vuex'

export default {
    name: 'Content',
    data() {
        return {
            title: '',
            content: '',
            date:'',
            uid: 1
        }
    },
    // 添加计算属性
    computed: {
      // 将仓库的以下状态混入到计算属性之中
      ...mapState([
        'auth',
        'user'
      ])
    },
    created() {
        const articleId = this.$route.params.articleId
        const article = this.$store.getters.getArticleById(articleId)

        if (article) {
            let { uid, title, content, date } = article

            this.uid = uid
            this.title = title
            // emojify 方法解析 emoji 字符串标识， name => name 表示不认识就返回原值
            this.content = SimpleMDE.prototype.markdown(emoji.emojify(content, name => name))
            this.date = date
            
            this.$nextTick(() => {
                this.$el.querySelectorAll('pre code').forEach((el) => {
                    hljs.highlighBlock(el)
                })
            })
        }

        this.articleId = articleId
    },
    methods: {
      // 编辑文章
        editArticle() {
            // 点击编辑文章图标，跳到编辑文章页面，并附带当前文章ID
            this.$router.push({ name: 'Edit', params: { articleId: this.articleId } } )
        },
        // 删除文章
        deleteArticle() {
              // 提示框
              this.$swal({
                   text: '你确定要删除此内容',
                   confirmButtonText: '删除'
              }).then((res) => {
                 if (res.value) {
                    this.$store.dispatch('post', { articleId: this.articleId})
                 }  
              });
        }
    }
}
</script>
