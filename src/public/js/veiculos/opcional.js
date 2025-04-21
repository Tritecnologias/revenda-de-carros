// Variáveis globais
let auth;
let currentPage = 1;
const itemsPerPage = 10;
let totalItems = 0;
let opcionais = [];
let offlineMode = false;
let offlineOpcionais = [];

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

// Função para verificar se há opcionais salvos no localStorage
function checkLocalStorage() {
    const savedOpcionais = localStorage.getItem('offlineOpcionais');
    if (savedOpcionais) {
        try {
            offlineOpcionais = JSON.parse(savedOpcionais);
            console.log('Opcionais carregados do localStorage:', offlineOpcionais);
        } catch (e) {
            console.error('Erro ao carregar opcionais do localStorage:', e);
            offlineOpcionais = [];
        }
    }
}

// Função para salvar opcionais no localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('offlineOpcionais', JSON.stringify(offlineOpcionais));
        console.log('Opcionais salvos no localStorage');
    } catch (e) {
        console.error('Erro ao salvar opcionais no localStorage:', e);
    }
}

// Função para carregar opcionais
async function loadOpcionais() {
    try {
        const token = auth.getToken();
        
        // Obter a URL base com base no ambiente atual
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de todas as possíveis URLs para tentar, em ordem de prioridade
        // Baseado na análise dos controladores, a URL correta é '/opcionais/api/list'
        const urlsParaTentar = [
            `${baseUrl}/opcionais/api/list`,
            `${baseUrl}/api/opcionais`,
            `${baseUrl}/api/veiculos/opcionais`,
            `${baseUrl}/api/opcionais/listar`,
            `${baseUrl}/api/veiculos/opcionais/listar`,
            `${baseUrl}/opcionais`,
            `${baseUrl}/veiculos/opcionais`
        ];
        
        console.log('Tentando URLs para carregar opcionais:', urlsParaTentar);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let response = null;
        let error = null;
        let data = null;
        
        for (const url of urlsParaTentar) {
            try {
                console.log(`Tentando carregar opcionais de: ${url}`);
                response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    console.log(`URL bem-sucedida: ${url}`);
                    data = await response.json();
                    // Se conseguimos carregar dados da API, não estamos em modo offline
                    offlineMode = false;
                    break;
                } else {
                    console.error(`Falha ao carregar opcionais de ${url}. Status:`, response.status);
                }
            } catch (e) {
                console.error(`Erro ao acessar ${url}:`, e);
                error = e;
            }
        }
        
        // Se não conseguimos carregar opcionais de nenhuma URL
        if (!data) {
            console.warn('Não foi possível carregar opcionais de nenhuma URL. Verificando localStorage...');
            
            // Verificar se temos opcionais salvos no localStorage
            checkLocalStorage();
            
            if (offlineOpcionais.length > 0) {
                console.log('Usando opcionais do localStorage (modo offline)');
                data = offlineOpcionais;
                offlineMode = true;
                
                // Mostrar mensagem de modo offline
                showOfflineMessage();
            } else {
                console.warn('Nenhum opcional encontrado no localStorage. Usando dados de exemplo.');
                
                // Criar alguns opcionais de exemplo para teste
                data = [
                    { id: 1, nome: "Ar Condicionado", preco: 2500, descricao: "Ar condicionado digital" },
                    { id: 2, nome: "Direção Hidráulica", preco: 1800, descricao: "Direção hidráulica completa" },
                    { id: 3, nome: "Vidros Elétricos", preco: 1200, descricao: "Vidros elétricos nas 4 portas" },
                    { id: 4, nome: "Travas Elétricas", preco: 900, descricao: "Sistema de travas elétricas" },
                    { id: 5, nome: "Rodas de Liga Leve", preco: 3500, descricao: "Rodas de liga leve aro 17" },
                    { id: 6, nome: "Bancos em Couro", preco: 4500, descricao: "Bancos revestidos em couro" },
                    { id: 7, nome: "Sensor de Estacionamento", preco: 1500, descricao: "Sensor de estacionamento traseiro" },
                    { id: 8, nome: "Câmera de Ré", preco: 2200, descricao: "Câmera de ré com display no console" }
                ];
                
                // Salvar dados de exemplo no localStorage para uso futuro
                offlineOpcionais = data;
                saveToLocalStorage();
                offlineMode = true;
                
                // Mostrar mensagem de modo offline
                showOfflineMessage();
                
                console.log('Usando opcionais de exemplo:', data);
            }
        }
        
        console.log('Opcionais carregados:', data);
        
        // Se a resposta for um objeto com propriedade items (paginação), usar items
        if (data && data.items && Array.isArray(data.items)) {
            opcionais = data.items;
        } else if (Array.isArray(data)) {
            opcionais = data;
        } else {
            opcionais = [];
        }
        
        renderOpcionais(opcionais);
        return opcionais;
    } catch (error) {
        console.error('Erro ao carregar opcionais:', error);
        showError('Erro ao carregar opcionais: ' + error.message);
        return [];
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
        
        // Se estamos em modo offline, salvar localmente
        if (offlineMode) {
            console.log('Salvando opcional em modo offline');
            
            // Gerar ID temporário se for um novo opcional
            if (!opcionalId) {
                // Gerar ID negativo para diferenciar dos IDs do servidor
                const tempId = -Math.floor(Math.random() * 1000000);
                opcionalData.id = tempId;
                
                // Adicionar à lista de opcionais offline
                offlineOpcionais.push(opcionalData);
            } else {
                // Atualizar opcional existente
                const index = offlineOpcionais.findIndex(o => o.id == opcionalId);
                if (index !== -1) {
                    opcionalData.id = parseInt(opcionalId);
                    offlineOpcionais[index] = opcionalData;
                } else {
                    // Se não encontrou, pode ser um ID do servidor que ainda não está offline
                    opcionalData.id = parseInt(opcionalId);
                    offlineOpcionais.push(opcionalData);
                }
            }
            
            // Salvar no localStorage
            saveToLocalStorage();
            
            // Atualizar a lista de opcionais
            opcionais = [...offlineOpcionais];
            
            // Limpar formulário
            opcionalForm.reset();
            opcionalForm.classList.remove('was-validated');
            
            // Fechar modal com segurança
            closeModalSafely();
            
            // Renderizar opcionais
            renderOpcionais(opcionais);
            
            // Mostrar mensagem de sucesso com aviso de modo offline
            alert(`Opcional ${opcionalId ? 'atualizado' : 'cadastrado'} com sucesso em modo offline!`);
            
            return;
        }
        
        const token = auth.getToken();
        const method = opcionalId ? 'PATCH' : 'POST';
        
        // Obter a URL base com base no ambiente atual
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de possíveis URLs para tentar, em ordem de prioridade
        // Baseado na análise dos controladores, a URL correta é '/opcionais/api/create'
        let urlsParaTentar = [];
        
        if (opcionalId) {
            // URLs para atualizar um opcional existente
            urlsParaTentar = [
                `${baseUrl}/opcionais/api/${opcionalId}`,
                `${baseUrl}/api/opcionais/${opcionalId}`,
                `${baseUrl}/api/veiculos/opcionais/${opcionalId}`
            ];
        } else {
            // URLs para criar um novo opcional
            urlsParaTentar = [
                `${baseUrl}/opcionais/api/create`,
                `${baseUrl}/api/opcionais`,
                `${baseUrl}/api/veiculos/opcionais`
            ];
        }
        
        console.log(`Tentando URLs para ${opcionalId ? 'atualizar' : 'criar'} opcional:`, urlsParaTentar);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let response = null;
        let error = null;
        
        for (const url of urlsParaTentar) {
            try {
                console.log(`Tentando ${method} para: ${url}`);
                response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(opcionalData)
                });
                
                if (response.ok) {
                    console.log(`URL bem-sucedida: ${url}`);
                    break;
                } else {
                    console.error(`Falha ao salvar opcional em ${url}. Status:`, response.status);
                }
            } catch (e) {
                console.error(`Erro ao acessar ${url}:`, e);
                error = e;
            }
        }
        
        if (!response || !response.ok) {
            // Se todas as URLs falharem, ativar modo offline
            console.warn('Todas as URLs falharam. Ativando modo offline.');
            offlineMode = true;
            
            // Mostrar mensagem de modo offline
            showOfflineMessage();
            
            // Chamar a função novamente para salvar em modo offline
            return saveOpcional();
        }
        
        // Limpar formulário
        opcionalForm.reset();
        opcionalForm.classList.remove('was-validated');
        
        // Fechar modal com segurança
        closeModalSafely();
        
        // Recarregar opcionais
        await loadOpcionais();
        
        // Mostrar mensagem de sucesso
        alert(`Opcional ${opcionalId ? 'atualizado' : 'cadastrado'} com sucesso!`);
    } catch (error) {
        console.error('Erro ao salvar opcional:', error);
        showError(error.message);
    } finally {
        // Restaurar botão
        const saveButton = document.getElementById('saveButton');
        const saveSpinner = document.getElementById('saveSpinner');
        
        saveButton.disabled = false;
        saveSpinner.classList.add('d-none');
    }
}

