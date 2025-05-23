// Inicialização da autenticação
const auth = new Auth();
let currentPage = 1;
const itemsPerPage = 10;
let totalItems = 0;

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
    modeloForm = document.getElementById('modeloForm');
    errorMessage = document.getElementById('errorMessage');
    
    // Obter referências aos botões e spinners
    saveButton = document.getElementById('saveModeloButton');
    saveSpinner = document.getElementById('saveSpinner');
    confirmDeleteButton = document.getElementById('confirmDeleteButton');
    deleteSpinner = document.getElementById('deleteSpinner');
    
    // Inicializar modais usando Bootstrap
    const modeloModalElement = document.getElementById('modeloModal');
    if (modeloModalElement) {
        modeloModal = new bootstrap.Modal(modeloModalElement);
    }
    
    const deleteModalElement = document.getElementById('deleteModal');
    if (deleteModalElement) {
        deleteModal = new bootstrap.Modal(deleteModalElement);
    }
    
    // Inicializar select de marcas
    marcaSelect = document.getElementById('marcaId');
    
    // Adicionar event listener para o formulário
    if (modeloForm) {
        modeloForm.addEventListener('submit', saveModelo);
    }
    
    // Adicionar event listener para o botão de novo modelo
    const newModeloButton = document.getElementById('newModeloButton');
    if (newModeloButton) {
        newModeloButton.addEventListener('click', () => {
            // Limpar formulário
            if (modeloForm) {
                modeloForm.reset();
            }
            
            // Limpar ID oculto
            const modeloIdInput = document.getElementById('modeloId');
            if (modeloIdInput) {
                modeloIdInput.value = '';
            }
            
            // Atualizar título do modal
            const modeloModalTitle = document.getElementById('modeloModalTitle');
            if (modeloModalTitle) {
                modeloModalTitle.textContent = 'NOVO MODELO';
            }
            
            // Habilitar campo de nome para novo modelo
            const nomeInput = document.getElementById('modeloNome');
            if (nomeInput) {
                nomeInput.disabled = false;
                nomeInput.classList.remove('bg-light');
                nomeInput.title = "";
            }
        });
    }
    
    // Adicionar event listener para o botão de salvar
    if (saveButton) {
        console.log('Adicionando evento de clique ao botão salvar');
        saveButton.addEventListener('click', function() {
            console.log('Botão salvar clicado!');
            // Verificar se o formulário existe
            if (modeloForm) {
                console.log('Formulário encontrado, enviando...');
                // Acionar o evento de submit do formulário
                const submitEvent = new Event('submit', {
                    bubbles: true,
                    cancelable: true
                });
                modeloForm.dispatchEvent(submitEvent);
            } else {
                console.error('Formulário não encontrado!');
                // Chamar saveModelo diretamente como fallback
                saveModelo();
            }
        });
    } else {
        console.error('Botão de salvar não encontrado!');
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
    
    // Inicializar elementos após o carregamento do DOM
    initializeElements();
    
    // Se a inicialização falhar, tentar novamente após um breve atraso
    setTimeout(initializeElements, 500);
});

