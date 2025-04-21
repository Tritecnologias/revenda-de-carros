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
        
        // URLs para tentar carregar versões - incluindo mais alternativas
        const apiUrls = [
            `/api/versoes/modelo/${modeloId}/public`,
            `/api/versoes/by-modelo/${modeloId}/public`,
            `/api/veiculos/versoes/modelo/${modeloId}/public`,
            `/api/versoes/modelo/${modeloId}`,
            `/api/veiculos/versoes/by-modelo/${modeloId}`,
            `http://localhost:3000/api/versoes/modelo/${modeloId}/public`,
            `http://localhost:3000/api/versoes/by-modelo/${modeloId}/public`,
            `http://localhost:3000/api/veiculos/versoes/modelo/${modeloId}/public`,
            `http://69.62.91.195:3000/api/versoes/modelo/${modeloId}/public`,
            `http://69.62.91.195:3000/api/versoes/by-modelo/${modeloId}/public`,
            `http://69.62.91.195:3000/api/veiculos/versoes/modelo/${modeloId}/public`
        ];
        
        console.log('Tentando carregar versões usando múltiplas URLs:', apiUrls);
        
        // Tentar cada URL em sequência
        let response = null;
        let lastError = null;
        let versoes = null;
        
        for (const url of apiUrls) {
            try {
                console.log(`Tentando carregar versões de: ${url}`);
                response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    versoes = await response.json();
                    console.log(`URL bem-sucedida: ${url}`);
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
        if (!versoes) {
            console.error(`Falha ao carregar versões: ${lastError}`);
            versoes = []; // Usar array vazio como fallback para não quebrar a interface
        }
        
        console.log('Versões carregadas com sucesso:', versoes);
        
        // Agora, vamos verificar quais veículos existem
        const veiculosExistentes = new Set();
        
        try {
            // URLs para tentar carregar veículos
            const veiculosUrls = [
                `/api/veiculos/public`,
                `http://localhost:3000/api/veiculos/public`,
                `http://69.62.91.195:3000/api/veiculos/public`
            ];
            
            // Tentar cada URL em sequência
            let veiculosResponse = null;
            let veiculosLastError = null;
            let veiculos = null;
            
            for (const url of veiculosUrls) {
                try {
                    console.log(`Tentando carregar veículos de: ${url}`);
                    veiculosResponse = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (veiculosResponse.ok) {
                        veiculos = await veiculosResponse.json();
                        console.log(`URL bem-sucedida para veículos: ${url}`);
                        break; // Sair do loop se a resposta for bem-sucedida
                    } else {
                        const errorText = await veiculosResponse.text();
                        console.error(`Falha na URL ${url}:`, errorText);
                        veiculosLastError = `${veiculosResponse.status} ${veiculosResponse.statusText}`;
                    }
                } catch (error) {
                    console.error(`Erro ao acessar ${url}:`, error.message);
                    veiculosLastError = error.message;
                }
            }
            
            if (veiculos) {
                // Criar um conjunto de IDs de veículos existentes
                veiculos.forEach(veiculo => veiculosExistentes.add(veiculo.versao_id));
                console.log('Veículos existentes:', veiculosExistentes);
            } else {
                console.error(`Falha ao carregar veículos: ${veiculosLastError}`);
            }
        } catch (error) {
            console.error('Erro ao verificar veículos existentes:', error);
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
                    // Verificar se a versão tem veículos associados
                    const temVeiculos = veiculosExistentes.has(versao.id);
                    
                    const option = document.createElement('option');
                    option.value = versao.id;
                    option.textContent = versao.nome;
                    
                    // Adicionar indicador visual se não houver veículos
                    if (!temVeiculos) {
                        option.textContent += ' (Indisponível)';
                        option.disabled = true;
                        option.style.color = '#999';
                    }
                    
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
        if (versaoSelect) {
            versaoSelect.innerHTML = '<option value="">Erro ao carregar versões</option>';
            versaoSelect.disabled = true;
        }
        
        return [];
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
