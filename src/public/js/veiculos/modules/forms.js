/**
 * Módulo Forms - Funções para manipulação de formulários
 * Este módulo contém funções para manipulação de formulários de veículos
 */

import { loadMarcas, loadModelos, loadVersoes } from './api.js';
import { formatarPreco, converterParaNumero } from './utils.js';
import { showError, hideError } from './ui.js';

// Função para resetar o formulário
function resetForm() {
    console.log('Resetando formulário');
    
    // Esconder mensagem de erro
    hideError();
    
    // Obter formulário
    const form = document.getElementById('veiculoForm');
    if (!form) {
        console.error('Elemento veiculoForm não encontrado');
        return;
    }
    
    // Resetar formulário
    form.reset();
    
    // Limpar ID do veículo
    const veiculoIdInput = document.getElementById('veiculoId');
    if (veiculoIdInput) {
        veiculoIdInput.value = '';
    }
    
    // Resetar selects
    const modeloSelect = document.getElementById('modeloId');
    const versaoSelect = document.getElementById('versaoId');
    
    if (modeloSelect) {
        modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
        modeloSelect.disabled = true;
    }
    
    if (versaoSelect) {
        versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
        versaoSelect.disabled = true;
    }
    
    // Atualizar título do modal
    const modalTitle = document.querySelector('#veiculoModal .modal-title');
    if (modalTitle) {
        modalTitle.textContent = 'Novo Veículo';
    }
    
    // Atualizar botão de salvar
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.textContent = 'Salvar';
    }
}

// Função para preencher o formulário com os dados do veículo
async function preencherFormularioVeiculo(veiculo) {
    try {
        console.log('Preenchendo formulário com veículo:', veiculo);
        
        // Resetar formulário
        resetForm();
        
        // Carregar marcas
        await loadMarcasNoForm();
        
        // Preencher campos
        const veiculoIdInput = document.getElementById('veiculoId');
        const marcaSelect = document.getElementById('marcaId');
        const anoInput = document.getElementById('ano');
        const placaInput = document.getElementById('placa');
        const corInput = document.getElementById('cor');
        const precoInput = document.getElementById('preco');
        const situacaoSelect = document.getElementById('situacao');
        const observacoesInput = document.getElementById('observacoes');
        
        // Campos de isenções
        const defisicoicmsInput = document.getElementById('defisicoicms');
        const defisicoipiInput = document.getElementById('defisicoipi');
        const taxicmsInput = document.getElementById('taxicms');
        const taxipiInput = document.getElementById('taxipi');
        
        if (veiculoIdInput) veiculoIdInput.value = veiculo.id;
        if (anoInput) anoInput.value = veiculo.ano;
        if (placaInput) placaInput.value = veiculo.placa;
        if (corInput) corInput.value = veiculo.cor;
        if (precoInput) precoInput.value = formatarPreco(veiculo.preco);
        if (situacaoSelect) situacaoSelect.value = veiculo.situacao;
        if (observacoesInput) observacoesInput.value = veiculo.observacoes;
        
        // Preencher campos de isenções
        if (defisicoicmsInput) defisicoicmsInput.value = formatarPreco(veiculo.defisicoicms);
        if (defisicoipiInput) defisicoipiInput.value = formatarPreco(veiculo.defisicoipi);
        if (taxicmsInput) taxicmsInput.value = formatarPreco(veiculo.taxicms);
        if (taxipiInput) taxipiInput.value = formatarPreco(veiculo.taxipi);
        
        // Selecionar marca
        if (marcaSelect && veiculo.marcaId) {
            marcaSelect.value = veiculo.marcaId;
            
            // Carregar modelos da marca selecionada
            await loadModelosNoForm(veiculo.marcaId);
            
            // Selecionar modelo
            const modeloSelect = document.getElementById('modeloId');
            if (modeloSelect && veiculo.modeloId) {
                modeloSelect.value = veiculo.modeloId;
                
                // Carregar versões do modelo selecionado
                await loadVersoesNoForm(veiculo.modeloId);
                
                // Selecionar versão
                const versaoSelect = document.getElementById('versaoId');
                if (versaoSelect && veiculo.versaoId) {
                    versaoSelect.value = veiculo.versaoId;
                }
            }
        }
        
        // Atualizar título do modal
        const modalTitle = document.querySelector('#veiculoModal .modal-title');
        if (modalTitle) {
            modalTitle.textContent = 'Editar Veículo';
        }
        
        // Atualizar botão de salvar
        const saveButton = document.getElementById('saveButton');
        if (saveButton) {
            saveButton.textContent = 'Atualizar';
        }
    } catch (error) {
        console.error('Erro ao preencher formulário:', error);
        showError('Erro ao carregar dados do veículo. Por favor, tente novamente.');
    }
}

