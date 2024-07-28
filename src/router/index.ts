import { storeToRefs } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';

import AppTest from '@/components/ui/AppTest.vue';
import useGlobalStore from '@/stores/globalStore';
import HomeView from '@/views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomeView
    },
    {
      path: '/chat',
      name: 'ChatPage',
      // route level code-splitting
      // this generates a separate chunk (Chat.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ChatView.vue'),
      meta: { auth: true },
      children: [{ path: ':id', name: 'PrivateChatPage', component: AppTest }]
    }
  ]
});

// navigation guard
router.beforeEach((to, from, next) => {
  // console.log('router toPage: ', to.name);
  const globalStore = useGlobalStore();
  const { userName } = storeToRefs(globalStore);

  // 無法進入 ChatPage：因為沒有使用者名稱
  if (to.meta.auth && userName.value === '') {
    next({ name: 'HomePage' });
  } else {
    next();
  }
});

export default router;
