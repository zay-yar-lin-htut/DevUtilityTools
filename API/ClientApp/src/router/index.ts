import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/json-formatter',
      name: 'json-formatter',
      component: () => import('../views/JsonFormatterView.vue')
    },
    {
      path: '/json-stringify',
      name: 'json-stringify',
      component: () => import('../views/JsonStringifyView.vue')
    },
    {
      path: '/markdown-preview',
      name: 'markdown-preview',
      component: () => import('../views/MarkdownPreviewView.vue')
    },
    {
      path: '/diff-checker',
      name: 'diff-checker',
      component: () => import('../views/DiffCheckerView.vue')
    },
    {
      path: '/saved',
      name: 'saved',
      component: () => import('../views/SavedResultsView.vue'),
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
