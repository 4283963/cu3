const routeConfig = {
  GUEST: [
    {
      path: '/',
      name: 'Home',
      component: 'Home',
      meta: { title: '首页', icon: 'Home', requiresAuth: false }
    },
    {
      path: '/login',
      name: 'Login',
      component: 'Login',
      meta: { title: '登录', icon: 'User', requiresAuth: false, hidden: true }
    },
    {
      path: '/blinds',
      name: 'Blinds',
      component: 'Blinds',
      meta: { title: '机位一览', icon: 'Location', requiresAuth: false }
    }
  ],
  BASIC: [
    {
      path: '/',
      name: 'Home',
      component: 'Home',
      meta: { title: '首页', icon: 'Home', requiresAuth: false }
    },
    {
      path: '/blinds',
      name: 'Blinds',
      component: 'Blinds',
      meta: { title: '机位预约', icon: 'Location', requiresAuth: true }
    },
    {
      path: '/my-bookings',
      name: 'MyBookings',
      component: 'MyBookings',
      meta: { title: '我的预约', icon: 'Tickets', requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: 'Profile',
      meta: { title: '个人中心', icon: 'User', requiresAuth: true }
    }
  ],
  PRO: [
    {
      path: '/',
      name: 'Home',
      component: 'Home',
      meta: { title: '首页', icon: 'Home', requiresAuth: false }
    },
    {
      path: '/blinds',
      name: 'Blinds',
      component: 'Blinds',
      meta: { title: '机位预约', icon: 'Location', requiresAuth: true }
    },
    {
      path: '/my-bookings',
      name: 'MyBookings',
      component: 'MyBookings',
      meta: { title: '我的预约', icon: 'Tickets', requiresAuth: true }
    },
    {
      path: '/gallery',
      name: 'Gallery',
      component: 'Gallery',
      meta: { title: '作品展示', icon: 'Picture', requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: 'Profile',
      meta: { title: '个人中心', icon: 'User', requiresAuth: true }
    }
  ],
  VIP: [
    {
      path: '/',
      name: 'Home',
      component: 'Home',
      meta: { title: '首页', icon: 'Home', requiresAuth: false }
    },
    {
      path: '/blinds',
      name: 'Blinds',
      component: 'Blinds',
      meta: { title: '机位预约', icon: 'Location', requiresAuth: true }
    },
    {
      path: '/my-bookings',
      name: 'MyBookings',
      component: 'MyBookings',
      meta: { title: '我的预约', icon: 'Tickets', requiresAuth: true }
    },
    {
      path: '/gallery',
      name: 'Gallery',
      component: 'Gallery',
      meta: { title: '作品展示', icon: 'Picture', requiresAuth: true }
    },
    {
      path: '/vip-lounge',
      name: 'VIPLounge',
      component: 'VIPLounge',
      meta: { title: 'VIP专区', icon: 'Crown', requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: 'Admin',
      meta: { title: '系统管理', icon: 'Setting', requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: 'Profile',
      meta: { title: '个人中心', icon: 'User', requiresAuth: true }
    }
  ]
};

module.exports = routeConfig;
