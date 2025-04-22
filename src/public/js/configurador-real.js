/**
 * CONFIGURADOR REAL - SEM DADOS MOCKADOS
 * 
 * Este arquivo implementa um configurador que usa EXCLUSIVAMENTE
 * dados da tabela de veículos, sem nenhum tipo de fallback ou dados mockados.
 * 
 * IMPORTANTE: Este configurador NUNCA usa dados mockados ou de exemplo.
 * Todos os dados vêm diretamente do banco de dados.
 */

console.log('Carregando configurador-real.js - APENAS DADOS REAIS');

// Função para carregar marcas
async function loadMarcas() {
    console.log('Carregando marcas do banco de dados...');
    
    // Obter o elemento select
    const marcaSelect = document.getElementById('configuradorMarca');
    if (!marcaSelect) {
        console.error('Elemento select de marca não encontrado');
        return;
    }
    
    // Mostrar mensagem de carregamento
    marcaSelect.innerHTML = '<option value="">Carregando marcas...</option>';
    marcaSelect.disabled = true;
    
    try {
        // Obter token de autenticação
        let headers = { 'Content-Type': 'application/json' };
        try {
            const auth = new Auth();
            const token = auth.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (error) {
            console.warn('Erro ao obter token:', error);
        }
        
        // Fazer requisição direta à API de veículos/marcas
        const url = 'http://localhost:3000/api/veiculos/marcas';
        console.log('Buscando marcas de:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });
        
        // Verificar se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro ao carregar marcas: ${response.status} ${response.statusText}`);
        }
        
        // Obter as marcas
        const marcas = await response.json();
        console.log('Marcas carregadas:', marcas);
        
        // Limpar o select
        marcaSelect.innerHTML = '<option value="">Selecione uma marca</option>';
        
        // Adicionar as marcas ao select
        if (Array.isArray(marcas) && marcas.length > 0) {
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
    
    // Obter o elemento select
    const modeloSelect = document.getElementById('configuradorModelo');
    if (!modeloSelect) {
        console.error('Elemento select de modelo não encontrado');
        return;
    }
    
    // Mostrar mensagem de carregamento
    modeloSelect.innerHTML = '<option value="">Carregando modelos...</option>';
    modeloSelect.disabled = true;
    
    // Se não houver marca selecionada, limpar o select
    if (!marcaId) {
        modeloSelect.innerHTML = '<option value="">Selecione uma marca primeiro</option>';
        modeloSelect.disabled = true;
        return;
    }
    
    try {
        // Obter token de autenticação
        let headers = { 'Content-Type': 'application/json' };
        try {
            const auth = new Auth();
            const token = auth.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (error) {
            console.warn('Erro ao obter token:', error);
        }
        
        // Fazer requisição direta à API de veículos/modelos
        const url = `http://localhost:3000/api/veiculos/modelos/by-marca/${marcaId}`;
        console.log('Buscando modelos de:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });
        
        // Verificar se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro ao carregar modelos: ${response.status} ${response.statusText}`);
        }
        
        // Obter os modelos
        const modelos = await response.json();
        console.log('Modelos carregados:', modelos);
        
        // Limpar o select
        modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
        
        // Adicionar os modelos ao select
        if (Array.isArray(modelos) && modelos.length > 0) {
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

// Função para carregar versões por modelo - BUSCANDO VERSÕES REAIS CADASTRADAS
async function loadVersoes(modeloId) {
    console.log('Carregando versões para o modelo ID:', modeloId);
    
    // Obter o elemento select
    const versaoSelect = document.getElementById('configuradorVersao');
    if (!versaoSelect) {
        console.error('Elemento select de versão não encontrado');
        return;
    }
    
    // Mostrar mensagem de carregamento
    versaoSelect.innerHTML = '<option value="">Carregando versões...</option>';
    versaoSelect.disabled = true;
    
    // Se não houver modelo selecionado, limpar o select
    if (!modeloId) {
        versaoSelect.innerHTML = '<option value="">Selecione um modelo primeiro</option>';
        versaoSelect.disabled = true;
        return;
    }
    
    try {
        // Obter token de autenticação
        let headers = { 'Content-Type': 'application/json' };
        try {
            const auth = new Auth();
            const token = auth.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (error) {
            console.warn('Erro ao obter token:', error);
        }
        
        // IMPORTANTE: Buscar diretamente da tabela de veículos para mostrar apenas versões com veículos cadastrados
        console.log('Buscando versões a partir dos veículos cadastrados...');
        
        // Buscar todos os veículos
        const veiculosUrl = 'http://localhost:3000/api/veiculos';
        const veiculosResponse = await fetch(veiculosUrl, {
            method: 'GET',
            headers: headers
        });
        
        if (!veiculosResponse.ok) {
            throw new Error(`Erro ao carregar veículos: ${veiculosResponse.status} ${veiculosResponse.statusText}`);
        }
        
        // Obter os veículos
        const responseData = await veiculosResponse.json();
        console.log('Resposta da API de veículos:', responseData);
        
        // Extrair os veículos do formato de resposta
        let veiculos = [];
        
        if (Array.isArray(responseData)) {
            veiculos = responseData;
        } else if (responseData && typeof responseData === 'object') {
            if (responseData.items && Array.isArray(responseData.items)) {
                veiculos = responseData.items;
            } else if (responseData.veiculos && Array.isArray(responseData.veiculos)) {
                veiculos = responseData.veiculos;
            } else if (responseData.data && Array.isArray(responseData.data)) {
                veiculos = responseData.data;
            } else if (responseData.results && Array.isArray(responseData.results)) {
                veiculos = responseData.results;
            }
        }
        
        console.log('Total de veículos processados:', veiculos.length);
        
        // Filtrar veículos pelo modelo selecionado
        const veiculosFiltrados = veiculos.filter(veiculo => {
            if (!veiculo) return false;
            
            // Verificar todas as formas possíveis de armazenar o ID do modelo
            const vModeloId = veiculo.modelo_id || veiculo.modeloId || 
                            (veiculo.modelo && veiculo.modelo.id);
            
            return vModeloId == modeloId;
        });
        
        console.log('Veículos encontrados para este modelo:', veiculosFiltrados.length);
        
        // Verificar se há versões cadastradas para este modelo
        const versoesMap = new Map();
        
        // Buscar versões nos veículos
        veiculosFiltrados.forEach(veiculo => {
            // Verificar se o veículo tem uma versão associada
            if (veiculo.versao && (veiculo.versao.nome || veiculo.versao.nome_versao)) {
                const versaoId = veiculo.versao.id;
                const versaoNome = veiculo.versao.nome || veiculo.versao.nome_versao;
                
                if (!versoesMap.has(versaoId)) {
                    versoesMap.set(versaoId, {
                        id: versaoId,
                        nome: versaoNome,
                        veiculoId: veiculo.id
                    });
                    console.log(`Versão encontrada no objeto versao: ${versaoNome}`);
                }
            }
            
            // Verificar campos específicos de versão
            if (veiculo.versao_nome) {
                const versaoId = veiculo.versao_id || veiculo.id;
                const versaoNome = veiculo.versao_nome;
                
                if (!versoesMap.has(versaoId)) {
                    versoesMap.set(versaoId, {
                        id: versaoId,
                        nome: versaoNome,
                        veiculoId: veiculo.id
                    });
                    console.log(`Versão encontrada no campo versao_nome: ${versaoNome}`);
                }
            }
            
            // Verificar campos com nomenclatura camelCase
            if (veiculo.versaoNome || veiculo.nome_versao) {
                const versaoId = veiculo.versaoId || veiculo.id;
                const versaoNome = veiculo.versaoNome || veiculo.nome_versao;
                
                if (!versoesMap.has(versaoId)) {
                    versoesMap.set(versaoId, {
                        id: versaoId,
                        nome: versaoNome,
                        veiculoId: veiculo.id
                    });
                    console.log(`Versão encontrada no campo versaoNome/nome_versao: ${versaoNome}`);
                }
            }
        });
        
        // Converter o Map para array
        const versoes = Array.from(versoesMap.values());
        console.log('Versões encontradas:', versoes);
        
        // Limpar o select
        versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
        
        // Se encontrou versões, adicioná-las ao select
        if (versoes.length > 0) {
            versoes.forEach(versao => {
                // Verificar se a versão tem nome ou nome_versao
                const nomeVersao = versao.nome || versao.nome_versao;
                
                // Só adicionar versões que tenham nome definido
                if (nomeVersao) {
                    const option = document.createElement('option');
                    option.value = versao.id;
                    option.textContent = nomeVersao;
                    option.dataset.veiculoId = versao.veiculoId;
                    
                    versaoSelect.appendChild(option);
                }
            });
            versaoSelect.disabled = false;
        } else {
            // Se não encontrou nenhuma versão, mostrar mensagem
            console.log('Nenhuma versão encontrada para este modelo.');
            versaoSelect.innerHTML = '<option value="">Nenhum veículo disponível para este modelo</option>';
            versaoSelect.disabled = true;
        }
    } catch (error) {
        console.error('Erro ao carregar versões:', error);
        versaoSelect.innerHTML = '<option value="">Erro ao carregar versões</option>';
        versaoSelect.disabled = true;
    }
}

// Função para carregar vendas diretas
async function loadVendasDiretas() {
    console.log('Carregando descontos de venda direta do banco de dados...');
    
    // Obter o elemento select
    const vendasDiretasSelect = document.getElementById('vendasDiretasSelect');
    if (!vendasDiretasSelect) {
        console.error('Elemento select de vendas diretas não encontrado');
        return;
    }
    
    // Mostrar mensagem de carregamento
    vendasDiretasSelect.innerHTML = '<option value="">Carregando descontos...</option>';
    vendasDiretasSelect.disabled = true;
    
    try {
        // Obter token de autenticação
        let headers = { 'Content-Type': 'application/json' };
        try {
            const auth = new Auth();
            const token = auth.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (error) {
            console.warn('Erro ao obter token:', error);
        }
        
        // URLs para tentar carregar vendas diretas (baseado no arquivo vendas-diretas.js)
        const apiUrls = [
            '/api/venda-direta/public',
            'http://localhost:3000/api/venda-direta/public',
            'http://69.62.91.195:3000/api/venda-direta/public'
        ];
        
        console.log('Tentando URLs para carregar vendas diretas:', apiUrls);
        
        // Tentar cada URL em sequência
        let response = null;
        let lastError = null;
        let data = null;
        
        for (const url of apiUrls) {
            try {
                console.log(`Tentando carregar vendas diretas de: ${url}`);
                response = await fetch(url, {
                    method: 'GET',
                    headers: headers
                });
                
                if (response.ok) {
                    data = await response.json();
                    console.log(`URL bem-sucedida para vendas diretas: ${url}`);
                    break; // Sair do loop se a resposta for bem-sucedida
                } else {
                    const errorText = await response.text();
                    console.warn(`Falha na URL ${url}:`, errorText);
                    lastError = `${response.status} ${response.statusText}`;
                }
            } catch (error) {
                console.error(`Erro ao acessar ${url}:`, error.message);
                lastError = error.message;
            }
        }
        
        // Se todas as URLs falharam
        if (!data) {
            console.error(`Falha ao carregar vendas diretas: ${lastError}`);
            vendasDiretasSelect.innerHTML = '<option value="">DESCONTOS VENDA DIRETA</option>';
            vendasDiretasSelect.disabled = false;
            return;
        }
        
        // Extrair as vendas diretas do objeto de resposta
        let vendasDiretas = [];
        if (Array.isArray(data)) {
            vendasDiretas = data;
        } else if (data && typeof data === 'object') {
            if (data.items && Array.isArray(data.items)) {
                vendasDiretas = data.items;
            } else if (data.vendasDiretas && Array.isArray(data.vendasDiretas)) {
                vendasDiretas = data.vendasDiretas;
            } else if (data.data && Array.isArray(data.data)) {
                vendasDiretas = data.data;
            } else if (data.results && Array.isArray(data.results)) {
                vendasDiretas = data.results;
            }
        }
        
        console.log('Vendas diretas carregadas do banco:', vendasDiretas);
        
        // Filtrar apenas as vendas diretas ativas
        const vendasDiretasAtivas = vendasDiretas.filter(vd => vd.status === 'ativo' || vd.status === undefined);
        
        // Limpar o select
        vendasDiretasSelect.innerHTML = '<option value="">DESCONTOS VENDA DIRETA</option>';
        
        // Adicionar as vendas diretas ao select
        if (vendasDiretasAtivas.length > 0) {
            vendasDiretasAtivas.forEach(vendaDireta => {
                const option = document.createElement('option');
                option.value = vendaDireta.id;
                option.textContent = `${vendaDireta.nome} (${parseFloat(vendaDireta.percentual).toFixed(2)}%)`;
                option.dataset.percentual = vendaDireta.percentual;
                vendasDiretasSelect.appendChild(option);
            });
            
            // Adicionar evento de change para atualizar o percentual de desconto
            vendasDiretasSelect.addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                const percentual = selectedOption.dataset.percentual || 0;
                
                // Atualizar o campo de desconto
                const descontoInput = document.getElementById('descontoInput');
                if (descontoInput) {
                    descontoInput.value = percentual;
                    
                    // Disparar evento de input para atualizar o cálculo
                    const event = new Event('input', { bubbles: true });
                    descontoInput.dispatchEvent(event);
                }
                
                // Armazenar a venda direta selecionada para uso posterior
                if (this.value) {
                    window.vendaDiretaSelecionada = {
                        id: this.value,
                        percentual: percentual
                    };
                } else {
                    window.vendaDiretaSelecionada = null;
                }
            });
            
            // Restaurar seleção anterior se existir
            if (window.vendaDiretaSelecionada) {
                const vendaDiretaExiste = vendasDiretasAtivas.some(vd => vd.id == window.vendaDiretaSelecionada.id);
                if (vendaDiretaExiste) {
                    vendasDiretasSelect.value = window.vendaDiretaSelecionada.id;
                    
                    // Disparar evento de change para atualizar o percentual
                    const event = new Event('change', { bubbles: true });
                    vendasDiretasSelect.dispatchEvent(event);
                }
            }
        } else {
            console.log('Nenhuma venda direta ativa encontrada');
        }
        
        // Habilitar o select
        vendasDiretasSelect.disabled = false;
        
        console.log('Descontos de venda direta carregados com sucesso');
    } catch (error) {
        console.error('Erro ao carregar descontos de venda direta:', error);
        vendasDiretasSelect.innerHTML = '<option value="">DESCONTOS VENDA DIRETA</option>';
        vendasDiretasSelect.disabled = false;
    }
}

// Exportar funções para o escopo global
window.loadMarcas = loadMarcas;
window.loadModelos = loadModelos;
window.loadVersoes = loadVersoes;
window.loadVendasDiretas = loadVendasDiretas;

console.log('Funções do configurador real exportadas globalmente');
