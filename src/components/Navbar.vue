<template>
    <nav class="navbar">
      <div class="brand">
        <router-link to="/" class="brand-logo">Senya Web</router-link>
      </div>
      <div class="nav-links">
        <router-link to="/home" class="nav-link">Home</router-link>
        <router-link to="/notes" class="nav-link">Notes</router-link>
        <router-link to="/workout" class="nav-link">Workout</router-link>
        <router-link to="/taskmanager" class="nav-link">Task Manager</router-link>
        <router-link to="/about" class="nav-link">About</router-link>
        <div v-if="user?.isAuthenticated" class="welcome-container">
          <span class="nav-link">Welcome, {{ user?.username }}</span>
          <button @click="logout" class="nav-link">Logout</button>
        </div>
        <div v-else class="nav-links">
          <router-link :to="{ path: '/auth', query: { mode: 'login' }}" class="nav-link">Login</router-link>
          <router-link :to="{ path: '/auth', query: { mode: 'register' }}" class="nav-link">Register</router-link>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import { useAuthStore } from '@/stores/auth'
  import { mapState } from 'pinia'
  
  export default {
    name: 'Navbar',
    computed: {
      ...mapState(useAuthStore, ['user'])
    },
    methods: {
      logout() {
        const authStore = useAuthStore()
        authStore.logout()
      }
    }
  }
  </script>
  
  <style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #333;
    color: white;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    height: 60px; /* Fixed height */
    box-sizing: border-box; /* Include padding in height */
  }
  .welcome-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .brand-logo {
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
    color: white;
  }
  
  .nav-links {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }
  
  .nav-link {
    text-decoration: none;
    color: white;
    transition: color 0.3s ease;
    
  }
  
  .nav-link:hover {
    color: #ddd;
  }
  </style>