// Função para carregar marcas no formulário
async function loadMarcasNoForm() {
    try {
        console.log('Carregando marcas no formulário...');
        
        const marcaSelect = document.getElementById('marcaId');
        if (!marcaSelect) {
            console.error('Elemento marcaId não encontrado');
            return;
        }
        
        // Limpar select e mostrar carregando
        marcaSelect.innerHTML = '<option value="">Carregando marcas...</option>';
        marcaSelect.disabled = true;
        
        // Carregar marcas
        let marcas = [];
        try {
            marcas = await loadMarcas();
            console.log(`Carregadas ${marcas.length} marcas com sucesso`);
        } catch (apiError) {
            console.error('Erro ao carregar marcas da API:', apiError);
            console.warn('Usando dados de exemplo para marcas como fallback');
            
            // Usar dados de exemplo como fallback
            marcas = [
                { id: 1, nome: 'Chevrolet' },
                { id: 2, nome: 'Ford' },
                { id: 3, nome: 'Volkswagen' },
                { id: 4, nome: 'Toyota' },
                { id: 5, nome: 'Honda' },
                { id: 6, nome: 'Hyundai' },
                { id: 7, nome: 'Fiat' },
                { id: 8, nome: 'Renault' }
            ];
        }
        
        // Limpar select
        marcaSelect.innerHTML = '<option value="">Selecione uma marca</option>';
        
        // Preencher select
        if (Array.isArray(marcas) && marcas.length > 0) {
            marcas.forEach(marca => {
                const option = document.createElement('option');
                option.value = marca.id;
                option.textContent = marca.nome;
                marcaSelect.appendChild(option);
            });
            console.log(`Preenchido select de marcas com ${marcas.length} opções`);
        } else {
            console.warn('Nenhuma marca disponível para preencher o select');
        }
        
        // Habilitar select
        marcaSelect.disabled = false;
    } catch (error) {
        console.error('Erro ao carregar marcas para o formulário:', error);
        showError('Não foi possível carregar as marcas. Por favor, tente novamente mais tarde.');
        
        // Garantir que o select esteja habilitado mesmo em caso de erro
        const marcaSelect = document.getElementById('marcaId');
        if (marcaSelect) {
            marcaSelect.innerHTML = '<option value="">Selecione uma marca</option>';
            marcaSelect.disabled = false;
        }
    }
}

