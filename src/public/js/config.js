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
  
  // Função para armazenar dados mockados como último recurso
  storeMockData: function(endpointType, data) {
    if (!data) return;
    
    const mockDataKey = `mock_${endpointType}_data`;
    try {
      localStorage.setItem(mockDataKey, JSON.stringify(data));
      console.log(`Dados mockados armazenados para ${endpointType}`);
    } catch (error) {
      console.error(`Erro ao armazenar dados mockados para ${endpointType}:`, error);
    }
  },
  
  // Mapeamento de rotas incorretas para rotas corretas
  routeMappings: {
    // Veículos
    '/api/veiculos/versoes/all': '/api/versoes/public',
    '/api/veiculos/versoes/': '/api/versoes/',
    '/api/veiculos/versoes/modelo/': '/api/versoes/modelo/',
    '/api/veiculos/versoes/by-modelo/': '/api/versoes/modelo/',
    
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
  fetchWithFallback: async function(urls, options = {}) {
    try {
      // Se urls for uma string única, convertê-la para array
      if (typeof urls === 'string') {
        urls = [urls];
      }
      
      // Corrigir rotas conhecidas incorretas
      urls = urls.map(url => this.fixApiUrl(url));
      
      // Verificar se temos uma URL bem-sucedida armazenada para este tipo de endpoint
      const endpointType = urls[0].split('/')[2]; // Ex: 'veiculos', 'versoes', etc.
      const storedUrlKey = `successful_${endpointType}_url`;
      const storedUrl = localStorage.getItem(storedUrlKey);
      
      // Se temos uma URL armazenada, tentar ela primeiro
      let expandedUrls = [];
      if (storedUrl) {
        // Adicionar a URL armazenada como primeira opção
        expandedUrls.push(storedUrl);
      }
      
      // Obter URLs base para o ambiente atual
      const baseUrls = this.getBaseUrls();
      
      // Para cada URL original, criar versões com diferentes prefixos
      urls.forEach(url => {
        // Se a URL já começa com http:// ou https://, adicioná-la diretamente
        if (url.startsWith('http://') || url.startsWith('https://')) {
          if (!expandedUrls.includes(url)) {
            expandedUrls.push(url);
          }
        } else {
          // Adicionar versões com diferentes prefixos
          baseUrls.forEach(baseUrl => {
            // Garantir que não haja barras duplicadas
            const cleanUrl = url.startsWith('/') ? url : `/${url}`;
            const fullUrl = `${baseUrl}${cleanUrl}`;
            if (!expandedUrls.includes(fullUrl)) {
              expandedUrls.push(fullUrl);
            }
          });
        }
      });
      
      // Remover duplicatas
      expandedUrls = [...new Set(expandedUrls)];
      
      console.log(`Tentando URLs expandidas em sequência:`, expandedUrls);
      
      let lastError = null;
      
      // Tentar cada URL até encontrar uma que funcione
      for (const url of expandedUrls) {
        try {
          console.log(`Tentando URL: ${url}`);
          
          // Configurar timeout para evitar esperas muito longas
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout
          
          const fetchOptions = {
            ...options,
            signal: controller.signal
          };
          
          const response = await fetch(url, fetchOptions).catch(err => {
            clearTimeout(timeoutId);
            throw err;
          });
          
          clearTimeout(timeoutId); // Limpar o timeout se a requisição for bem-sucedida
          
          if (response.ok) {
            console.log(`URL bem-sucedida: ${url}`);
            
            // Armazenar URL bem-sucedida para uso futuro
            localStorage.setItem(storedUrlKey, url); // Armazenar URL completa
            
            const data = await response.json().catch(err => {
              console.error('Erro ao parsear resposta JSON:', err);
              throw new Error('Erro ao processar resposta do servidor');
            });
            
            // Armazenar dados como mockados para uso futuro
            if (data) {
              this.storeMockData(endpointType, data);
            }
            
            return data;
          } else {
            console.log(`Falha na URL ${url}: ${response.status} - ${response.statusText}`);
            
            // Se for erro de autenticação, redirecionar para login
            if (response.status === 401) {
              console.error('Sessão expirada ou token inválido');
              window.location.href = '/login.html';
              return null;
            }
            
            // Para outros erros, tentar ler a mensagem de erro
            try {
              const errorData = await response.json().catch(() => ({}));
              console.error('Detalhes do erro:', errorData);
            } catch (e) {
              console.error('Não foi possível ler detalhes do erro');
            }
          }
        } catch (error) {
          console.error(`Erro ao tentar URL ${url}:`, error);
          
          // Limpar a URL armazenada se for a que falhou
          if (url === storedUrl) {
            console.log(`Removendo URL armazenada que falhou: ${url}`);
            localStorage.removeItem(storedUrlKey);
          }
          
          lastError = error;
        }
      }
      
      // Se chegamos aqui, todas as URLs falharam
      // Verificar se temos dados mockados para usar como último recurso
      const mockDataKey = `mock_${endpointType}_data`;
      const mockData = localStorage.getItem(mockDataKey);
      
      if (mockData) {
        console.warn(`Usando dados mockados para ${endpointType} como último recurso`);
        try {
          return JSON.parse(mockData);
        } catch (e) {
          console.error('Erro ao parsear dados mockados:', e);
        }
      }
      
      throw new Error(lastError?.message || 'Não foi possível conectar a nenhuma API disponível');
    } catch (finalError) {
      console.error('Erro fatal em fetchWithFallback:', finalError);
      throw finalError;
    }
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
