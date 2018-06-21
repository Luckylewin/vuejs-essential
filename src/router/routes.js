export default [
      {
        path: '/auth/register',
        name: 'Register',
        component: () => import('@/views/auth/Register')
      },
      // 首页路由配置
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home')
      },
      // 其它未配置的路由都跳转到首页
      {
        path: '*',
        //重定向
        redirect: '/'
      },
      {
        path: '/auth/login',
        name: 'Login',
        component: () => import('@/views/auth/Login') 
      },
      // 编辑用户
      {
        path: '/users/1/edit',
        name: 'EditUsers',
        component: () => import('@/views/users/Edit'),
        children: [
          {
              path: '',
              name: 'EditProfile',
              component: () => import('@/views/users/Profile'),
              meta: { auth: true}
          },
          
          {
              path: '/users/1/edit_avatar',
              name: 'EditAvatar',
              component:() => import('@/views/users/Avatar'),
              meta: { auth: true}
          },

          {
              path: '/users/1/edit_password',
              name: 'EditPassword',
              component: () => import('@/views/users/Password')
          }
         
        ]
      },

      // 创建文章
      {
         path: '/articles/create',
         name: 'Create',
         component: () => import('@/views/articles/Create'),
         meta: { auth: true }
      },

      // 内容页
      {
          path: '/articles/:articleId/content',
          name: 'Content',
          component: () => import('@/views/articles/Content.vue')
      }
      
];