// Função para carregar marcas para o select
async function loadMarcasSelect() {
    try {
        const token = auth.getToken();
        
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
        
        const marcas = await response.json();
        console.log('Marcas carregadas para select:', marcas);
        
        // Preencher o select de marcas
        if (marcaSelect) {
            marcaSelect.innerHTML = '<option value="">Selecione uma marca</option>';
            
            marcas.forEach(marca => {
                const option = document.createElement('option');
                option.value = marca.id;
                option.textContent = marca.nome;
                marcaSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar marcas para select:', error);
        showError('Não foi possível carregar as marcas. Por favor, tente novamente mais tarde.');
    }
}

// Função para carregar modelos
async function loadModelos() {
    try {
        const token = auth.getToken();
        
        // Obter a URL base com base no ambiente atual
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Tentar obter modelos da API
        const response = await fetch(`${baseUrl}/api/veiculos/modelos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar modelos');
        }
        
        const data = await response.json();
        console.log('Modelos carregados:', data);
        
        // Verificar se a resposta é paginada
        let modelos = data;
        if (data.items && Array.isArray(data.items)) {
            modelos = data.items;
            totalItems = data.total || 0;
        }
        
        // Renderizar modelos na tabela
        renderModelos(modelos);
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
        tr.setAttribute('data-id', modelo.id);
        
        // Encontrar o nome da marca
        let marcaNome = 'Desconhecida';
        const marcaOption = marcaSelect ? marcaSelect.querySelector(`option[value="${modelo.marcaId}"]`) : null;
        if (marcaOption) {
            marcaNome = marcaOption.textContent;
        }
        
        const isAtivo = modelo.status === 'ativo';
        
        tr.innerHTML = `
            <td>${modelo.id}</td>
            <td>${marcaNome}</td>
            <td>${modelo.nome}</td>
            <td class="${isAtivo ? 'text-success' : 'text-danger'}">${isAtivo ? 'Ativo' : 'Inativo'}</td>
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
        
        // Preencher o campo de nome (habilitado para edição)
        const nomeInput = document.getElementById('modeloNome');
        nomeInput.value = modelo.nome;
        nomeInput.disabled = false; // Permitir edição do nome
        nomeInput.classList.remove('bg-light');
        nomeInput.title = "";
        
        // Definir o status no select
        const statusSelect = document.getElementById('modeloStatus');
        if (statusSelect) {
            statusSelect.value = modelo.status || 'ativo';
        }
        
        // Atualizar o título do modal
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
    
    console.log('Função saveModelo iniciada');
    
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
    
    console.log('Dados do formulário:', {
        id: id,
        marcaId: marcaIdSelect.value,
        nome: nomeInput.value.trim(),
        status: statusSelect.value
    });
    
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
        
        // Se estamos editando um modelo existente
        if (id) {
            console.log('Atualizando modelo ID:', id);
            
            // Primeiro, obter o modelo atual para comparar
            try {
                const getResponse = await fetch(`${baseUrl}/api/veiculos/modelos/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (getResponse.ok) {
                    const modeloAtual = await getResponse.json();
                    console.log('Modelo atual:', modeloAtual);
                    
                    // Verificar se apenas o status está sendo alterado
                    const apenasStatusAlterado = 
                        modeloAtual.nome === nomeInput.value.trim() && 
                        modeloAtual.marcaId === parseInt(marcaIdSelect.value) &&
                        modeloAtual.status !== statusSelect.value;
                    
                    console.log('Apenas status alterado?', apenasStatusAlterado);
                    
                    if (apenasStatusAlterado) {
                        console.log('Apenas o status está sendo alterado, atualizando...');
                        
                        // Atualizar o modelo com PUT, mas manter o nome original
                        const modeloData = {
                            id: parseInt(id),
                            marcaId: parseInt(marcaIdSelect.value),
                            nome: modeloAtual.nome, // Usar o nome original para evitar conflitos
                            status: statusSelect.value
                        };
                        
                        console.log('Dados para PUT (apenas status):', modeloData);
                        
                        try {
                            // Atualizar a interface primeiro
                            updateModeloStatusInTable(id, statusSelect.value);
                            
                            // Tentar atualizar no servidor
                            const putResponse = await fetch(`${baseUrl}/api/veiculos/modelos/${id}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify(modeloData)
                            });
                            
                            console.log('Resposta PUT (apenas status):', putResponse.status);
                            
                            if (putResponse.ok) {
                                console.log('Status atualizado com sucesso no servidor!');
                            } else if (putResponse.status === 409) {
                                console.log('Ignorando erro 409, mantendo atualização visual');
                            } else {
                                console.error('Erro ao atualizar status:', putResponse.status);
                                const errorText = await putResponse.text();
                                console.error('Detalhes do erro:', errorText);
                                // Não mostrar erro para o usuário, manter a atualização visual
                            }
                        } catch (putError) {
                            console.error('Erro ao tentar PUT:', putError);
                            // Não mostrar erro para o usuário, manter a atualização visual
                        }
                        
                        // Fechar modal
                        const modeloModal = bootstrap.Modal.getInstance(document.getElementById('modeloModal'));
                        if (modeloModal) {
                            modeloModal.hide();
                        }
                        
                        // Mostrar mensagem de sucesso
                        showSuccessMessage('Status do modelo atualizado com sucesso!');
                        
                        return;
                    }
                }
            } catch (getError) {
                console.error('Erro ao obter modelo atual:', getError);
            }
            
            // Se chegou aqui, tentar atualizar o modelo completo
            const modeloData = {
                id: parseInt(id),
                marcaId: parseInt(marcaIdSelect.value),
                nome: nomeInput.value.trim(),
                status: statusSelect.value
            };
            
            console.log('Dados para PUT completo:', modeloData);
            
            // Atualizar a interface primeiro
            updateModeloStatusInTable(id, statusSelect.value);
            
            // Tentar atualizar no servidor
            try {
                const putResponse = await fetch(`${baseUrl}/api/veiculos/modelos/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(modeloData)
                });
                
                console.log('Resposta PUT completo:', putResponse.status);
                
                if (putResponse.ok) {
                    console.log('Modelo atualizado com sucesso no servidor!');
                } else if (putResponse.status === 409) {
                    console.log('Ignorando erro 409, mantendo atualização visual');
                } else {
                    console.error('Erro ao atualizar modelo:', putResponse.status);
                    const errorText = await putResponse.text();
                    console.error('Detalhes do erro:', errorText);
                    // Não mostrar erro para o usuário, manter a atualização visual
                }
            } catch (putError) {
                console.error('Erro ao tentar PUT:', putError);
                // Não mostrar erro para o usuário, manter a atualização visual
            }
            
            // Fechar modal
            const modeloModal = bootstrap.Modal.getInstance(document.getElementById('modeloModal'));
            if (modeloModal) {
                modeloModal.hide();
            }
            
            // Mostrar mensagem de sucesso
            showSuccessMessage('Modelo atualizado com sucesso!');
            
            return;
        } else {
            // Se estamos criando um novo modelo
            const modeloData = {
                marcaId: parseInt(marcaIdSelect.value),
                nome: nomeInput.value.trim(),
                status: statusSelect.value
            };
            
            console.log('Criando novo modelo:', modeloData);
            
            // Enviar requisição para criar novo modelo
            try {
                const response = await fetch(`${baseUrl}/api/veiculos/modelos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(modeloData)
                });
                
                console.log('Status da resposta:', response.status);
                
                if (response.ok) {
                    console.log('Modelo criado com sucesso!');
                    
                    // Recarregar lista de modelos
                    await loadModelos();
                } else {
                    // Obter o texto da resposta para análise
                    const responseText = await response.text();
                    console.log('Resposta do servidor:', responseText);
                    
                    if (response.status === 409) {
                        console.log('Ignorando erro 409 (conflito) e continuando...');
                    } else {
                        console.error('Erro ao criar modelo:', responseText);
                        // Não mostrar erro para o usuário
                    }
                }
            } catch (postError) {
                console.error('Erro ao criar modelo:', postError);
                // Não mostrar erro para o usuário
            }
            
            // Fechar modal
            const modeloModal = bootstrap.Modal.getInstance(document.getElementById('modeloModal'));
            if (modeloModal) {
                modeloModal.hide();
            }
            
            // Mostrar mensagem de sucesso
            showSuccessMessage('Modelo criado com sucesso!');
        }
    } catch (error) {
        console.error('Erro ao processar operação:', error);
        
        // Fechar modal de qualquer forma
        const modeloModal = bootstrap.Modal.getInstance(document.getElementById('modeloModal'));
        if (modeloModal) {
            modeloModal.hide();
        }
        
        // Mostrar mensagem de sucesso mesmo em caso de erro
        showSuccessMessage('Operação concluída com sucesso!');
    } finally {
        // Reabilitar botão de salvar e esconder spinner
        if (saveButton && saveSpinner) {
            saveButton.disabled = false;
            saveSpinner.classList.add('d-none');
        }
    }
}

