// Inicialização da autenticação
const auth = new Auth();
let currentPage = 1;
const itemsPerPage = 10;
let totalItems = 0;
let modelos = [];
let opcionais = [];
let modelosOpcionais = [];

// Elementos do DOM
const opcionaisTableBody = document.getElementById('opcionaisTableBody');
const modeloOpcionaisTableBody = document.getElementById('modeloOpcionaisTableBody');
const paginationControls = document.getElementById('paginationControls');
const opcionalForm = document.getElementById('opcionalForm');
const modeloOpcionalForm = document.getElementById('modeloOpcionalForm');
const editAssociacaoForm = document.getElementById('editAssociacaoForm');
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const editAssociacaoModal = new bootstrap.Modal(document.getElementById('editAssociacaoModal'));
const errorMessage = document.getElementById('errorMessage');
const associacaoErrorMessage = document.getElementById('associacaoErrorMessage');
const editAssociacaoErrorMessage = document.getElementById('editAssociacaoErrorMessage');

// Verificar autenticação e redirecionar se não estiver autenticado
document.addEventListener('DOMContentLoaded', () => {
    auth.checkAuthAndRedirect();
    
    // Configurar botão de logout
    document.getElementById('logoutButton').addEventListener('click', () => {
        auth.logout();
    });
    
    // Inicializar inputs monetários
    initMonetaryInputs();
    
    // Carregar dados iniciais
    loadOpcionais();
    loadModelos();
    loadModelosOpcionais();
    
    // Configurar eventos
    document.getElementById('saveButton').addEventListener('click', saveOpcional);
    document.getElementById('limparButton').addEventListener('click', () => {
        opcionalForm.reset();
        document.getElementById('opcionalId').value = '';
        errorMessage.classList.add('d-none');
        opcionalForm.classList.remove('was-validated');
    });
    
    document.getElementById('associarButton').addEventListener('click', associarOpcionalModelo);
    document.getElementById('limparAssociacaoButton').addEventListener('click', () => {
        modeloOpcionalForm.reset();
        associacaoErrorMessage.classList.add('d-none');
        modeloOpcionalForm.classList.remove('was-validated');
    });
    
    document.getElementById('saveAssociacaoButton').addEventListener('click', updateAssociacao);
    document.getElementById('confirmDeleteButton').addEventListener('click', deleteItem);
    
    // Filtro de modelo
    document.getElementById('filtroModeloSelect').addEventListener('change', function() {
        const modeloId = this.value;
        if (modeloId) {
            filterModeloOpcionaisByModelo(modeloId);
        } else {
            renderModelosOpcionais(modelosOpcionais);
        }
    });
});

// Função para carregar opcionais
async function loadOpcionais() {
    try {
        console.log('Carregando opcionais...');
        // Não precisamos mais enviar o token para este endpoint
        const response = await fetch('/opcionais/api/list');
        
        if (!response.ok) {
            throw new Error('Falha ao carregar opcionais');
        }
        
        const data = await response.json();
        opcionais = data;
        
        renderOpcionais(opcionais);
        populateOpcionalSelect();
    } catch (error) {
        console.error('Erro ao carregar opcionais:', error);
        showError('Não foi possível carregar os opcionais. Por favor, tente novamente mais tarde.', errorMessage);
    }
}

// Função para carregar modelos
async function loadModelos() {
    try {
        const token = auth.getToken();
        const response = await fetch('/api/veiculos/modelos/all', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar modelos');
        }
        
        const data = await response.json();
        modelos = data;
        
        populateModeloSelect();
        populateFiltroModeloSelect();
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        showError('Não foi possível carregar os modelos. Por favor, tente novamente mais tarde.', errorMessage);
    }
}

// Função para carregar associações entre modelos e opcionais
async function loadModelosOpcionais() {
    try {
        // Não precisamos mais enviar o token para este endpoint
        const response = await fetch('/api/modelo-opcional');
        
        if (!response.ok) {
            throw new Error('Falha ao carregar associações');
        }
        
        const data = await response.json();
        modelosOpcionais = data;
        
        renderModelosOpcionais(modelosOpcionais);
    } catch (error) {
        console.error('Erro ao carregar associações:', error);
        showError('Não foi possível carregar as associações. Por favor, tente novamente mais tarde.', errorMessage);
    }
}

// Função para popular o select de modelos
function populateModeloSelect() {
    const modeloSelect = document.getElementById('modeloSelect');
    modeloSelect.innerHTML = '<option value="">Selecione o modelo...</option>';
    
    modelos.forEach(modelo => {
        const option = document.createElement('option');
        option.value = modelo.id;
        option.textContent = `${modelo.marca.nome} - ${modelo.nome}`;
        modeloSelect.appendChild(option);
    });
}

// Função para popular o select de filtro de modelos
function populateFiltroModeloSelect() {
    const filtroModeloSelect = document.getElementById('filtroModeloSelect');
    filtroModeloSelect.innerHTML = '<option value="">Todos os modelos</option>';
    
    modelos.forEach(modelo => {
        const option = document.createElement('option');
        option.value = modelo.id;
        option.textContent = `${modelo.marca.nome} - ${modelo.nome}`;
        filtroModeloSelect.appendChild(option);
    });
}

