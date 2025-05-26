<template>
    <div class="login-form">
        <h2>Login</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="email">Email</label>
                <input 
                    type="text"
                    id="email"
                    v-model="formData.email"
                    required
                    placeholder="Enter your email or username"
                >
                <div v-if="this.emailInputError">
                    {{this.emailInputError}}
                </div>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input 
                    type="password"
                    id="password"
                    v-model="formData.password"
                    required
                    placeholder="Enter your password"
                >
                <div v-if="this.passwordInputError">
                    {{this.passwordInputError}}
                </div>
            </div>

            <div v-if="errorLogin" class="error-message">
                {{ errorLogin }}
            </div>
            <button type="submit" :disabled="isLoadingLogin" class="submit-btn">
                {{ isLoadingLogin ? 'Logging in...' : 'Login' }}
            </button>
        </form>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { mapActions, mapState } from 'pinia'

export default {
    name: 'LoginForm',
    data() {
        return {
            formData: {
                email: '',
                password: ''
            },
            passwordInputError: '',
            emailInputError: '',
        }
    },
    computed: {
        ...mapState(useAuthStore, ['isLoadingLogin', 'errorLogin', 'user'])
    },
    methods: {
        ...mapActions(useAuthStore, ['login', 'logout']),

        async handleSubmit() {
            try {
                console.log('handleSubmit', this.formData)
                await this.login(this.formData)

            } catch (error) {
                // Error handling is already done in the store
            }
        },
        isEmailEmpty(email){
            if (email.length() === 0){
                this.emailInputError = 'please enter email'
            }
        },
        isPasswordEmpty(password){
            if (password.length() === 0){
                this.passwordInputError = 'please enter password'
            }
        }
    }   
}
</script>

<style scoped>
.login-form {
    width: 300px;
    max-width: 400px;
    padding: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

.submit-btn {
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.submit-btn:hover {
    background-color: #45a049;
}
</style>