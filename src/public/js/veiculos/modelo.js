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
        console.log('Elemento errorMessage não encontrado. Criando elemento...');
        // Criar um elemento para mensagens de erro se não existir
        errorMessage = document.createElement('div');
        errorMessage.id = 'errorMessage';
        errorMessage.className = 'alert alert-danger';
        errorMessage.style.display = 'none';
        
        // Adicionar o elemento ao DOM em um local apropriado
        const container = document.querySelector('.container') || document.querySelector('.content') || document.body;
        if (container) {
            // Inserir no início do container, antes de qualquer outro elemento
            if (container.firstChild) {
                container.insertBefore(errorMessage, container.firstChild);
            } else {
                container.appendChild(errorMessage);
            }
            console.log('Elemento errorMessage criado e adicionado ao DOM');
        } else {
            console.warn('Não foi possível encontrar um container para adicionar o errorMessage');
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
        
        // Usar a função fetchWithFallback do config.js para maior resiliência
        const urls = [
            '/api/veiculos/marcas/public',
            '/api/veiculos/marcas/all',
            '/api/marcas'
        ];
        
        console.log('Tentando carregar marcas usando as URLs:', urls);
        
        const data = await config.fetchWithFallback(urls, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        // Verificar se a resposta tem o formato esperado
        if (data && data.items && Array.isArray(data.items)) {
            marcas = data.items;
        } else if (Array.isArray(data)) {
            marcas = data;
        } else {
            console.warn('Formato de resposta inesperado:', data);
            throw new Error('Formato de resposta inesperado ao carregar marcas');
        }
        
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
        
        // Usar a função fetchWithFallback do config.js para maior resiliência
        const urls = [
            `/api/veiculos/modelos?page=${currentPage}&limit=${itemsPerPage}`,
            `/api/veiculos/modelos/all?page=${currentPage}&limit=${itemsPerPage}`
        ];
        
        console.log('Tentando carregar modelos usando as URLs:', urls);
        
        const data = await config.fetchWithFallback(urls, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        // Verificar se a resposta tem o formato esperado
        if (data && data.items && Array.isArray(data.items)) {
            totalItems = data.total || data.items.length;
            renderModelos(data.items);
        } else if (Array.isArray(data)) {
            // Se a resposta for um array direto, usá-lo
            totalItems = data.length;
            renderModelos(data);
        } else {
            console.warn('Formato de resposta inesperado:', data);
            throw new Error('Formato de resposta inesperado ao carregar modelos');
        }
        
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
    
    // Obter a URL base com base no ambiente atual
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
    
    fetch(`${baseUrl}/api/veiculos/modelos/${id}`, {
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
async function saveModelo(event) {
    // Prevenir comportamento padrão do formulário
    if (event) {
        event.preventDefault();
    }
    
    // Obter dados do formulário
    const form = document.getElementById('modeloForm');
    const marcaIdSelect = document.getElementById('marcaId');
    const nomeInput = document.getElementById('modeloNome');
    const statusSelect = document.getElementById('modeloStatus');
    const modeloIdInput = document.getElementById('modeloId');
    
    // Verificar se os elementos existem
    if (!form || !marcaIdSelect || !nomeInput || !statusSelect) {
        showError('Formulário incompleto. Recarregue a página e tente novamente.');
        return;
    }
    
    // Obter ID (se estiver editando)
    const id = modeloIdInput ? modeloIdInput.value : null;
    
    // Validar formulário
    if (!marcaIdSelect.value) {
        showError('Selecione uma marca.');
        marcaIdSelect.focus();
        return;
    }
    
    if (!nomeInput.value.trim()) {
        showError('O nome do modelo é obrigatório.');
        nomeInput.focus();
        return;
    }
    
    // Desabilitar botão de salvar e mostrar spinner
    if (saveButton && saveSpinner) {
        saveButton.disabled = true;
        saveSpinner.classList.remove('d-none');
    }
    
    try {
        // Obter token de autenticação
        const token = auth.getToken();
        if (!token) {
            showError('Você precisa estar autenticado para realizar esta operação.');
            return;
        }
        
        // Obter a URL base com base no ambiente atual
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Preparar dados
        const modeloData = {
            marcaId: parseInt(marcaIdSelect.value),
            nome: nomeInput.value.trim(),
            status: statusSelect.value
        };
        
        console.log('Enviando dados do modelo:', modeloData);
        
        // Determinar método e URL
        let method, url;
        
        if (id) {
            // Se estamos editando um modelo existente
            method = 'PUT';
            url = `${baseUrl}/api/veiculos/modelos/${id}`;
            modeloData.id = parseInt(id);
        } else {
            // Se estamos criando um novo modelo
            method = 'POST';
            url = `${baseUrl}/api/veiculos/modelos`;
        }
        
        console.log('URL da requisição:', url);
        console.log('Método da requisição:', method);
        
        // Enviar requisição
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(modeloData)
        });
        
        console.log('Status da resposta:', response.status);
        
        // Obter o texto da resposta para análise
        const responseText = await response.text();
        console.log('Resposta do servidor:', responseText);
        
        // Tentar parsear a resposta como JSON
        let errorMessage = 'Falha ao salvar modelo';
        let responseData;
        
        try {
            if (responseText) {
                responseData = JSON.parse(responseText);
                
                // Se houver uma mensagem específica na resposta, usá-la
                if (responseData && responseData.message) {
                    errorMessage = responseData.message;
                }
            }
        } catch (parseError) {
            console.error('Erro ao parsear resposta JSON:', parseError);
        }
        
        if (!response.ok) {
            // Tratar diferentes códigos de erro
            if (response.status === 409) {
                throw new Error('Já existe um modelo com este nome para esta marca. Por favor, escolha outro nome.');
            } else if (response.status === 401 || response.status === 403) {
                throw new Error('Você não tem permissão para realizar esta operação.');
            } else if (response.status === 404) {
                throw new Error('Recurso não encontrado. Verifique se o modelo ainda existe.');
            } else if (response.status >= 500) {
                throw new Error('Erro no servidor. Por favor, tente novamente mais tarde.');
            } else {
                throw new Error(errorMessage);
            }
        }
        
        // Se chegou aqui, a resposta foi bem-sucedida
        const data = responseData || { success: true };
        console.log('Modelo salvo com sucesso:', data);
        
        // Fechar modal e recarregar modelos
        modeloModal.hide();
        await loadModelos();
        
        // Mostrar mensagem de sucesso
        const successAlert = document.getElementById('successAlert');
        if (successAlert) {
            successAlert.textContent = id ? 'Modelo atualizado com sucesso!' : 'Modelo criado com sucesso!';
            successAlert.classList.remove('d-none');
            setTimeout(() => {
                successAlert.classList.add('d-none');
            }, 3000);
        }
    } catch (error) {
        console.error('Erro ao salvar modelo:', error);
        showError(error.message || 'Ocorreu um erro ao salvar o modelo. Por favor, tente novamente.');
    } finally {
        // Reabilitar botão de salvar e esconder spinner
        if (saveButton && saveSpinner) {
            saveButton.disabled = false;
            saveSpinner.classList.add('d-none');
        }
    }
}

// Função para excluir modelo
async function deleteModelo() {
    try {
        const deleteId = document.getElementById('deleteId').value;
        
        if (!deleteId) {
            showError('ID do modelo não encontrado.');
            return;
        }
        
        // Desabilitar botão de confirmação e mostrar spinner
        if (confirmDeleteButton && deleteSpinner) {
            confirmDeleteButton.disabled = true;
            deleteSpinner.classList.remove('d-none');
        }
        
        // Obter token de autenticação
        const token = auth.getToken();
        if (!token) {
            showError('Você precisa estar autenticado para realizar esta operação.');
            return;
        }
        
        // Obter a URL base com base no ambiente atual
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Enviar requisição para excluir modelo
        const response = await fetch(`${baseUrl}/api/veiculos/modelos/${deleteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro ao excluir modelo:', errorText);
            throw new Error('Não foi possível excluir o modelo.');
        }
        
        // Fechar modal
        deleteModal.hide();
        
        // Recarregar lista de modelos
        await loadModelos();
        
        // Mostrar mensagem de sucesso
        const successAlert = document.getElementById('successAlert');
        if (successAlert) {
            successAlert.textContent = 'Modelo excluído com sucesso!';
            successAlert.classList.remove('d-none');
            setTimeout(() => {
                successAlert.classList.add('d-none');
            }, 3000);
        }
    } catch (error) {
        console.error('Erro ao excluir modelo:', error);
        showError(error.message || 'Ocorreu um erro ao excluir o modelo. Por favor, tente novamente.');
    } finally {
        // Reabilitar botão de confirmação e esconder spinner
        if (confirmDeleteButton && deleteSpinner) {
            confirmDeleteButton.disabled = false;
            deleteSpinner.classList.add('d-none');
        }
    }
}

// Função para mostrar mensagem de erro
function showError(message) {
    if (!errorMessage) {
        console.error('Elemento errorMessage não encontrado');
        // Tentar criar o elemento novamente como último recurso
        errorMessage = document.createElement('div');
        errorMessage.id = 'errorMessage';
        errorMessage.className = 'alert alert-danger';
        document.body.prepend(errorMessage);
    }
    
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Garantir que o elemento seja visível
    errorMessage.classList.remove('d-none');
    
    // Rolar para o topo para garantir que a mensagem seja vista
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Esconder mensagem após 5 segundos
    setTimeout(() => {
        errorMessage.style.display = 'none';
        errorMessage.classList.add('d-none');
    }, 5000);
}
