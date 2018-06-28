<template>
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
        <!-- 点赞 -->
<div class="votes-container panel panel-default padding-md">
  <div class="panel-body vote-box text-center">
    <div class="btn-group">
      <a @click="like" href="javascript:;" class="vote btn btn-primary popover-with-html" :class="likeClass">
        <i class="fa fa-thumbs-up"></i> {{ likeClass ? '已赞' : '点赞' }}
      </a>
      <div class="or"></div>
      <button class="btn btn-success" @click="showQrcode = true"><i class="fa fa-heart"></i> 打赏</button>
    </div>
    <div class="voted-users">
      <div class="user-lists">
        <span v-for="likeUser in likeUsers">
          <!-- 点赞用户是当前用户时，加上类 animated 和 swing 以显示一个特别的动画  -->
          <img :src="user && user.avatar" class="img-thumbnail avatar avatar-middle" :class="{ 'animated swing' : likeUser.uid === 1 }">
        </span>
      </div>
      <div v-if="!likeUsers.length" class="vote-hint">成为第一个点赞的人吧 😄</div>
    </div>
  </div>
</div>

<Modal :show.sync="showQrcode" class="text-center">
  <div v-if="user" slot="title">
    <img :src="user.avatar" class="img-thumbnail avatar" width="48">
  </div>
  <div>
    <p class="text-md">如果你想学习更多前端的知识，VuejsCaff.com 是个不错的开始</p>
    <div class="payment-qrcode inline-block">
      <h5>扫一扫打开 VuejsCaff.com</h5>
      <p>
        <qrcode-vue value="https://vuejscaff.com/" :size="160"></qrcode-vue>
      </p>
    </div>
  </div>
  <div slot="footer">
    <div class="text-center">祝你学习愉快 :)</div>
  </div>
</Modal>

<!-- 评论列表 -->
<div class="replies panel panel-default list-panel replies-index">
  <div class="panel-heading">
    <div class="total">
      回复数量: <b>{{ comments.length }}</b>
    </div>
  </div>
  <div class="panel-body">
    <transition-group tag="ul" name="fade"  id="reply-list" class="list-group row">
      <li v-for="(comment, index) in comments" :key="comment.commentId" class="list-group-item media">
        <div class="avatar avatar-container pull-left">
          <router-link :to="`/${comment.uname}`">
            <img :src="comment.uavatar" class="media-object img-thumbnail avatar avatar-middle">
          </router-link>
        </div>
        <div class="infos">
          <div class="media-heading">
            <router-link :to="`/${comment.uname}`" class="remove-padding-left author rm-link-color">
              {{ comment.uname }}
            </router-link>
            <div class="meta">
              <a :id="`reply${index + 1}`" :href="`#reply${index + 1}`" class="anchor">#{{ index + 1 }}</a>
              <span> ⋅ </span>
              <abbr class="timeago">
                {{ comment.date | moment('from', { startOf: 'second' }) }}
              </abbr>
            </div>
          </div>

          <div class="preview media-body markdown-reply markdown-body" v-html="comment.content"></div>
        </div>
      </li>
    </transition-group>


    <div v-show="!comments.length" class="empty-block">
      暂无评论~~
    </div>
  </div>
</div>

<!-- 评论框 -->
<div id="reply-box" class="reply-box form box-block">
  <div class="form-group comment-editor">
    <textarea v-if="auth" id="editor"></textarea>
    <textarea v-else disabled class="form-control" placeholder="需要登录后才能发表评论." style="height:172px"></textarea>
  </div>
  <div class="form-group reply-post-submit">
    <button id="reply-btn" :disabled="!auth" @click="comment" class="btn btn-primary">回复</button>
    <span class="help-inline">Ctrl+Enter</span>
  </div>
  <div v-show="commentHtml" id="preview-box" class="box preview markdown-body" v-html="commentHtml"></div>
</div>

      </div>
</template>

<script>
import SimpleMDE from 'simplemde'
import hljs from 'highlight.js'
import emoji from 'node-emoji'
// 引入 mapState 辅助函数
import { mapState } from 'vuex'
// 引入 QrcodeVue 的默认值
import QrcodeVue from 'qrcode.vue'