// Função para carregar modelos no formulário
async function loadModelosNoForm(marcaId) {
    try {
        console.log(`Carregando modelos para marca ID: ${marcaId}`);
        
        const modeloSelect = document.getElementById('modeloId');
        const versaoSelect = document.getElementById('versaoId');
        
        if (!modeloSelect) {
            console.error('Elemento modeloId não encontrado');
            return;
        }
        
        // Limpar e desabilitar selects
        modeloSelect.innerHTML = '<option value="">Carregando modelos...</option>';
        modeloSelect.disabled = true;
        
        if (versaoSelect) {
            versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
            versaoSelect.disabled = true;
        }
        
        // Verificar se marcaId foi fornecido
        if (!marcaId) {
            modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
            modeloSelect.disabled = true;
            return;
        }
        
        // Carregar modelos
        let modelos = [];
        try {
            modelos = await loadModelos(marcaId);
            console.log(`Carregados ${modelos.length} modelos com sucesso para marca ID: ${marcaId}`);
        } catch (apiError) {
            console.error('Erro ao carregar modelos da API:', apiError);
            console.warn('Usando dados de exemplo para modelos como fallback');
            
            // Dados de exemplo por marca
            const modelosPorMarca = {
                1: [ // Chevrolet
                    { id: 1, nome: 'Onix' },
                    { id: 2, nome: 'Cruze' },
                    { id: 3, nome: 'S10' }
                ],
                2: [ // Ford
                    { id: 4, nome: 'Ka' },
                    { id: 5, nome: 'Ranger' },
                    { id: 6, nome: 'Mustang' }
                ],
                3: [ // Volkswagen
                    { id: 7, nome: 'Gol' },
                    { id: 8, nome: 'Polo' },
                    { id: 9, nome: 'T-Cross' }
                ],
                4: [ // Toyota
                    { id: 10, nome: 'Corolla' },
                    { id: 11, nome: 'Hilux' },
                    { id: 12, nome: 'Yaris' }
                ],
                5: [ // Honda
                    { id: 13, nome: 'Civic' },
                    { id: 14, nome: 'HR-V' },
                    { id: 15, nome: 'Fit' }
                ],
                6: [ // Hyundai
                    { id: 16, nome: 'HB20' },
                    { id: 17, nome: 'Creta' },
                    { id: 18, nome: 'Tucson' }
                ],
                7: [ // Fiat
                    { id: 19, nome: 'Uno' },
                    { id: 20, nome: 'Argo' },
                    { id: 21, nome: 'Toro' }
                ],
                8: [ // Renault
                    { id: 22, nome: 'Kwid' },
                    { id: 23, nome: 'Sandero' },
                    { id: 24, nome: 'Duster' }
                ]
            };
            
            // Usar modelos de exemplo para a marca selecionada ou modelos genéricos
            modelos = modelosPorMarca[marcaId] || [
                { id: 100, nome: 'Modelo A' },
                { id: 101, nome: 'Modelo B' },
                { id: 102, nome: 'Modelo C' }
            ];
        }
        
        // Limpar select
        modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
        
        // Preencher select
        if (Array.isArray(modelos) && modelos.length > 0) {
            modelos.forEach(modelo => {
                const option = document.createElement('option');
                option.value = modelo.id;
                option.textContent = modelo.nome;
                modeloSelect.appendChild(option);
            });
            console.log(`Preenchido select de modelos com ${modelos.length} opções`);
            modeloSelect.disabled = false;
        } else {
            console.warn('Nenhum modelo disponível para a marca selecionada');
            modeloSelect.innerHTML = '<option value="">Nenhum modelo disponível</option>';
            modeloSelect.disabled = true;
        }
    } catch (error) {
        console.error('Erro ao carregar modelos para o formulário:', error);
        showError('Não foi possível carregar os modelos. Por favor, tente novamente mais tarde.');
        
        // Garantir que o select esteja em um estado consistente
        const modeloSelect = document.getElementById('modeloId');
        if (modeloSelect) {
            modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
            modeloSelect.disabled = true;
        }
    }
}

