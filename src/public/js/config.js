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
    
    // Adicionar URLs com prefixo de domínio para tentar também
    const baseUrls = ['', 'http://localhost:3000', window.location.origin];
    let expandedUrls = [];
    
    // Para cada URL original, criar versões com diferentes prefixos
    urls.forEach(url => {
      // Se a URL já começa com http:// ou https://, não adicionar prefixos
      if (url.startsWith('http://') || url.startsWith('https://')) {
        expandedUrls.push(url);
      } else {
        // Adicionar versões com diferentes prefixos
        baseUrls.forEach(baseUrl => {
          // Garantir que não haja barras duplicadas
          const cleanUrl = url.startsWith('/') ? url : `/${url}`;
          expandedUrls.push(`${baseUrl}${cleanUrl}`);
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
        
        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId); // Limpar o timeout se a requisição for bem-sucedida
        
        if (response.ok) {
          console.log(`URL bem-sucedida: ${url}`);
          
          // Armazenar URL bem-sucedida para uso futuro
          localStorage.setItem(storedUrlKey, url); // Armazenar URL completa
          
          return await response.json();
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
            const errorData = await response.json();
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
  }
};

console.log('Usando URLs relativas para todas as chamadas à API');

// Verificar se o objeto config está disponível globalmente
if (typeof window !== 'undefined') {
  window.config = config;
  console.log('Objeto config disponível globalmente');
}
