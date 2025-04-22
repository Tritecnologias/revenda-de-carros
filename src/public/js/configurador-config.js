/**
 * CONFIGURADOR - CONFIGURAÇÃO SEM FALLBACKS
 * 
 * Este arquivo substitui o config.js para o configurador,
 * garantindo que NÃO EXISTAM DADOS MOCKADOS ou FALLBACKS.
 * 
 * Todas as chamadas de API devem retornar apenas dados reais
 * ou falhar explicitamente.
 */

console.log('Carregando configurador-config.js - VERSÃO SEM FALLBACKS');

const configuradorConfig = {
  // Configurações de ambiente
  apiBaseUrl: window.location.hostname.includes('localhost') ? 'http://localhost:3000' : 'http://69.62.91.195:3000',
  
  // Função para obter a URL base
  getApiBaseUrl: function() {
    return this.apiBaseUrl;
  },
  
  // Função para fazer requisições à API - SEM FALLBACKS
  async fetchApi(url, options = {}) {
    console.log(`Fazendo requisição para: ${url}`);
    
    try {
      // Adicionar token de autenticação se disponível
      let headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };
      
      try {
        if (typeof Auth !== 'undefined') {
          const auth = new Auth();
          const token = auth.getToken();
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            console.log('Token de autenticação adicionado');
          }
        }
      } catch (authError) {
        console.warn('Erro ao obter token:', authError);
      }
      
      // Fazer a requisição
      const response = await fetch(url, {
        ...options,
        headers: headers
      });
      
      // Verificar se a resposta foi bem-sucedida
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro na requisição: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      // Retornar os dados
      return await response.json();
    } catch (error) {
      console.error(`Erro ao acessar ${url}:`, error);
      throw error; // Propagar o erro para ser tratado pelo chamador
    }
  },
  
  // Função para buscar veículos da tabela de veículos
  async getVeiculos() {
    const url = `${this.apiBaseUrl}/api/veiculos`;
    console.log('Buscando veículos da tabela veiculos:', url);
    return this.fetchApi(url);
  },
  
  // Função para buscar marcas
  async getMarcas() {
    const url = `${this.apiBaseUrl}/api/veiculos/marcas`;
    console.log('Buscando marcas:', url);
    return this.fetchApi(url);
  },
  
  // Função para buscar modelos por marca
  async getModelosByMarca(marcaId) {
    if (!marcaId) {
      throw new Error('ID da marca é obrigatório');
    }
    const url = `${this.apiBaseUrl}/api/veiculos/modelos/by-marca/${marcaId}`;
    console.log('Buscando modelos por marca:', url);
    return this.fetchApi(url);
  },
  
  // Função para buscar versões de um modelo a partir da tabela de veículos
  async getVersoesByModelo(modeloId) {
    if (!modeloId) {
      throw new Error('ID do modelo é obrigatório');
    }
    
    console.log('Buscando versões para o modelo ID:', modeloId);
    
    // Buscar todos os veículos
    const veiculos = await this.getVeiculos();
    console.log('Total de veículos encontrados:', veiculos.length);
    
    // Filtrar veículos pelo modelo
    const veiculosFiltrados = veiculos.filter(v => 
      v.modelo_id == modeloId || 
      v.modeloId == modeloId || 
      (v.modelo && v.modelo.id == modeloId)
    );
    
    console.log('Veículos filtrados por modelo:', veiculosFiltrados.length);
    
    // Extrair versões únicas
    const versoesMap = new Map();
    
    veiculosFiltrados.forEach(veiculo => {
      // Extrair ID da versão
      const versaoId = veiculo.versao_id || veiculo.versaoId || 
                      (veiculo.versao && veiculo.versao.id);
      
      // Extrair nome da versão
      const versaoNome = (veiculo.versao && veiculo.versao.nome) || 
                        veiculo.versao_nome || 
                        veiculo.versaoNome || 
                        `Versão ${versaoId}`;
      
      if (versaoId && !versoesMap.has(versaoId)) {
        versoesMap.set(versaoId, {
          id: versaoId,
          nome: versaoNome,
          veiculoId: veiculo.id,
          preco: veiculo.preco,
          status: veiculo.status
        });
      }
    });
    
    // Converter o Map para array
    const versoes = Array.from(versoesMap.values());
    console.log('Versões extraídas dos veículos:', versoes);
    
    return versoes;
  }
};

// Exportar para o escopo global
window.configuradorConfig = configuradorConfig;
console.log('Configurador config disponível globalmente');