// Função para carregar versões no formulário
async function loadVersoesNoForm(modeloId) {
    try {
        console.log(`Carregando versões para modelo ID: ${modeloId}`);
        
        const versaoSelect = document.getElementById('versaoId');
        if (!versaoSelect) {
            console.error('Elemento versaoId não encontrado');
            return;
        }
        
        // Limpar e desabilitar select
        versaoSelect.innerHTML = '<option value="">Carregando versões...</option>';
        versaoSelect.disabled = true;
        
        // Verificar se modeloId foi fornecido
        if (!modeloId) {
            versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
            versaoSelect.disabled = true;
            return;
        }
        
        // Carregar versões
        let versoes = [];
        try {
            versoes = await loadVersoes(modeloId);
            console.log(`Carregadas ${versoes.length} versões com sucesso para modelo ID: ${modeloId}`);
        } catch (apiError) {
            console.error('Erro ao carregar versões da API:', apiError);
            console.warn('Usando dados de exemplo para versões como fallback');
            
            // Dados de exemplo por modelo
            const versoesPorModelo = {
                // Chevrolet
                1: [ // Onix
                    { id: 1, nome_versao: 'LT 1.0' },
                    { id: 2, nome_versao: 'LTZ 1.4' },
                    { id: 3, nome_versao: 'Premier 1.0 Turbo' }
                ],
                2: [ // Cruze
                    { id: 4, nome_versao: 'LT 1.4 Turbo' },
                    { id: 5, nome_versao: 'Premier 1.4 Turbo' }
                ],
                3: [ // S10
                    { id: 6, nome_versao: 'LT 2.8 Diesel' },
                    { id: 7, nome_versao: 'LTZ 2.8 Diesel 4x4' }
                ],
                // Ford
                4: [ // Ka
                    { id: 8, nome_versao: 'SE 1.0' },
                    { id: 9, nome_versao: 'SEL 1.5' }
                ],
                5: [ // Ranger
                    { id: 10, nome_versao: 'XLS 2.2 Diesel' },
                    { id: 11, nome_versao: 'XLT 3.2 Diesel 4x4' }
                ],
                // Outros modelos...
                10: [ // Corolla
                    { id: 12, nome_versao: 'GLi 1.8' },
                    { id: 13, nome_versao: 'XEi 2.0' },
                    { id: 14, nome_versao: 'Altis Hybrid' }
                ],
                16: [ // HB20
                    { id: 15, nome_versao: 'Sense 1.0' },
                    { id: 16, nome_versao: 'Comfort 1.0 Turbo' },
                    { id: 17, nome_versao: 'Premium 1.0 Turbo' }
                ]
            };
            
            // Usar versões de exemplo para o modelo selecionado ou versões genéricas
            versoes = versoesPorModelo[modeloId] || [
                { id: 100, nome_versao: 'Básica' },
                { id: 101, nome_versao: 'Intermediária' },
                { id: 102, nome_versao: 'Completa' }
            ];
        }
        
        // Limpar select
        versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
        
        // Preencher select
        if (Array.isArray(versoes) && versoes.length > 0) {
            versoes.forEach(versao => {
                const option = document.createElement('option');
                option.value = versao.id;
                option.textContent = versao.nome_versao;
                versaoSelect.appendChild(option);
            });
            console.log(`Preenchido select de versões com ${versoes.length} opções`);
            versaoSelect.disabled = false;
        } else {
            console.warn('Nenhuma versão disponível para o modelo selecionado');
            versaoSelect.innerHTML = '<option value="">Nenhuma versão disponível</option>';
            versaoSelect.disabled = true;
        }
    } catch (error) {
        console.error('Erro ao carregar versões para o formulário:', error);
        showError('Não foi possível carregar as versões. Por favor, tente novamente mais tarde.');
        
        // Garantir que o select esteja em um estado consistente
        const versaoSelect = document.getElementById('versaoId');
        if (versaoSelect) {
            versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
            versaoSelect.disabled = true;
        }
    }
}

