// Inicialização da autenticação
const auth = new Auth();
let currentPage = 1;
const itemsPerPage = 10;
let totalItems = 0;
let marcas = [];

// Elementos do DOM
let modelosTableBody;
let paginationControls;
let modeloForm;
let modeloModal;
let deleteModal;
let errorMessage;
let saveButton;
let saveSpinner;
let confirmDeleteButton;
let deleteSpinner;
let marcaSelect;

// Inicializar elementos após o carregamento do DOM
function initializeElements() {
    modelosTableBody = document.getElementById('modelosTableBody');
    paginationControls = document.getElementById('paginationControls');
    if (!paginationControls) {
        console.warn('Elemento paginationControls não encontrado. A paginação não funcionará corretamente.');
    }
    
    modeloForm = document.getElementById('modeloForm');
    if (!modeloForm) {
        console.warn('Elemento modeloForm não encontrado. O formulário de modelo não funcionará corretamente.');
    }
    
    const modeloModalElement = document.getElementById('modeloModal');
    if (modeloModalElement) {
        modeloModal = new bootstrap.Modal(modeloModalElement);
    } else {
        console.warn('Elemento modeloModal não encontrado. O modal de modelo não funcionará corretamente.');
    }
    
    const deleteModalElement = document.getElementById('confirmDeleteModal');
    if (deleteModalElement) {
        deleteModal = new bootstrap.Modal(deleteModalElement);
    } else {
        console.warn('Elemento confirmDeleteModal não encontrado. O modal de exclusão não funcionará corretamente.');
    }
    
    errorMessage = document.getElementById('errorMessage');
    if (!errorMessage) {
        console.warn('Elemento errorMessage não encontrado. As mensagens de erro não serão exibidas corretamente.');
        // Criar um elemento para mensagens de erro se não existir
        errorMessage = document.createElement('div');
        errorMessage.id = 'errorMessage';
        errorMessage.className = 'alert alert-danger d-none';
        if (modeloForm && modeloForm.parentNode) {
            modeloForm.parentNode.insertBefore(errorMessage, modeloForm);
        }
    }
    
    saveButton = document.getElementById('saveModeloButton');
    saveSpinner = document.getElementById('saveSpinner');
    confirmDeleteButton = document.getElementById('confirmDeleteButton');
    deleteSpinner = document.getElementById('deleteSpinner');
    marcaSelect = document.getElementById('marcaId');
    
    // Configurar eventos
    if (saveButton) {
        saveButton.addEventListener('click', saveModelo);
    } else {
        console.warn('Elemento saveModeloButton não encontrado. O botão de salvar não funcionará corretamente.');
    }
    
    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', deleteModelo);
    } else {
        console.warn('Elemento confirmDeleteButton não encontrado. O botão de excluir não funcionará corretamente.');
    }
    
    // Reset do formulário quando o modal é fechado
    if (modeloModalElement) {
        modeloModalElement.addEventListener('hidden.bs.modal', () => {
            if (modeloForm) {
                modeloForm.reset();
                
                const modeloIdElement = document.getElementById('modeloId');
                if (modeloIdElement) {
                    modeloIdElement.value = '';
                }
                
                const modeloModalTitleElement = document.getElementById('modeloModalTitle');
                if (modeloModalTitleElement) {
                    modeloModalTitleElement.textContent = 'NOVO MODELO';
                }
                
                if (errorMessage) {
                    errorMessage.classList.add('d-none');
                }
                
                modeloForm.classList.remove('was-validated');
            } else {
                console.warn('modeloForm não encontrado ao fechar o modal');
            }
        });
    }
    
    // Carregar marcas para o select
    loadMarcasSelect();
    
    // Carregar modelos
    loadModelos();
}

// Verificar autenticação e redirecionar se não estiver autenticado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    auth.checkAuthAndRedirect();
    
    // Inicializar elementos após garantir que o DOM está completamente carregado
    // e que o cabeçalho foi carregado pelo layout-manager.js
    setTimeout(initializeElements, 500);
});

