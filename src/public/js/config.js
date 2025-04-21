console.log('Carregando config.js...');

/**
 * Configuração da API
 * Este arquivo centraliza as configurações da API para facilitar a mudança entre ambientes
 * 
 * IMPORTANTE: Esta versão foi reescrita para garantir compatibilidade em todos os ambientes
 * usando URLs relativas e um sistema de fallback resiliente.
 */

const config = {
  // Configurações de ambiente
  environments: {
    development: {
      baseUrls: ['', 'http://localhost:3000', 'http://127.0.0.1:3000'],
      dbConfig: {
        host: 'localhost',
        port: 3306
      }
    },
    production: {
      baseUrls: ['', window.location.origin, 'http://69.62.91.195:3000'],
      dbConfig: {
        host: '69.62.91.195',
        port: 3306
      }
    }
  },
  
  // Detectar ambiente atual
  getCurrentEnvironment: function() {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return isLocalhost ? 'development' : 'production';
  },
  
  // Obter URLs base para o ambiente atual
  getBaseUrls: function() {
    const env = this.getCurrentEnvironment();
    return this.environments[env].baseUrls;
  },
  
  // Mapeamento de rotas incorretas para rotas corretas
  routeMappings: {
    // Veículos - REMOVENDO MAPEAMENTOS PROBLEMÁTICOS DE VERSÕES
    // '/api/veiculos/versoes/all': '/api/versoes',
    // '/api/veiculos/versoes/': '/api/versoes/',
    // '/api/veiculos/versoes/modelo/': '/api/versoes/modelo/',
    // '/api/veiculos/versoes/by-modelo/': '/api/versoes/modelo/',
    // '/api/versoes/public': '/api/versoes',
    
    // Marcas e Modelos
    '/api/marcas': '/api/veiculos/marcas/public',
    '/api/marcas/': '/api/veiculos/marcas/public',
    '/api/modelos/marca/': '/api/veiculos/modelos/by-marca/'
  },
  
  // Função para corrigir uma URL com base nos mapeamentos conhecidos
  fixApiUrl: function(url) {
    if (typeof url !== 'string') return url;
    
    // Verificar cada mapeamento
    for (const [incorrectPath, correctPath] of Object.entries(this.routeMappings)) {
      if (url.includes(incorrectPath)) {
        const fixedUrl = url.replace(incorrectPath, correctPath);
        console.log(`URL Fixer: Corrigindo rota: ${url} -> ${fixedUrl}`);
        return fixedUrl;
      }
    }
    
    return url;
  },
  
  // Função para tentar múltiplas URLs em sequência até encontrar uma que funcione
  async fetchWithFallback(urls, options = {}) {
    if (!Array.isArray(urls)) {
      urls = [urls];
    }
    
    let lastError = null;
    
    // Tentar cada URL em sequência
    for (const url of urls) {
      try {
        console.log('Tentando URL:', url);
        const response = await fetch(url, options);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            message: `${response.status} - ${response.statusText}`
          }));
          
          console.log(`Falha na URL ${url}: ${response.status} - ${response.statusText}`);
          lastError = errorData;
          continue; // Tentar próxima URL
        }
        
        // Se chegou aqui, a resposta foi bem-sucedida
        console.log('URL bem-sucedida:', url);
        return await response.json();
      } catch (error) {
        console.log(`Erro ao acessar ${url}:`, error.message);
        lastError = error;
      }
    }
    
    // Se chegou aqui, todas as URLs falharam
    console.log('Detalhes do erro:', lastError);
    
    // Se estamos buscando versões e todas as URLs falharam, retornar um array vazio
    // para evitar quebrar a interface do usuário
    if (urls.some(url => url.includes('/versoes'))) {
      console.log('Retornando array vazio para versões como fallback');
      return [];
    }
    
    throw new Error(`Não foi possível acessar nenhuma das URLs: ${lastError?.message || 'Erro desconhecido'}`);
  },
  
  // Função auxiliar para fazer requisições GET
  get: async function(endpoint, options = {}) {
    return this.fetchWithFallback(endpoint, {
      method: 'GET',
      ...options
    });
  },
  
  // Função auxiliar para fazer requisições POST
  post: async function(endpoint, data, options = {}) {
    return this.fetchWithFallback(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    });
  },
  
  // Função auxiliar para fazer requisições PUT
  put: async function(endpoint, data, options = {}) {
    return this.fetchWithFallback(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    });
  },
  
  // Função auxiliar para fazer requisições DELETE
  delete: async function(endpoint, options = {}) {
    return this.fetchWithFallback(endpoint, {
      method: 'DELETE',
      ...options
    });
  }
};

console.log('Usando sistema de fallback resiliente para todas as chamadas à API');

// Verificar se o objeto config está disponível globalmente
if (typeof window !== 'undefined') {
  window.config = config;
  console.log('Objeto config disponível globalmente');
}
