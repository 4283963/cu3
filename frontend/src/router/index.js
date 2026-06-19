import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';

const constantRoutes = [
  {
    path: '/',
    redirect: '/home'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
});

const resetRouter = () => {
  const newRouter = createRouter({
    history: createWebHistory(),
    routes: constantRoutes
  });
  router.matcher = newRouter.matcher;
};

let initialRouteLoad = true;

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  if (!userStore.routesLoaded) {
    await userStore.loadRoutes();
  }

  if (to.path === '/login') {
    if (userStore.isLoggedIn) {
      next('/');
    } else {
      next();
    }
    return;
  }

  if (to.meta?.requiresAuth && !userStore.isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } });
    return;
  }

  if (to.matched.length === 0 && !initialRouteLoad) {
    next('/404');
    return;
  }

  initialRouteLoad = false;
  next();
});

export default router;
export { resetRouter };
