const envVariables = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL_DEV || 'http://localhost:8000/api/v1',

}

export default envVariables