import { createRouter, createWebHistory } from 'vue-router'
import RootLayout from '@/views/RootLayout.vue'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import WorkoutView from '@/views/WorkoutView.vue'
import NoteView from '@/views/NoteView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import TaskManagerView from '@/views/TaskManagerView.vue'
import AuthView from '@/views/AuthView.vue'
import TodoView from '@/views/TodoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      component: RootLayout,
      redirect: '/home',
      children:[
        {
          path: 'home',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'notes',
          name: 'notes',
          component: NoteView,
        },
        {
          path: 'workout',
          name: 'workout',
          component: WorkoutView,
        },
        {
          path: 'about',
          name: 'about',
          component: AboutView,
        },
        {
          path: 'taskmanager',
          name: 'taskmanager',
          component: TaskManagerView,
        },
        {
          path: 'todo',
          name: 'todo',
          component: TodoView,
        },
        {
          path: 'auth',
          component: AuthView,
          redirect: '/auth/login',
          children: [
            {
              path: 'login',
              name: 'login',
              component: () => import('@/components/auth/login/LoginForm.vue')
            },
            {
              path: 'register',
              name: 'register',
              component: () => import('@/components/auth/register/RegisterForm.vue')
            }
          ]
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'NotFound',
          component: NotFoundView  // You'll need to create and import this component
        }
      ]
    },
  ],
})

export default router