export default {
    name: 'Content',
    components: {
        QrcodeVue
    }, 
       data() {
        return {
            title: '',
            content: '',
            date:'',
            uid: 1,
            likeUsers: [], // 点赞用户列表
            likeClass: '' ,// 点赞样式,
            showQrcode: false, // 是否显示打赏弹窗
            commentHtml: '', // 评论 Html
            comments:[] // 用户评论列表
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
            let { uid, title, content, date, likeUsers, comments } = article

            this.uid = uid
            this.title = title
            // emojify 方法解析 emoji 字符串标识， name => name 表示不认识就返回原值
            this.content = SimpleMDE.prototype.markdown(emoji.emojify(content, name => name))
            this.date = date
            this.likeUsers = likeUsers || []
            // 更新 likeClass，点赞用户列表包含当前用户时，赋值为 active 表示已赞
            this.likeClass = this.likeUsers.some(likeUser => likeUser.uid === 1) ? 'active' : ''
            // 渲染文章的 comments
            this.renderComments(comments)

            this.$nextTick(() => {
                this.$el.querySelectorAll('pre code').forEach((el) => {
                    hljs.highlighBlock(el)
                })
            })
        }

        this.articleId = articleId
    },
    mounted() {
      // 已经登录时才开始监听
      if (this.auth) {
           // 自动高亮编辑器的内容
           window.hljs = hljs

          const simplemde = new SimpleMDE({
                                              element: document.querySelector('#editor'),
                                              placeholder: '请使用 Markdown 格式书写 ;-)，代码片段黏贴时请注意使用高亮语法。',
                                              spellChecker: false,
                                              autoDownloadFontAwesome: false,
                                              // 不显示工具栏
                                              toolbar: false,
                                              // 不显示状态栏
                                              status: false,
                                              renderingConfig: {
                                                codeSyntaxHighlighting: true
                                              }
          })

          // 内容改变监听
          simplemde.codemirror.on('change', () => {
              // 更新 commentMarkdown 为编辑器的内容
              this.commentMarkdown = simplemde.value()
              // 更新 commentHtml emoji化
              this.commentHtml = simplemde.markdown(emoji.emojify(this.commentMarkdown, name => name))
          })

          // 松键松开监听
          simplemde.codemirror.on('keyup', (codemirror, event) => {
               // 使用 ctrl + enter 时提交评论
               if (event.ctrlKey && event.keyCode === 13) {
                    this.comment()
               }
          })

          this.simplemde = simplemde
      }
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
        },
        like(e) {
            // 未登录时，提示登录
            if (!this.auth) {
                this.$swal({
                    text: '需要登录以后才能执行此操作',
                    confirmButtonText: '前往登录'
                }).then((res) => {
                    if (res.value) {
                        this.$router.push('/auth/login')
                    }
                })
            } else {
                const target = e.currentTarget
                // 点赞按钮是否含有 active 类，我们用来判断它是否已赞
                const active = target.classList.contains('active')
                const articleId = this.articleId
                
                if (active) {
                    // 清除已赞样式
                    this.likeClass = ''
                    // 分发 like 事件取消赞，更新实例的 likeUsers 为返回的值
                    this.$store.dispatch('like', { articleId }).then((likeUsers) => {
                        this.likeUsers = likeUsers
                    })
                } else {
                    // 添加已赞样式
                    this.likeClass = 'active animated rubberBand'
                    // 分发 like 事件，传入 isAdd 参数点赞，更新实例的 likeUsers 为返回的值
                    this.$store.dispatch('like', { articleId, isAdd: true}).then((likeUsers) => {
                        this.likeUsers = likeUsers
                    })
                }
            }
        },
        comment() {
          // 编辑器内容不为空时
          if (this.commentMarkdown && this.commentMarkdown.trim() !== '') {
             // 分发 comment 事件以提交评论
             this.$store.dispatch('comment', {
               comment: { content: this.commentMarkdown},
               articleId: this.articleId
             }).then((comments) => {
                 // 在浏览器的控制台打印返回的评论列表
                 console.log(comments)
                 this.renderComments(comments)
             })

             // 清空编辑器
             this.simplemde.value('')
             // 使回复按钮获得焦点
             document.querySelector('#reply-btn').focus()

             // 将最后评论滚动到页面的顶部
             this.$nextTick(() => {
                const lastComment = document.querySelector('#reply-list li:last-child')
                if (lastComment) lastComment.scrollIntoView(true)
             })
          }
        },
        renderComments(comments) {
          if (Array.isArray(comments)) {
            // 深拷贝 comments 不影响其原值
            const newComments = comments.map(comment => ({ ...comment }))
            const user = this.user || {}

            for (let comment of newComments) {
              comment.uname = user.name
              comment.uavatar = user.avatar
              // 将评论内容从Markdown 转成 HTML
              comment.content = SimpleMDE.prototype.markdown(emoji.emojify(comment.content, name => name))

              // 更新实例的 comments
              this.comments = newComments
              // 将 markdown格式的评论添加到当前实例
              this.commentsMarkdown = comments
            }

          }
        }
    }
}
</script>


<style scoped>
.fade-enter-active, .fade-leave-active {transition: opacity .5s;}
.fade-enter, .fade-leave-to { opacity: 0;}
</style>