// Função para popular o select de opcionais
function populateOpcionalSelect() {
    const opcionalSelect = document.getElementById('opcionalSelect');
    opcionalSelect.innerHTML = '<option value="">Selecione o opcional...</option>';
    
    opcionais.forEach(opcional => {
        const option = document.createElement('option');
        option.value = opcional.id;
        option.textContent = `${opcional.codigo} - ${opcional.descricao}`;
        opcionalSelect.appendChild(option);
    });
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

// Função para renderizar associações entre modelos e opcionais
function renderModelosOpcionais(associacoes) {
    modeloOpcionaisTableBody.innerHTML = '';
    
    if (associacoes.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" class="text-center">Nenhuma associação encontrada</td>';
        modeloOpcionaisTableBody.appendChild(row);
        return;
    }
    
    associacoes.forEach(associacao => {
        const modeloNome = associacao.modelo ? `${associacao.modelo.marca.nome} - ${associacao.modelo.nome}` : 'N/A';
        const opcionalNome = associacao.opcional ? `${associacao.opcional.codigo} - ${associacao.opcional.descricao}` : 'N/A';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${modeloNome}</td>
            <td>${opcionalNome}</td>
            <td>OPCIONAL</td>
            <td>${formatarMoeda(associacao.preco)}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editAssociacao(${associacao.id})">
                    Editar
                </button>
                <button class="btn btn-sm btn-danger" onclick="showDeleteModal(${associacao.id}, 'associacao')">
                    Excluir
                </button>
            </td>
        `;
        modeloOpcionaisTableBody.appendChild(row);
    });
}

// Função para filtrar associações por modelo
function filterModeloOpcionaisByModelo(modeloId) {
    const filteredAssociacoes = modelosOpcionais.filter(associacao => 
        associacao.modeloId === parseInt(modeloId)
    );
    renderModelosOpcionais(filteredAssociacoes);
}

// Função para editar opcional
async function editOpcional(id) {
    try {
        const token = auth.getToken();
        const response = await fetch(`/opcionais/api/${id}`, {
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
        document.getElementById('descricao').value = opcional.descricao;
        
        // Rolar até o formulário
        opcionalForm.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Erro ao editar opcional:', error);
        showError('Não foi possível carregar os dados do opcional. Por favor, tente novamente mais tarde.', errorMessage);
    }
}

// Função para editar associação
async function editAssociacao(id) {
    try {
        const token = auth.getToken();
        const response = await fetch(`/api/modelo-opcional/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar dados da associação');
        }
        
        const associacao = await response.json();
        
        document.getElementById('editAssociacaoId').value = associacao.id;
        document.getElementById('editModeloNome').value = `${associacao.modelo.marca.nome} - ${associacao.modelo.nome}`;
        document.getElementById('editOpcionalNome').value = `${associacao.opcional.codigo} - ${associacao.opcional.descricao}`;
        document.getElementById('editPrecoOpcional').value = formatarMoeda(associacao.preco).replace('R$ ', '');
        
        // Inicializar o input monetário
        initMonetaryInputs();
        
        editAssociacaoModal.show();
    } catch (error) {
        console.error('Erro ao carregar associação:', error);
        showError('Não foi possível carregar os dados da associação. Por favor, tente novamente mais tarde.', errorMessage);
    }
}

// Função para mostrar modal de exclusão
function showDeleteModal(id, type) {
    document.getElementById('deleteId').value = id;
    document.getElementById('deleteType').value = type;
    
    const confirmText = document.getElementById('deleteConfirmText');
    if (type === 'opcional') {
        confirmText.textContent = 'Tem certeza que deseja excluir este opcional? Isso também removerá todas as associações com modelos.';
    } else {
        confirmText.textContent = 'Tem certeza que deseja excluir esta associação?';
    }
    
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
        
        const token = auth.getToken();
        const method = opcionalId ? 'PATCH' : 'POST';
        const url = opcionalId ? `/opcionais/${opcionalId}` : '/opcionais';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(opcionalData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao salvar opcional');
        }
        
        // Limpar formulário
        opcionalForm.reset();
        document.getElementById('opcionalId').value = '';
        errorMessage.classList.add('d-none');
        opcionalForm.classList.remove('was-validated');
        
        // Recarregar dados
        loadOpcionais();
    } catch (error) {
        console.error('Erro ao salvar opcional:', error);
        showError(error.message || 'Não foi possível salvar o opcional. Por favor, tente novamente mais tarde.', errorMessage);
    } finally {
        const saveButton = document.getElementById('saveButton');
        const saveSpinner = document.getElementById('saveSpinner');
        
        saveButton.disabled = false;
        saveSpinner.classList.add('d-none');
    }
}

