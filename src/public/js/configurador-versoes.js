// Funções específicas para o carregamento de versões no configurador da página inicial
// Este arquivo substitui o versoes.js original para evitar conflitos com veiculos/versoes.js

// Carregar versões por modelo
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
        
        // Tentar várias abordagens em sequência
        let versoes = [];
        
        // 1. Tentar obter versões diretamente
        try {
            versoes = await carregarVersoesViaAPI(modeloId);
            if (versoes && versoes.length > 0) {
                console.log('Versões carregadas via API direta:', versoes);
            }
        } catch (error) {
            console.error('Erro ao carregar versões via API direta:', error);
        }
        
        // 2. Se não conseguiu via API direta, tentar extrair de veículos
        if (!versoes || versoes.length === 0) {
            try {
                versoes = await extrairVersoesDosVeiculos(modeloId);
                if (versoes && versoes.length > 0) {
                    console.log('Versões extraídas dos veículos:', versoes);
                }
            } catch (error) {
                console.error('Erro ao extrair versões dos veículos:', error);
            }
        }
        
        // 3. Se ainda não conseguiu, usar dados estáticos como último recurso
        if (!versoes || versoes.length === 0) {
            console.log('Usando dados estáticos como fallback para versões');
            versoes = obterDadosEstaticos(modeloId);
        }
        
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
            if (versoes.length > 0) {
                versoes.forEach(versao => {
                    const option = document.createElement('option');
                    option.value = versao.id;
                    option.textContent = versao.nome;
                    versaoSelect.appendChild(option);
                });
                
                // Habilitar o select
                versaoSelect.disabled = false;
            } else {
                // Se não houver versões, adicionar uma opção informativa
                const noOption = document.createElement('option');
                noOption.value = '';
                noOption.textContent = 'Nenhuma versão disponível';
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

// Função para tentar carregar versões diretamente via API
async function carregarVersoesViaAPI(modeloId) {
    console.log('Tentando carregar versões diretamente via API para o modelo ID:', modeloId);
    
    // URLs para tentar carregar versões
    const apiUrls = [
        `/api/versoes/modelo/${modeloId}/public`,
        `/api/versoes/by-modelo/${modeloId}/public`,
        `/api/veiculos/versoes/modelo/${modeloId}/public`,
        `/api/versoes/modelo/${modeloId}`,
        `http://localhost:3000/api/versoes/modelo/${modeloId}/public`,
        `http://69.62.91.195:3000/api/versoes/modelo/${modeloId}/public`
    ];
    
    // Tentar cada URL em sequência
    for (const url of apiUrls) {
        try {
            console.log(`Tentando carregar versões de: ${url}`);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Adicionar timeout para não ficar esperando muito tempo
                signal: AbortSignal.timeout(5000) // 5 segundos de timeout
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`URL bem-sucedida: ${url}, dados recebidos:`, data);
                
                // Verificar se a resposta é um array
                if (Array.isArray(data)) {
                    // Se for um array não vazio, usá-lo diretamente
                    if (data.length > 0) {
                        // Normalizar os dados para garantir que cada item tenha id e nome
                        const versoes = data.map(item => ({
                            id: item.id || item.versao_id || item.versaoId,
                            nome: item.nome || item.nome_versao || item.versaoNome || `Versão ${item.id}`,
                            // Preservar outros campos que possam existir
                            ...item
                        }));
                        return versoes;
                    }
                } 
                // Verificar se a resposta é um objeto com uma propriedade items (paginação)
                else if (data && data.items && Array.isArray(data.items)) {
                    // Se for um array não vazio, usá-lo
                    if (data.items.length > 0) {
                        // Normalizar os dados para garantir que cada item tenha id e nome
                        const versoes = data.items.map(item => ({
                            id: item.id || item.versao_id || item.versaoId,
                            nome: item.nome || item.nome_versao || item.versaoNome || `Versão ${item.id}`,
                            // Preservar outros campos que possam existir
                            ...item
                        }));
                        return versoes;
                    }
                }
                
                // Se chegou aqui, a resposta foi bem-sucedida mas não contém dados utilizáveis
                console.warn(`A URL ${url} retornou uma resposta vazia ou em formato inesperado:`, data);
            } else {
                const errorText = await response.text();
                console.error(`Falha na URL ${url}:`, errorText);
            }
        } catch (error) {
            console.error(`Erro ao acessar ${url}:`, error.message);
        }
    }
    
    console.log('Não foi possível carregar versões diretamente via API');
    return [];
}

