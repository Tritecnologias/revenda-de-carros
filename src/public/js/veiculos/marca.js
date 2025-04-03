// Inicialização da autenticação
const auth = new Auth();
let currentPage = 1;
const itemsPerPage = 10;
let totalItems = 0;

// Elementos do DOM
let marcasTableBody;
let paginationControls;
let marcaForm;
let marcaModal;
let deleteModal;
let errorMessage;
let saveButton;
let saveSpinner;
let confirmDeleteButton;
let deleteSpinner;

// Inicializar elementos após o carregamento do DOM
function initializeElements() {
    marcasTableBody = document.getElementById('marcasTableBody');
    paginationControls = document.getElementById('paginationControls');
    marcaForm = document.getElementById('marcaForm');
    
    const marcaModalElement = document.getElementById('marcaModal');
    if (marcaModalElement) {
        marcaModal = new bootstrap.Modal(marcaModalElement);
    }
    
    const deleteModalElement = document.getElementById('deleteModal');
    if (deleteModalElement) {
        deleteModal = new bootstrap.Modal(deleteModalElement);
    }
    
    errorMessage = document.getElementById('errorMessage');
    saveButton = document.getElementById('saveButton');
    saveSpinner = document.getElementById('saveSpinner');
    confirmDeleteButton = document.getElementById('confirmDeleteButton');
    deleteSpinner = document.getElementById('deleteSpinner');
    
    // Configurar eventos
    if (saveButton) {
        saveButton.addEventListener('click', saveMarca);
    }
    
    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', deleteMarca);
    }
    
    // Reset do formulário quando o modal é fechado
    if (marcaModalElement) {
        marcaModalElement.addEventListener('hidden.bs.modal', () => {
            marcaForm.reset();
            document.getElementById('marcaId').value = '';
            document.getElementById('marcaModalTitle').textContent = 'NOVA MARCA';
            errorMessage.classList.add('d-none');
            marcaForm.classList.remove('was-validated');
        });
    }
    
    // Carregar marcas
    loadMarcas();
}

// Verificar autenticação e redirecionar se não estiver autenticado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    auth.checkAuthAndRedirect();
    
    // Inicializar elementos após garantir que o DOM está completamente carregado
    // e que o cabeçalho foi carregado pelo layout-manager.js
    setTimeout(initializeElements, 500);
});

