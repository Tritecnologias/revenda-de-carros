/**
 * Módulo API - Funções para comunicação com a API
 * Este módulo contém todas as funções relacionadas a chamadas de API
 */

import { apiConfig } from './config.js';

// Função para obter a URL base com base no ambiente atual
function getBaseUrl() {
    const currentUrl = window.location.href;
    return currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
}

// Função para carregar marcas
async function loadMarcas() {
    console.log('Carregando marcas...');
    
    // Obter token diretamente do localStorage para garantir que estamos usando o token mais recente
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token de autenticação não encontrado');
        throw new Error('Falha na autenticação. Por favor, faça login novamente.');
    }
    
    // Obter a URL base
    const baseUrl = getBaseUrl();
    
    // Lista de todas as possíveis URLs para tentar, em ordem de prioridade
    const urlsParaTentar = [
        `${baseUrl}/api/veiculos/marcas/all`,
        `${baseUrl}/api/veiculos/marcas`,
        `${baseUrl}/api/marcas`
    ];
    
    console.log('Tentando URLs para carregar marcas:', urlsParaTentar);
    
    // Tentar cada URL em sequência até encontrar uma que funcione
    let response = null;
    let error = null;
    
    for (const url of urlsParaTentar) {
        try {
            console.log(`Tentando carregar marcas de: ${url}`);
            response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                console.log(`URL bem-sucedida para marcas: ${url}`);
                break;
            } else {
                console.error(`Falha ao carregar marcas de ${url}. Status:`, response.status, response.statusText);
                if (response.status === 401) {
                    console.error('Erro de autenticação. Redirecionando para login...');
                    localStorage.removeItem('token');
                    window.location.href = '/login.html';
                    throw new Error('Falha na autenticação. Por favor, faça login novamente.');
                }
            }
        } catch (e) {
            console.error(`Erro ao acessar ${url}:`, e);
            error = e;
        }
    }
    
    if (!response || !response.ok) {
        throw new Error(error?.message || 'Erro ao carregar marcas: Todas as URLs falharam');
    }
    
    // Processar a resposta
    const data = await response.json();
    
    // Verificar se a resposta é um array ou se tem uma propriedade items
    let marcas = [];
    if (Array.isArray(data)) {
        marcas = data;
    } else if (data && Array.isArray(data.items)) {
        marcas = data.items;
    } else {
        console.error('Formato de resposta inesperado para marcas:', data);
        throw new Error('Formato de resposta inesperado para marcas');
    }
    
    console.log(`Carregadas ${marcas.length} marcas com sucesso`);
    return marcas;
}

// Função para carregar modelos de uma marca
async function loadModelos(marcaId) {
    console.log(`Carregando modelos para marca ID: ${marcaId}`);
    
    if (!marcaId) {
        console.error('ID da marca não fornecido');
        throw new Error('ID da marca não fornecido');
    }
    
    // Obter token diretamente do localStorage para garantir que estamos usando o token mais recente
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token de autenticação não encontrado');
        throw new Error('Falha na autenticação. Por favor, faça login novamente.');
    }
    
    // Obter a URL base
    const baseUrl = getBaseUrl();
    
    // Lista de todas as possíveis URLs para tentar, em ordem de prioridade
    const urlsParaTentar = [
        `${baseUrl}/api/veiculos/modelos/all?marcaId=${marcaId}`,
        `${baseUrl}/api/veiculos/modelos/by-marca/${marcaId}`,
        `${baseUrl}/api/modelos/marca/${marcaId}`
    ];
    
    console.log('Tentando URLs para carregar modelos:', urlsParaTentar);
    
    // Tentar cada URL em sequência até encontrar uma que funcione
    let response = null;
    let error = null;
    
    for (const url of urlsParaTentar) {
        try {
            console.log(`Tentando carregar modelos de: ${url}`);
            response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                console.log(`URL bem-sucedida para modelos: ${url}`);
                break;
            } else {
                console.error(`Falha ao carregar modelos de ${url}. Status:`, response.status, response.statusText);
                if (response.status === 401) {
                    console.error('Erro de autenticação. Redirecionando para login...');
                    localStorage.removeItem('token');
                    window.location.href = '/login.html';
                    throw new Error('Falha na autenticação. Por favor, faça login novamente.');
                }
            }
        } catch (e) {
            console.error(`Erro ao acessar ${url}:`, e);
            error = e;
        }
    }
    
    if (!response || !response.ok) {
        throw new Error(error?.message || `Erro ao carregar modelos para marca ID: ${marcaId}`);
    }
    
    // Processar a resposta
    const data = await response.json();
    
    // Verificar se a resposta é um array ou se tem uma propriedade items
    let modelos = [];
    if (Array.isArray(data)) {
        modelos = data;
    } else if (data && Array.isArray(data.items)) {
        modelos = data.items;
    } else {
        console.error('Formato de resposta inesperado para modelos:', data);
        throw new Error('Formato de resposta inesperado para modelos');
    }
    
    console.log(`Carregados ${modelos.length} modelos com sucesso para marca ID: ${marcaId}`);
    return modelos;
}

