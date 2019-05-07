export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      {
        path: '/',
        redirect: '/posts/list',
        authority: ['admin'],
      },
      {
        path: '/posts',
        name: 'posts',
        icon: 'smile',
        routes: [
          {
            path: '/posts/list',
            name: 'list',
            icon: 'smile',
            component: './PostsList',
          },
          {
            path: '/posts/write',
            name: 'write',
            icon: 'smile',
            component: './Write',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
