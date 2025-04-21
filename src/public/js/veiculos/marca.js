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
    if (!paginationControls) {
        console.warn('Elemento paginationControls não encontrado. A paginação não funcionará corretamente.');
    }
    
    marcaForm = document.getElementById('marcaForm');
    if (!marcaForm) {
        console.warn('Elemento marcaForm não encontrado. O formulário de marca não funcionará corretamente.');
    }
    
    const marcaModalElement = document.getElementById('marcaModal');
    if (marcaModalElement) {
        marcaModal = new bootstrap.Modal(marcaModalElement);
    } else {
        console.warn('Elemento marcaModal não encontrado. O modal de marca não funcionará corretamente.');
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
        if (marcaForm && marcaForm.parentNode) {
            marcaForm.parentNode.insertBefore(errorMessage, marcaForm);
        }
    }
    
    saveButton = document.getElementById('saveMarcaButton');
    saveSpinner = document.getElementById('saveSpinner');
    confirmDeleteButton = document.getElementById('confirmDeleteButton');
    deleteSpinner = document.getElementById('deleteSpinner');
    
    // Configurar eventos
    if (saveButton) {
        saveButton.addEventListener('click', saveMarca);
    } else {
        console.warn('Elemento saveMarcaButton não encontrado. O botão de salvar não funcionará corretamente.');
    }
    
    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', deleteMarca);
    } else {
        console.warn('Elemento confirmDeleteButton não encontrado. O botão de excluir não funcionará corretamente.');
    }
    
    // Reset do formulário quando o modal é fechado
    if (marcaModalElement) {
        marcaModalElement.addEventListener('hidden.bs.modal', () => {
            if (marcaForm) {
                marcaForm.reset();
                
                const marcaIdElement = document.getElementById('marcaId');
                if (marcaIdElement) {
                    marcaIdElement.value = '';
                }
                
                const marcaModalTitleElement = document.getElementById('marcaModalTitle');
                if (marcaModalTitleElement) {
                    marcaModalTitleElement.textContent = 'NOVA MARCA';
                }
                
                if (errorMessage) {
                    errorMessage.classList.add('d-none');
                }
                
                marcaForm.classList.remove('was-validated');
            } else {
                console.warn('marcaForm não encontrado ao fechar o modal');
            }
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
async function loadMarcas(page = 1) {
    currentPage = page;
    
    if (!marcasTableBody) {
        console.error('Elemento marcasTableBody não encontrado');
        return;
    }
    
    // Mostrar indicador de carregamento
    marcasTableBody.innerHTML = '<tr><td colspan="5" class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Carregando...</span></div></td></tr>';
    
    try {
        const token = auth.getToken();
        if (!token) {
            console.error('Token de autenticação não encontrado');
            window.location.href = '/login.html';
            return;
        }
        
        // Lista de URLs a tentar, em ordem de prioridade
        const urls = [
            `/api/veiculos/marcas/public`,
            `/api/veiculos/marcas/all`,
            `/api/veiculos/marcas?page=${currentPage}&limit=${itemsPerPage}`
        ];
        
        // Usar a função fetchWithFallback do config.js
        const data = await config.fetchWithFallback(urls, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Marcas carregadas:', data);
        
        // Verificar se a resposta é paginada ou uma lista simples
        if (data.items && data.total) {
            // Resposta paginada
            totalItems = data.total;
            renderMarcas(data.items);
        } else {
            // Lista simples de marcas
            totalItems = data.length;
            renderMarcas(data);
        }
        
        renderPagination();
    } catch (error) {
        console.error('Erro ao carregar marcas:', error);
        marcasTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger">
                    Erro ao carregar marcas: ${error.message}
                </td>
            </tr>
        `;
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
async function saveMarca() {
    // Obter dados do formulário
    const form = document.getElementById('marcaForm');
    const nomeInput = document.getElementById('marcaNome');
    const statusSelect = document.getElementById('marcaStatus');
    const marcaIdInput = document.getElementById('marcaId');
    
    // Verificar se os elementos existem
    if (!form || !nomeInput || !statusSelect) {
        showError('Formulário incompleto. Recarregue a página e tente novamente.');
        return;
    }
    
    // Validar formulário
    if (!nomeInput.value.trim()) {
        showError('O nome da marca é obrigatório.');
        nomeInput.focus();
        return;
    }
    
    // Obter ID (se estiver editando)
    const id = marcaIdInput ? marcaIdInput.value : null;
    
    // Preparar dados
    const marcaData = {
        nome: nomeInput.value.trim(),
        status: statusSelect.value
    };
    
    console.log('Enviando dados da marca:', marcaData);
    
    try {
        // Obter token de autenticação
        const token = auth.getToken();
        if (!token) {
            showError('Você precisa estar autenticado para realizar esta operação.');
            return;
        }
        
        // Determinar método e URL
        const method = id ? 'PUT' : 'POST';
        
        // Obter a URL base com base no ambiente atual
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Construir URL absoluta
        const url = id 
            ? `${baseUrl}/api/veiculos/marcas/${id}` 
            : `${baseUrl}/api/veiculos/marcas`;
        
        console.log('URL da requisição:', url);
        console.log('Método da requisição:', method);
        
        // Desabilitar botão de salvar e mostrar spinner
        const saveButton = document.getElementById('saveMarcaButton');
        const saveSpinner = document.getElementById('saveSpinner');
        
        if (saveButton && saveSpinner) {
            saveButton.disabled = true;
            saveSpinner.classList.remove('d-none');
        }
        
        // Enviar requisição
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(marcaData)
        });
        
        console.log('Status da resposta:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Resposta do servidor:', errorText);
            throw new Error('Falha ao salvar marca');
        }
        
        const data = await response.json();
        console.log('Marca salva com sucesso:', data);
        
        // Fechar modal e recarregar marcas
        const marcaModal = bootstrap.Modal.getInstance(document.getElementById('marcaModal'));
        if (marcaModal) {
            marcaModal.hide();
        }
        
        // Recarregar lista de marcas
        await loadMarcas();
        
        // Mostrar mensagem de sucesso
        const successAlert = document.getElementById('successAlert');
        if (successAlert) {
            successAlert.textContent = id ? 'Marca atualizada com sucesso!' : 'Marca criada com sucesso!';
            successAlert.classList.remove('d-none');
            setTimeout(() => {
                successAlert.classList.add('d-none');
            }, 3000);
        }
    } catch (error) {
        console.error('Erro ao salvar marca:', error);
        showError(error.message || 'Ocorreu um erro ao salvar a marca. Por favor, tente novamente.');
    } finally {
        // Reabilitar botão de salvar e esconder spinner
        const saveButton = document.getElementById('saveMarcaButton');
        const saveSpinner = document.getElementById('saveSpinner');
        
        if (saveButton && saveSpinner) {
            saveButton.disabled = false;
            saveSpinner.classList.add('d-none');
        }
    }
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
