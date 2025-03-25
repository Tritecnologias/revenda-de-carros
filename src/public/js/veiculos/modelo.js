// Inicialização da autenticação
const auth = new Auth();
let currentPage = 1;
const itemsPerPage = 10;
let totalItems = 0;
let marcas = [];

// Elementos do DOM
const modelosTableBody = document.getElementById('modelosTableBody');
const paginationControls = document.getElementById('paginationControls');
const modeloForm = document.getElementById('modeloForm');
const modeloModal = new bootstrap.Modal(document.getElementById('modeloModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const errorMessage = document.getElementById('errorMessage');
const saveButton = document.getElementById('saveButton');
const saveSpinner = document.getElementById('saveSpinner');
const confirmDeleteButton = document.getElementById('confirmDeleteButton');
const deleteSpinner = document.getElementById('deleteSpinner');
const marcaSelect = document.getElementById('marcaId');

// Verificar autenticação e redirecionar se não estiver autenticado
document.addEventListener('DOMContentLoaded', () => {
    auth.checkAuthAndRedirect();
    
    // Configurar botão de logout
    document.getElementById('logoutButton').addEventListener('click', () => {
        auth.logout();
    });
    
    // Carregar marcas para o select
    loadMarcasSelect();
    
    // Carregar modelos
    loadModelos();
    
    // Configurar eventos
    saveButton.addEventListener('click', saveModelo);
    confirmDeleteButton.addEventListener('click', deleteModelo);
    
    // Reset do formulário quando o modal é fechado
    document.getElementById('modeloModal').addEventListener('hidden.bs.modal', () => {
        modeloForm.reset();
        document.getElementById('modeloId').value = '';
        document.getElementById('modeloModalTitle').textContent = 'NOVO MODELO';
        errorMessage.classList.add('d-none');
        modeloForm.classList.remove('was-validated');
    });
});

// Função para carregar marcas para o select
async function loadMarcasSelect() {
    try {
        const token = auth.getToken();
        const response = await fetch('/api/veiculos/marcas/all', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar marcas');
        }
        
        marcas = await response.json();
        
        // Limpar opções existentes, mantendo a primeira
        while (marcaSelect.options.length > 1) {
            marcaSelect.remove(1);
        }
        
        // Adicionar novas opções
        marcas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca.id;
            option.textContent = marca.nome;
            marcaSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar marcas:', error);
        showError('Não foi possível carregar as marcas. Por favor, tente novamente mais tarde.');
    }
}

// Função para carregar modelos
async function loadModelos() {
    try {
        const token = auth.getToken();
        const response = await fetch(`/api/veiculos/modelos?page=${currentPage}&limit=${itemsPerPage}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar modelos');
        }
        
        const data = await response.json();
        totalItems = data.total;
        
        renderModelos(data.items);
        renderPagination();
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        showError('Não foi possível carregar os modelos. Por favor, tente novamente mais tarde.');
    }
}

// Função para renderizar modelos na tabela
function renderModelos(modelos) {
    modelosTableBody.innerHTML = '';
    
    if (modelos.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" class="text-center">Nenhum modelo encontrado</td>';
        modelosTableBody.appendChild(row);
        return;
    }
    
    modelos.forEach(modelo => {
        // Encontrar o nome da marca
        const marca = marcas.find(m => m.id === modelo.marcaId) || { nome: 'Desconhecida' };
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${modelo.id}</td>
            <td>${marca.nome}</td>
            <td>${modelo.nome}</td>
            <td>
                <span class="badge ${modelo.status === 'ativo' ? 'bg-success' : 'bg-danger'}">
                    ${modelo.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editModelo(${modelo.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="showDeleteModal(${modelo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        modelosTableBody.appendChild(row);
    });
}

// Função para renderizar controles de paginação
function renderPagination() {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    paginationControls.innerHTML = '';
    
    if (totalPages <= 1) {
        return;
    }
    
    const pagination = document.createElement('ul');
    pagination.className = 'pagination justify-content-center';
    
    // Botão anterior
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Anterior</a>`;
    pagination.appendChild(prevLi);
    
    // Páginas
    for (let i = 1; i <= totalPages; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
        pagination.appendChild(pageLi);
    }
    
    // Botão próximo
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Próximo</a>`;
    pagination.appendChild(nextLi);
    
    paginationControls.appendChild(pagination);
}

// Função para mudar de página
function changePage(page) {
    if (page < 1 || page > Math.ceil(totalItems / itemsPerPage)) {
        return;
    }
    
    currentPage = page;
    loadModelos();
}

// Função para editar modelo
async function editModelo(id) {
    try {
        const token = auth.getToken();
        const response = await fetch(`/api/veiculos/modelos/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar dados do modelo');
        }
        
        const modelo = await response.json();
        
        document.getElementById('modeloId').value = modelo.id;
        document.getElementById('marcaId').value = modelo.marcaId;
        document.getElementById('nome').value = modelo.nome;
        document.getElementById('status').value = modelo.status;
        document.getElementById('modeloModalTitle').textContent = 'EDITAR MODELO';
        
        modeloModal.show();
    } catch (error) {
        console.error('Erro ao carregar modelo:', error);
        showError('Não foi possível carregar os dados do modelo. Por favor, tente novamente mais tarde.');
    }
}

// Função para mostrar modal de exclusão
function showDeleteModal(id) {
    document.getElementById('deleteId').value = id;
    deleteModal.show();
}

// Função para salvar modelo
async function saveModelo() {
    if (!modeloForm.checkValidity()) {
        modeloForm.classList.add('was-validated');
        return;
    }
    
    const modeloId = document.getElementById('modeloId').value;
    const marcaId = document.getElementById('marcaId').value;
    const nome = document.getElementById('nome').value;
    const status = document.getElementById('status').value;
    
    const modeloData = {
        marcaId,
        nome,
        status
    };
    
    try {
        saveButton.disabled = true;
        saveSpinner.classList.remove('d-none');
        errorMessage.classList.add('d-none');
        
        const token = auth.getToken();
        const url = modeloId ? `/api/veiculos/modelos/${modeloId}` : '/api/veiculos/modelos';
        const method = modeloId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(modeloData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao salvar modelo');
        }
        
        modeloModal.hide();
        loadModelos();
    } catch (error) {
        console.error('Erro ao salvar modelo:', error);
        errorMessage.textContent = error.message || 'Não foi possível salvar o modelo. Por favor, tente novamente mais tarde.';
        errorMessage.classList.remove('d-none');
    } finally {
        saveButton.disabled = false;
        saveSpinner.classList.add('d-none');
    }
}

// Função para excluir modelo
async function deleteModelo() {
    const modeloId = document.getElementById('deleteId').value;
    
    try {
        confirmDeleteButton.disabled = true;
        deleteSpinner.classList.remove('d-none');
        
        const token = auth.getToken();
        const response = await fetch(`/api/veiculos/modelos/${modeloId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao excluir modelo');
        }
        
        deleteModal.hide();
        loadModelos();
    } catch (error) {
        console.error('Erro ao excluir modelo:', error);
        alert('Não foi possível excluir o modelo. ' + (error.message || 'Por favor, tente novamente mais tarde.'));
    } finally {
        confirmDeleteButton.disabled = false;
        deleteSpinner.classList.add('d-none');
    }
}

// Função para mostrar mensagem de erro
function showError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show mt-3';
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.card'));
    
    // Auto-fechar após 5 segundos
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 5000);
}
