export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
};

// Log para verificar que se está usando el environment correcto
if (typeof console !== 'undefined') {
  console.log('🔧 DEVELOPMENT Environment loaded!');
  console.log('📡 API URL:', environment.apiUrl);
}