// Função para carregar marcas
async function loadMarcas() {
    if (!marcasTableBody) {
        console.error('Elemento marcasTableBody não encontrado');
        return;
    }
    
    try {
        const token = auth.getToken();
        const response = await fetch(`${config.apiBaseUrl}/api/veiculos/marcas?page=${currentPage}&limit=${itemsPerPage}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar marcas');
        }
        
        const data = await response.json();
        totalItems = data.total;
        
        renderMarcas(data.items);
        renderPagination();
    } catch (error) {
        console.error('Erro ao carregar marcas:', error);
        showError('Não foi possível carregar as marcas. Por favor, tente novamente mais tarde.');
    }
}

// Função para renderizar marcas na tabela
function renderMarcas(marcas) {
    if (!marcasTableBody) {
        console.error('Elemento marcasTableBody não encontrado');
        return;
    }
    
    marcasTableBody.innerHTML = '';
    
    if (marcas.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="4" class="text-center">Nenhuma marca encontrada</td>';
        marcasTableBody.appendChild(tr);
        return;
    }
    
    marcas.forEach(marca => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${marca.id}</td>
            <td>${marca.nome}</td>
            <td>${marca.ativo ? '<span class="badge bg-success">Ativo</span>' : '<span class="badge bg-danger">Inativo</span>'}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editMarca(${marca.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="showDeleteModal(${marca.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        marcasTableBody.appendChild(tr);
    });
}

// Função para renderizar controles de paginação
function renderPagination() {
    if (!paginationControls) {
        console.error('Elemento paginationControls não encontrado');
        return;
    }
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) {
        paginationControls.innerHTML = '';
        return;
    }
    
    let paginationHTML = `
        <nav aria-label="Navegação de página">
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">Anterior</a>
                </li>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
            </li>
        `;
    }
    
    paginationHTML += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">Próximo</a>
                </li>
            </ul>
        </nav>
    `;
    
    paginationControls.innerHTML = paginationHTML;
}

// Função para mudar de página
function changePage(page) {
    if (page < 1 || page > Math.ceil(totalItems / itemsPerPage)) {
        return;
    }
    
    currentPage = page;
    loadMarcas();
}

// Função para editar marca
function editMarca(id) {
    const token = auth.getToken();
    
    fetch(`${config.apiBaseUrl}/api/veiculos/marcas/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar marca');
        }
        return response.json();
    })
    .then(marca => {
        document.getElementById('marcaId').value = marca.id;
        document.getElementById('marcaNome').value = marca.nome;
        document.getElementById('marcaAtivo').checked = marca.ativo;
        
        document.getElementById('marcaModalTitle').textContent = 'EDITAR MARCA';
        
        marcaModal.show();
    })
    .catch(error => {
        console.error('Erro ao carregar marca para edição:', error);
        showError('Não foi possível carregar a marca para edição. Por favor, tente novamente mais tarde.');
    });
}

// Função para mostrar modal de exclusão
function showDeleteModal(id) {
    document.getElementById('deleteId').value = id;
    deleteModal.show();
}

// Função para salvar marca
function saveMarca() {
    // Validar formulário
    if (!marcaForm.checkValidity()) {
        marcaForm.classList.add('was-validated');
        return;
    }
    
    // Mostrar spinner
    saveButton.disabled = true;
    saveSpinner.classList.remove('d-none');
    
    // Obter dados do formulário
    const id = document.getElementById('marcaId').value;
    const nome = document.getElementById('marcaNome').value;
    const ativo = document.getElementById('marcaAtivo').checked;
    
    // Preparar dados para envio
    const marcaData = {
        nome,
        ativo
    };
    
    const token = auth.getToken();
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${config.apiBaseUrl}/api/veiculos/marcas/${id}` : `${config.apiBaseUrl}/api/veiculos/marcas`;
    
    // Enviar requisição
    fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(marcaData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao salvar marca');
        }
        return response.json();
    })
    .then(() => {
        // Fechar modal e recarregar marcas
        marcaModal.hide();
        loadMarcas();
    })
    .catch(error => {
        console.error('Erro ao salvar marca:', error);
        showError('Não foi possível salvar a marca. Por favor, tente novamente mais tarde.');
    })
    .finally(() => {
        // Esconder spinner
        saveButton.disabled = false;
        saveSpinner.classList.add('d-none');
    });
}

// Função para excluir marca
function deleteMarca() {
    // Mostrar spinner
    confirmDeleteButton.disabled = true;
    deleteSpinner.classList.remove('d-none');
    
    // Obter ID da marca a ser excluída
    const id = document.getElementById('deleteId').value;
    
    const token = auth.getToken();
    
    // Enviar requisição
    fetch(`${config.apiBaseUrl}/api/veiculos/marcas/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao excluir marca');
        }
        return response.json();
    })
    .then(() => {
        // Fechar modal e recarregar marcas
        deleteModal.hide();
        loadMarcas();
    })
    .catch(error => {
        console.error('Erro ao excluir marca:', error);
        showError('Não foi possível excluir a marca. Por favor, tente novamente mais tarde.');
    })
    .finally(() => {
        // Esconder spinner
        confirmDeleteButton.disabled = false;
        deleteSpinner.classList.add('d-none');
    });
}

// Função para mostrar mensagem de erro
function showError(message) {
    if (!errorMessage) {
        console.error('Elemento errorMessage não encontrado');
        return;
    }
    
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');
    
    // Esconder mensagem após 5 segundos
    setTimeout(() => {
        errorMessage.classList.add('d-none');
    }, 5000);
}
