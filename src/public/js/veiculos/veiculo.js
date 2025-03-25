// Inicialização da autenticação
const auth = new Auth();
let currentPage = 1;
const itemsPerPage = 10;
let totalItems = 0;
let marcas = [];
let modelos = [];

// Elementos do DOM
const veiculosTableBody = document.getElementById('veiculosTableBody');
const paginationControls = document.getElementById('paginationControls');
const veiculoForm = document.getElementById('veiculoForm');
const veiculoModal = new bootstrap.Modal(document.getElementById('veiculoModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const errorMessage = document.getElementById('errorMessage');
const saveButton = document.getElementById('saveButton');
const saveSpinner = document.getElementById('saveSpinner');
const confirmDeleteButton = document.getElementById('confirmDeleteButton');
const deleteSpinner = document.getElementById('deleteSpinner');
const marcaSelect = document.getElementById('marcaId');
const modeloSelect = document.getElementById('modeloId');

// Verificar autenticação e redirecionar se não estiver autenticado
document.addEventListener('DOMContentLoaded', async () => {
    auth.checkAuthAndRedirect();
    
    // Configurar botão de logout
    document.getElementById('logoutButton').addEventListener('click', () => {
        auth.logout();
    });
    
    // Carregar marcas para o select e depois os veículos
    try {
        await loadMarcasSelect();
        loadVeiculos();
    } catch (error) {
        console.error('Erro ao inicializar dados:', error);
        showError('Erro ao carregar dados iniciais. Por favor, recarregue a página.');
    }
    
    // Configurar eventos
    saveButton.addEventListener('click', saveVeiculo);
    confirmDeleteButton.addEventListener('click', deleteVeiculo);
    
    // Evento para carregar modelos quando a marca mudar
    marcaSelect.addEventListener('change', loadModelosByMarca);
    
    // Reset do formulário quando o modal é fechado
    document.getElementById('veiculoModal').addEventListener('hidden.bs.modal', () => {
        veiculoForm.reset();
        document.getElementById('veiculoId').value = '';
        document.getElementById('veiculoModalTitle').textContent = 'NOVO VEÍCULO';
        errorMessage.classList.add('d-none');
        veiculoForm.classList.remove('was-validated');
        
        // Limpar select de modelos
        while (modeloSelect.options.length > 1) {
            modeloSelect.remove(1);
        }
    });
    
    // Definir o ano atual como valor padrão
    document.getElementById('ano').value = new Date().getFullYear();
});

// Função para formatar preço em reais
function formatarPreco(preco) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(preco);
}

// Função para converter valores formatados para números
function converterParaNumero(valor) {
    return parseFloat(valor.replace('R$', '').replace('.', '').replace(',', '.'));
}

// Função para carregar marcas para o select
async function loadMarcasSelect() {
    try {
        const token = auth.getToken();
        const response = await fetch('/api/veiculos/marcas/public', {
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
    console.log('loadModelosByMarca chamada com marcaId:', marcaId);
    
    // Limpar select de modelos, mantendo a primeira opção
    while (modeloSelect.options.length > 1) {
        modeloSelect.remove(1);
    }
    
    if (!marcaId) {
        console.log('Nenhuma marca selecionada, retornando sem carregar modelos');
        return;
    }
    
    try {
        const token = auth.getToken();
        console.log('Fazendo requisição para:', `/api/veiculos/modelos/public/by-marca/${marcaId}`);
        const response = await fetch(`/api/veiculos/modelos/public/by-marca/${marcaId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            console.error('Resposta não ok:', response.status, response.statusText);
            throw new Error('Falha ao carregar modelos');
        }
        
        modelos = await response.json();
        console.log('Modelos recebidos:', modelos);
        
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

// Função para carregar veículos
async function loadVeiculos() {
    try {
        const token = auth.getToken();
        const response = await fetch(`/api/veiculos/public?page=${currentPage}&limit=${itemsPerPage}`, {
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
        
        console.log('Veículos carregados:', data.items);
        console.log('Marcas carregadas:', marcas);
        
        renderVeiculos(data.items);
        renderPagination();
    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
        showError('Não foi possível carregar os veículos. Por favor, tente novamente mais tarde.');
    }
}

// Função para renderizar veículos na tabela
function renderVeiculos(veiculos) {
    veiculosTableBody.innerHTML = '';
    
    if (veiculos.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="9" class="text-center">Nenhum veículo encontrado</td>';
        veiculosTableBody.appendChild(row);
        return;
    }
    
    veiculos.forEach(veiculo => {
        // Usar os objetos marca e modelo que vêm do backend, ou usar os arrays locais como fallback
        const marcaNome = veiculo.marca ? veiculo.marca.nome : (marcas.find(m => m.id === veiculo.marcaId)?.nome || 'Desconhecida');
        const modeloNome = veiculo.modelo ? veiculo.modelo.nome : (modelos.find(m => m.id === veiculo.modeloId)?.nome || 'Desconhecido');
        
        // Definir cores para situação
        let situacaoBadgeClass = 'bg-success';
        if (veiculo.situacao === 'reservado') {
            situacaoBadgeClass = 'bg-warning';
        } else if (veiculo.situacao === 'vendido') {
            situacaoBadgeClass = 'bg-info';
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${veiculo.id}</td>
            <td>${marcaNome}</td>
            <td>${modeloNome}</td>
            <td>${veiculo.versao}</td>
            <td>${veiculo.ano}</td>
            <td>${formatarPreco(veiculo.preco)}</td>
            <td>
                <span class="badge ${situacaoBadgeClass}">
                    ${veiculo.situacao.charAt(0).toUpperCase() + veiculo.situacao.slice(1)}
                </span>
            </td>
            <td>
                <span class="badge ${veiculo.status === 'ativo' ? 'bg-success' : 'bg-danger'}">
                    ${veiculo.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editVeiculo(${veiculo.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="showDeleteModal(${veiculo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        veiculosTableBody.appendChild(row);
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
    loadVeiculos();
}

// Função para editar veículo
async function editVeiculo(id) {
    try {
        const token = auth.getToken();
        const response = await fetch(`/api/veiculos/public/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar dados do veículo');
        }
        
        const veiculo = await response.json();
        
        document.getElementById('veiculoId').value = veiculo.id;
        document.getElementById('marcaId').value = veiculo.marcaId;
        
        // Carregar modelos da marca selecionada
        await loadModelosByMarca();
        
        document.getElementById('modeloId').value = veiculo.modeloId;
        document.getElementById('versao').value = veiculo.versao;
        document.getElementById('ano').value = veiculo.ano;
        
        // Formatar valores monetários
        document.getElementById('preco').value = new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(veiculo.preco || 0);
        
        document.getElementById('situacao').value = veiculo.situacao;
        document.getElementById('descricao').value = veiculo.descricao || '';
        document.getElementById('motor').value = veiculo.motor || '';
        document.getElementById('combustivel').value = veiculo.combustivel || '';
        document.getElementById('cambio').value = veiculo.cambio || '';
        document.getElementById('status').value = veiculo.status;
        
        // Campos de isenção com formatação monetária
        document.getElementById('defisicoicms').value = veiculo.defisicoicms ? new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(veiculo.defisicoicms) : '';
        
        document.getElementById('defisicoipi').value = veiculo.defisicoipi ? new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(veiculo.defisicoipi) : '';
        
        document.getElementById('taxicms').value = veiculo.taxicms ? new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(veiculo.taxicms) : '';
        
        document.getElementById('taxipi').value = veiculo.taxipi ? new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(veiculo.taxipi) : '';
        
        document.getElementById('veiculoModalTitle').textContent = 'EDITAR VEÍCULO';
        
        veiculoModal.show();
    } catch (error) {
        console.error('Erro ao carregar veículo:', error);
        showError('Não foi possível carregar os dados do veículo. Por favor, tente novamente mais tarde.');
    }
}

// Função para mostrar modal de exclusão
function showDeleteModal(id) {
    document.getElementById('deleteId').value = id;
    deleteModal.show();
}

// Função para salvar veículo
async function saveVeiculo() {
    if (!veiculoForm.checkValidity()) {
        veiculoForm.classList.add('was-validated');
        return;
    }
    
    const veiculoId = document.getElementById('veiculoId').value;
    const marcaId = document.getElementById('marcaId').value;
    const modeloId = document.getElementById('modeloId').value;
    const versao = document.getElementById('versao').value;
    const ano = document.getElementById('ano').value;
    
    // Converter valores formatados para números
    const preco = converterParaNumero(document.getElementById('preco').value);
    const situacao = document.getElementById('situacao').value;
    const descricao = document.getElementById('descricao').value;
    const motor = document.getElementById('motor').value;
    const combustivel = document.getElementById('combustivel').value;
    const cambio = document.getElementById('cambio').value;
    const status = document.getElementById('status').value;
    
    // Converter valores de isenção formatados para números
    const defisicoicms = converterParaNumero(document.getElementById('defisicoicms').value);
    const defisicoipi = converterParaNumero(document.getElementById('defisicoipi').value);
    const taxicms = converterParaNumero(document.getElementById('taxicms').value);
    const taxipi = converterParaNumero(document.getElementById('taxipi').value);
    
    const veiculoData = {
        marcaId,
        modeloId,
        versao,
        ano,
        preco,
        situacao,
        descricao: descricao || null,
        motor: motor || null,
        combustivel: combustivel || null,
        cambio: cambio || null,
        status,
        defisicoicms: defisicoicms || null,
        defisicoipi: defisicoipi || null,
        taxicms: taxicms || null,
        taxipi: taxipi || null
    };
    
    try {
        saveButton.disabled = true;
        saveSpinner.classList.remove('d-none');
        errorMessage.classList.add('d-none');
        
        const token = auth.getToken();
        
        // Verificar se o usuário está autenticado
        if (!token) {
            throw new Error('Você precisa estar autenticado para salvar veículos');
        }
        
        const url = veiculoId ? `/api/veiculos/${veiculoId}` : '/api/veiculos';
        const method = veiculoId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(veiculoData)
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                // Token expirado ou inválido
                auth.clearAuth();
                window.location.href = '/login.html?expired=true';
                return;
            }
            
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao salvar veículo');
        }
        
        veiculoModal.hide();
        loadVeiculos();
    } catch (error) {
        console.error('Erro ao salvar veículo:', error);
        errorMessage.textContent = error.message || 'Não foi possível salvar o veículo. Por favor, tente novamente mais tarde.';
        errorMessage.classList.remove('d-none');
    } finally {
        saveButton.disabled = false;
        saveSpinner.classList.add('d-none');
    }
}

// Função para excluir veículo
async function deleteVeiculo() {
    const veiculoId = document.getElementById('deleteId').value;
    
    try {
        confirmDeleteButton.disabled = true;
        deleteSpinner.classList.remove('d-none');
        
        const token = auth.getToken();
        const response = await fetch(`/api/veiculos/${veiculoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                // Token expirado ou inválido
                auth.clearAuth();
                window.location.href = '/login.html?expired=true';
                return;
            }
            
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao excluir veículo');
        }
        
        deleteModal.hide();
        loadVeiculos();
    } catch (error) {
        console.error('Erro ao excluir veículo:', error);
        alert('Não foi possível excluir o veículo. ' + (error.message || 'Por favor, tente novamente mais tarde.'));
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