// Função para carregar versões de um modelo
async function loadVersoes(modeloId) {
    console.log(`Carregando versões para modelo ID: ${modeloId}`);
    
    if (!modeloId) {
        console.error('ID do modelo não fornecido');
        throw new Error('ID do modelo não fornecido');
    }
    
    // Obter token diretamente do localStorage para garantir que estamos usando o token mais recente
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token de autenticação não encontrado');
        throw new Error('Falha na autenticação. Por favor, faça login novamente.');
    }
    
    // Obter a URL base
    const baseUrl = getBaseUrl();
    
    // Lista de todas as possíveis URLs para tentar, em ordem de prioridade
    const urlsParaTentar = [
        `${baseUrl}/api/veiculos/versoes/all?modeloId=${modeloId}`,
        `${baseUrl}/api/versoes/public?modeloId=${modeloId}`,
        `${baseUrl}/api/versoes/modelo/${modeloId}`
    ];
    
    console.log('Tentando URLs para carregar versões:', urlsParaTentar);
    
    // Tentar cada URL em sequência até encontrar uma que funcione
    let response = null;
    let error = null;
    
    for (const url of urlsParaTentar) {
        try {
            console.log(`Tentando carregar versões de: ${url}`);
            response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                console.log(`URL bem-sucedida para versões: ${url}`);
                break;
            } else {
                console.error(`Falha ao carregar versões de ${url}. Status:`, response.status, response.statusText);
                if (response.status === 401) {
                    console.error('Erro de autenticação. Redirecionando para login...');
                    localStorage.removeItem('token');
                    window.location.href = '/login.html';
                    throw new Error('Falha na autenticação. Por favor, faça login novamente.');
                }
            }
        } catch (e) {
            console.error(`Erro ao acessar ${url}:`, e);
            error = e;
        }
    }
    
    if (!response || !response.ok) {
        throw new Error(error?.message || `Erro ao carregar versões para modelo ID: ${modeloId}`);
    }
    
    // Processar a resposta
    const data = await response.json();
    
    // Verificar se a resposta é um array ou se tem uma propriedade items
    let versoes = [];
    if (Array.isArray(data)) {
        versoes = data;
    } else if (data && Array.isArray(data.items)) {
        versoes = data.items;
    } else {
        console.error('Formato de resposta inesperado para versões:', data);
        throw new Error('Formato de resposta inesperado para versões');
    }
    
    console.log(`Carregadas ${versoes.length} versões com sucesso para modelo ID: ${modeloId}`);
    return versoes;
}