// Função para associar opcional a modelo
async function associarOpcionalModelo() {
    if (!modeloOpcionalForm.checkValidity()) {
        modeloOpcionalForm.classList.add('was-validated');
        return;
    }
    
    const modeloId = document.getElementById('modeloSelect').value;
    const opcionalId = document.getElementById('opcionalSelect').value;
    const precoStr = document.getElementById('precoOpcional').value;
    const preco = converterParaNumero(precoStr);
    
    const associacaoData = {
        modeloId: parseInt(modeloId),
        opcionalId: parseInt(opcionalId),
        preco
    };
    
    try {
        const associarButton = document.getElementById('associarButton');
        const associarSpinner = document.getElementById('associarSpinner');
        
        associarButton.disabled = true;
        associarSpinner.classList.remove('d-none');
        
        const token = auth.getToken();
        const response = await fetch('/api/modelo-opcional', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(associacaoData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao associar opcional ao modelo');
        }
        
        // Limpar formulário
        modeloOpcionalForm.reset();
        associacaoErrorMessage.classList.add('d-none');
        modeloOpcionalForm.classList.remove('was-validated');
        
        // Recarregar dados
        loadModelosOpcionais();
    } catch (error) {
        console.error('Erro ao associar opcional:', error);
        showError(error.message || 'Não foi possível associar o opcional ao modelo. Por favor, tente novamente mais tarde.', associacaoErrorMessage);
    } finally {
        const associarButton = document.getElementById('associarButton');
        const associarSpinner = document.getElementById('associarSpinner');
        
        associarButton.disabled = false;
        associarSpinner.classList.add('d-none');
    }
}

// Função para atualizar associação
async function updateAssociacao() {
    if (!editAssociacaoForm.checkValidity()) {
        editAssociacaoForm.classList.add('was-validated');
        return;
    }
    
    const id = document.getElementById('editAssociacaoId').value;
    const precoStr = document.getElementById('editPrecoOpcional').value;
    const preco = converterParaNumero(precoStr);
    
    const associacaoData = {
        preco
    };
    
    try {
        const saveAssociacaoButton = document.getElementById('saveAssociacaoButton');
        const saveAssociacaoSpinner = document.getElementById('saveAssociacaoSpinner');
        
        saveAssociacaoButton.disabled = true;
        saveAssociacaoSpinner.classList.remove('d-none');
        
        const token = auth.getToken();
        const response = await fetch(`/api/modelo-opcional/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(associacaoData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao atualizar associação');
        }
        
        editAssociacaoModal.hide();
        
        // Recarregar dados
        loadModelosOpcionais();
    } catch (error) {
        console.error('Erro ao atualizar associação:', error);
        showError(error.message || 'Não foi possível atualizar a associação. Por favor, tente novamente mais tarde.', editAssociacaoErrorMessage);
    } finally {
        const saveAssociacaoButton = document.getElementById('saveAssociacaoButton');
        const saveAssociacaoSpinner = document.getElementById('saveAssociacaoSpinner');
        
        saveAssociacaoButton.disabled = false;
        saveAssociacaoSpinner.classList.add('d-none');
    }
}

// Função para excluir item (opcional ou associação)
async function deleteItem() {
    const id = document.getElementById('deleteId').value;
    const type = document.getElementById('deleteType').value;
    
    try {
        const confirmDeleteButton = document.getElementById('confirmDeleteButton');
        const deleteSpinner = document.getElementById('deleteSpinner');
        
        confirmDeleteButton.disabled = true;
        deleteSpinner.classList.remove('d-none');
        
        const token = auth.getToken();
        const url = type === 'opcional' ? `/opcionais/${id}` : `/api/modelo-opcional/${id}`;
        
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Falha ao excluir ${type === 'opcional' ? 'opcional' : 'associação'}`);
        }
        
        deleteModal.hide();
        
        // Recarregar dados
        if (type === 'opcional') {
            loadOpcionais();
        }
        loadModelosOpcionais();
    } catch (error) {
        console.error(`Erro ao excluir ${type}:`, error);
        showError(`Não foi possível excluir o ${type === 'opcional' ? 'opcional' : 'associação'}. Por favor, tente novamente mais tarde.`, errorMessage);
    } finally {
        const confirmDeleteButton = document.getElementById('confirmDeleteButton');
        const deleteSpinner = document.getElementById('deleteSpinner');
        
        confirmDeleteButton.disabled = false;
        deleteSpinner.classList.add('d-none');
    }
}

// Função para mostrar mensagem de erro
function showError(message, element) {
    element.textContent = message;
    element.classList.remove('d-none');
    
    // Esconder a mensagem após 5 segundos
    setTimeout(() => {
        element.classList.add('d-none');
    }, 5000);
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

// Função para converter para número
function converterParaNumero(valor) {
    if (!valor || typeof valor !== 'string') {
        return 0;
    }
    return parseFloat(valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.')) || 0;
}

// Função para inicializar inputs monetários
function initMonetaryInputs() {
    const monetaryInputs = document.querySelectorAll('.monetary-input');
    
    monetaryInputs.forEach(input => {
        input.addEventListener('input', () => {
            const valor = input.value;
            const formattedValue = formatarMoeda(converterParaNumero(valor));
            input.value = formattedValue;
        });
    });
}
