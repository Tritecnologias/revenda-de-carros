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
        
        // Buscar versões exclusivamente dos veículos cadastrados
        let versoes = [];
        
        try {
            versoes = await extrairVersoesDosVeiculos(modeloId);
            if (versoes && versoes.length > 0) {
                console.log('Versões extraídas dos veículos cadastrados:', versoes);
            } else {
                console.log('Nenhuma versão encontrada na tabela de veículos para este modelo');
            }
        } catch (error) {
            console.error('Erro ao extrair versões dos veículos:', error);
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

// Função para extrair versões dos veículos
async function extrairVersoesDosVeiculos(modeloId) {
    console.log('Buscando versões da tabela de veículos para o modelo ID:', modeloId);
    
    // URLs para tentar carregar veículos - apenas endpoints reais, sem fallbacks
    const veiculosUrls = [
        `/api/veiculos`,
        `http://localhost:3000/api/veiculos`,
        `http://69.62.91.195:3000/api/veiculos`
    ];
    
    // Tentar cada URL em sequência
    for (const url of veiculosUrls) {
        try {
            console.log(`Tentando carregar veículos de: ${url}`);
            
            // Obter token de autenticação usando a classe Auth
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
                // Adicionar timeout para não ficar esperando muito tempo
                signal: AbortSignal.timeout(5000) // 5 segundos de timeout
            });
            
            if (response.ok) {
                const veiculos = await response.json();
                console.log(`URL bem-sucedida para veículos: ${url}, total de veículos:`, Array.isArray(veiculos) ? veiculos.length : 'não é array');
                
                // Verificar se a resposta é um array ou um objeto paginado
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
                
                console.log('Veículos filtrados por modelo:', veiculosFiltrados.length);
                
                // Se não encontrou veículos para este modelo, continuar para a próxima URL
                if (veiculosFiltrados.length === 0) {
                    console.log(`Nenhum veículo encontrado para o modelo ${modeloId} na URL ${url}`);
                    continue;
                }
                
                // Criar um Map para armazenar versões únicas
                const versoesMap = new Map();
                
                // Extrair versões únicas dos veículos
                veiculosFiltrados.forEach(veiculo => {
                    // Tentar extrair o ID da versão de diferentes formatos possíveis
                    const versaoId = veiculo.versao_id || veiculo.versaoId || 
                                    (veiculo.versao && veiculo.versao.id);
                    
                    // Tentar extrair o nome da versão de diferentes formatos possíveis
                    const versaoNome = (veiculo.versao && veiculo.versao.nome) || 
                                      veiculo.versao_nome || 
                                      veiculo.versaoNome || 
                                      `Versão ${versaoId}`;
                    
                    if (versaoId && !versoesMap.has(versaoId)) {
                        versoesMap.set(versaoId, {
                            id: versaoId,
                            nome: versaoNome,
                            veiculoId: veiculo.id,
                            // Adicionar outros dados úteis
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

// Função para carregar modelos por marca no configurador
async function carregarModelos(marcaId) {
    if (!marcaId) {
        return [];
    }
    
    try {
        console.log('Carregando modelos para a marca ID:', marcaId);
        
        // URLs para tentar carregar modelos
        const apiUrls = [
            `/api/veiculos/modelos/by-marca/${marcaId}`,
            `http://localhost:3000/api/veiculos/modelos/by-marca/${marcaId}`,
            `http://69.62.91.195:3000/api/veiculos/modelos/by-marca/${marcaId}`
        ];
        
        // Tentar cada URL em sequência
        for (const url of apiUrls) {
            try {
                console.log(`Tentando carregar modelos de: ${url}`);
                
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
                    signal: AbortSignal.timeout(5000) // 5 segundos de timeout
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`URL bem-sucedida: ${url}, dados recebidos:`, data);
                    
                    // Verificar se a resposta é um array
                    if (Array.isArray(data)) {
                        return data;
                    } 
                    // Verificar se a resposta é um objeto com uma propriedade items (paginação)
                    else if (data && data.items && Array.isArray(data.items)) {
                        return data.items;
                    }
                }
            } catch (error) {
                console.error(`Erro ao acessar ${url}:`, error.message);
            }
        }
        
        // Se chegou aqui, não conseguiu carregar modelos de nenhuma URL
        console.error('Não foi possível carregar modelos de nenhuma URL');
        return [];
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        return [];
    }
}

// Exporta globalmente para uso em index.js
window.loadVersoes = loadVersoes;
window.carregarModelos = carregarModelos;