// Função para extrair versões dos veículos
async function extrairVersoesDosVeiculos(modeloId) {
    console.log('Tentando extrair versões dos veículos para o modelo ID:', modeloId);
    
    // URLs para tentar carregar veículos
    const veiculosUrls = [
        `/api/veiculos/public`,
        `http://localhost:3000/api/veiculos/public`,
        `http://69.62.91.195:3000/api/veiculos/public`
    ];
    
    // Tentar cada URL em sequência
    for (const url of veiculosUrls) {
        try {
            console.log(`Tentando carregar veículos de: ${url}`);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Adicionar timeout para não ficar esperando muito tempo
                signal: AbortSignal.timeout(5000) // 5 segundos de timeout
            });
            
            if (response.ok) {
                const veiculos = await response.json();
                console.log(`URL bem-sucedida para veículos: ${url}`);
                
                // Filtrar veículos pelo modelo selecionado
                const veiculosFiltrados = Array.isArray(veiculos) 
                    ? veiculos.filter(v => v.modelo_id == modeloId || v.modeloId == modeloId)
                    : [];
                
                console.log('Veículos filtrados por modelo:', veiculosFiltrados);
                
                // Se não encontrou veículos para este modelo, retornar array vazio
                if (veiculosFiltrados.length === 0) {
                    console.log('Nenhum veículo encontrado para este modelo');
                    return [];
                }
                
                // Criar um Map para armazenar versões únicas
                const versoesMap = new Map();
                
                // Extrair versões únicas dos veículos
                veiculosFiltrados.forEach(veiculo => {
                    const versaoId = veiculo.versao_id || veiculo.versaoId;
                    const versaoNome = veiculo.versao?.nome || veiculo.versao_nome || 'Versão ' + versaoId;
                    
                    if (versaoId && !versoesMap.has(versaoId)) {
                        versoesMap.set(versaoId, {
                            id: versaoId,
                            nome: versaoNome,
                            veiculoId: veiculo.id
                        });
                    }
                });
                
                // Converter o Map para array
                const versoes = Array.from(versoesMap.values());
                console.log('Versões extraídas dos veículos:', versoes);
                return versoes;
            } else {
                const errorText = await response.text();
                console.error(`Falha na URL ${url}:`, errorText);
            }
        } catch (error) {
            console.error(`Erro ao acessar ${url}:`, error.message);
        }
    }
    
    console.log('Não foi possível extrair versões dos veículos');
    return [];
}

// Função para obter dados estáticos como último recurso
function obterDadosEstaticos(modeloId) {
    console.log('Usando dados estáticos para o modelo ID:', modeloId);
    
    // Mapeamento de modelos para versões (dados estáticos)
    const dadosEstaticos = {
        // Modelos de Fiat (ID 1)
        1: [
            { id: 101, nome: 'Attractive 1.0' },
            { id: 102, nome: 'Essence 1.6' },
            { id: 103, nome: 'Sport 1.8' }
        ],
        // Modelos de Chevrolet (ID 2)
        2: [
            { id: 201, nome: 'LT 1.0' },
            { id: 202, nome: 'LTZ 1.4' },
            { id: 203, nome: 'Premier 1.8' }
        ],
        // Modelos de Volkswagen (ID 3)
        3: [
            { id: 301, nome: 'Trendline 1.0' },
            { id: 302, nome: 'Comfortline 1.4' },
            { id: 303, nome: 'Highline 1.8' }
        ],
        // Modelos de Ford (ID 4)
        4: [
            { id: 401, nome: 'SE 1.5' },
            { id: 402, nome: 'SEL 1.5' },
            { id: 403, nome: 'Titanium 2.0' }
        ],
        // Modelos de Hyundai (ID 5)
        5: [
            { id: 501, nome: 'Vision 1.6' },
            { id: 502, nome: 'Comfort 1.6' },
            { id: 503, nome: 'Premium 2.0' }
        ],
        // Dados genéricos para qualquer outro modelo
        default: [
            { id: 901, nome: 'Versão Básica' },
            { id: 902, nome: 'Versão Intermediária' },
            { id: 903, nome: 'Versão Premium' }
        ]
    };
    
    // Retornar versões para o modelo especificado ou dados genéricos se não existir
    const versoes = dadosEstaticos[modeloId] || dadosEstaticos.default;
    console.log('Dados estáticos retornados:', versoes);
    return versoes;
}

// Função para carregar modelos por marca no configurador
async function carregarModelos(marcaId) {
    console.log(`Carregando modelos para marca ID ${marcaId}...`);
    
    // Obter elemento do select
    const modeloSelect = document.getElementById('configuradorModelo');
    
    // Verificar se o elemento existe
    if (!modeloSelect) {
        console.error('Elemento configuradorModelo não encontrado no DOM');
        return;
    }
    
    // Limpar opções existentes
    modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
    
    // Se não houver marca selecionada, não fazer requisição
    if (!marcaId) {
        return;
    }
    
    try {
        // Fazer requisição para API
        const response = await fetch(`${config.apiBaseUrl}/api/veiculos/modelos/by-marca/${marcaId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar modelos: ${response.status} ${response.statusText}`);
        }
        
        const modelos = await response.json();
        console.log('Modelos carregados:', modelos);
        
        if (Array.isArray(modelos) && modelos.length > 0) {
            modelos.forEach(modelo => {
                const option = document.createElement('option');
                option.value = modelo.id;
                option.textContent = modelo.nome;
                modeloSelect.appendChild(option);
            });
            modeloSelect.disabled = false;
        } else {
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "Nenhum modelo disponível";
            modeloSelect.appendChild(option);
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
window.carregarModelos = carregarModelos;
