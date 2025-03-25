// Variáveis globais
let auth;
let currentPage = 1;
let totalPages = 1;
let isEditing = false;

// Função para inicializar a aplicação
function initApp() {
    console.log('Inicializando aplicação de Venda Direta...');
    
    // Inicializar auth
    auth = new Auth();
    console.log('Auth inicializado');
    
    auth.checkAuthAndRedirect();
    console.log('Verificação de autenticação concluída');

    const user = auth.getUser();
    console.log('Usuário atual:', user);
    
    // Mostrar/ocultar itens do menu baseado no papel do usuário
    if (user && user.role === 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = '';
        });
        console.log('Elementos de admin exibidos');
    }

    // Carregar marcas para o select
    loadMarcas();
    
    // Carregar lista de vendas diretas
    loadVendasDiretas(currentPage);
    
    // Configurar listeners
    setupEventListeners();
}

// Função para configurar event listeners
function setupEventListeners() {
    // Form de venda direta
    const vendaDiretaForm = document.getElementById('vendaDiretaForm');
    if (vendaDiretaForm) {
        vendaDiretaForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Botão de cancelar
    const cancelButton = document.getElementById('cancelButton');
    if (cancelButton) {
        cancelButton.addEventListener('click', resetForm);
    }
    
    // Botões de paginação
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    
    if (prevPageButton) {
        prevPageButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                loadVendasDiretas(currentPage);
            }
        });
    }
    
    if (nextPageButton) {
        nextPageButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                loadVendasDiretas(currentPage);
            }
        });
    }
    
    // Botão de logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            auth.logout();
        });
    }
}

