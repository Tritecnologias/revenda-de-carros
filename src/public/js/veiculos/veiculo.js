/**
 * Módulo principal de Veículos
 * Este arquivo importa todos os módulos e inicializa a aplicação
 */

// Log de inicialização
console.log('Carregando veiculo.js - versão modularizada');

// Importar módulos
import * as api from './modules/api.js';
import * as ui from './modules/ui.js';
import * as forms from './modules/forms.js';
import * as table from './modules/table.js';
import * as utils from './modules/utils.js';

// Verificar autenticação
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, verificando autenticação...');
    
    if (!utils.isAuthenticated()) {
        console.error('Usuário não autenticado, redirecionando para login...');
        utils.redirectToLogin();
        return;
    }
    
    console.log('Usuário autenticado, inicializando aplicação...');
    
    // Inicializar aplicação
    init();
});

// Função de inicialização
async function init() {
    try {
        console.log('Inicializando aplicação de veículos...');
        
        // Inicializar tabela
        await table.initTable();
        
        // Adicionar event listeners
        setupEventListeners();
        
        console.log('Aplicação de veículos inicializada com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
        ui.showError('Erro ao inicializar aplicação. Por favor, recarregue a página.');
    }
}

// Configurar event listeners
function setupEventListeners() {
    console.log('Configurando event listeners...');
    
    // Botão para abrir modal de novo veículo
    const newVeiculoBtn = document.getElementById('newVeiculo');
    if (newVeiculoBtn) {
        console.log('Botão de novo veículo encontrado, adicionando event listener...');
        
        newVeiculoBtn.addEventListener('click', async () => {
            console.log('Botão de novo veículo clicado, abrindo modal...');
            
            try {
                // Mostrar spinner ou indicador de carregamento
                ui.showLoading('Carregando formulário...');
                
                // Resetar formulário
                forms.resetForm();
                
                // Abrir modal primeiro para mostrar o carregamento
                const modalElement = document.getElementById('veiculoModal');
                if (!modalElement) {
                    throw new Error('Elemento modal não encontrado!');
                }
                
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                
                // Carregar marcas no formulário
                console.log('Carregando marcas no formulário...');
                await forms.loadMarcasNoForm();
                
                // Esconder loading
                ui.hideLoading();
                
                console.log('Modal de novo veículo aberto com sucesso!');
            } catch (error) {
                console.error('Erro ao abrir modal de novo veículo:', error);
                ui.showError('Erro ao carregar formulário: ' + (error.message || 'Erro desconhecido'));
                ui.hideLoading();
            }
        });
    } else {
        console.error('Botão de novo veículo não encontrado!');
    }
    
    // Adicionar event listener para o evento 'hidden.bs.modal' do modal
    const modalElement = document.getElementById('veiculoModal');
    if (modalElement) {
        modalElement.addEventListener('hidden.bs.modal', function () {
            console.log('Modal fechado, resetando formulário...');
            forms.resetForm();
            
            // Garantir que o backdrop seja removido
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.parentNode.removeChild(backdrop);
            }
            
            // Garantir que o body esteja restaurado
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        });
    }
    
    // Botão para salvar veículo
    const saveVeiculoBtn = document.getElementById('saveButton');
    if (saveVeiculoBtn) {
        saveVeiculoBtn.addEventListener('click', saveVeiculo);
    } else {
        console.error('Botão de salvar veículo não encontrado!');
    }
    
    // Botão para confirmar exclusão
    const confirmDeleteBtn = document.getElementById('confirmDeleteButton');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDelete);
    } else {
        console.error('Botão de confirmar exclusão não encontrado!');
    }
    
    // Event listener para mudança de marca
    const marcaSelect = document.getElementById('marcaId');
    if (marcaSelect) {
        marcaSelect.addEventListener('change', () => {
            const marcaId = marcaSelect.value;
            console.log(`Marca alterada para ID: ${marcaId}`);
            
            if (marcaId) {
                forms.loadModelosNoForm(marcaId).catch(error => {
                    console.error('Erro ao carregar modelos:', error);
                });
            }
        });
    } else {
        console.error('Select de marca não encontrado!');
    }
    
    // Event listener para mudança de modelo
    const modeloSelect = document.getElementById('modeloId');
    if (modeloSelect) {
        modeloSelect.addEventListener('change', () => {
            const modeloId = modeloSelect.value;
            console.log(`Modelo alterado para ID: ${modeloId}`);
            
            if (modeloId) {
                forms.loadVersoesNoForm(modeloId).catch(error => {
                    console.error('Erro ao carregar versões:', error);
                });
            }
        });
    } else {
        console.error('Select de modelo não encontrado!');
    }
}