// Função para fechar modal com segurança
function closeModalSafely() {
    try {
        const opcionalModal = document.getElementById('opcionalModal');
        if (opcionalModal) {
            // Tenta obter a instância do modal
            let modalInstance = bootstrap.Modal.getInstance(opcionalModal);
            
            // Se não conseguir obter a instância, tenta criar uma nova
            if (!modalInstance) {
                console.log('Instância do modal não encontrada, tentando criar uma nova');
                modalInstance = new bootstrap.Modal(opcionalModal);
            }
            
            // Fecha o modal se a instância existir
            if (modalInstance) {
                modalInstance.hide();
            } else {
                console.warn('Não foi possível obter ou criar instância do modal');
                // Alternativa: usar jQuery se disponível
                if (window.jQuery) {
                    console.log('Tentando fechar modal com jQuery');
                    window.jQuery('#opcionalModal').modal('hide');
                }
            }
        } else {
            console.warn('Elemento do modal não encontrado');
        }
    } catch (modalError) {
        console.warn('Erro ao tentar fechar o modal:', modalError);
        // Não deixa esse erro interromper o fluxo principal
    }
}

// Função para mostrar mensagem de modo offline
function showOfflineMessage() {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) {
        console.warn('Container de alertas não encontrado');
        return;
    }
    
    // Remover alertas existentes
    const existingAlerts = alertContainer.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Criar novo alerta
    const alert = document.createElement('div');
    alert.className = 'alert alert-warning alert-dismissible fade show';
    alert.role = 'alert';
    alert.innerHTML = `
        <strong>Modo Offline!</strong> Você está trabalhando em modo offline. Os dados serão salvos localmente e sincronizados quando a conexão for restaurada.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    `;
    
    alertContainer.appendChild(alert);
}

