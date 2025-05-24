const envVariables = {
    API_BASE_URL: import.meta.env.PROD
        ? "https://api.senya.ca/api/v1"
        : "http://localhost:5173/api/v1"
}

export default envVariables
