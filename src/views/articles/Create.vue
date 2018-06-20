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
                            <input type="text" class="form-control" v-validator.required="{ title: '标题'}"  placeholder="请填写标题">
                        </div>
                        <!-- content -->
                        <div class="form-group">
                            <textarea id="editor"></textarea>
                        </div>
                        <br>
                        <div class="form-group">
                            <button class="btn btn-primary" type="submit">发 布</button>
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

// 添加全局变量
window.hljs = hljs

export default {
    name: 'Create',
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
    }
}
</script>

<style scoped>
.blog-container {max-width: 980px; margin: 0 auto; margin-top: 20px;}
textarea {height: 200px;}
</style>