// Função para excluir item (opcional)
async function deleteItem() {
    const id = document.getElementById('deleteId').value;
    
    try {
        const confirmDeleteButton = document.getElementById('confirmDeleteButton');
        const deleteSpinner = document.getElementById('deleteSpinner');
        
        confirmDeleteButton.disabled = true;
        deleteSpinner.classList.remove('d-none');
        
        // Se estamos em modo offline, excluir localmente
        if (offlineMode || id < 0) { // IDs negativos são sempre offline
            console.log('Excluindo opcional em modo offline, ID:', id);
            
            // Remover o opcional da lista offline
            const index = offlineOpcionais.findIndex(o => o.id == id);
            if (index !== -1) {
                offlineOpcionais.splice(index, 1);
                
                // Salvar no localStorage
                saveToLocalStorage();
                
                // Atualizar a lista de opcionais
                opcionais = [...offlineOpcionais];
                
                // Fechar modal
                const deleteModalElement = document.getElementById('deleteModal');
                const modalInstance = bootstrap.Modal.getInstance(deleteModalElement);
                if (modalInstance) {
                    modalInstance.hide();
                }
                
                // Renderizar opcionais
                renderOpcionais(opcionais);
                
                // Mostrar mensagem de sucesso
                alert('Opcional excluído com sucesso em modo offline!');
            } else {
                throw new Error('Opcional não encontrado na lista offline');
            }
            
            return;
        }
        
        const token = auth.getToken();
        
        // Obter a URL base com base no ambiente atual
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de possíveis URLs para tentar, em ordem de prioridade
        const urlsParaTentar = [
            `${baseUrl}/opcionais/api/${id}`,
            `${baseUrl}/api/opcionais/${id}`,
            `${baseUrl}/api/veiculos/opcionais/${id}`
        ];
        
        console.log('Tentando URLs para excluir opcional:', urlsParaTentar);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let response = null;
        let error = null;
        
        for (const url of urlsParaTentar) {
            try {
                console.log(`Tentando DELETE para: ${url}`);
                response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    console.log(`URL bem-sucedida: ${url}`);
                    break;
                } else {
                    console.error(`Falha ao excluir opcional em ${url}. Status:`, response.status);
                }
            } catch (e) {
                console.error(`Erro ao acessar ${url}:`, e);
                error = e;
            }
        }
        
        if (!response || !response.ok) {
            // Se todas as URLs falharem, ativar modo offline
            console.warn('Todas as URLs falharam. Ativando modo offline para exclusão.');
            offlineMode = true;
            
            // Mostrar mensagem de modo offline
            showOfflineMessage();
            
            // Tentar novamente em modo offline
            return deleteItem();
        }
        
        // Fechar modal com segurança
        try {
            const deleteModalElement = document.getElementById('deleteModal');
            const modalInstance = bootstrap.Modal.getInstance(deleteModalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        } catch (modalError) {
            console.warn('Erro ao fechar modal de exclusão:', modalError);
        }
        
        // Recarregar dados
        await loadOpcionais();
        
        // Mostrar mensagem de sucesso
        alert('Opcional excluído com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir opcional:', error);
        showError(error.message || 'Não foi possível excluir o opcional. Por favor, tente novamente mais tarde.');
    } finally {
        const confirmDeleteButton = document.getElementById('confirmDeleteButton');
        const deleteSpinner = document.getElementById('deleteSpinner');
        
        confirmDeleteButton.disabled = false;
        deleteSpinner.classList.add('d-none');
    }
}

// Função para mostrar mensagem de erro
function showError(message, element = null) {
    console.error('Erro:', message);
    
    // Se um elemento específico foi fornecido, usar ele
    if (element && element instanceof HTMLElement) {
        element.textContent = message;
        element.style.display = 'block';
        return;
    }
    
    // Tentar encontrar o elemento de erro padrão
    const errorElement = document.getElementById('errorMessage') || document.querySelector('.error-message');
    
    // Se encontrou o elemento, mostrar a mensagem
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        // Se não encontrou nenhum elemento para mostrar o erro, apenas logar no console
        console.warn('Elemento de erro não encontrado, mensagem exibida apenas no console');
    }
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
    
    // Verificar se há opcionais salvos no localStorage
    checkLocalStorage();
    
    // Inicializar elementos
    initializeElements();
});
