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
        
        if (veiculoIdInput) veiculoIdInput.value = veiculo.id;
        if (anoInput) anoInput.value = veiculo.ano;
        if (placaInput) placaInput.value = veiculo.placa;
        if (corInput) corInput.value = veiculo.cor;
        if (precoInput) precoInput.value = formatarPreco(veiculo.preco);
        if (situacaoSelect) situacaoSelect.value = veiculo.situacao;
        if (observacoesInput) observacoesInput.value = veiculo.observacoes;
        
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
        const marcaSelect = document.getElementById('marcaId');
        if (!marcaSelect) {
            console.error('Elemento marcaId não encontrado');
            return;
        }
        
        // Limpar select
        marcaSelect.innerHTML = '<option value="">Selecione uma marca</option>';
        
        // Carregar marcas
        const marcas = await loadMarcas();
        
        // Preencher select
        marcas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca.id;
            option.textContent = marca.nome;
            marcaSelect.appendChild(option);
        });
        
        // Habilitar select
        marcaSelect.disabled = false;
    } catch (error) {
        console.error('Erro ao carregar marcas para o formulário:', error);
        showError('Não foi possível carregar as marcas. Por favor, tente novamente mais tarde.');
    }
}

// Função para carregar modelos no formulário
async function loadModelosNoForm(marcaId) {
    try {
        const modeloSelect = document.getElementById('modeloId');
        if (!modeloSelect) {
            console.error('Elemento modeloId não encontrado');
            return;
        }
        
        // Limpar select
        modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
        
        // Se não houver marca selecionada, desabilitar select
        if (!marcaId) {
            modeloSelect.disabled = true;
            
            // Limpar select de versões
            const versaoSelect = document.getElementById('versaoId');
            if (versaoSelect) {
                versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
                versaoSelect.disabled = true;
            }
            
            return;
        }
        
        // Carregar modelos
        const modelos = await loadModelos(marcaId);
        
        // Preencher select
        modelos.forEach(modelo => {
            const option = document.createElement('option');
            option.value = modelo.id;
            option.textContent = modelo.nome;
            modeloSelect.appendChild(option);
        });
        
        // Habilitar select
        modeloSelect.disabled = false;
        
        // Limpar select de versões
        const versaoSelect = document.getElementById('versaoId');
        if (versaoSelect) {
            versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
            versaoSelect.disabled = true;
        }
    } catch (error) {
        console.error('Erro ao carregar modelos para o formulário:', error);
        showError('Não foi possível carregar os modelos. Por favor, tente novamente mais tarde.');
    }
}

// Função para carregar versões no formulário
async function loadVersoesNoForm(modeloId) {
    try {
        const versaoSelect = document.getElementById('versaoId');
        if (!versaoSelect) {
            console.error('Elemento versaoId não encontrado');
            return;
        }
        
        // Limpar select
        versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
        
        // Se não houver modelo selecionado, desabilitar select
        if (!modeloId) {
            versaoSelect.disabled = true;
            return;
        }
        
        // Carregar versões
        const versoes = await loadVersoes(modeloId);
        
        // Preencher select
        versoes.forEach(versao => {
            const option = document.createElement('option');
            option.value = versao.id;
            
            // Usar nome_versao em vez de nome, conforme a entidade Versao
            if (versao.nome_versao !== undefined) {
                option.textContent = versao.nome_versao;
            } else if (versao.nome !== undefined) {
                option.textContent = versao.nome;
            } else {
                option.textContent = `Versão ${versao.id}`;
            }
            
            versaoSelect.appendChild(option);
        });
        
        // Habilitar select
        versaoSelect.disabled = false;
    } catch (error) {
        console.error('Erro ao carregar versões para o formulário:', error);
        showError('Não foi possível carregar as versões. Por favor, tente novamente mais tarde.');
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
        observacoes: observacoesInput ? observacoesInput.value : null
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
