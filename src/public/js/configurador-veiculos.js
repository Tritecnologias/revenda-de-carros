/**
 * CONFIGURADOR DE VEÍCULOS
 * 
 * Este arquivo implementa as funções necessárias para o configurador da página inicial,
 * buscando dados EXCLUSIVAMENTE da tabela de veículos do banco de dados.
 * 
 * NÃO HÁ DADOS MOCKADOS OU FALLBACKS NESTE ARQUIVO.
 */

console.log('Carregando configurador-veiculos.js - Versão sem dados mockados');

// Função para carregar versões por modelo - busca APENAS da tabela de veículos
async function loadVersoes(modeloId) {
    if (!modeloId) {
        const versaoSelect = document.getElementById('configuradorVersao');
        if (versaoSelect) {
            versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
            versaoSelect.disabled = true;
        }
        return [];
    }
    
    try {
        console.log('Carregando versões para o modelo ID:', modeloId);
        const versaoSelect = document.getElementById('configuradorVersao');
        if (versaoSelect) {
            versaoSelect.innerHTML = '<option value="">Carregando versões...</option>';
            versaoSelect.disabled = true;
        }
        
        // Buscar versões exclusivamente dos veículos cadastrados
        const versoes = await buscarVersoesDaTabela(modeloId);
        
        // Preencher o select de versões
        if (versaoSelect) {
            // Limpar o select
            versaoSelect.innerHTML = '';
            
            // Adicionar opção padrão
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Selecione uma versão';
            versaoSelect.appendChild(defaultOption);
            
            // Adicionar versões
            if (versoes && versoes.length > 0) {
                versoes.forEach(versao => {
                    const option = document.createElement('option');
                    option.value = versao.id;
                    option.textContent = versao.nome;
                    
                    // Adicionar o ID do veículo como atributo data para uso posterior
                    if (versao.veiculoId) {
                        option.dataset.veiculoId = versao.veiculoId;
                    }
                    
                    versaoSelect.appendChild(option);
                });
                
                // Habilitar o select
                versaoSelect.disabled = false;
            } else {
                // Se não houver versões, adicionar uma opção informativa
                const noOption = document.createElement('option');
                noOption.value = '';
                noOption.textContent = 'Nenhuma versão disponível para este modelo';
                versaoSelect.appendChild(noOption);
                
                // Manter o select desabilitado
                versaoSelect.disabled = true;
            }
        }
        
        return versoes;
    } catch (error) {
        console.error('Erro ao carregar versões:', error);
        
        // Em caso de erro, limpar e desabilitar o select
        const versaoSelect = document.getElementById('configuradorVersao');
        if (versaoSelect) {
            versaoSelect.innerHTML = '<option value="">Erro ao carregar versões</option>';
            versaoSelect.disabled = true;
        }
        
        return [];
    }
}

// Função para buscar versões diretamente da tabela de veículos
async function buscarVersoesDaTabela(modeloId) {
    console.log('Buscando versões diretamente da tabela de veículos para o modelo ID:', modeloId);
    
    // URLs para buscar veículos - apenas endpoints da tabela de veículos
    const veiculosUrls = [
        `/api/veiculos`,
        `http://localhost:3000/api/veiculos`,
        `http://69.62.91.195:3000/api/veiculos`
    ];
    
    // Tentar cada URL em sequência
    for (const url of veiculosUrls) {
        try {
            console.log(`Tentando buscar veículos de: ${url}`);
            
            // Obter token de autenticação
            let headers = {
                'Content-Type': 'application/json'
            };
            
            try {
                const auth = new Auth();
                const token = auth.getToken();
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                    console.log('Token de autenticação adicionado ao cabeçalho');
                }
            } catch (authError) {
                console.warn('Erro ao obter token de autenticação:', authError);
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
                signal: AbortSignal.timeout(5000) // 5 segundos de timeout
            });
            
            if (response.ok) {
                const veiculos = await response.json();
                console.log(`Resposta recebida de ${url}, total de veículos:`, Array.isArray(veiculos) ? veiculos.length : 'não é array');
                
                // Verificar formato da resposta
                let veiculosArray = [];
                
                if (Array.isArray(veiculos)) {
                    veiculosArray = veiculos;
                } else if (veiculos && veiculos.items && Array.isArray(veiculos.items)) {
                    veiculosArray = veiculos.items;
                } else {
                    console.warn(`A resposta de ${url} não é um array nem um objeto paginado:`, veiculos);
                    continue;
                }
                
                // Filtrar veículos pelo modelo selecionado
                const veiculosFiltrados = veiculosArray.filter(v => 
                    v.modelo_id == modeloId || 
                    v.modeloId == modeloId || 
                    (v.modelo && v.modelo.id == modeloId)
                );
                
                console.log('Veículos encontrados para o modelo:', veiculosFiltrados.length);
                
                // Se não encontrou veículos para este modelo, continuar para a próxima URL
                if (veiculosFiltrados.length === 0) {
                    console.log(`Nenhum veículo encontrado para o modelo ${modeloId} na URL ${url}`);
                    continue;
                }
                
                // Extrair versões únicas dos veículos
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
                
                // Retornar apenas se encontrou versões
                if (versoes.length > 0) {
                    return versoes;
                }
            } else {
                const errorText = await response.text();
                console.error(`Falha na URL ${url}:`, response.status, errorText);
            }
        } catch (error) {
            console.error(`Erro ao acessar ${url}:`, error.message);
        }
    }
    
    console.log('Não foi possível encontrar versões na tabela de veículos');
    return [];
}