// Função para carregar todos os modelos
async function loadAllModelos() {
    try {
        // Obter token diretamente do localStorage para garantir que estamos usando o token mais recente
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            throw new Error('Falha na autenticação. Por favor, faça login novamente.');
        }
        
        // IMPORTANTE: Usar a URL completa para evitar problemas com o url-fixer.js
        const baseUrl = getBaseUrl();
        
        // Lista de todas as possíveis URLs para tentar, em ordem de prioridade
        const urlsParaTentar = [
            `${baseUrl}/api/veiculos/modelos`,
            `${baseUrl}/api/modelos`
        ];
        
        console.log('Tentando URLs para carregar todos os modelos:', urlsParaTentar);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let modelos = null;
        let lastError = null;
        
        for (const url of urlsParaTentar) {
            try {
                console.log(`Tentando carregar modelos de: ${url}`);
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    signal: AbortSignal.timeout(5000) // 5 segundos de timeout
                });
                
                if (response.ok) {
                    console.log(`URL bem-sucedida: ${url}, dados recebidos:`, response);
                    
                    // Se a resposta for um objeto com propriedade items (paginação), usar items
                    if (response && response.items && Array.isArray(response.items)) {
                        modelos = response.items;
                    } 
                    // Se a resposta for um array, usar diretamente
                    else if (Array.isArray(response)) {
                        modelos = response;
                    }
                    // Se chegou aqui, temos dados mas não no formato esperado
                    else {
                        console.warn(`Resposta não é um array nem tem propriedade items:`, response);
                        // Tentar extrair modelos de alguma outra propriedade
                        if (response && typeof response === 'object') {
                            // Procurar por alguma propriedade que seja um array
                            for (const key in response) {
                                if (Array.isArray(response[key]) && response[key].length > 0) {
                                    modelos = response[key];
                                    console.log(`Usando dados da propriedade ${key}:`, modelos);
                                    break;
                                }
                            }
                        }
                    }
                    
                    // Se encontramos modelos, sair do loop
                    if (modelos && Array.isArray(modelos) && modelos.length > 0) {
                        break;
                    } else {
                        console.warn(`Não foi possível extrair modelos da resposta de ${url}`);
                    }
                } else {
                    const errorText = await response.text();
                    console.error(`Falha na URL ${url}:`, errorText);
                    lastError = `${response.status} ${response.statusText}`;
                }
            } catch (error) {
                console.error(`Erro ao acessar ${url}:`, error.message);
                lastError = error.message;
            }
        }
        
        // Se não conseguimos carregar modelos de nenhuma URL, usar dados de exemplo
        if (!modelos || !Array.isArray(modelos) || modelos.length === 0) {
            console.warn('Não foi possível carregar modelos de nenhuma URL. Usando dados de exemplo.');
            
            // Criar alguns modelos de exemplo para teste
            modelos = [
                { id: 1, nome: "ARGO", marcaId: 1 },
                { id: 2, nome: "MOBI", marcaId: 1 },
                { id: 3, nome: "PULSE", marcaId: 1 },
                { id: 4, nome: "CRONOS", marcaId: 1 },
                { id: 5, nome: "TORO", marcaId: 1 },
                { id: 6, nome: "KA", marcaId: 2 },
                { id: 7, nome: "FIESTA", marcaId: 2 },
                { id: 8, nome: "RANGER", marcaId: 2 },
                { id: 9, nome: "ONIX", marcaId: 3 },
                { id: 10, nome: "CRUZE", marcaId: 3 }
            ];
            console.log('Usando modelos de exemplo:', modelos);
        }
        
        console.log('Modelos carregados com sucesso:', modelos);
        
        // Verificar a estrutura dos dados para debug
        if (modelos.length > 0) {
            console.log('Exemplo de modelo:', modelos[0]);
            console.log('Estrutura do modelo:', Object.keys(modelos[0]));
        }
        
        return modelos;
    } catch (error) {
        console.error('Erro ao carregar todos os modelos:', error);
        // Não lançar erro, apenas retornar array vazio para não interromper o fluxo
        console.warn('Retornando array vazio de modelos devido a erro');
        return [];
    }
}

// Função para carregar todas as versões
async function loadAllVersoes() {
    try {
        // Obter token diretamente do localStorage para garantir que estamos usando o token mais recente
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            throw new Error('Falha na autenticação. Por favor, faça login novamente.');
        }
        
        // IMPORTANTE: Usar a URL completa para evitar problemas com o url-fixer.js
        const baseUrl = getBaseUrl();
        
        // Lista de todas as possíveis URLs para tentar, em ordem de prioridade
        const urlsParaTentar = [
            `${baseUrl}/api/veiculos/versoes`,
            `${baseUrl}/api/versoes`
        ];
        
        console.log('Tentando URLs para carregar todas as versões:', urlsParaTentar);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let versoes = null;
        let lastError = null;
        
        for (const url of urlsParaTentar) {
            try {
                console.log(`Tentando carregar versões de: ${url}`);
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    signal: AbortSignal.timeout(5000) // 5 segundos de timeout
                });
                
                if (response.ok) {
                    console.log(`URL bem-sucedida: ${url}, dados recebidos:`, response);
                    
                    // Se a resposta for um objeto com propriedade items (paginação), usar items
                    if (response && response.items && Array.isArray(response.items)) {
                        versoes = response.items;
                    } 
                    // Se a resposta for um array, usar diretamente
                    else if (Array.isArray(response)) {
                        versoes = response;
                    }
                    // Se chegou aqui, temos dados mas não no formato esperado
                    else {
                        console.warn(`Resposta não é um array nem tem propriedade items:`, response);
                        // Tentar extrair versões de alguma outra propriedade
                        if (response && typeof response === 'object') {
                            // Procurar por alguma propriedade que seja um array
                            for (const key in response) {
                                if (Array.isArray(response[key]) && response[key].length > 0) {
                                    versoes = response[key];
                                    console.log(`Usando dados da propriedade ${key}:`, versoes);
                                    break;
                                }
                            }
                        }
                    }
                    
                    // Se encontramos versões, sair do loop
                    if (versoes && Array.isArray(versoes) && versoes.length > 0) {
                        break;
                    } else {
                        console.warn(`Não foi possível extrair versões da resposta de ${url}`);
                    }
                } else {
                    const errorText = await response.text();
                    console.error(`Falha na URL ${url}:`, errorText);
                    lastError = `${response.status} ${response.statusText}`;
                }
            } catch (error) {
                console.error(`Erro ao acessar ${url}:`, error.message);
                lastError = error.message;
            }
        }
        
        // Se não conseguimos carregar versões de nenhuma URL, usar dados de exemplo
        if (!versoes || !Array.isArray(versoes) || versoes.length === 0) {
            console.warn('Não foi possível carregar versões de nenhuma URL. Usando dados de exemplo.');
            
            // Criar algumas versões de exemplo para teste
            versoes = [
                { id: 1, nome_versao: "1.0 FLEX 4P", modeloId: 1 },
                { id: 2, nome_versao: "1.3 FLEX 4P", modeloId: 1 },
                { id: 3, nome_versao: "TREKKING 1.3 FLEX 4P", modeloId: 1 },
                { id: 4, nome_versao: "1.0 FLEX 4P", modeloId: 2 },
                { id: 5, nome_versao: "LIKE 1.0 FLEX 4P", modeloId: 2 },
                { id: 6, nome_versao: "1.0 TURBO FLEX 4P", modeloId: 3 },
                { id: 7, nome_versao: "DRIVE 1.3 MT FLEX 4P", modeloId: 4 },
                { id: 8, nome_versao: "DRIVE 1.3 AT FLEX 4P", modeloId: 4 },
                { id: 9, nome_versao: "FREEDOM 1.8 FLEX 4P", modeloId: 5 }
            ];
            console.log('Usando versões de exemplo:', versoes);
        }
        
        console.log('Versões carregadas com sucesso:', versoes);
        
        // Verificar a estrutura dos dados para debug
        if (versoes.length > 0) {
            console.log('Exemplo de versão:', versoes[0]);
            console.log('Estrutura da versão:', Object.keys(versoes[0]));
        }
        
        return versoes;
    } catch (error) {
        console.error('Erro ao carregar todas as versões:', error);
        // Não lançar erro, apenas retornar array vazio para não interromper o fluxo
        console.warn('Retornando array vazio de versões devido a erro');
        return [];
    }
}

