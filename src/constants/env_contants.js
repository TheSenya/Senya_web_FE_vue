// Production API URL constant
const PRODUCTION_API_URL = "https://api.senya.ca/api/v1"

const envVariables = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL ||
        (import.meta.env.MODE === 'production' || import.meta.env.PROD
            ? PRODUCTION_API_URL
            : "http://localhost:8000/api/v1") ||
        PRODUCTION_API_URL  // Final fallback to ensure it's never undefined
}

// Debug logging
console.log('Environment mode:', import.meta.env.MODE)
console.log('Is production:', import.meta.env.PROD)
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
console.log('API Base URL:', envVariables.API_BASE_URL)

// Ensure API_BASE_URL is never undefined
if (!envVariables.API_BASE_URL || envVariables.API_BASE_URL === 'undefined') {
    console.error('API_BASE_URL is undefined, falling back to production URL')
    envVariables.API_BASE_URL = PRODUCTION_API_URL
}

export default envVariables
