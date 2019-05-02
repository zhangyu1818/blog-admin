export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/user',
        component: './Login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/',
        redirect: '/welcome',
      },
      // dashboard
      {
        path: '/welcome',
        name: 'welcome',
        icon: 'smile',
        component: './Welcome',
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
        path: 'https://github.com/umijs/umi-blocks/tree/master/ant-design-pro',
        name: 'more-blocks',
        icon: 'block',
      },
    ],
  },
];
