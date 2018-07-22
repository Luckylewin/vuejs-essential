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
        alias: '/topics',
        component: () => import('@/views/Home')
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
      // 编辑文章路由
      {
          path: '/articles/:articleId/edit',
          name: 'Edit',
          component: () => import('@/views/articles/Create.vue'),
          meta: { auth: true}
      },
      // Search
      {
        path: '/search',
        name: 'Search',
        component: () => import('@/views/Search')
      },
      // 侧边栏路由
      {
         path: '/:user',
         component: () => import('@/views/articles/Column'),
         children: [
           {
              path: '',
              name: 'Column',
              component: () => import('@/views/articles/List.vue')
           },
           {
              path: '/articles/:articleId/content',
              name: 'Content',
              component: () => import('@/views/articles/Content.vue')
           }
         ]
      },

      // 其它未配置的路由都跳转到首页
      {
       path: '*',
       //重定向
       redirect: '/'
      },
      
];