// Função para carregar marcas - busca diretamente da API
async function loadMarcas() {
    console.log('Carregando marcas para o configurador...');
    
    const marcaSelect = document.getElementById('configuradorMarca');
    if (!marcaSelect) {
        console.error('Elemento select de marca não encontrado');
        return;
    }
    
    // Mostrar loading
    marcaSelect.innerHTML = '<option value="">Carregando marcas...</option>';
    marcaSelect.disabled = true;
    
    // URLs para buscar marcas
    const apiUrls = [
        '/api/veiculos/marcas',
        'http://localhost:3000/api/veiculos/marcas',
        'http://69.62.91.195:3000/api/veiculos/marcas'
    ];
    
    try {
        let marcas = null;
        
        // Tentar cada URL em sequência
        for (const url of apiUrls) {
            try {
                console.log(`Tentando buscar marcas de: ${url}`);
                
                // Obter token de autenticação
                let headers = {
                    'Content-Type': 'application/json'
                };
                
                try {
                    const auth = new Auth();
                    const token = auth.getToken();
                    if (token) {
                        headers['Authorization'] = `Bearer ${token}`;
                    }
                } catch (authError) {
                    console.warn('Erro ao obter token:', authError);
                }
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: headers,
                    signal: AbortSignal.timeout(5000)
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`Marcas recebidas de ${url}:`, data);
                    
                    if (Array.isArray(data) && data.length > 0) {
                        marcas = data;
                        break;
                    } else if (data && data.items && Array.isArray(data.items) && data.items.length > 0) {
                        marcas = data.items;
                        break;
                    }
                }
            } catch (error) {
                console.error(`Erro ao acessar ${url}:`, error.message);
            }
        }
        
        // Limpar e preencher o select
        marcaSelect.innerHTML = '<option value="">Selecione uma marca</option>';
        
        if (marcas && marcas.length > 0) {
            marcas.forEach(marca => {
                const option = document.createElement('option');
                option.value = marca.id;
                option.textContent = marca.nome;
                marcaSelect.appendChild(option);
            });
            marcaSelect.disabled = false;
        } else {
            marcaSelect.innerHTML = '<option value="">Nenhuma marca disponível</option>';
            marcaSelect.disabled = true;
        }
    } catch (error) {
        console.error('Erro ao carregar marcas:', error);
        marcaSelect.innerHTML = '<option value="">Erro ao carregar marcas</option>';
        marcaSelect.disabled = true;
    }
}

// Função para carregar modelos por marca
async function loadModelos(marcaId) {
    console.log('Carregando modelos para a marca ID:', marcaId);
    
    const modeloSelect = document.getElementById('configuradorModelo');
    if (!modeloSelect) {
        console.error('Elemento select de modelo não encontrado');
        return;
    }
    
    // Mostrar loading
    modeloSelect.innerHTML = '<option value="">Carregando modelos...</option>';
    modeloSelect.disabled = true;
    
    if (!marcaId) {
        modeloSelect.innerHTML = '<option value="">Selecione uma marca primeiro</option>';
        modeloSelect.disabled = true;
        return;
    }
    
    // URLs para buscar modelos
    const apiUrls = [
        `/api/veiculos/modelos/by-marca/${marcaId}`,
        `http://localhost:3000/api/veiculos/modelos/by-marca/${marcaId}`,
        `http://69.62.91.195:3000/api/veiculos/modelos/by-marca/${marcaId}`
    ];
    
    try {
        let modelos = null;
        
        // Tentar cada URL em sequência
        for (const url of apiUrls) {
            try {
                console.log(`Tentando buscar modelos de: ${url}`);
                
                // Obter token de autenticação
                let headers = {
                    'Content-Type': 'application/json'
                };
                
                try {
                    const auth = new Auth();
                    const token = auth.getToken();
                    if (token) {
                        headers['Authorization'] = `Bearer ${token}`;
                    }
                } catch (authError) {
                    console.warn('Erro ao obter token:', authError);
                }
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: headers,
                    signal: AbortSignal.timeout(5000)
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`Modelos recebidos de ${url}:`, data);
                    
                    if (Array.isArray(data) && data.length > 0) {
                        modelos = data;
                        break;
                    } else if (data && data.items && Array.isArray(data.items) && data.items.length > 0) {
                        modelos = data.items;
                        break;
                    }
                }
            } catch (error) {
                console.error(`Erro ao acessar ${url}:`, error.message);
            }
        }
        
        // Limpar e preencher o select
        modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
        
        if (modelos && modelos.length > 0) {
            modelos.forEach(modelo => {
                const option = document.createElement('option');
                option.value = modelo.id;
                option.textContent = modelo.nome;
                modeloSelect.appendChild(option);
            });
            modeloSelect.disabled = false;
        } else {
            modeloSelect.innerHTML = '<option value="">Nenhum modelo disponível</option>';
            modeloSelect.disabled = true;
        }
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        modeloSelect.innerHTML = '<option value="">Erro ao carregar modelos</option>';
        modeloSelect.disabled = true;
    }
}

// Exporta globalmente para uso em index.js
window.loadVersoes = loadVersoes;
window.loadMarcas = loadMarcas;
window.loadModelos = loadModelos;

console.log('Funções do configurador de veículos exportadas globalmente');
