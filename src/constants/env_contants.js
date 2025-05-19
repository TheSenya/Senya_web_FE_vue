const envVariables = {
    API_BASE_URL: import.meta.env.VITE_PROD === 'true'
        ? import.meta.env.VITE_API_BASE_URL_PROD
        : import.meta.env.VITE_API_BASE_URL_DEV || '/api/v1',
}

export default envVariables