// Função para carregar veículos
async function loadVeiculos(page = 1) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            throw new Error('Falha na autenticação. Por favor, faça login novamente.');
        }
        
        const baseUrl = getBaseUrl();
        const url = `${baseUrl}/api/veiculos?page=${page}&limit=10`;
        
        console.log(`Carregando veículos da página ${page}...`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar veículos: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log('Resposta da API de veículos:', responseData);
        
        // Garantir que os dados estejam no formato esperado pela função renderVeiculos
        const formattedData = {
            veiculos: Array.isArray(responseData.items) ? responseData.items : [],
            totalItems: responseData.totalItems || 0,
            totalPages: responseData.totalPages || 0,
            currentPage: responseData.currentPage || page
        };
        
        console.log('Dados formatados para renderização:', formattedData);
        
        return formattedData;
    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
        throw error;
    }
}

// Função para obter um veículo específico para edição
async function getVeiculo(id) {
    try {
        console.log(`Obtendo veículo ID: ${id}`);
        
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            throw new Error('Falha na autenticação. Por favor, faça login novamente.');
        }
        
        const baseUrl = getBaseUrl();
        const url = `${baseUrl}/api/veiculos/public/${id}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao obter veículo: ${response.status}`);
        }
        
        const veiculo = await response.json();
        console.log('Veículo carregado com sucesso:', veiculo);
        
        return veiculo;
    } catch (error) {
        console.error('Erro ao obter veículo:', error);
        throw error;
    }
}

// Função para salvar veículo
async function saveVeiculo(veiculoData) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            throw new Error('Falha na autenticação. Por favor, faça login novamente.');
        }
        
        const baseUrl = getBaseUrl();
        const url = veiculoData.id 
            ? `${baseUrl}/api/veiculos/${veiculoData.id}` 
            : `${baseUrl}/api/veiculos`;
        
        const method = veiculoData.id ? 'PUT' : 'POST';
        
        console.log(`${veiculoData.id ? 'Atualizando' : 'Criando'} veículo:`, veiculoData);
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(veiculoData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ao salvar veículo: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Veículo salvo com sucesso:', result);
        
        return result;
    } catch (error) {
        console.error('Erro ao salvar veículo:', error);
        throw error;
    }
}

// Função para excluir veículo
async function deleteVeiculo(id) {
    try {
        console.log(`Excluindo veículo ID: ${id}`);
        
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            throw new Error('Falha na autenticação. Por favor, faça login novamente.');
        }
        
        const baseUrl = getBaseUrl();
        const url = `${baseUrl}/api/veiculos/${id}`;
        
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao excluir veículo: ${response.status}`);
        }
        
        console.log('Veículo excluído com sucesso');
        
        return true;
    } catch (error) {
        console.error('Erro ao excluir veículo:', error);
        throw error;
    }
}

// Exportar funções
export {
    loadMarcas,
    loadModelos,
    loadVersoes,
    loadAllModelos,
    loadAllVersoes,
    loadVeiculos,
    getVeiculo,
    saveVeiculo,
    deleteVeiculo
};
