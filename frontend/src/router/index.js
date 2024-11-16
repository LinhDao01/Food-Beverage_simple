import { createWebHistory, createRouter } from 'vue-router';
import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';
import SignUp from '@/views/SignUp.vue';
import Admin from '@/views/Admin.vue';
import { useUserStore } from '@/stores/user.store';

//redirect to home if already logged in
const redirectAuth = (to, from, next) => {
  const userStore = useUserStore();
  if (userStore.isAuthenticated) {
    //if admin
    if (userStore.hasAdminAccess) {
      next('/admin');
    } else {
      next('/');
    }
  } else {
    next();
  }
}

//kiểm tra trạng thái của người dùng
const requireAuth = (to, from, next) => {
  const userStore = useUserStore();
  if (!userStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
};

//kiểm tra quyền admin
const requireAdmin = (to, from, next) => {
  const userStore = useUserStore();
  console.log('Router guard - Admin check:', {
    isAuthenticated: userStore.isAuthenticated,
    hasAdminAccess: userStore.hasAdminAccess,
    role: userStore.role
  });
  if (!userStore.isAuthenticated) {
    next('/login');
  } else if (!userStore.hasAdminAccess) {
    next('/');
  } else {
    next();
  }
};

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    beforeEnter: requireAdmin,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import('@/views/NotFound.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: redirectAuth
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
    beforeEnter: redirectAuth,
    props: true,
    
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  userStore.checkAuthStatus(); // Check authentication status before each route change
  next();
});

export default router;