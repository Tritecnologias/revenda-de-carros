// Inicialização da autenticação
const auth = new Auth();
let currentPage = 1;
const itemsPerPage = 10;
let totalItems = 0;
let marcas = [];
let modelos = [];

// Elementos do DOM
const descricoesTableBody = document.getElementById('descricoesTableBody');
const paginationControls = document.getElementById('paginationControls');
const descricaoForm = document.getElementById('descricaoForm');
const descricaoModal = new bootstrap.Modal(document.getElementById('descricaoModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const errorMessage = document.getElementById('errorMessage');
const saveButton = document.getElementById('saveButton');
const saveSpinner = document.getElementById('saveSpinner');
const confirmDeleteButton = document.getElementById('confirmDeleteButton');
const deleteSpinner = document.getElementById('deleteSpinner');
const marcaSelect = document.getElementById('marcaId');
const modeloSelect = document.getElementById('modeloId');

// Verificar autenticação e redirecionar se não estiver autenticado
document.addEventListener('DOMContentLoaded', () => {
    auth.checkAuthAndRedirect();
    
    // Configurar botão de logout
    document.getElementById('logoutButton').addEventListener('click', () => {
        auth.logout();
    });
    
    // Carregar marcas para o select
    loadMarcasSelect();
    
    // Carregar descrições
    loadDescricoes();
    
    // Configurar eventos
    saveButton.addEventListener('click', saveDescricao);
    confirmDeleteButton.addEventListener('click', deleteDescricao);
    
    // Evento para carregar modelos quando a marca mudar
    marcaSelect.addEventListener('change', loadModelosByMarca);
    
    // Reset do formulário quando o modal é fechado
    document.getElementById('descricaoModal').addEventListener('hidden.bs.modal', () => {
        descricaoForm.reset();
        document.getElementById('descricaoId').value = '';
        document.getElementById('descricaoModalTitle').textContent = 'NOVA DESCRIÇÃO DE VEÍCULO';
        errorMessage.classList.add('d-none');
        descricaoForm.classList.remove('was-validated');
        
        // Limpar select de modelos
        while (modeloSelect.options.length > 1) {
            modeloSelect.remove(1);
        }
    });
    
    // Definir o ano atual como valor padrão
    document.getElementById('ano').value = new Date().getFullYear();
});

// Função para carregar marcas para o select
async function loadMarcasSelect() {
    try {
        const token = auth.getToken();
        const response = await fetch(`${config.apiBaseUrl}/api/veiculos/marcas/all`, {
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

// Função para carregar modelos por marca
async function loadModelosByMarca() {
    const marcaId = marcaSelect.value;
    
    // Limpar select de modelos, mantendo a primeira opção
    while (modeloSelect.options.length > 1) {
        modeloSelect.remove(1);
    }
    
    if (!marcaId) {
        return;
    }
    
    try {
        const token = auth.getToken();
        const response = await fetch(`${config.apiBaseUrl}/api/veiculos/modelos/by-marca/${marcaId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar modelos');
        }
        
        modelos = await response.json();
        
        // Adicionar novas opções
        modelos.forEach(modelo => {
            const option = document.createElement('option');
            option.value = modelo.id;
            option.textContent = modelo.nome;
            modeloSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        showError('Não foi possível carregar os modelos. Por favor, tente novamente mais tarde.');
    }
}

// Função para carregar descrições
async function loadDescricoes() {
    try {
        const token = auth.getToken();
        const response = await fetch(`${config.apiBaseUrl}/api/veiculos/descricoes?page=${currentPage}&limit=${itemsPerPage}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar descrições');
        }
        
        const data = await response.json();
        totalItems = data.total;
        
        renderDescricoes(data.items);
        renderPagination();
    } catch (error) {
        console.error('Erro ao carregar descrições:', error);
        showError('Não foi possível carregar as descrições. Por favor, tente novamente mais tarde.');
    }
}

// Função para renderizar descrições na tabela
function renderDescricoes(descricoes) {
    descricoesTableBody.innerHTML = '';
    
    if (descricoes.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" class="text-center">Nenhuma descrição encontrada</td>';
        descricoesTableBody.appendChild(row);
        return;
    }
    
    descricoes.forEach(descricao => {
        // Encontrar o nome da marca e modelo
        const marca = marcas.find(m => m.id === descricao.marcaId) || { nome: 'Desconhecida' };
        const modelo = modelos.find(m => m.id === descricao.modeloId) || { nome: 'Desconhecido' };
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${descricao.id}</td>
            <td>${marca.nome}</td>
            <td>${modelo.nome}</td>
            <td>${descricao.versao}</td>
            <td>${descricao.ano}</td>
            <td>
                <span class="badge ${descricao.status === 'ativo' ? 'bg-success' : 'bg-danger'}">
                    ${descricao.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editDescricao(${descricao.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="showDeleteModal(${descricao.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        descricoesTableBody.appendChild(row);
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
    loadDescricoes();
}

// Função para editar descrição
async function editDescricao(id) {
    try {
        const token = auth.getToken();
        const response = await fetch(`${config.apiBaseUrl}/api/veiculos/descricoes/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar dados da descrição');
        }
        
        const descricao = await response.json();
        
        document.getElementById('descricaoId').value = descricao.id;
        document.getElementById('marcaId').value = descricao.marcaId;
        
        // Carregar modelos da marca selecionada
        await loadModelosByMarca();
        
        document.getElementById('modeloId').value = descricao.modeloId;
        document.getElementById('versao').value = descricao.versao;
        document.getElementById('ano').value = descricao.ano;
        document.getElementById('status').value = descricao.status;
        document.getElementById('descricao').value = descricao.descricao;
        document.getElementById('motor').value = descricao.motor || '';
        document.getElementById('combustivel').value = descricao.combustivel || '';
        document.getElementById('cambio').value = descricao.cambio || '';
        
        document.getElementById('descricaoModalTitle').textContent = 'EDITAR DESCRIÇÃO DE VEÍCULO';
        
        descricaoModal.show();
    } catch (error) {
        console.error('Erro ao carregar descrição:', error);
        showError('Não foi possível carregar os dados da descrição. Por favor, tente novamente mais tarde.');
    }
}

// Função para mostrar modal de exclusão
function showDeleteModal(id) {
    document.getElementById('deleteId').value = id;
    deleteModal.show();
}

// Função para salvar descrição
async function saveDescricao() {
    if (!descricaoForm.checkValidity()) {
        descricaoForm.classList.add('was-validated');
        return;
    }
    
    const descricaoId = document.getElementById('descricaoId').value;
    const marcaId = document.getElementById('marcaId').value;
    const modeloId = document.getElementById('modeloId').value;
    const versao = document.getElementById('versao').value;
    const ano = document.getElementById('ano').value;
    const status = document.getElementById('status').value;
    const descricaoText = document.getElementById('descricao').value;
    const motor = document.getElementById('motor').value;
    const combustivel = document.getElementById('combustivel').value;
    const cambio = document.getElementById('cambio').value;
    
    const descricaoData = {
        marcaId,
        modeloId,
        versao,
        ano,
        status,
        descricao: descricaoText,
        motor,
        combustivel,
        cambio
    };
    
    try {
        saveButton.disabled = true;
        saveSpinner.classList.remove('d-none');
        errorMessage.classList.add('d-none');
        
        const token = auth.getToken();
        const url = descricaoId ? `${config.apiBaseUrl}/api/veiculos/descricoes/${descricaoId}` : `${config.apiBaseUrl}/api/veiculos/descricoes`;
        const method = descricaoId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(descricaoData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao salvar descrição');
        }
        
        descricaoModal.hide();
        loadDescricoes();
    } catch (error) {
        console.error('Erro ao salvar descrição:', error);
        errorMessage.textContent = error.message || 'Não foi possível salvar a descrição. Por favor, tente novamente mais tarde.';
        errorMessage.classList.remove('d-none');
    } finally {
        saveButton.disabled = false;
        saveSpinner.classList.add('d-none');
    }
}

// Função para excluir descrição
async function deleteDescricao() {
    const descricaoId = document.getElementById('deleteId').value;
    
    try {
        confirmDeleteButton.disabled = true;
        deleteSpinner.classList.remove('d-none');
        
        const token = auth.getToken();
        const response = await fetch(`${config.apiBaseUrl}/api/veiculos/descricoes/${descricaoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao excluir descrição');
        }
        
        deleteModal.hide();
        loadDescricoes();
    } catch (error) {
        console.error('Erro ao excluir descrição:', error);
        alert('Não foi possível excluir a descrição. ' + (error.message || 'Por favor, tente novamente mais tarde.'));
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
