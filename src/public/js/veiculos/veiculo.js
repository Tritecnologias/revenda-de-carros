// Inicialização da autenticação
const auth = new Auth();
let currentPage = 1;
const itemsPerPage = 10;
let totalItems = 0;
let marcas = [];
let modelos = [];

// Elementos do DOM
let veiculosTableBody;
let paginationControls;
let veiculoForm;
let veiculoModal;
let deleteModal;
let errorMessage;
let saveButton;
let saveSpinner;
let confirmDeleteButton;
let deleteSpinner;
let marcaSelect;
let modeloSelect;

// Inicializar elementos após o carregamento do DOM
function initializeElements() {
    veiculosTableBody = document.getElementById('veiculosTableBody');
    paginationControls = document.getElementById('paginationControls');
    veiculoForm = document.getElementById('veiculoForm');
    
    const veiculoModalElement = document.getElementById('veiculoModal');
    if (veiculoModalElement) {
        veiculoModal = new bootstrap.Modal(veiculoModalElement);
    }
    
    const deleteModalElement = document.getElementById('deleteModal');
    if (deleteModalElement) {
        deleteModal = new bootstrap.Modal(deleteModalElement);
    }
    
    errorMessage = document.getElementById('errorMessage');
    saveButton = document.getElementById('saveButton');
    saveSpinner = document.getElementById('saveSpinner');
    confirmDeleteButton = document.getElementById('confirmDeleteButton');
    deleteSpinner = document.getElementById('deleteSpinner');
    marcaSelect = document.getElementById('marcaId');
    modeloSelect = document.getElementById('modeloId');
    
    // Configurar eventos
    if (saveButton) {
        saveButton.addEventListener('click', saveVeiculo);
    }
    
    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', deleteVeiculo);
    }
    
    // Evento para carregar modelos quando a marca mudar
    if (marcaSelect) {
        marcaSelect.addEventListener('change', loadModelosByMarca);
    }
    
    // Reset do formulário quando o modal é fechado
    if (veiculoModalElement) {
        veiculoModalElement.addEventListener('hidden.bs.modal', () => {
            veiculoForm.reset();
            document.getElementById('veiculoId').value = '';
            document.getElementById('veiculoModalTitle').textContent = 'NOVO VEÍCULO';
            errorMessage.classList.add('d-none');
            veiculoForm.classList.remove('was-validated');
            
            // Limpar campos de preço
            document.getElementById('preco').value = '';
            document.getElementById('custoAquisicao').value = '';
        });
    }
    
    // Inicializar dados
    inicializarDados();
}

// Função para inicializar dados
async function inicializarDados() {
    try {
        await loadMarcasSelect();
        loadVeiculos();
    } catch (error) {
        console.error('Erro ao inicializar dados:', error);
        showError('Erro ao carregar dados iniciais. Por favor, recarregue a página.');
    }
}

// Verificar autenticação e redirecionar se não estiver autenticado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    auth.checkAuthAndRedirect();
    
    // Inicializar elementos após garantir que o DOM está completamente carregado
    // e que o cabeçalho foi carregado pelo layout-manager.js
    setTimeout(initializeElements, 500);
});

// Função para formatar preço em reais
function formatarPreco(preco) {
    if (!preco) return '';
    
    // Converter para número se for string
    if (typeof preco === 'string') {
        preco = converterParaNumero(preco);
    }
    
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para converter valores formatados para números
function converterParaNumero(valor) {
    return parseFloat(valor.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
}

// Função para carregar marcas para o select
async function loadMarcasSelect() {
    if (!marcaSelect) {
        console.error('Elemento marcaSelect não encontrado');
        return;
    }
    
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
        throw new Error('Não foi possível carregar as marcas. Por favor, tente novamente mais tarde.');
    }
}

// Função para carregar modelos por marca
async function loadModelosByMarca() {
    if (!modeloSelect || !marcaSelect) {
        console.error('Elementos modeloSelect ou marcaSelect não encontrados');
        return;
    }
    
    const marcaId = marcaSelect.value;
    
    // Limpar select de modelos
    modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
    
    // Se não houver marca selecionada, retornar
    if (!marcaId) {
        return;
    }
    
    try {
        const token = auth.getToken();
        const response = await fetch(`/api/veiculos/modelos/by-marca/${marcaId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar modelos');
        }
        
        modelos = await response.json();
        
        if (modelos.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Nenhum modelo encontrado para esta marca';
            modeloSelect.appendChild(option);
            return;
        }
        
        // Adicionar opções
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

// Função para carregar veículos
async function loadVeiculos() {
    if (!veiculosTableBody) {
        console.error('Elemento veiculosTableBody não encontrado');
        return;
    }
    
    try {
        const token = auth.getToken();
        const response = await fetch(`/api/veiculos?page=${currentPage}&limit=${itemsPerPage}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar veículos');
        }
        
        const data = await response.json();
        totalItems = data.total;
        
        renderVeiculos(data.items);
        renderPagination();
    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
        showError('Não foi possível carregar os veículos. Por favor, tente novamente mais tarde.');
    }
}

// Função para renderizar veículos na tabela
function renderVeiculos(veiculos) {
    if (!veiculosTableBody) {
        console.error('Elemento veiculosTableBody não encontrado');
        return;
    }
    
    veiculosTableBody.innerHTML = '';
    
    if (veiculos.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="7" class="text-center">Nenhum veículo encontrado</td>';
        veiculosTableBody.appendChild(tr);
        return;
    }
    
    veiculos.forEach(veiculo => {
        const tr = document.createElement('tr');
        
        // Encontrar o nome da marca e modelo
        const marca = marcas.find(m => m.id === veiculo.marcaId) || { nome: 'Desconhecida' };
        const modelo = modelos.find(m => m.id === veiculo.modeloId) || { nome: 'Desconhecido' };
        
        tr.innerHTML = `
            <td>${veiculo.id}</td>
            <td>${marca.nome}</td>
            <td>${modelo.nome}</td>
            <td>${veiculo.ano}</td>
            <td>${veiculo.placa}</td>
            <td>${formatarPreco(veiculo.preco)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editVeiculo(${veiculo.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="showDeleteModal(${veiculo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        veiculosTableBody.appendChild(tr);
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
    loadVeiculos();
}

// Função para editar veículo
function editVeiculo(id) {
    const token = auth.getToken();
    
    fetch(`/api/veiculos/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar veículo');
        }
        return response.json();
    })
    .then(async veiculo => {
        document.getElementById('veiculoId').value = veiculo.id;
        
        // Selecionar marca
        document.getElementById('marcaId').value = veiculo.marcaId;
        
        // Carregar modelos da marca e depois selecionar o modelo
        await loadModelosByMarca();
        document.getElementById('modeloId').value = veiculo.modeloId;
        
        // Preencher outros campos
        document.getElementById('ano').value = veiculo.ano;
        document.getElementById('placa').value = veiculo.placa;
        document.getElementById('cor').value = veiculo.cor;
        document.getElementById('quilometragem').value = veiculo.quilometragem;
        document.getElementById('preco').value = formatarPreco(veiculo.preco);
        document.getElementById('custoAquisicao').value = formatarPreco(veiculo.custoAquisicao);
        document.getElementById('observacoes').value = veiculo.observacoes || '';
        
        document.getElementById('veiculoModalTitle').textContent = 'EDITAR VEÍCULO';
        
        veiculoModal.show();
    })
    .catch(error => {
        console.error('Erro ao carregar veículo para edição:', error);
        showError('Não foi possível carregar o veículo para edição. Por favor, tente novamente mais tarde.');
    });
}