// Função para carregar marcas no select
async function loadMarcas() {
    try {
        const response = await fetch('/api/veiculos/marcas/public', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Falha ao carregar marcas: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        // O endpoint retorna diretamente um array de marcas, não um objeto com 'items'
        const marcas = Array.isArray(data) ? data : [];
        
        const marcaSelect = document.getElementById('marcaId');
        if (marcaSelect) {
            // Manter a opção padrão
            marcaSelect.innerHTML = '<option value="">Selecione uma marca</option>';
            
            // Adicionar as marcas
            marcas.forEach(marca => {
                const option = document.createElement('option');
                option.value = marca.id;
                option.textContent = marca.nome;
                marcaSelect.appendChild(option);
            });
        }
        
    } catch (error) {
        console.error('Erro ao carregar marcas:', error);
        alert('Erro ao carregar marcas. Por favor, tente novamente.');
    }
}

// Função para carregar vendas diretas
async function loadVendasDiretas(page = 1, limit = 10) {
    try {
        const token = auth.getToken();
        
        const response = await fetch(`/api/venda-direta?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Falha ao carregar vendas diretas: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const vendasDiretas = data.items || [];
        
        // Atualizar informações de paginação
        currentPage = data.page || 1;
        totalPages = data.totalPages || 1;
        
        document.getElementById('currentPage').textContent = currentPage;
        document.getElementById('currentItems').textContent = vendasDiretas.length;
        document.getElementById('totalItems').textContent = data.total || 0;
        
        // Habilitar/desabilitar botões de paginação
        document.getElementById('prevPage').disabled = currentPage <= 1;
        document.getElementById('nextPage').disabled = currentPage >= totalPages;
        
        // Renderizar tabela
        renderVendasDiretasTable(vendasDiretas);
        
    } catch (error) {
        console.error('Erro ao carregar vendas diretas:', error);
        alert('Erro ao carregar vendas diretas. Por favor, tente novamente.');
    }
}

// Função para renderizar a tabela de vendas diretas
function renderVendasDiretasTable(vendasDiretas) {
    const tableBody = document.getElementById('vendaDiretaTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (vendasDiretas.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="6" class="text-center">Nenhuma venda direta encontrada</td>';
        tableBody.appendChild(tr);
        return;
    }
    
    vendasDiretas.forEach(vendaDireta => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${vendaDireta.id}</td>
            <td>${vendaDireta.nome}</td>
            <td>${vendaDireta.percentual}%</td>
            <td>${vendaDireta.marca ? vendaDireta.marca.nome : 'N/A'}</td>
            <td>
                <span class="badge ${vendaDireta.status === 'ativo' ? 'bg-success' : 'bg-danger'}">
                    ${vendaDireta.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary edit-button" data-id="${vendaDireta.id}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm ${vendaDireta.status === 'ativo' ? 'btn-danger' : 'btn-success'} toggle-status-button" data-id="${vendaDireta.id}" data-status="${vendaDireta.status}">
                    <i class="bi ${vendaDireta.status === 'ativo' ? 'bi-x-circle' : 'bi-check-circle'}"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
    
    // Adicionar event listeners aos botões
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            loadVendaDiretaForEdit(id);
        });
    });
    
    document.querySelectorAll('.toggle-status-button').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const currentStatus = button.getAttribute('data-status');
            const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
            updateVendaDiretaStatus(id, newStatus);
        });
    });
}

// Função para carregar uma venda direta para edição
async function loadVendaDiretaForEdit(id) {
    try {
        const token = auth.getToken();
        
        const response = await fetch(`/api/venda-direta/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Falha ao carregar venda direta: ${response.status} ${response.statusText}`);
        }
        
        const vendaDireta = await response.json();
        
        // Preencher o formulário
        document.getElementById('vendaDiretaId').value = vendaDireta.id;
        document.getElementById('nome').value = vendaDireta.nome;
        document.getElementById('percentual').value = vendaDireta.percentual;
        document.getElementById('marcaId').value = vendaDireta.marcaId;
        
        // Atualizar o título do formulário
        document.getElementById('formTitle').textContent = 'Editar Venda Direta';
        
        // Marcar que estamos editando
        isEditing = true;
        
        // Rolar para o formulário
        document.getElementById('vendaDiretaForm').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Erro ao carregar venda direta para edição:', error);
        alert('Erro ao carregar venda direta para edição. Por favor, tente novamente.');
    }
}

// Função para atualizar o status de uma venda direta
async function updateVendaDiretaStatus(id, newStatus) {
    try {
        const token = auth.getToken();
        
        const response = await fetch(`/api/venda-direta/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) {
            throw new Error(`Falha ao atualizar status: ${response.status} ${response.statusText}`);
        }
        
        // Recarregar a lista
        loadVendasDiretas(currentPage);
        
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        alert('Erro ao atualizar status. Por favor, tente novamente.');
    }
}

// Função para lidar com o envio do formulário
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const vendaDiretaId = document.getElementById('vendaDiretaId').value;
    const nome = document.getElementById('nome').value;
    const percentual = parseFloat(document.getElementById('percentual').value);
    const marcaId = parseInt(document.getElementById('marcaId').value);
    
    const vendaDiretaData = {
        nome,
        percentual,
        marcaId
    };
    
    try {
        const token = auth.getToken();
        
        let url = '/api/venda-direta';
        let method = 'POST';
        
        if (isEditing) {
            url = `${url}/${vendaDiretaId}`;
            method = 'PUT';
        }
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(vendaDiretaData)
        });
        
        if (!response.ok) {
            throw new Error(`Falha ao ${isEditing ? 'atualizar' : 'criar'} venda direta: ${response.status} ${response.statusText}`);
        }
        
        // Resetar o formulário
        resetForm();
        
        // Recarregar a lista
        loadVendasDiretas(currentPage);
        
        alert(`Venda direta ${isEditing ? 'atualizada' : 'criada'} com sucesso!`);
        
    } catch (error) {
        console.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} venda direta:`, error);
        alert(`Erro ao ${isEditing ? 'atualizar' : 'criar'} venda direta. Por favor, tente novamente.`);
    }
}

// Função para resetar o formulário
function resetForm() {
    document.getElementById('vendaDiretaForm').reset();
    document.getElementById('vendaDiretaId').value = '';
    document.getElementById('formTitle').textContent = 'Cadastrar Venda Direta';
    isEditing = false;
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initApp);
