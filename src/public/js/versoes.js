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
        
        // URLs para tentar carregar versões
        const versaoUrls = [
            `/api/versoes/modelo/${modeloId}/public`,
            `http://localhost:3000/api/versoes/modelo/${modeloId}/public`,
            `http://69.62.91.195:3000/api/versoes/modelo/${modeloId}/public`
        ];
        
        // URLs para tentar carregar veículos
        const veiculoUrls = [
            `/api/veiculos`,
            `http://localhost:3000/api/veiculos`,
            `http://69.62.91.195:3000/api/veiculos`
        ];
        
        // Função para tentar múltiplas URLs
        async function tryUrls(urls, errorMessage) {
            let response = null;
            let lastError = null;
            
            for (const url of urls) {
                try {
                    console.log(`Tentando URL: ${url}`);
                    response = await fetch(url, {
                        method: 'GET',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (response.ok) {
                        console.log(`URL bem-sucedida: ${url}`);
                        return await response.json();
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
            
            // Se chegou aqui, todas as URLs falharam
            throw new Error(`${errorMessage}: ${lastError}`);
        }
        
        // Carregar versões e veículos em paralelo
        const [versoes, veiculos] = await Promise.all([
            tryUrls(versaoUrls, 'Falha ao carregar versões'),
            tryUrls(veiculoUrls, 'Falha ao carregar veículos')
        ]);
        
        console.log('Versões carregadas:', versoes);
        console.log('Veículos carregados:', veiculos);
        
        // Criar um conjunto de IDs de veículos existentes
        const veiculosExistentes = new Set();
        if (Array.isArray(veiculos)) {
            veiculos.forEach(veiculo => {
                if (veiculo && veiculo.id) {
                    veiculosExistentes.add(veiculo.id);
                }
            });
        }
        
        console.log('Veículos existentes:', [...veiculosExistentes]);
        
        // Filtrar versões para mostrar apenas as que têm veículos existentes
        const versoesValidas = Array.isArray(versoes) ? versoes.filter(versao => {
            return versao && versao.veiculoId && veiculosExistentes.has(versao.veiculoId);
        }) : [];
        
        console.log('Versões válidas (com veículos existentes):', versoesValidas);
        
        // Atualizar o select de versões
        if (versaoSelect) {
            versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
            versaoSelect.disabled = false;
            
            if (versoesValidas.length > 0) {
                versoesValidas.forEach(versao => {
                    const option = document.createElement('option');
                    option.value = versao.id;
                    option.textContent = versao.nome;
                    
                    // Adicionar o ID do veículo como atributo data
                    if (versao.veiculoId) {
                        option.setAttribute('data-veiculo-id', versao.veiculoId);
                    }
                    
                    versaoSelect.appendChild(option);
                });
            } else {
                const option = document.createElement('option');
                option.value = "";
                option.textContent = "Nenhuma versão disponível";
                versaoSelect.appendChild(option);
            }
        }
    } catch (error) {
        console.error('Erro ao carregar versões:', error);
        const versaoSelect = document.getElementById('configuradorVersao');
        if (versaoSelect) {
            versaoSelect.innerHTML = '<option value="">Erro ao carregar versões</option>';
            versaoSelect.disabled = false;
        }
    }
}

// Função auxiliar para carregar modelos por marca (usada pelo configurador)
async function carregarModelos(marcaId, selectId = 'configuradorModelo') {
    try {
        console.log(`Carregando modelos para marca ID: ${marcaId}, select ID: ${selectId}`);
        const modeloSelect = document.getElementById(selectId);
        if (!modeloSelect) {
            console.error(`Elemento select com ID ${selectId} não encontrado`);
            return;
        }
        
        modeloSelect.innerHTML = '<option value="">Carregando modelos...</option>';
        modeloSelect.disabled = true;
        
        // URLs para tentar carregar modelos
        const apiUrls = [
            `/api/veiculos/modelos/public/by-marca/${marcaId}`,
            `http://localhost:3000/api/veiculos/modelos/public/by-marca/${marcaId}`,
            `http://69.62.91.195:3000/api/veiculos/modelos/public/by-marca/${marcaId}`
        ];
        
        // Tentar cada URL em sequência
        let response = null;
        let lastError = null;
        let modelos = null;
        
        for (const url of apiUrls) {
            try {
                console.log(`Tentando carregar modelos de: ${url}`);
                response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                if (response.ok) {
                    modelos = await response.json();
                    console.log(`URL bem-sucedida: ${url}`, modelos);
                    break; // Sair do loop se a resposta for bem-sucedida
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
        
        // Se todas as URLs falharam
        if (!modelos) {
            throw new Error(`Falha ao carregar modelos: ${lastError}`);
        }
        
        // Processar resposta bem-sucedida
        modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
        modeloSelect.disabled = false;
        
        if (Array.isArray(modelos)) {
            modelos.forEach(modelo => {
                const option = document.createElement('option');
                option.value = modelo.id;
                option.textContent = modelo.nome;
                modeloSelect.appendChild(option);
            });
            
            if (modelos.length === 0) {
                const option = document.createElement('option');
                option.value = "";
                option.textContent = "Nenhum modelo disponível";
                modeloSelect.appendChild(option);
            }
        } else {
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "Formato de resposta inválido";
            modeloSelect.appendChild(option);
        }
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        const modeloSelect = document.getElementById(selectId);
        if (modeloSelect) {
            modeloSelect.innerHTML = '<option value="">Erro ao carregar modelos</option>';
            modeloSelect.disabled = false;
        }
    }
}

// Exporta globalmente para uso em index.js
window.loadVersoes = loadVersoes;
window.carregarModelos = carregarModelos;
