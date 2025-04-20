console.log('Carregando config.js...');

/**
 * Configuração da API
 * Este arquivo centraliza as configurações da API para facilitar a mudança entre ambientes
 */

// Detecta se estamos em ambiente de produção ou desenvolvimento
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// Define a URL base da API
const config = {
  // Em produção, usa URLs relativas (vazio)
  // Em desenvolvimento, usa localhost completo
  apiBaseUrl: isProduction ? '' : 'http://localhost:3000',
  
  // Função auxiliar para obter a URL completa da API
  getApiUrl: function(endpoint) {
    // Remover barras iniciais duplicadas se o endpoint já começar com barra
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.apiBaseUrl}${cleanEndpoint}`;
  }
};

console.log('Ambiente de execução:', isProduction ? 'Produção' : 'Desenvolvimento');
console.log('URL base da API:', config.apiBaseUrl || '(URLs relativas)');

// Verificar se o objeto config está disponível globalmente
if (typeof window !== 'undefined') {
  window.config = config;
  console.log('Objeto config disponível globalmente');
}
