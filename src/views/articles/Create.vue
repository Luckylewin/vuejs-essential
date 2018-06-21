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
                            <input v-model="title" type="text" class="form-control" v-validator.required="{ title: '标题'}"  placeholder="请填写标题">
                        </div>
                        <!-- content -->
                        <div class="form-group">
                            <textarea id="editor"></textarea>
                        </div>
                        <br>
                        <div class="form-group">
                            <button @click="post" class="btn btn-primary" type="submit">发 布</button>
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
            content: ''
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
        fillContent() {
            const simplemde = this.simplemde
            const title = ls.getItem('smde_title')
             // 如果 localStorage 有标题数据，使用它作为文章标题
            if (title !== null) {
                this.title = title
            }

            // 使用编辑器的内容作为文章内容
            this.content = simplemde.value()
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
                this.$store.dispatch('post', { article })
                // 清除数据
                this.clearData()
            }
           
        },
        clearData() {
            this.title = ''
            ls.removeItem('smde_title')
            // 清除编辑的内容
            this.simplemde.value('')
            // 清除编辑器自动保存的内容
            this.simplemde.clearAutosavedValue()
        }
    }
}
</script>

<style scoped>
.blog-container {max-width: 980px; margin: 0 auto; margin-top: 20px;}
textarea {height: 200px;}
</style>