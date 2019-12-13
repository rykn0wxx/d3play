export default [
  {
    path: '/app',
    name: 'Application',
    view: 'layouts/Application',
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        view: 'pages/Home',
        icon: 'home'
      },
      {
        path: '/about',
        name: 'About',
        view: 'pages/About',
        icon: 'info'
      },
      {
        path: '/other',
        name: 'Other',
        view: 'pages/Other',
        icon: 'info'
      }
    ]
  }
]
