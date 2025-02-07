<template>
  <main>
    <div class="home-page-container">
      home page
      <button @click="testsendcookie">test send cookie</button>
      <button @click="testgetcookie">test get cookie</button>
    </div>
  </main>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { mapActions } from 'pinia'
export default {
  name: 'HomeView',
  data() {
    return {
      authStore: useAuthStore()
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['testsendcookie', 'testgetcookie'])
  }
}
</script>