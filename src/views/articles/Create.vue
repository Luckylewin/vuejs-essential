<template>
    <div class="blog-container">
        <div class="blog-pages">
            <div class="col-md-12 panel">
                <div class="panel-body">
                    <h2 class="text-center">创作文章</h2>
                    <hr>

                    <div id="data-validator-form">
                        <!-- title -->
                        <div class="form-group">
                            <input v-model="title" type="text" class="form-control" v-validator.required="{ title: '标题'}"  placeholder="请填写标题" @input="saveTitle">
                        </div>
                        <!-- content -->
                        <div class="form-group">
                            <textarea id="editor"></textarea>
                        </div>
                        <br>
                        <div class="form-group">
                            <button @click="post" class="btn btn-primary" type="submit">{{ articleId ? '编辑文章' : '发布文章' }}</button>
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
import ls from '@/utils/localStorage'
// 添加全局变量
window.hljs = hljs

export default {
    name: 'Create',
    data(){
        return {
            title: '',
            content: '',
            articleId: undefined // 文章 ID
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // 确认渲染组件对应的路由时，设置articleId
            vm.setArticleId(vm.$route.params.articleId)
        })
    },
    // 在离开该组件的对应路由前
    beforeRouteLeave(to, from, next) {
        // 清空自动保存的文章数据
        this.clearData()
        next()
    },
    watch: {
        // 监听路由参数的变化
        '$route'(to) {
         
            this.clearData(),
            this.setArticleId(to.params.articleId)
        }
    },
    mounted() {
        const simplemde = new SimpleMDE({
            element: document.querySelector('#editor'),
            placeholder: '请使用 Markdown 格式书写',
            spellChecker: false,
            autoDownloadFontAwesome: false,
            autosave: {
                enabled: true,
                uniqueId: 'vuejs-essential'
            },
            renderingConfig: {
                codeSyntaxHighlighting: true
            }
        })
        // 监听编辑器的 change 事件
        simplemde.codemirror.on('change', () => {
            // 将改变后的值赋给文章内容
            this.content = simplemde.value()
        })
        
        // 将 simplemde 添加到当前实例，以在其它地方调用
        this.simplemde = simplemde
        // 初始化标题和内容
        this.fillContent()
    },
    methods: {
        // 编辑器只会自动保存文章的内容，我们需要自己保存文章的标题
        saveTitle() {
            ls.setItem('smde_title', this.title)
        },
        // 初始化标题和内容
        fillContent(articleId) {
           const simplemde = this.simplemde
           const smde_title = ls.getItem('smde_title')

           if (articleId !== undefined) {
               const article = this.$store.getters.getArticleById(articleId)

               if (article) {
                   const { title, content } = article

                   this.title = smde_title || title
                   this.content = simplemde.value() || content
                   simplemde.value(this.content)
               }
           } else {
               this.title = smde_title
               this.content = simplemde.value()
           }
        },
        // 发布
        post() {
            const title = this.title
            const content = this.content

            // 如果标题和内容都不为空，提交发布
            if (title.trim() !== '' && content.trim() !== '') {
                const article = {
                    title,
                    content    
                }
              
                // 分发 post 事件，并附带参数
                this.$store.dispatch('post', { article, articleId: this.articleId })
                // 清除数据
               // this.clearData()
            }
           
        },
        clearData() {
            this.title = ''
            ls.removeItem('smde_title')
            // 清除编辑的内容
            this.simplemde.value('')
            // 清除编辑器自动保存的内容
            this.simplemde.clearAutosavedValue()
        },
        // 设置 articleId
        setArticleId(articleId) {
            // 获取 localStorage 保存的 articleId，临时用它来判断是否还处于当前编辑页面
            const localArticleId = ls.getItem('articleId')
            
            // 手动在两个不同的编辑页面之间跳转时(如 /articles/1/edit 和 /articles/2/edit)
            if (articleId !== undefined && !(articleId === localArticleId)) {
                // 清空自动保存的文章数据
                this.clearData()
            }

            this.articleId = articleId
            this.fillContent(articleId)
            ls.setItem('articleId', articleId)
        }
    }
}
</script>

<style scoped>
.blog-container {max-width: 980px; margin: 0 auto; margin-top: 20px;}
textarea {height: 200px;}
</style>