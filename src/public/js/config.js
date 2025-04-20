console.log('Carregando config.js...');

/**
 * Configuração da API
 * Este arquivo centraliza as configurações da API para facilitar a mudança entre ambientes
 * 
 * IMPORTANTE: Esta versão foi reescrita para garantir compatibilidade em todos os ambientes
 * usando URLs relativas e um sistema de fallback resiliente.
 */

const config = {
  // Sempre usar URLs relativas, independentemente do ambiente
  apiBaseUrl: '',
  
  // Função para obter a URL da API com fallback
  getApiUrl: function(endpoint, fallbacks = []) {
    // Remover barras iniciais duplicadas se o endpoint já começar com barra
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Retornar a URL relativa principal
    return cleanEndpoint;
  },
  
  // Função para tentar múltiplas URLs em sequência até encontrar uma que funcione
  fetchWithFallback: async function(urls, options = {}) {
    // Verificar se temos uma URL bem-sucedida armazenada para este tipo de endpoint
    const endpointType = urls[0].split('/')[2]; // Ex: 'veiculos', 'versoes', etc.
    const storedUrlKey = `successful_${endpointType}_url`;
    const storedUrl = localStorage.getItem(storedUrlKey);
    
    // Se temos uma URL armazenada, tentar ela primeiro
    if (storedUrl) {
      const storedUrlWithParams = urls[0].includes('?') && !storedUrl.includes('?') 
        ? `${storedUrl}${urls[0].substring(urls[0].indexOf('?'))}` 
        : storedUrl;
      
      urls = [storedUrlWithParams, ...urls.filter(url => url !== storedUrlWithParams)];
    }
    
    // Remover duplicatas
    urls = [...new Set(urls)];
    
    console.log(`Tentando URLs em sequência:`, urls);
    
    let lastError = null;
    
    // Tentar cada URL até encontrar uma que funcione
    for (const url of urls) {
      try {
        console.log(`Tentando URL: ${url}`);
        const response = await fetch(url, options);
        
        if (response.ok) {
          console.log(`URL bem-sucedida: ${url}`);
          
          // Armazenar URL bem-sucedida para uso futuro
          localStorage.setItem(storedUrlKey, url.split('?')[0]); // Armazenar sem parâmetros
          
          return await response.json();
        } else {
          console.log(`Falha na URL ${url}: ${response.status}`);
          
          // Se for erro de autenticação, redirecionar para login
          if (response.status === 401) {
            console.error('Sessão expirada ou token inválido');
            window.location.href = '/login.html';
            return null;
          }
        }
      } catch (error) {
        console.error(`Erro ao tentar URL ${url}:`, error);
        lastError = error;
      }
    }
    
    // Se chegamos aqui, todas as URLs falharam
    throw new Error(lastError?.message || 'Não foi possível conectar a nenhuma API disponível');
  }
};

console.log('Usando URLs relativas para todas as chamadas à API');

// Verificar se o objeto config está disponível globalmente
if (typeof window !== 'undefined') {
  window.config = config;
  console.log('Objeto config disponível globalmente');
}
