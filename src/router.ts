import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import MainPage from '@/pages/MainPage.vue';
import AboutPage from '@/pages/AboutPage.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'mainPage',
      component: MainPage,
    },
    {
      path: '/aboutPage',
      name: 'aboutPage',
      component: AboutPage,
    },
  ],
});

export default router;
