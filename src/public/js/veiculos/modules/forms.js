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
        console.log('Preenchendo formulário com dados do veículo:', veiculo);
        
        // Resetar formulário
        resetForm();
        
        // Obter campos
        const veiculoIdInput = document.getElementById('veiculoId');
        const marcaSelect = document.getElementById('marcaId');
        const anoInput = document.getElementById('ano');
        const precoInput = document.getElementById('preco');
        const situacaoSelect = document.getElementById('situacao');
        const descricaoInput = document.getElementById('descricao');
        const motorInput = document.getElementById('motor');
        const combustivelSelect = document.getElementById('combustivel');
        const cambioSelect = document.getElementById('cambio');
        const statusSelect = document.getElementById('status');
        
        // Campos de isenções
        const defisicoicmsInput = document.getElementById('defisicoicms');
        const defisicoipiInput = document.getElementById('defisicoipi');
        const taxicmsInput = document.getElementById('taxicms');
        const taxipiInput = document.getElementById('taxipi');
        
        // Preencher campos
        if (veiculoIdInput) veiculoIdInput.value = veiculo.id;
        if (anoInput) anoInput.value = veiculo.ano;
        if (precoInput) precoInput.value = formatarPreco(veiculo.preco);
        if (situacaoSelect) situacaoSelect.value = veiculo.situacao;
        if (descricaoInput) descricaoInput.value = veiculo.descricao;
        if (motorInput) motorInput.value = veiculo.motor;
        if (combustivelSelect) combustivelSelect.value = veiculo.combustivel;
        if (cambioSelect) cambioSelect.value = veiculo.cambio;
        if (statusSelect) statusSelect.value = veiculo.status || 'ativo';
        
        // Preencher campos de isenções
        if (defisicoicmsInput) defisicoicmsInput.value = formatarPreco(veiculo.defisicoicms);
        if (defisicoipiInput) defisicoipiInput.value = formatarPreco(veiculo.defisicoipi);
        if (taxicmsInput) taxicmsInput.value = formatarPreco(veiculo.taxicms);
        if (taxipiInput) taxipiInput.value = formatarPreco(veiculo.taxipi);
        
        // Carregar marca
        if (marcaSelect && veiculo.marcaId) {
            await loadMarcasNoForm();
            marcaSelect.value = veiculo.marcaId;
            
            // Carregar modelos
            if (veiculo.modeloId) {
                await loadModelosNoForm(veiculo.marcaId);
                
                // Selecionar modelo
                const modeloSelect = document.getElementById('modeloId');
                if (modeloSelect) {
                    modeloSelect.value = veiculo.modeloId;
                    
                    // Carregar versões
                    if (veiculo.versaoId) {
                        await loadVersoesNoForm(veiculo.modeloId);
                        
                        // Selecionar versão
                        const versaoSelect = document.getElementById('versaoId');
                        if (versaoSelect) {
                            versaoSelect.value = veiculo.versaoId;
                        }
                    }
                }
            }
        }
        
        // Atualizar título do modal
        const modalTitle = document.querySelector('#veiculoModal .modal-title');
        if (modalTitle) {
            modalTitle.textContent = 'Editar Veículo';
        }
    } catch (error) {
        console.error('Erro ao preencher formulário:', error);
        showError('Erro ao carregar dados do veículo. Por favor, tente novamente mais tarde.');
    }
}

// Função para carregar marcas no formulário
async function loadMarcasNoForm() {
    try {
        console.log('Carregando marcas no formulário...');
        
        const marcaSelect = document.getElementById('marcaId');
        if (!marcaSelect) {
            console.error('Elemento marcaId não encontrado');
            throw new Error('Elemento marcaId não encontrado');
        }
        
        // Limpar select e mostrar carregando
        marcaSelect.innerHTML = '<option value="">Carregando marcas...</option>';
        marcaSelect.disabled = true;
        
        // Carregar marcas
        const marcas = await loadMarcas();
        console.log(`Carregadas ${marcas.length} marcas com sucesso`);
        
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
        
        // Retornar as marcas para permitir encadeamento de promessas
        return marcas;
    } catch (error) {
        console.error('Erro ao carregar marcas para o formulário:', error);
        showError('Não foi possível carregar as marcas. Por favor, tente novamente mais tarde.');
        
        // Garantir que o select esteja habilitado mesmo em caso de erro
        const marcaSelect = document.getElementById('marcaId');
        if (marcaSelect) {
            marcaSelect.innerHTML = '<option value="">Selecione uma marca</option>';
            marcaSelect.disabled = false;
        }
        
        // Propagar o erro para permitir tratamento externo
        throw error;
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
            throw new Error('Elemento modeloId não encontrado');
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
            throw new Error('ID da marca não fornecido');
        }
        
        // Carregar modelos
        const modelos = await loadModelos(marcaId);
        console.log(`Carregados ${modelos.length} modelos com sucesso para marca ID: ${marcaId}`);
        
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
        
        // Retornar os modelos para permitir encadeamento de promessas
        return modelos;
    } catch (error) {
        console.error('Erro ao carregar modelos para o formulário:', error);
        showError('Não foi possível carregar os modelos. Por favor, tente novamente mais tarde.');
        
        // Garantir que o select esteja em um estado consistente
        const modeloSelect = document.getElementById('modeloId');
        if (modeloSelect) {
            modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
            modeloSelect.disabled = true;
        }
        
        // Propagar o erro para permitir tratamento externo
        throw error;
    }
}

