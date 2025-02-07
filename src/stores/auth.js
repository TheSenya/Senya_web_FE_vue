import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import envVariables from '@/constants/env_contants'

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()

    const isLoadingLogin = ref(false)
    const isLoadingRegister = ref(false)
    const errorLogin = ref(null)
    const errorRegister = ref(null)

    const user = reactive({
        username: null,
        id: null,
        email: null,
        token: localStorage.getItem('token'),
        isAuthenticated: false,
        token: null
    })
    
    const isAuthenticated = ref(false)

    const login = async (credentials) => {
        console.log('Attempting login with:', JSON.stringify(credentials))

        try {
            // trigger loading state
            isLoadingLogin.value = true
            errorLogin.value = null


            // mock response replace with actual API call
            const response = await fetch(`${envVariables.API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();

            console.log('login response data', data)

            // update user state
            user.username = data.username
            user.id = data.id 
            user.email = data.email
            user.token = data.access_token
            user.isAuthenticated = true

            localStorage.setItem('token', data.access_token)

            // redirect to home
            await router.push('/')
        } catch (err) {
            console.log('login error', err)
            errorLogin.value = err.message || 'Login failed'
            throw err
        } finally {
            console.log('login finally')
            isLoadingLogin.value = false
        }
    }

    const register = async (userData) => {
        try {
            // trigger loading state and reset error
            isLoadingRegister.value = true
            errorRegister.value = null

            // Replace with actual API call
            const response = await fetch(`${envVariables.API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();

            console.log('register response data', data)

            user.username = data.user.username
            user.id = data.user.id  
            user.email = data.user.email
            user.token = data.access_token
            user.isAuthenticated = true

            localStorage.setItem('token', data.access_token)

            await router.push('/')
        } catch (err) {
            errorRegister.value = err.message || 'Registration failed'
            throw err
        } finally {
            isLoadingRegister.value = false
        }
    }

    const logout = () => {
        // reset user and token
        resetUser()

        localStorage.removeItem('token')
        // redirect to login
        router.push('/home')
    }

    const resetUser = () => {
        user.username = null
        user.id = null
        user.email = null
        user.token = null
        user.isAuthenticated = false
    }

    const testgetcookie = async () => {
        
        const response = await fetch(`${envVariables.API_BASE_URL}/auth/debug/get_cookies`, {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            console.log('get cookie response', data)
        })
        .catch(error => {
            console.error('Error getting cookie:', error)
        })
    }

    const testsendcookie = async () => {
        const response = await fetch(`${envVariables.API_BASE_URL}/auth/debug/set_cookie`, {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            console.log('set cookie response', data)
        })
        .catch(error => {
            console.error('Error setting cookie:', error)
        })
    }

    return {
        user,
        isLoadingLogin,
        isLoadingRegister,
        errorLogin,
        errorRegister,

        login,
        register,
        logout,
        testgetcookie,
        testsendcookie
    }
    
},{
    persist: true,
}) 