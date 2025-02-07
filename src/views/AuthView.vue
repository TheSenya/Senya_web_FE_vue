<template>
    <div v-if="getAuthTemplateType === 'login'" class="login-form-container">
        <LoginForm />
    </div>
    
    <div v-else-if="getAuthTemplateType === 'register'" class="register-form-container">
        <RegisterForm />
    </div>

    <div v-else>
        improper route
    </div>
</template>

<script>
import LoginForm from '@/components/auth/LoginForm.vue';
import RegisterForm from '@/components/auth/RegisterForm.vue';

export default {
    name: 'AuthView',
    components: {
        LoginForm,
        RegisterForm
    },
    computed: {
        getAuthTemplateType() {
            return this.$route.query.mode;
        }
    }
}
</script>