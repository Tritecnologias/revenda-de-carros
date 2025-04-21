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
        
        // Nova abordagem: obter versões a partir dos veículos disponíveis
        // URLs para tentar carregar veículos
        const veiculosUrls = [
            `/api/veiculos/public`,
            `http://localhost:3000/api/veiculos/public`,
            `http://69.62.91.195:3000/api/veiculos/public`
        ];
        
        console.log('Tentando carregar veículos para extrair versões:', veiculosUrls);
        
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
        
        // Se não conseguiu carregar veículos, retornar array vazio
        if (!veiculos) {
            console.error(`Falha ao carregar veículos: ${veiculosLastError}`);
            
            if (versaoSelect) {
                versaoSelect.innerHTML = '<option value="">Erro ao carregar versões</option>';
                versaoSelect.disabled = true;
            }
            
            return [];
        }
        
        console.log('Veículos carregados:', veiculos);
        
        // Filtrar veículos pelo modelo selecionado e extrair versões únicas
        const veiculosFiltrados = Array.isArray(veiculos) 
            ? veiculos.filter(v => v.modelo_id == modeloId || v.modeloId == modeloId)
            : [];
        
        console.log('Veículos filtrados por modelo:', veiculosFiltrados);
        
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
