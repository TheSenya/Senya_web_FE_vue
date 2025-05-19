console.log('Vite Mode:', import.meta.env.MODE);
console.log('Vite PROD flag:', import.meta.env.PROD);
console.log('API_BASE_URL_PROD from env:', import.meta.env.API_BASE_URL_PROD);
console.log('API_BASE_URL_DEV from env:', import.meta.env.API_BASE_URL_DEV);


export const envVariables = {
  API_BASE_URL: import.meta.env.MODE === 'production'
      ? import.meta.env.API_BASE_URL_PROD
      : import.meta.env.API_BASE_URL_DEV || '/api/v1',
};

console.log('Calculated API_BASE_URL:', envVariables.API_BASE_URL);

// Add a check for undefined specifically for production
if (import.meta.env.PROD && typeof import.meta.env.API_BASE_URL_PROD === 'undefined') {
    console.error("CRITICAL: API_BASE_URL_PROD is undefined in production build!");
}
if (import.meta.env.PROD && typeof envVariables.API_BASE_URL === 'undefined') {
    console.error("CRITICAL: envVariables.API_BASE_URL resolved to undefined in production build!");
}

export default envVariables;