// 引入路由页面作跳转
import router from '../router'

// 导出一个 post 事件，这里的用户参数是 {article, articleId}, article 包含文章标题和内容，articleId 是文章ID
export const post = (context, { article, articleId}) => {
    // 从仓库获取所有文章
    let articles = context.state.articles
  
    // 没有文章时，新建一个空数组
    if (!Array.isArray(articles)) articles = []

    // 存在 article 时
    if (article) {
        const uid = 1
        const { title, content } = article
        const date = new Date()

        if (articleId === undefined) {
            const lastArticle = articles[articles.length - 1]

            if (lastArticle) {
                articleId = parseInt(lastArticle.articleId) + 1
            } else {
                articleId = articles.length + 1
            }
        } else {
            // 如果有找到文章 遍历所有文章
            for (let article of articles) {
                // 找到与 articleId 对应的文章
                if (parseInt(article.articleId) === parseInt(articleId)) {
                    // 更新文章的标题
                    article.title = title
                    // 更新文章内容
                    article.content = content
                    break
                }
            }

        }

        // 把当前文章添加到所有文章
        articles.push({
            uid,
            articleId,
            title,
            content,
            date
        })
        // 更新所有文章    
        context.commit('UPDATE_ARTICLES', articles)
        // 跳转到首页 并附带 articleId 和 showMsg参数，showMsg用来指示目标页面显示一个提示
        router.push({ name: 'Content', params: { articleId, showMsg: true}})

    } else {
        // 没有article 传参数时 确定时删除
        // 遍历所有文章
        for (let article of articles) {
            // 找到与 articleId 对应的文章
            if (parseInt(article.articleId) === parseInt(articleId)) {
                // 删除对应的文章
                articles.splice(articles.indexOf(article), 1)
                break
            }
        }

        // 更新所有文章    
        context.commit('UPDATE_ARTICLES', articles)
        // 跳转到首页 并附带 articleId 和 showMsg参数，showMsg用来指示目标页面显示一个提示
        router.push({ name: 'Home', params: { showMsg: true}})

    }
}