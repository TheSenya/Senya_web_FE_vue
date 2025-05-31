<template>
  <nav class="navbar" :class="{ 'navbar--hidden': !navbarVisible }">
    <div class="brand">
      <router-link to="/" class="brand-logo">Senya Web</router-link>
    </div>
    <div class="nav-links">
      <router-link to="/home" class="nav-link">Home</router-link>
      <router-link to="/notes" class="nav-link">Notes</router-link>
      <router-link to="/workout" class="nav-link">Workout</router-link>
      <router-link to="/taskmanager" class="nav-link">Task Manager</router-link>
      <router-link to="/todo" class="nav-link">Todo</router-link>
      <router-link to="/about" class="nav-link">About</router-link>
      <div class="auth-links">
        <div v-if="user?.isAuthenticated" class="welcome-container">
          <span class="nav-link">Welcome, {{ user?.username }}</span>
          <button @click="logout" class="nav-link">Logout</button>
        </div>
        <div v-else class="nav-links">
          <router-link :to="{ path: '/auth/login', query: { mode: 'login' } }" class="nav-link">Login</router-link>
          <router-link :to="{ path: '/auth/register', query: { mode: 'register' } }" class="nav-link">Register</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { mapState } from 'pinia'

export default {
  name: 'Navbar',
  data() {
    return {
      lastScrollY: 0,
      navbarVisible: true,
    };
  },
  computed: {
    ...mapState(useAuthStore, ['user'])
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    logout() {
      const authStore = useAuthStore()
      authStore.logout()
    },
    handleScroll() {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      const navbarHeight = this.$el.offsetHeight;

      if (currentScrollY < 0) { // Handle negative scroll values if any browser quirks
        return;
      }

      // Determine scroll direction and visibility
      if (currentScrollY > this.lastScrollY && currentScrollY > navbarHeight) {
        // Scrolling down and past the navbar height
        this.navbarVisible = false;
      } else if (currentScrollY < this.lastScrollY || currentScrollY <= navbarHeight) {
        // Scrolling up or within navbar height from top
        this.navbarVisible = true;
      }
      this.lastScrollY = currentScrollY;
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 2rem;
  background-color: #2c3e50;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 45px;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.navbar--hidden {
  transform: translateY(-100%);
}

.welcome-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.brand-logo {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: white;
  letter-spacing: 0.5px;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: #ecf0f1;
  transition: all 0.3s ease;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  font-weight: 500;
}

.nav-link:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.router-link-active {
  color: white;
  background-color: rgba(255, 255, 255, 0.15);
}
</style>