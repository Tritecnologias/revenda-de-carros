// Variáveis globais
let auth;
let currentPage = 1;
const itemsPerPage = 10;
let totalItems = 0;
let opcionais = [];

// Elementos do DOM
let opcionaisTableBody;
let paginationControls;
let opcionalForm;
let deleteModal;
let errorMessage;

// Função para inicializar os elementos do DOM
function initializeElements() {
    // Inicialização da autenticação
    auth = new Auth();
    
    // Elementos do DOM
    opcionaisTableBody = document.getElementById('opcionaisTableBody');
    paginationControls = document.getElementById('paginationControls');
    opcionalForm = document.getElementById('opcionalForm');
    
    const deleteModalElement = document.getElementById('deleteModal');
    if (deleteModalElement) {
        deleteModal = new bootstrap.Modal(deleteModalElement);
    }
    
    errorMessage = document.getElementById('errorMessage');
    
    // Verificar autenticação
    auth.checkAuthAndRedirect();
    
    // Configurar botão de logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            auth.logout();
        });
    }
    
    // Carregar dados iniciais
    loadOpcionais();
    
    // Configurar eventos
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', saveOpcional);
    }
    
    const limparButton = document.getElementById('limparButton');
    if (limparButton) {
        limparButton.addEventListener('click', () => {
            if (opcionalForm) {
                opcionalForm.reset();
                const opcionalIdElement = document.getElementById('opcionalId');
                if (opcionalIdElement) {
                    opcionalIdElement.value = '';
                }
                if (errorMessage) {
                    errorMessage.classList.add('d-none');
                }
                opcionalForm.classList.remove('was-validated');
            }
        });
    }
    
    // Configurar evento para o botão de confirmação de exclusão
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', deleteItem);
    }
}

// Função para carregar opcionais
async function loadOpcionais() {
    try {
        const token = auth.getToken();
        const response = await fetch(`${config.apiBaseUrl}/opcionais/api/list`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar opcionais');
        }
        
        const data = await response.json();
        opcionais = data;
        
        renderOpcionais(opcionais);
    } catch (error) {
        console.error('Erro ao carregar opcionais:', error);
        showError('Não foi possível carregar os opcionais. Por favor, tente novamente mais tarde.', errorMessage);
    }
}

// Função para renderizar opcionais na tabela
function renderOpcionais(opcionais) {
    opcionaisTableBody.innerHTML = '';
    
    if (opcionais.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="3" class="text-center">Nenhum opcional encontrado</td>';
        opcionaisTableBody.appendChild(row);
        return;
    }
    
    opcionais.forEach(opcional => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>OPCIONAL</td>
            <td>${opcional.codigo} - ${opcional.descricao}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editOpcional(${opcional.id})">
                    Editar
                </button>
                <button class="btn btn-sm btn-danger" onclick="showDeleteModal(${opcional.id}, 'opcional')">
                    Excluir
                </button>
            </td>
        `;
        opcionaisTableBody.appendChild(row);
    });
}

// Função para editar opcional
async function editOpcional(id) {
    try {
        const token = auth.getToken();
        const response = await fetch(`${config.apiBaseUrl}/opcionais/api/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar opcional');
        }
        
        const opcional = await response.json();
        
        // Preencher formulário
        document.getElementById('opcionalId').value = opcional.id;
        document.getElementById('codigo').value = opcional.codigo;
        document.getElementById('descricao').value = opcional.descricao;
        
        // Rolar até o formulário
        opcionalForm.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Erro ao editar opcional:', error);
        showError('Não foi possível carregar os dados do opcional. Por favor, tente novamente mais tarde.', errorMessage);
    }
}

// Função para mostrar modal de exclusão
function showDeleteModal(id, type) {
    document.getElementById('deleteId').value = id;
    document.getElementById('deleteType').value = type;
    
    const confirmText = document.getElementById('deleteConfirmText');
    confirmText.textContent = 'Tem certeza que deseja excluir este opcional?';
    
    deleteModal.show();
}

// Função para salvar opcional
async function saveOpcional() {
    if (!opcionalForm.checkValidity()) {
        opcionalForm.classList.add('was-validated');
        return;
    }
    
    const opcionalId = document.getElementById('opcionalId').value;
    const codigo = document.getElementById('codigo').value;
    const descricao = document.getElementById('descricao').value;
    
    const opcionalData = {
        codigo,
        descricao
    };
    
    try {
        const saveButton = document.getElementById('saveButton');
        const saveSpinner = document.getElementById('saveSpinner');
        
        saveButton.disabled = true;
        saveSpinner.classList.remove('d-none');
        
        const token = auth.getToken();
        const method = opcionalId ? 'PATCH' : 'POST';
        const url = opcionalId 
            ? `${config.apiBaseUrl}/opcionais/api/${opcionalId}` 
            : `${config.apiBaseUrl}/opcionais/api/create`;
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(opcionalData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao salvar opcional');
        }
        
        // Limpar formulário
        opcionalForm.reset();
        document.getElementById('opcionalId').value = '';
        errorMessage.classList.add('d-none');
        opcionalForm.classList.remove('was-validated');
        
        // Recarregar dados
        loadOpcionais();
    } catch (error) {
        console.error('Erro ao salvar opcional:', error);
        showError(error.message || 'Não foi possível salvar o opcional. Por favor, tente novamente mais tarde.', errorMessage);
    } finally {
        const saveButton = document.getElementById('saveButton');
        const saveSpinner = document.getElementById('saveSpinner');
        
        saveButton.disabled = false;
        saveSpinner.classList.add('d-none');
    }
}

// Função para excluir item (opcional)
async function deleteItem() {
    const id = document.getElementById('deleteId').value;
    
    try {
        const confirmDeleteButton = document.getElementById('confirmDeleteButton');
        const deleteSpinner = document.getElementById('deleteSpinner');
        
        confirmDeleteButton.disabled = true;
        deleteSpinner.classList.remove('d-none');
        
        const token = auth.getToken();
        const url = `${config.apiBaseUrl}/opcionais/api/${id}`;
        
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao excluir opcional');
        }
        
        deleteModal.hide();
        
        // Recarregar dados
        loadOpcionais();
    } catch (error) {
        console.error('Erro ao excluir opcional:', error);
        showError('Não foi possível excluir o opcional. Por favor, tente novamente mais tarde.', errorMessage);
    } finally {
        const confirmDeleteButton = document.getElementById('confirmDeleteButton');
        const deleteSpinner = document.getElementById('deleteSpinner');
        
        confirmDeleteButton.disabled = false;
        deleteSpinner.classList.add('d-none');
    }
}

// Função para mostrar mensagem de erro
function showError(message, element) {
    element.textContent = message;
    element.classList.remove('d-none');
    
    // Esconder a mensagem após 5 segundos
    setTimeout(() => {
        element.classList.add('d-none');
    }, 5000);
}

// Função para formatar moeda
function formatarMoeda(valor) {
    // Verificar se o valor é um número válido
    if (valor === null || valor === undefined || isNaN(Number(valor))) {
        return 'R$ 0,00';
    }
    
    // Converter para número se for string
    const valorNumerico = typeof valor === 'string' ? parseFloat(valor.replace(',', '.')) : Number(valor);
    
    // Formatar o valor
    return `R$ ${valorNumerico.toFixed(2).replace('.', ',')}`;
}

// Inicializar a página quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página de opcionais carregada');
    initializeElements();
});
