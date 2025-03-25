// Inicialização da autenticação
const auth = new Auth();
let currentPage = 1;
const itemsPerPage = 10;
let totalItems = 0;

// Elementos do DOM
const marcasTableBody = document.getElementById('marcasTableBody');
const paginationControls = document.getElementById('paginationControls');
const marcaForm = document.getElementById('marcaForm');
const marcaModal = new bootstrap.Modal(document.getElementById('marcaModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const errorMessage = document.getElementById('errorMessage');
const saveButton = document.getElementById('saveButton');
const saveSpinner = document.getElementById('saveSpinner');
const confirmDeleteButton = document.getElementById('confirmDeleteButton');
const deleteSpinner = document.getElementById('deleteSpinner');

// Verificar autenticação e redirecionar se não estiver autenticado
document.addEventListener('DOMContentLoaded', () => {
    auth.checkAuthAndRedirect();
    
    // Configurar botão de logout
    document.getElementById('logoutButton').addEventListener('click', () => {
        auth.logout();
    });
    
    // Carregar marcas
    loadMarcas();
    
    // Configurar eventos
    saveButton.addEventListener('click', saveMarca);
    confirmDeleteButton.addEventListener('click', deleteMarca);
    
    // Reset do formulário quando o modal é fechado
    document.getElementById('marcaModal').addEventListener('hidden.bs.modal', () => {
        marcaForm.reset();
        document.getElementById('marcaId').value = '';
        document.getElementById('marcaModalTitle').textContent = 'NOVA MARCA';
        errorMessage.classList.add('d-none');
        marcaForm.classList.remove('was-validated');
    });
});

// Função para carregar marcas
async function loadMarcas() {
    try {
        const token = auth.getToken();
        const response = await fetch(`/api/veiculos/marcas?page=${currentPage}&limit=${itemsPerPage}`, {
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
    marcasTableBody.innerHTML = '';
    
    if (marcas.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4" class="text-center">Nenhuma marca encontrada</td>';
        marcasTableBody.appendChild(row);
        return;
    }
    
    marcas.forEach(marca => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${marca.id}</td>
            <td>${marca.nome}</td>
            <td>
                <span class="badge ${marca.status === 'ativo' ? 'bg-success' : 'bg-danger'}">
                    ${marca.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editMarca(${marca.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="showDeleteModal(${marca.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        marcasTableBody.appendChild(row);
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
    loadMarcas();
}

// Função para editar marca
async function editMarca(id) {
    try {
        const token = auth.getToken();
        const response = await fetch(`/api/veiculos/marcas/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar dados da marca');
        }
        
        const marca = await response.json();
        
        document.getElementById('marcaId').value = marca.id;
        document.getElementById('nome').value = marca.nome;
        document.getElementById('status').value = marca.status;
        document.getElementById('marcaModalTitle').textContent = 'EDITAR MARCA';
        
        marcaModal.show();
    } catch (error) {
        console.error('Erro ao carregar marca:', error);
        showError('Não foi possível carregar os dados da marca. Por favor, tente novamente mais tarde.');
    }
}

// Função para mostrar modal de exclusão
function showDeleteModal(id) {
    document.getElementById('deleteId').value = id;
    deleteModal.show();
}

// Função para salvar marca
async function saveMarca() {
    if (!marcaForm.checkValidity()) {
        marcaForm.classList.add('was-validated');
        return;
    }
    
    const marcaId = document.getElementById('marcaId').value;
    const nome = document.getElementById('nome').value;
    const status = document.getElementById('status').value;
    
    const marcaData = {
        nome,
        status
    };
    
    try {
        saveButton.disabled = true;
        saveSpinner.classList.remove('d-none');
        errorMessage.classList.add('d-none');
        
        const token = auth.getToken();
        const url = marcaId ? `/api/veiculos/marcas/${marcaId}` : '/api/veiculos/marcas';
        const method = marcaId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(marcaData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao salvar marca');
        }
        
        marcaModal.hide();
        loadMarcas();
    } catch (error) {
        console.error('Erro ao salvar marca:', error);
        errorMessage.textContent = error.message || 'Não foi possível salvar a marca. Por favor, tente novamente mais tarde.';
        errorMessage.classList.remove('d-none');
    } finally {
        saveButton.disabled = false;
        saveSpinner.classList.add('d-none');
    }
}

// Função para excluir marca
async function deleteMarca() {
    const marcaId = document.getElementById('deleteId').value;
    
    try {
        confirmDeleteButton.disabled = true;
        deleteSpinner.classList.remove('d-none');
        
        const token = auth.getToken();
        const response = await fetch(`/api/veiculos/marcas/${marcaId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao excluir marca');
        }
        
        deleteModal.hide();
        loadMarcas();
    } catch (error) {
        console.error('Erro ao excluir marca:', error);
        alert('Não foi possível excluir a marca. ' + (error.message || 'Por favor, tente novamente mais tarde.'));
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