// Função para salvar veículo
async function saveVeiculo() {
    try {
        // Validar formulário
        if (!forms.validarFormulario()) {
            return;
        }
        
        // Obter dados do formulário
        const veiculoData = forms.obterDadosFormulario();
        
        // Mostrar spinner
        const saveButton = document.getElementById('saveButton');
        const saveSpinner = document.getElementById('saveSpinner');
        
        if (saveButton && saveSpinner) {
            saveButton.disabled = true;
            saveSpinner.classList.remove('d-none');
        }
        
        // Salvar veículo
        await api.saveVeiculo(veiculoData);
        
        // Resetar o formulário antes de fechar o modal
        forms.resetForm();
        
        // Fechar modal usando o método nativo do Bootstrap
        const modalElement = document.getElementById('veiculoModal');
        if (modalElement) {
            try {
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide();
                } else {
                    console.warn('Não foi possível obter a instância do modal.');
                    // Fechar manualmente
                    modalElement.style.display = 'none';
                    modalElement.classList.remove('show');
                    modalElement.setAttribute('aria-hidden', 'true');
                    
                    // Remover backdrop manualmente
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) {
                        backdrop.parentNode.removeChild(backdrop);
                    }
                    
                    // Restaurar o body
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                }
            } catch (modalError) {
                console.error('Erro ao fechar o modal:', modalError);
            }
        }
        
        // Recarregar tabela
        await table.initTable();
        
        // Mostrar mensagem de sucesso
        ui.showSuccess('Veículo salvo com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar veículo:', error);
        ui.showError(error.message || 'Erro ao salvar veículo. Por favor, tente novamente mais tarde.');
    } finally {
        // Esconder spinner
        const saveButton = document.getElementById('saveButton');
        const saveSpinner = document.getElementById('saveSpinner');
        
        if (saveButton && saveSpinner) {
            saveButton.disabled = false;
            saveSpinner.classList.add('d-none');
        }
    }
}

// Função para editar veículo
async function editVeiculo(id) {
    try {
        // Obter veículo
        const veiculo = await api.getVeiculo(id);
        
        // Preencher formulário
        forms.preencherFormularioVeiculo(veiculo);
        
        // Abrir modal
        const modalElement = document.getElementById('veiculoModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    } catch (error) {
        console.error('Erro ao editar veículo:', error);
        ui.showError(error.message || 'Erro ao carregar dados do veículo. Por favor, tente novamente mais tarde.');
    }
}

// Função para confirmar exclusão
async function confirmDelete() {
    try {
        console.log('Função confirmDelete chamada');
        
        // Obter ID do veículo a ser excluído
        const veiculoId = document.getElementById('veiculoIdToDelete').value;
        
        console.log(`Tentando excluir veículo ID: ${veiculoId}`);
        
        if (!veiculoId) {
            ui.showError('ID do veículo não encontrado.');
            return;
        }
        
        // Mostrar spinner
        const deleteButton = document.getElementById('confirmDeleteButton');
        const deleteSpinner = document.getElementById('deleteSpinner');
        
        if (deleteButton && deleteSpinner) {
            deleteButton.disabled = true;
            deleteSpinner.classList.remove('d-none');
        }
        
        // Excluir veículo
        await api.deleteVeiculo(veiculoId);
        
        // Fechar modal
        const modalElement = document.getElementById('deleteModal');
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            } else {
                console.warn('Não foi possível obter a instância do modal de exclusão.');
                // Fechar manualmente
                modalElement.style.display = 'none';
                modalElement.classList.remove('show');
                modalElement.setAttribute('aria-hidden', 'true');
                
                // Remover backdrop manualmente
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.parentNode.removeChild(backdrop);
                }
                
                // Restaurar o body
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }
        }
        
        // Recarregar tabela
        await table.initTable();
        
        // Mostrar mensagem de sucesso
        ui.showSuccess('Veículo excluído com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir veículo:', error);
        ui.showError(error.message || 'Erro ao excluir veículo. Por favor, tente novamente mais tarde.');
    } finally {
        // Esconder spinner
        const deleteButton = document.getElementById('confirmDeleteButton');
        const deleteSpinner = document.getElementById('deleteSpinner');
        
        if (deleteButton && deleteSpinner) {
            deleteButton.disabled = false;
            deleteSpinner.classList.add('d-none');
        }
    }
}

// Expor funções globalmente para uso em eventos HTML
window.editVeiculo = editVeiculo;
window.showDeleteModal = ui.showDeleteModal;
window.changePage = table.changePage;