// Função para carregar versões no formulário
async function loadVersoesNoForm(modeloId) {
    try {
        console.log(`Carregando versões para modelo ID: ${modeloId}`);
        
        const versaoSelect = document.getElementById('versaoId');
        if (!versaoSelect) {
            console.error('Elemento versaoId não encontrado');
            throw new Error('Elemento versaoId não encontrado');
        }
        
        // Limpar e desabilitar select
        versaoSelect.innerHTML = '<option value="">Carregando versões...</option>';
        versaoSelect.disabled = true;
        
        // Verificar se modeloId foi fornecido
        if (!modeloId) {
            versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
            versaoSelect.disabled = true;
            throw new Error('ID do modelo não fornecido');
        }
        
        // Carregar versões
        const versoes = await loadVersoes(modeloId);
        console.log(`Carregadas ${versoes.length} versões com sucesso para modelo ID: ${modeloId}`);
        
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
        
        // Retornar as versões para permitir encadeamento de promessas
        return versoes;
    } catch (error) {
        console.error('Erro ao carregar versões para o formulário:', error);
        showError('Não foi possível carregar as versões. Por favor, tente novamente mais tarde.');
        
        // Garantir que o select esteja em um estado consistente
        const versaoSelect = document.getElementById('versaoId');
        if (versaoSelect) {
            versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
            versaoSelect.disabled = true;
        }
        
        // Propagar o erro para permitir tratamento externo
        throw error;
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
    const precoInput = document.getElementById('preco');
    const situacaoSelect = document.getElementById('situacao');
    const descricaoInput = document.getElementById('descricao');
    const motorInput = document.getElementById('motor');
    const combustivelSelect = document.getElementById('combustivel');
    const cambioSelect = document.getElementById('cambio');
    const statusSelect = document.getElementById('status');
    
    // Campos de isenções
    const defisicoicmsInput = document.getElementById('defisicoicms');
    const defisicoipiInput = document.getElementById('defisicoipi');
    const taxicmsInput = document.getElementById('taxicms');
    const taxipiInput = document.getElementById('taxipi');
    
    // Obter valores monetários
    let preco = null;
    if (precoInput && precoInput.value) {
        preco = converterParaNumero(precoInput.value);
        console.log(`Preço convertido: ${precoInput.value} -> ${preco}`);
    }
    
    // Obter valores monetários de isenções
    let defisicoicms = null;
    let defisicoipi = null;
    let taxicms = null;
    let taxipi = null;
    
    if (defisicoicmsInput && defisicoicmsInput.value) {
        defisicoicms = converterParaNumero(defisicoicmsInput.value);
    }
    
    if (defisicoipiInput && defisicoipiInput.value) {
        defisicoipi = converterParaNumero(defisicoipiInput.value);
    }
    
    if (taxicmsInput && taxicmsInput.value) {
        taxicms = converterParaNumero(taxicmsInput.value);
    }
    
    if (taxipiInput && taxipiInput.value) {
        taxipi = converterParaNumero(taxipiInput.value);
    }
    
    // Criar objeto com dados do veículo
    const veiculo = {
        marcaId: marcaSelect ? parseInt(marcaSelect.value) : null,
        modeloId: modeloSelect ? parseInt(modeloSelect.value) : null,
        versaoId: versaoSelect ? parseInt(versaoSelect.value) : null,
        ano: anoInput ? parseInt(anoInput.value) : null,
        preco: preco,
        situacao: situacaoSelect ? situacaoSelect.value : null,
        descricao: descricaoInput ? descricaoInput.value : null,
        motor: motorInput ? motorInput.value : null,
        combustivel: combustivelSelect ? combustivelSelect.value : null,
        cambio: cambioSelect ? cambioSelect.value : null,
        status: statusSelect ? statusSelect.value : 'ativo',
        
        // Adicionar campos de isenções
        defisicoicms: defisicoicms,
        defisicoipi: defisicoipi,
        taxicms: taxicms,
        taxipi: taxipi
    };
    
    // Adicionar ID se estiver editando
    if (veiculoIdInput && veiculoIdInput.value) {
        veiculo.id = parseInt(veiculoIdInput.value);
    }
    
    console.log('Dados do veículo obtidos do formulário:', veiculo);
    
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
