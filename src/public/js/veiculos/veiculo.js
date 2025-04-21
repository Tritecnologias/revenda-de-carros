/**
 * Módulo principal de Veículos
 * Este arquivo importa todos os módulos e inicializa a aplicação
 */

// Log de inicialização
console.log('Carregando veiculo-modular.js - versão modularizada');

// Importar módulos
import * as api from './modules/api.js';
import * as ui from './modules/ui.js';
import * as forms from './modules/forms.js';
import * as table from './modules/table.js';
import * as utils from './modules/utils.js';

// Verificar autenticação
document.addEventListener('DOMContentLoaded', () => {
    if (!utils.isAuthenticated()) {
        utils.redirectToLogin();
        return;
    }
    
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
    // Botão para abrir modal de novo veículo
    const newVeiculoBtn = document.getElementById('newVeiculo');
    if (newVeiculoBtn) {
        newVeiculoBtn.addEventListener('click', () => {
            forms.resetForm();
            forms.loadMarcasNoForm();
            
            // Abrir modal
            const modal = new bootstrap.Modal(document.getElementById('veiculoModal'));
            modal.show();
        });
    }
    
    // Botão para salvar veículo
    const saveVeiculoBtn = document.getElementById('saveVeiculo');
    if (saveVeiculoBtn) {
        saveVeiculoBtn.addEventListener('click', saveVeiculo);
    }
    
    // Botão para confirmar exclusão
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDelete);
    }
    
    // Event listener para mudança de marca
    const marcaSelect = document.getElementById('marca');
    if (marcaSelect) {
        marcaSelect.addEventListener('change', () => {
            const marcaId = marcaSelect.value;
            if (marcaId) {
                forms.loadModelosNoForm(marcaId);
            }
        });
    }
    
    // Event listener para mudança de modelo
    const modeloSelect = document.getElementById('modelo');
    if (modeloSelect) {
        modeloSelect.addEventListener('change', () => {
            const modeloId = modeloSelect.value;
            if (modeloId) {
                forms.loadVersoesNoForm(modeloId);
            }
        });
    }
    
    // Event listener para formatação de preço
    const precoInput = document.getElementById('preco');
    if (precoInput) {
        precoInput.addEventListener('input', (e) => {
            const valor = e.target.value;
            if (valor) {
                e.target.value = utils.formatarValorMonetario(valor);
            }
        });
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
        
        // Mostrar indicador de carregamento
        const saveButton = document.getElementById('saveVeiculo');
        if (saveButton) {
            saveButton.disabled = true;
            saveButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';
        }
        
        // Salvar veículo
        await api.saveVeiculo(veiculoData);
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('veiculoModal'));
        if (modal) {
            modal.hide();
        }
        
        // Atualizar tabela
        await table.refreshTable();
        
        // Mostrar mensagem de sucesso
        alert(veiculoData.id ? 'Veículo atualizado com sucesso!' : 'Veículo cadastrado com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar veículo:', error);
        ui.showError(`Erro ao salvar veículo: ${error.message}`);
    } finally {
        // Restaurar botão
        const saveButton = document.getElementById('saveVeiculo');
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.textContent = 'Salvar';
        }
    }
}

// Função para editar veículo
async function editVeiculo(id) {
    try {
        console.log(`Editando veículo ID: ${id}`);
        
        // Obter veículo
        const veiculo = await api.getVeiculo(id);
        
        // Preencher formulário
        await forms.preencherFormularioVeiculo(veiculo);
        
        // Abrir modal
        const modal = new bootstrap.Modal(document.getElementById('veiculoModal'));
        modal.show();
    } catch (error) {
        console.error('Erro ao editar veículo:', error);
        ui.showError(`Erro ao editar veículo: ${error.message}`);
    }
}

// Função para confirmar exclusão
async function confirmDelete() {
    try {
        // Obter ID do veículo
        const confirmDeleteBtn = document.getElementById('confirmDelete');
        const id = confirmDeleteBtn.getAttribute('data-id');
        
        if (!id) {
            console.error('ID do veículo não encontrado');
            return;
        }
        
        // Mostrar indicador de carregamento
        confirmDeleteBtn.disabled = true;
        confirmDeleteBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Excluindo...';
        
        // Excluir veículo
        await api.deleteVeiculo(id);
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        if (modal) {
            modal.hide();
        }
        
        // Atualizar tabela
        await table.refreshTable();
        
        // Mostrar mensagem de sucesso
        alert('Veículo excluído com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir veículo:', error);
        ui.showError(`Erro ao excluir veículo: ${error.message}`);
    } finally {
        // Restaurar botão
        const confirmDeleteBtn = document.getElementById('confirmDelete');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.disabled = false;
            confirmDeleteBtn.textContent = 'Excluir';
        }
    }
}

// Expor funções globalmente para uso em eventos HTML
window.editVeiculo = editVeiculo;
window.showDeleteModal = ui.showDeleteModal;
window.changePage = table.changePage;
