import { defineStore } from 'pinia';
import { login, getRoutes, getGuestRoutes, getProfile } from '@/api/auth';
import router, { resetRouter } from '@/router';

const viewModules = import.meta.glob('@/views/**/*.vue');

const loadComponent = (componentName) => {
  const path = `/src/views/${componentName}.vue`;
  const fullPath = Object.keys(viewModules).find(p => p.includes(path) || p.includes(`/${componentName}.vue`));
  return fullPath ? viewModules[fullPath] : null;
};

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('bird_token') || '',
    userInfo: JSON.parse(localStorage.getItem('bird_userInfo') || 'null'),
    routes: [],
    routesLoaded: false
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    menuRoutes: (state) => state.routes.filter(r => !r.meta?.hidden),
    userLevel: (state) => state.userInfo?.level || 'GUEST'
  },

  actions: {
    async login(username, password) {
      const res = await login({ username, password });
      this.token = res.data.token;
      this.userInfo = res.data.user;
      localStorage.setItem('bird_token', this.token);
      localStorage.setItem('bird_userInfo', JSON.stringify(this.userInfo));
      await this.loadRoutes();
      return res.data;
    },

    async loadRoutes() {
      let res;
      if (this.token) {
        res = await getRoutes();
      } else {
        res = await getGuestRoutes();
      }

      const dynamicRoutes = res.data.routes.map(route => ({
        ...route,
        component: loadComponent(route.component)
      }));

      dynamicRoutes.push({
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: (() => import('@/views/NotFound.vue')),
        meta: { hidden: true }
      });

      dynamicRoutes.forEach(route => {
        if (route.component) {
          router.addRoute(route);
        }
      });

      this.routes = dynamicRoutes;
      this.routesLoaded = true;
    },

    async refreshUserInfo() {
      if (!this.token) return;
      try {
        const res = await getProfile();
        this.userInfo = res.data;
        localStorage.setItem('bird_userInfo', JSON.stringify(this.userInfo));
      } catch (e) {
        console.error('刷新用户信息失败', e);
      }
    },

    logout() {
      this.token = '';
      this.userInfo = null;
      this.routes = [];
      this.routesLoaded = false;
      localStorage.removeItem('bird_token');
      localStorage.removeItem('bird_userInfo');
      resetRouter();
      router.push('/login');
    }
  }
});
