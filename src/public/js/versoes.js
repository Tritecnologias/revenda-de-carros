// Funções relacionadas ao carregamento de versões

// Carregar versões por modelo
async function loadVersoes(modeloId) {
    if (!modeloId) {
        const versaoSelect = document.getElementById('configuradorVersao');
        if (versaoSelect) {
            versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
            versaoSelect.disabled = true;
        }
        return;
    }
    try {
        console.log('Carregando versões para o modelo ID:', modeloId);
        const versaoSelect = document.getElementById('configuradorVersao');
        if (versaoSelect) {
            versaoSelect.innerHTML = '<option value="">Carregando versões...</option>';
            versaoSelect.disabled = true;
        }
        
        // Obter token de autenticação
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            throw new Error('Falha na autenticação. Por favor, faça login novamente.');
        }
        
        // Primeiro, carregar as versões
        const response = await fetch(`${config.apiBaseUrl}/api/versoes/modelo/${modeloId}/public`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Falha ao carregar versões: ${response.status} ${response.statusText}`);
        }
        
        const versoes = await response.json();
        console.log('Versões carregadas:', versoes);
        
        // Agora, vamos verificar quais veículos existem
        const veiculosExistentes = new Set();
        
        // Obter todos os veículos disponíveis
        const veiculosResponse = await fetch(`${config.apiBaseUrl}/api/veiculos`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (veiculosResponse.ok) {
            const veiculosData = await veiculosResponse.json();
            console.log('Veículos disponíveis:', veiculosData);
            
            // Adicionar IDs de veículos existentes ao Set
            if (veiculosData.items && Array.isArray(veiculosData.items)) {
                veiculosData.items.forEach(veiculo => {
                    if (veiculo && veiculo.id) {
                        veiculosExistentes.add(veiculo.id);
                    }
                });
            }
            console.log('IDs de veículos existentes:', [...veiculosExistentes]);
        } else {
            console.error('Erro ao verificar veículos existentes:', veiculosResponse.status);
        }
        
        if (versaoSelect) {
            versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
            
            // Filtrar apenas versões que têm veículos existentes
            const versoesValidas = Array.isArray(versoes) ? versoes.filter(versao => {
                // Determinar o ID do veículo
                let veiculoId = null;
                if (versao.veiculo && versao.veiculo.id) {
                    veiculoId = versao.veiculo.id;
                } else if (versao.veiculoId) {
                    veiculoId = versao.veiculoId;
                } else if (versao.id_veiculo) {
                    veiculoId = versao.id_veiculo;
                }
                
                // Verificar se o veículo existe
                return veiculoId && veiculosExistentes.has(veiculoId);
            }) : [];
            
            console.log('Versões válidas (com veículos existentes):', versoesValidas);
            
            if (versoesValidas.length > 0) {
                // Adiciona as versões ao select, garantindo que o value seja o ID do veículo
                versoesValidas.forEach(versao => {
                    // Obter o ID do veículo
                    let veiculoId = null;
                    if (versao.veiculo && versao.veiculo.id) {
                        veiculoId = versao.veiculo.id;
                    } else if (versao.veiculoId) {
                        veiculoId = versao.veiculoId;
                    } else if (versao.id_veiculo) {
                        veiculoId = versao.id_veiculo;
                    }
                    
                    const option = document.createElement('option');
                    option.value = versao.id; // ID da versão
                    option.textContent = versao.nome_versao || versao.nome || versao.descricao || `Versão ${versao.id}`;
                    option.dataset.veiculoId = veiculoId; // ID do veículo como atributo data
                    
                    // Para depuração, inclua atributos extras
                    option.dataset.versaoId = versao.id;
                    if (versao.modelo && versao.modelo.nome) option.dataset.modeloNome = versao.modelo.nome;
                    if (versao.modelo && versao.modelo.marca && versao.modelo.marca.nome) option.dataset.marcaNome = versao.modelo.marca.nome;
                    
                    versaoSelect.appendChild(option);
                });
                
                versaoSelect.disabled = false;
                
                // Seleção automática se só houver uma
                if (versoesValidas.length === 1) {
                    versaoSelect.value = versoesValidas[0].id;
                    const changeEvent = new Event('change');
                    versaoSelect.dispatchEvent(changeEvent);
                }
            } else {
                const option = document.createElement('option');
                option.value = "";
                option.textContent = "Nenhuma versão disponível com veículo cadastrado";
                versaoSelect.appendChild(option);
                versaoSelect.disabled = true;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar versões:', error);
        const versaoSelect = document.getElementById('configuradorVersao');
        if (versaoSelect) {
            versaoSelect.innerHTML = '<option value="">Erro ao carregar versões</option>';
            versaoSelect.disabled = true;
        }
    }
}

// Função auxiliar para carregar modelos por marca (usada pelo configurador)
async function carregarModelos(marcaId, selectId) {
    console.log(`Carregando modelos para marca ID ${marcaId} no select ${selectId || 'configuradorModelo'}...`);
    
    // Obter elemento do select - usar o ID fornecido ou o padrão
    const modeloSelect = document.getElementById(selectId || 'configuradorModelo');
    
    // Verificar se o elemento existe
    if (!modeloSelect) {
        console.error(`Elemento ${selectId || 'configuradorModelo'} não encontrado no DOM`);
        return;
    }
    
    // Limpar opções existentes
    if (selectId === 'filtroModelo') {
        modeloSelect.innerHTML = '<option value="">Todos os modelos</option>';
    } else {
        modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
    }
    
    // Se não houver marca selecionada, não fazer requisição
    if (!marcaId) {
        return;
    }
    
    try {
        // Obter token de autenticação
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            throw new Error('Falha na autenticação. Por favor, faça login novamente.');
        }
        
        // Fazer requisição para API
        const response = await fetch(`${config.apiBaseUrl}/api/veiculos/modelos/by-marca/${marcaId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
            option.textContent = selectId === 'filtroModelo' ? "Nenhum modelo disponível" : "Nenhum modelo disponível";
            modeloSelect.appendChild(option);
            modeloSelect.disabled = true;
        }
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        modeloSelect.innerHTML = selectId === 'filtroModelo' 
            ? '<option value="">Erro ao carregar modelos</option>' 
            : '<option value="">Erro ao carregar modelos</option>';
        modeloSelect.disabled = true;
    }
}

// Exporta globalmente para uso em index.js
window.loadVersoes = loadVersoes;
window.carregarModelos = carregarModelos;
