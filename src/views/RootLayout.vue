<template>
    <div class="root-container">
        <div class="taskbar-container">
            <Navbar></Navbar>
        </div>
        <div class="main-body-container">
            <RouterView />
        </div>
        <div class="footer-container">

        </div>
    </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
</script>

<style lang="css" scoped>
.root-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.main-body-container {
    flex: 1;
    padding-top: 60px; /* Matches navbar height */
    height: 100%; /* Ensure full height */
}

</style>
