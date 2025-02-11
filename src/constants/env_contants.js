const envVariables = {
    API_BASE_URL: import.meta.env.PROD 
        ? import.meta.env.VITE_API_BASE_URL_PROD 
        : import.meta.env.VITE_API_BASE_URL_DEV || 'http://localhost:3000/api/v1',
}

export default envVariables