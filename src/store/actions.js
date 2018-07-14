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

            // 把当前文章添加到所有文章
            articles.push({
                uid,
                articleId,
                title,
                content,
                date
            })

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


// 参数 articleId 是文章 ID：isAdd 为 true 时点赞，为false时取消赞
export const like = ({ commit, state }, { articleId, isAdd }) => {
    // 仓库的文章
    let articles = state.articles
    // 点赞用户列表
    let likeUsers = []
    // 用户 ID,默认为1
    const uid = 1

    if (!Array.isArray(articles)) articles = []

    for (let article of articles) {
        // 找到对应文章时
        if (parseInt(article.articleId) === parseInt(articleId)) {
            // 更新点赞用户列表
            likeUsers = Array.isArray(article.likeUsers) ? article.likeUsers : likeUsers;

            if (isAdd) {
                // 是否已赞
                const isAdded = likeUsers.some(likeUser => parseInt(likeUser.uid) === uid)

                if (!isAdded) {
                    // 在点赞用户列表中加入当前用户
                    likeUsers.push({ uid })
                }
            } else {
                for (let likeUser of likeUsers) {
                    // 找到对应点赞用户时
                    if (parseInt(likeUser.uid) === uid) {
                        // 删除点赞用户
                        likeUsers.splice(likeUsers.indexOf(likeUser), 1)
                        break
                    }
                }
            }

            // 更新文章的点赞用户列表
            article.likeUsers = likeUsers
            break
        }
    }

    // 提交 UPDATE_ARTICLES 以更新所有文章
    commit('UPDATE_ARTICLES', articles)
    // 返回点赞用户列表
    return likeUsers
}

export const comment = ({ commit, state }, { articleId, comment, commentId }) => {
    let articles = state.articles
    let comments = []
  
    if (!Array.isArray(articles)) articles = []
  
    for (let article of articles) {
      if (parseInt(article.articleId) === parseInt(articleId)) {
        comments = Array.isArray(article.comments) ? article.comments : comments
  
        if (comment) {
          const { uid = 1, content } = comment
          const date = new Date()
  
          if (commentId === undefined) {
            const lastComment = comments[comments.length - 1]
  
            if (lastComment) {
              commentId = parseInt(lastComment.commentId) + 1
            } else {
              commentId = comments.length + 1
            }
  
            comments.push({
              uid,
              commentId,
              content,
              date
            })
          } else {
            for (let comment of comments) {
              if (parseInt(comment.commentId) === parseInt(commentId)) {
                comment.content = content
                break
              }
            }
          }
        } else { // 不存在评论内容时
          for (let comment of comments) {
            // 找到对应的评论时
            if (parseInt(comment.commentId) === parseInt(commentId)) {
              // 删除这条评论
              comments.splice(comments.indexOf(comment), 1)
              break
            }
          }
        }
  
        article.comments = comments
        break
      }
    }
  
    commit('UPDATE_ARTICLES', articles)
    return comments
  }