// Função para validar formulário
function validarFormulario() {
    // Obter formulário
    const form = document.getElementById('veiculoForm');
    if (!form) {
        console.error('Elemento veiculoForm não encontrado');
        return false;
    }
    
    // Verificar se o formulário é válido
    if (!form.checkValidity()) {
        // Mostrar validações do navegador
        form.reportValidity();
        return false;
    }
    
    // Validar campos específicos
    const marcaSelect = document.getElementById('marcaId');
    const modeloSelect = document.getElementById('modeloId');
    const versaoSelect = document.getElementById('versaoId');
    const anoInput = document.getElementById('ano');
    const precoInput = document.getElementById('preco');
    
    // Validar marca
    if (!marcaSelect || !marcaSelect.value) {
        showError('Por favor, selecione uma marca.');
        return false;
    }
    
    // Validar modelo
    if (!modeloSelect || !modeloSelect.value) {
        showError('Por favor, selecione um modelo.');
        return false;
    }
    
    // Validar versão
    if (!versaoSelect || !versaoSelect.value) {
        showError('Por favor, selecione uma versão.');
        return false;
    }
    
    // Validar ano
    if (!anoInput || !anoInput.value) {
        showError('Por favor, informe o ano do veículo.');
        return false;
    }
    
    const ano = parseInt(anoInput.value);
    const anoAtual = new Date().getFullYear();
    
    if (isNaN(ano) || ano < 1900 || ano > anoAtual + 1) {
        showError(`Por favor, informe um ano válido entre 1900 e ${anoAtual + 1}.`);
        return false;
    }
    
    // Validar preço
    if (!precoInput || !precoInput.value) {
        showError('Por favor, informe o preço do veículo.');
        return false;
    }
    
    const preco = converterParaNumero(precoInput.value);
    
    if (isNaN(preco) || preco <= 0) {
        showError('Por favor, informe um preço válido maior que zero.');
        return false;
    }
    
    return true;
}

// Função para obter dados do formulário
function obterDadosFormulario() {
    // Obter campos
    const veiculoIdInput = document.getElementById('veiculoId');
    const marcaSelect = document.getElementById('marcaId');
    const modeloSelect = document.getElementById('modeloId');
    const versaoSelect = document.getElementById('versaoId');
    const anoInput = document.getElementById('ano');
    const placaInput = document.getElementById('placa');
    const corInput = document.getElementById('cor');
    const precoInput = document.getElementById('preco');
    const situacaoSelect = document.getElementById('situacao');
    const observacoesInput = document.getElementById('observacoes');
    
    // Campos de isenções
    const defisicoicmsInput = document.getElementById('defisicoicms');
    const defisicoipiInput = document.getElementById('defisicoipi');
    const taxicmsInput = document.getElementById('taxicms');
    const taxipiInput = document.getElementById('taxipi');
    
    // Criar objeto com dados do veículo
    const veiculo = {
        marcaId: marcaSelect ? parseInt(marcaSelect.value) : null,
        modeloId: modeloSelect ? parseInt(modeloSelect.value) : null,
        versaoId: versaoSelect ? parseInt(versaoSelect.value) : null,
        ano: anoInput ? parseInt(anoInput.value) : null,
        placa: placaInput ? placaInput.value : null,
        cor: corInput ? corInput.value : null,
        preco: precoInput ? converterParaNumero(precoInput.value) : null,
        situacao: situacaoSelect ? situacaoSelect.value : null,
        observacoes: observacoesInput ? observacoesInput.value : null,
        
        // Adicionar campos de isenções
        defisicoicms: defisicoicmsInput ? converterParaNumero(defisicoicmsInput.value) : null,
        defisicoipi: defisicoipiInput ? converterParaNumero(defisicoipiInput.value) : null,
        taxicms: taxicmsInput ? converterParaNumero(taxicmsInput.value) : null,
        taxipi: taxipiInput ? converterParaNumero(taxipiInput.value) : null
    };
    
    // Adicionar ID se estiver editando
    if (veiculoIdInput && veiculoIdInput.value) {
        veiculo.id = parseInt(veiculoIdInput.value);
    }
    
    return veiculo;
}

// Exportar funções
export {
    resetForm,
    preencherFormularioVeiculo,
    loadMarcasNoForm,
    loadModelosNoForm,
    loadVersoesNoForm,
    validarFormulario,
    obterDadosFormulario
};
