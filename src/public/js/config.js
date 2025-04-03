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
  apiBaseUrl: isProduction ? '' : 'http://localhost:3000'
};

console.log('Ambiente de execução:', isProduction ? 'Produção' : 'Desenvolvimento');
console.log('URL base da API:', config.apiBaseUrl || '(URLs relativas)');