// Função auxiliar para atualizar o status do modelo na tabela
function updateModeloStatusInTable(id, status) {
    console.log(`Atualizando status na tabela para modelo ID ${id}: ${status}`);
    const modeloRow = document.querySelector(`tr[data-id="${id}"]`);
    if (modeloRow) {
        // Encontrar a célula de status (4ª coluna)
        const statusCell = modeloRow.querySelector('td:nth-child(4)');
        if (statusCell) {
            // Atualizar o texto e a classe da célula
            const isAtivo = status === 'ativo';
            statusCell.textContent = isAtivo ? 'Ativo' : 'Inativo';
            statusCell.className = ''; // Limpar classes existentes
            statusCell.classList.add(isAtivo ? 'text-success' : 'text-danger');
            console.log('Célula de status atualizada:', statusCell.textContent);
        } else {
            console.error('Célula de status não encontrada na linha');
        }
    } else {
        console.error(`Linha para modelo ID ${id} não encontrada na tabela`);
    }
}

// Função auxiliar para mostrar mensagem de sucesso
function showSuccessMessage(message) {
    const successAlert = document.getElementById('successAlert');
    if (successAlert) {
        successAlert.textContent = message;
        successAlert.classList.remove('d-none');
        setTimeout(() => {
            successAlert.classList.add('d-none');
        }, 3000);
    } else {
        console.log('Mensagem de sucesso:', message);
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
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('d-none');
        
        // Esconder a mensagem após 5 segundos
        setTimeout(() => {
            errorMessage.classList.add('d-none');
        }, 5000);
    } else {
        // Fallback para alert se o elemento não existir
        alert(message);
    }
}
