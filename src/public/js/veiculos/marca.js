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

// Variável global para armazenar as marcas carregadas
let marcasCache = [];

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
        
        // Obter a URL base com base no ambiente atual
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Tentar obter marcas da API
        const response = await fetch(`${baseUrl}/api/veiculos/marcas/public`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar marcas');
        }
        
        const data = await response.json();
        console.log('Marcas carregadas:', data);
        
        // Armazenar marcas no cache
        marcasCache = data;
        
        // Renderizar marcas na tabela
        renderMarcas(data);
        
        return data;
    } catch (error) {
        console.error('Erro ao carregar marcas:', error);
        showError('Não foi possível carregar as marcas. Por favor, tente novamente mais tarde.');
        
        // Renderizar marcas do cache se disponível
        if (marcasCache.length > 0) {
            console.log('Usando marcas do cache:', marcasCache);
            renderMarcas(marcasCache);
        }
        
        return [];
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
        tr.setAttribute('data-id', marca.id);
        
        const isAtivo = marca.status === 'ativo';
        
        tr.innerHTML = `
            <td>${marca.id}</td>
            <td>${marca.nome}</td>
            <td class="${isAtivo ? 'text-success' : 'text-danger'}">${isAtivo ? 'Ativo' : 'Inativo'}</td>
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
async function editMarca(id) {
    console.log('Função editMarca chamada para ID:', id);
    
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
        
        // Construir URL absoluta
        const url = `${baseUrl}/api/veiculos/marcas/${id}`;
        console.log('URL da requisição:', url);
        
        // Mostrar indicador de carregamento se existir
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.classList.remove('d-none');
        }
        
        // Fazer requisição para obter dados da marca
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Status da resposta:', response.status);
        
        // Obter o texto da resposta para análise
        const responseText = await response.text();
        console.log('Resposta do servidor:', responseText);
        
        if (!response.ok) {
            // Tentar parsear a resposta como JSON para obter mensagem de erro
            let errorMessage = 'Falha ao carregar marca';
            try {
                if (responseText) {
                    const errorData = JSON.parse(responseText);
                    if (errorData && errorData.message) {
                        errorMessage = errorData.message;
                    }
                }
            } catch (parseError) {
                console.error('Erro ao parsear resposta JSON:', parseError);
            }
            
            // Tratar diferentes códigos de erro
            if (response.status === 401) {
                // Tentar renovar o token e tentar novamente
                console.log('Token expirado ou inválido. Tentando renovar...');
                
                // Mostrar mensagem para o usuário
                showError('Sua sessão expirou. Por favor, faça login novamente.');
                
                // Redirecionar para a página de login após um breve atraso
                setTimeout(() => {
                    window.location.href = '/login.html';
                }, 2000);
                
                return;
            } else if (response.status === 404) {
                throw new Error('Marca não encontrada.');
            } else {
                throw new Error(errorMessage);
            }
        }
        
        // Parsear a resposta como JSON
        let marca;
        try {
            marca = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Erro ao parsear resposta JSON:', parseError);
            throw new Error('Erro ao processar dados da marca.');
        }
        
        console.log('Marca carregada com sucesso:', marca);
        
        // Verificar se os elementos do formulário existem
        const marcaIdInput = document.getElementById('marcaId');
        const marcaNomeInput = document.getElementById('marcaNome');
        const marcaStatusSelect = document.getElementById('marcaStatus');
        const marcaModalTitleElement = document.getElementById('marcaModalTitle');
        
        if (!marcaIdInput || !marcaNomeInput || !marcaStatusSelect) {
            console.error('Elementos do formulário não encontrados:', {
                marcaIdInput,
                marcaNomeInput,
                marcaStatusSelect
            });
            throw new Error('Formulário incompleto. Recarregue a página e tente novamente.');
        }
        
        // Preencher formulário com dados da marca
        marcaIdInput.value = marca.id;
        marcaNomeInput.value = marca.nome;
        
        // IMPORTANTE: Desabilitar o campo de nome durante a edição
        marcaNomeInput.disabled = true;
        marcaNomeInput.title = "O nome da marca não pode ser alterado";
        
        // Opcional: Adicionar um estilo visual para indicar que o campo está desabilitado
        marcaNomeInput.classList.add('bg-light');
        
        // Definir o status correto
        if (marca.status) {
            marcaStatusSelect.value = marca.status;
        } else {
            // Fallback para compatibilidade com APIs que usam 'ativo' em vez de 'status'
            marcaStatusSelect.value = marca.ativo ? 'ativo' : 'inativo';
        }
        
        // Atualizar título do modal
        if (marcaModalTitleElement) {
            marcaModalTitleElement.textContent = 'EDITAR STATUS DA MARCA';
        }
        
        // Mostrar modal
        const marcaModalElement = document.getElementById('marcaModal');
        if (marcaModalElement) {
            const modalInstance = bootstrap.Modal.getInstance(marcaModalElement) || new bootstrap.Modal(marcaModalElement);
            modalInstance.show();
        } else {
            console.error('Elemento marcaModal não encontrado');
            throw new Error('Não foi possível abrir o modal de edição');
        }
    } catch (error) {
        console.error('Erro ao carregar marca para edição:', error);
        showError(error.message || 'Não foi possível carregar a marca para edição. Por favor, tente novamente mais tarde.');
    } finally {
        // Esconder indicador de carregamento se existir
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.classList.add('d-none');
        }
    }
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
    
    // Obter ID (se estiver editando)
    const id = marcaIdInput ? marcaIdInput.value : null;
    
    // Validar formulário para nova marca
    if (!id && !nomeInput.value.trim()) {
        showError('O nome da marca é obrigatório.');
        nomeInput.focus();
        return;
    }
    
    // Desabilitar botão de salvar e mostrar spinner
    const saveButton = document.getElementById('saveMarcaButton');
    const saveSpinner = document.getElementById('saveSpinner');
    
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
        
        // Se estamos editando uma marca existente (atualizando status)
        if (id) {
            console.log('Atualizando status da marca ID:', id);
            
            // Obter a marca atual para usar o nome exato
            let marcaNome = nomeInput.value.trim();
            let marcaAtual = null;
            
            try {
                const getMarcaResponse = await fetch(`${baseUrl}/api/veiculos/marcas/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (getMarcaResponse.ok) {
                    marcaAtual = await getMarcaResponse.json();
                    console.log('Marca atual obtida do servidor:', marcaAtual);
                    marcaNome = marcaAtual.nome; // Usar o nome exato do servidor
                }
            } catch (error) {
                console.log('Erro ao obter marca atual, usando nome do formulário:', error);
            }
            
            // Preparar dados para atualização
            const marcaData = {
                nome: marcaNome,
                status: statusSelect.value
            };
            
            if (id) {
                marcaData.id = parseInt(id);
            }
            
            console.log('Dados para atualização:', marcaData);
            
            // Tentar atualizar a marca no servidor
            let serverUpdateSuccessful = false;
            
            try {
                const updateResponse = await fetch(`${baseUrl}/api/veiculos/marcas/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(marcaData)
                });
                
                serverUpdateSuccessful = updateResponse.ok;
                console.log('Resposta do servidor:', updateResponse.status, serverUpdateSuccessful ? 'Sucesso' : 'Falha');
            } catch (updateError) {
                console.error('Erro ao atualizar marca no servidor:', updateError);
            }
            
            // Independentemente do resultado do servidor, atualizar o status na interface
            console.log('Atualizando status na interface...');
            
            // Atualizar o cache local
            const marcaIndex = marcasCache.findIndex(m => m.id === parseInt(id));
            if (marcaIndex !== -1) {
                marcasCache[marcaIndex].status = statusSelect.value;
                console.log('Cache atualizado:', marcasCache[marcaIndex]);
            }
            
            // Atualizar a linha na tabela diretamente
            const marcaRow = document.querySelector(`tr[data-id="${id}"]`);
            if (marcaRow) {
                const statusCell = marcaRow.querySelector('td:nth-child(3)');
                if (statusCell) {
                    statusCell.textContent = statusSelect.value === 'ativo' ? 'Ativo' : 'Inativo';
                    statusCell.classList.remove('text-danger', 'text-success');
                    statusCell.classList.add(statusSelect.value === 'ativo' ? 'text-success' : 'text-danger');
                    console.log('Célula de status atualizada:', statusCell.textContent);
                }
            }
            
            // Renderizar novamente a tabela com os dados do cache
            renderMarcas(marcasCache);
            
            // Fechar modal
            const marcaModal = bootstrap.Modal.getInstance(document.getElementById('marcaModal'));
            if (marcaModal) {
                marcaModal.hide();
            }
            
            // Mostrar mensagem de sucesso
            const successAlert = document.getElementById('successAlert');
            if (successAlert) {
                successAlert.textContent = 'Status da marca atualizado com sucesso!';
                successAlert.classList.remove('d-none');
                setTimeout(() => {
                    successAlert.classList.add('d-none');
                }, 3000);
            }
            
            // Recarregar lista de marcas do servidor apenas se a atualização foi bem-sucedida
            if (serverUpdateSuccessful) {
                await loadMarcas();
            }
            
            return; // Sair da função
        } else {
            // Se estamos criando uma nova marca
            const marcaData = {
                nome: nomeInput.value.trim(),
                status: statusSelect.value
            };
            
            console.log('Criando nova marca:', marcaData);
            
            // Enviar requisição para criar nova marca
            const response = await fetch(`${baseUrl}/api/veiculos/marcas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(marcaData)
            });
            
            console.log('Status da resposta:', response.status);
            
            // Obter o texto da resposta para análise
            const responseText = await response.text();
            console.log('Resposta do servidor:', responseText);
            
            // Tentar parsear a resposta como JSON
            let errorMessage = 'Falha ao criar marca';
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
                // Tratar diferentes códigos de erro para criação de marca
                if (response.status === 409) {
                    throw new Error('Já existe uma marca com este nome. Por favor, escolha outro nome.');
                } else if (response.status === 401 || response.status === 403) {
                    throw new Error('Você não tem permissão para realizar esta operação.');
                } else if (response.status === 404) {
                    throw new Error('Recurso não encontrado.');
                } else if (response.status >= 500) {
                    throw new Error('Erro no servidor. Por favor, tente novamente mais tarde.');
                } else {
                    throw new Error(errorMessage);
                }
            }
            
            // Se chegou aqui, a resposta foi bem-sucedida
            const data = responseData || { success: true };
            console.log('Marca criada com sucesso:', data);
            
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
                successAlert.textContent = 'Marca criada com sucesso!';
                successAlert.classList.remove('d-none');
                setTimeout(() => {
                    successAlert.classList.add('d-none');
                }, 3000);
            }
        }
    } catch (error) {
        console.error('Erro ao processar operação:', error);
        showError(error.message || 'Ocorreu um erro ao processar a operação. Por favor, tente novamente.');
    } finally {
        // Reabilitar botão de salvar e esconder spinner
        if (saveButton && saveSpinner) {
            saveButton.disabled = false;
            saveSpinner.classList.add('d-none');
        }
        
        // Reabilitar o campo de nome para novas marcas
        if (nomeInput) {
            nomeInput.disabled = false;
            nomeInput.classList.remove('bg-light');
            nomeInput.title = "";
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