// Função para carregar marcas para o select
async function loadMarcasSelect() {
    if (!marcaSelect) {
        console.error('Elemento marcaSelect não encontrado');
        return;
    }
    
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
        
        // Limpar select
        marcaSelect.innerHTML = '<option value="">Selecione uma marca</option>';
        
        // Adicionar opções
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
    if (!modelosTableBody) {
        console.error('Elemento modelosTableBody não encontrado');
        return;
    }
    
    try {
        const token = auth.getToken();
        const response = await fetch(`${config.apiBaseUrl}/api/veiculos/modelos?page=${currentPage}&limit=${itemsPerPage}`, {
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
    if (!modelosTableBody) {
        console.error('Elemento modelosTableBody não encontrado');
        return;
    }
    
    modelosTableBody.innerHTML = '';
    
    if (modelos.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="5" class="text-center">Nenhum modelo encontrado</td>';
        modelosTableBody.appendChild(tr);
        return;
    }
    
    modelos.forEach(modelo => {
        const tr = document.createElement('tr');
        
        // Encontrar o nome da marca
        const marca = marcas.find(m => m.id === modelo.marcaId) || { nome: 'Desconhecida' };
        
        tr.innerHTML = `
            <td>${modelo.id}</td>
            <td>${marca.nome}</td>
            <td>${modelo.nome}</td>
            <td>${modelo.ativo ? '<span class="badge bg-success">Ativo</span>' : '<span class="badge bg-danger">Inativo</span>'}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editModelo(${modelo.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="showDeleteModal(${modelo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        modelosTableBody.appendChild(tr);
    });
}

// Função para renderizar controles de paginação
function renderPagination() {
    if (!paginationControls) {
        console.warn('Elemento paginationControls não encontrado');
        return;
    }
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) {
        paginationControls.innerHTML = '';
        return;
    }
    
    let paginationHTML = `
        <nav aria-label="Navegação de página">
            <ul class="pagination">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">Anterior</a>
                </li>
    `;
    
    // Determinar quais páginas mostrar
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
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
    loadModelos();
}

// Função para editar modelo
function editModelo(id) {
    const token = auth.getToken();
    
    fetch(`${config.apiBaseUrl}/api/veiculos/modelos/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar modelo');
        }
        return response.json();
    })
    .then(modelo => {
        document.getElementById('modeloId').value = modelo.id;
        document.getElementById('marcaId').value = modelo.marcaId;
        document.getElementById('modeloNome').value = modelo.nome;
        
        // Definir o status no select
        const statusSelect = document.getElementById('modeloStatus');
        if (statusSelect) {
            statusSelect.value = modelo.status || 'ativo';
        }
        
        document.getElementById('modeloModalTitle').textContent = 'EDITAR MODELO';
        
        console.log('Modelo carregado para edição:', modelo);
        modeloModal.show();
    })
    .catch(error => {
        console.error('Erro ao carregar modelo para edição:', error);
        showError('Não foi possível carregar o modelo para edição. Por favor, tente novamente mais tarde.');
    });
}

// Função para mostrar modal de exclusão
function showDeleteModal(id) {
    document.getElementById('deleteId').value = id;
    deleteModal.show();
}

// Função para salvar modelo
function saveModelo() {
    // Validar formulário
    if (!modeloForm.checkValidity()) {
        modeloForm.classList.add('was-validated');
        return;
    }
    
    // Mostrar spinner
    saveButton.disabled = true;
    saveSpinner.classList.remove('d-none');
    
    // Obter dados do formulário
    const id = document.getElementById('modeloId').value;
    const marcaId = document.getElementById('marcaId').value;
    const nome = document.getElementById('modeloNome').value;
    const status = document.getElementById('modeloStatus').value;
    
    // Validar marca
    if (!marcaId) {
        showError('Por favor, selecione uma marca.');
        saveButton.disabled = false;
        saveSpinner.classList.add('d-none');
        return;
    }
    
    // Preparar dados para envio
    const modeloData = {
        marcaId: parseInt(marcaId),
        nome,
        status
    };
    
    console.log('Enviando dados do modelo:', modeloData);
    
    const token = auth.getToken();
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${config.apiBaseUrl}/api/veiculos/modelos/${id}` : `${config.apiBaseUrl}/api/veiculos/modelos`;
    
    // Enviar requisição
    fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(modeloData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                console.error('Resposta do servidor:', text);
                throw new Error('Falha ao salvar modelo');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Modelo salvo com sucesso:', data);
        // Fechar modal e recarregar modelos
        modeloModal.hide();
        loadModelos();
    })
    .catch(error => {
        console.error('Erro ao salvar modelo:', error);
        showError('Não foi possível salvar o modelo. Por favor, tente novamente mais tarde.');
    })
    .finally(() => {
        // Esconder spinner
        saveButton.disabled = false;
        saveSpinner.classList.add('d-none');
    });
}

// Função para excluir modelo
function deleteModelo() {
    // Mostrar spinner
    confirmDeleteButton.disabled = true;
    deleteSpinner.classList.remove('d-none');
    
    // Obter ID do modelo a ser excluído
    const id = document.getElementById('deleteId').value;
    
    const token = auth.getToken();
    
    // Enviar requisição
    fetch(`${config.apiBaseUrl}/api/veiculos/modelos/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao excluir modelo');
        }
        return response.json();
    })
    .then(() => {
        // Fechar modal e recarregar modelos
        deleteModal.hide();
        loadModelos();
    })
    .catch(error => {
        console.error('Erro ao excluir modelo:', error);
        showError('Não foi possível excluir o modelo. Por favor, tente novamente mais tarde.');
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