// Função para mostrar modal de exclusão
function showDeleteModal(id) {
    document.getElementById('deleteId').value = id;
    deleteModal.show();
}

// Função para salvar veículo
function saveVeiculo() {
    // Validar formulário
    if (!veiculoForm.checkValidity()) {
        veiculoForm.classList.add('was-validated');
        return;
    }
    
    // Mostrar spinner
    saveButton.disabled = true;
    saveSpinner.classList.remove('d-none');
    
    // Obter dados do formulário
    const id = document.getElementById('veiculoId').value;
    const marcaId = document.getElementById('marcaId').value;
    const modeloId = document.getElementById('modeloId').value;
    const ano = document.getElementById('ano').value;
    const placa = document.getElementById('placa').value;
    const cor = document.getElementById('cor').value;
    const quilometragem = document.getElementById('quilometragem').value;
    const precoFormatado = document.getElementById('preco').value;
    const custoAquisicaoFormatado = document.getElementById('custoAquisicao').value;
    const observacoes = document.getElementById('observacoes').value;
    
    // Validar campos obrigatórios
    if (!marcaId) {
        showError('Por favor, selecione uma marca.');
        saveButton.disabled = false;
        saveSpinner.classList.add('d-none');
        return;
    }
    
    if (!modeloId) {
        showError('Por favor, selecione um modelo.');
        saveButton.disabled = false;
        saveSpinner.classList.add('d-none');
        return;
    }
    
    // Converter valores formatados para números
    const preco = converterParaNumero(precoFormatado);
    const custoAquisicao = converterParaNumero(custoAquisicaoFormatado);
    
    // Preparar dados para envio
    const veiculoData = {
        marcaId,
        modeloId,
        ano,
        placa,
        cor,
        quilometragem,
        preco,
        custoAquisicao,
        observacoes
    };
    
    const token = auth.getToken();
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/veiculos/${id}` : '/api/veiculos';
    
    // Enviar requisição
    fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(veiculoData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao salvar veículo');
        }
        return response.json();
    })
    .then(() => {
        // Fechar modal e recarregar veículos
        veiculoModal.hide();
        loadVeiculos();
    })
    .catch(error => {
        console.error('Erro ao salvar veículo:', error);
        showError('Não foi possível salvar o veículo. Por favor, tente novamente mais tarde.');
    })
    .finally(() => {
        // Esconder spinner
        saveButton.disabled = false;
        saveSpinner.classList.add('d-none');
    });
}

// Função para excluir veículo
function deleteVeiculo() {
    // Mostrar spinner
    confirmDeleteButton.disabled = true;
    deleteSpinner.classList.remove('d-none');
    
    // Obter ID do veículo a ser excluído
    const id = document.getElementById('deleteId').value;
    
    const token = auth.getToken();
    
    // Enviar requisição
    fetch(`/api/veiculos/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao excluir veículo');
        }
        return response.json();
    })
    .then(() => {
        // Fechar modal e recarregar veículos
        deleteModal.hide();
        loadVeiculos();
    })
    .catch(error => {
        console.error('Erro ao excluir veículo:', error);
        showError('Não foi possível excluir o veículo. Por favor, tente novamente mais tarde.');
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
