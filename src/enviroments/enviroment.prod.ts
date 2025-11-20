export const environment = {
  production: true,
  apiUrl: 'https://nutritrack-api-wt8b.onrender.com/api/v1',
  apiKey: ''
};

// Log para verificar que se está usando el environment correcto
if (typeof console !== 'undefined') {
  console.log('🚀 PRODUCTION Environment loaded!');
  console.log('📡 API URL:', environment.apiUrl);
}