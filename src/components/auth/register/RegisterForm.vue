<template>
    <div class="register-form">
        <h2>Register</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" v-model="formData.name" required>
            </div>

            <!-- Using this temporarily to no have to deal with email format -->
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="text" id="email" v-model="formData.email" required>
            </div>


            <!-- <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
          >
        </div> -->

            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="formData.password" required>
            </div>

            <div class="form-group">
                <label for="confirmPassword">Confirm Password:</label>
                <input type="password" id="confirmPassword" v-model="formData.confirmPassword" required>
            </div>

            <div v-if="error" class="error-message">
                {{ error }}
            </div>
            <button type="submit" :disabled="isLoading">
                {{ isLoading ? 'Registering...' : 'Register' }}
            </button>
        </form>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { mapStores, mapActions, mapState } from 'pinia'

export default {
    name: 'RegisterForm',
    data() {
        return {
            formData: {
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            }
        }
    },
    computed: {
        ...mapStores(useAuthStore),
        ...mapState(useAuthStore, ['isLoading', 'error']),
        setRegisterData(){
            return {
                email: this.formData.email,
                password: this.formData.password,
                username: this.formData.name
            }
        }

    },
    methods: {
        ...mapActions(useAuthStore, ['register']),

        async handleSubmit() {
            if (this.formData.password !== this.formData.confirmPassword) {
                this.authStore.error = 'Passwords do not match'
                return
            }
            
            try {
                await this.register(this.setRegisterData)
            } catch (error) {
                // Error handling is already done in the store
            }
        }
    }
}
</script>

<style>
.register-form {
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
}

button {
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}
</style>