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
        return;
    }
    try {
        console.log('Carregando versões para o modelo ID:', modeloId);
        const versaoSelect = document.getElementById('configuradorVersao');
        if (versaoSelect) {
            versaoSelect.innerHTML = '<option value="">Carregando versões...</option>';
            versaoSelect.disabled = true;
        }
        
        // Lista de URLs a tentar, em ordem de prioridade
        const urls = [
            `/api/versoes/modelo/${modeloId}/public`,
            `/api/versoes/by-modelo/${modeloId}/public`,
            `/api/veiculos/versoes/by-modelo/${modeloId}`,
            `/api/versoes/modelo/${modeloId}`
        ];
        
        console.log('Tentando carregar versões usando múltiplas URLs:', urls);
        
        // Usar a função fetchWithFallback do config.js
        const versoes = await config.fetchWithFallback(urls, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Versões carregadas com sucesso:', versoes);
        
        // Armazenar dados como mockados para uso futuro
        if (versoes && versoes.length > 0) {
            config.storeMockData(`versoes_modelo_${modeloId}`, versoes);
        }
        
        // Agora, vamos verificar quais veículos existem
        const veiculosExistentes = new Set();
        
        try {
            // Lista de URLs a tentar para veículos, em ordem de prioridade
            const veiculosUrls = [
                `/api/veiculos/public`,
                `/api/veiculos`
            ];
            
            // Usar a função fetchWithFallback do config.js
            const veiculosData = await config.fetchWithFallback(veiculosUrls, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Veículos disponíveis:', veiculosData);
            
            // Extrair os IDs das versões que têm veículos associados
            if (veiculosData.items) {
                // Resposta paginada
                veiculosData.items.forEach(veiculo => {
                    if (veiculo.versaoId) {
                        veiculosExistentes.add(veiculo.versaoId);
                    }
                });
            } else if (Array.isArray(veiculosData)) {
                // Lista simples
                veiculosData.forEach(veiculo => {
                    if (veiculo.versaoId) {
                        veiculosExistentes.add(veiculo.versaoId);
                    }
                });
            }
        } catch (veiculosError) {
            console.warn('Erro ao carregar veículos:', veiculosError);
            // Continuar mesmo se não conseguir carregar os veículos
        }
        
        // Preencher o select de versões
        if (versaoSelect) {
            versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
            
            if (versoes.length === 0) {
                versaoSelect.innerHTML += '<option value="" disabled>Nenhuma versão disponível</option>';
            } else {
                versoes.forEach(versao => {
                    // Verificar se a versão tem veículos associados
                    const temVeiculos = veiculosExistentes.has(versao.id);
                    const option = document.createElement('option');
                    option.value = versao.id;
                    option.textContent = versao.nome || versao.nome_versao;
                    
                    // Se não tiver veículos, desabilitar a opção
                    if (!temVeiculos) {
                        option.disabled = true;
                        option.textContent += ' (Indisponível)';
                    }
                    
                    versaoSelect.appendChild(option);
                });
            }
            
            versaoSelect.disabled = false;
        }
    } catch (error) {
        console.error('Erro ao carregar versões:', error);
        
        const versaoSelect = document.getElementById('configuradorVersao');
        if (versaoSelect) {
            versaoSelect.innerHTML = '<option value="">Erro ao carregar versões</option>';
            versaoSelect.disabled = true;
        }
        
        // Tentar usar dados mockados se disponíveis
        const mockDataKey = `mock_versoes_modelo_${modeloId}_data`;
        const mockData = localStorage.getItem(mockDataKey);
        
        if (mockData) {
            try {
                console.warn(`Usando dados mockados para versões do modelo ${modeloId}`);
                const versoes = JSON.parse(mockData);
                
                if (versaoSelect && versoes && versoes.length > 0) {
                    versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
                    versoes.forEach(versao => {
                        const option = document.createElement('option');
                        option.value = versao.id;
                        option.textContent = versao.nome || versao.nome_versao;
                        versaoSelect.appendChild(option);
                    });
                    versaoSelect.disabled = false;
                }
            } catch (e) {
                console.error('Erro ao usar dados mockados:', e);
            }
        }
    }
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
