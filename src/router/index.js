import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TimelineView from '../views/TimelineView.vue'
import GalleryView from '../views/GalleryView.vue'
import LetterView from '../views/LetterView.vue'
import AdminView from '../views/AdminView.vue'
import LoginView from '../views/LoginView.vue'
import { supabase } from '../lib/supabase'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/timeline', name: 'timeline', component: TimelineView },
    { path: '/gallery', name: 'gallery', component: GalleryView },
    { path: '/letter', name: 'letter', component: LetterView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/admin', name: 'admin', component: AdminView, meta: { requiresAuth: true } },
  ],
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  const { data } = await supabase.auth.getSession()
  const session = data.session

  if (!session) {
    return '/login'
  }

  return true
})

export default router