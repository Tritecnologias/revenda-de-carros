// --- VARIÁVEIS GLOBAIS E AUTENTICAÇÃO ---
let auth;
let currentPage = 1;
let totalPages = 1;
let itemsPerPage = 10;
let selectedVersaoPinturaId = null;
let confirmDeleteModal;
let allModelos = [];
let allVersoes = [];
let allPinturas = [];

// --- INICIALIZAÇÃO DA APLICAÇÃO ---
async function initApp() {
    auth = new Auth();
    auth.checkAuthAndRedirect();
    const user = auth.getUser();
    if (document.getElementById('userInfo')) {
        document.getElementById('userInfo').textContent = `${user.nome} (${user.role})`;
    }
    if (document.getElementById('logoutBtn')) {
        document.getElementById('logoutBtn').addEventListener('click', () => auth.logout());
    }
    confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    await loadAllModelos();
    await loadAllVersoes();
    await loadAllPinturas();
    preencherSelectModelos();
    preencherSelectPinturas();
    loadVersaoPinturas();
    setupFormEvents();
    setupFilterEvents();
}

// --- FORM EVENTS ---
function setupFormEvents() {
    document.getElementById('versaoPinturaForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveVersaoPintura();
    });
    document.getElementById('limparBtn').addEventListener('click', resetForm);
    document.getElementById('confirmDeleteBtn').addEventListener('click', deleteVersaoPintura);
    document.getElementById('modeloIdForm').addEventListener('change', function() {
        const modeloId = this.value;
        filterVersoesByModeloInForm(modeloId);
        document.getElementById('versaoIdForm').value = '';
    });
}

function setupFilterEvents() {
    document.getElementById('filtroModelo').addEventListener('change', function() {
        const modeloId = this.value;
        filterVersoesByModeloInFiltro(modeloId);
        document.getElementById('filtroVersao').value = '';
        filterTable();
    });
    document.getElementById('filtroVersao').addEventListener('change', filterTable);
}

// --- CARREGAMENTO DE DADOS ---
async function loadAllModelos() {
    const token = auth.getToken();
    const url = `${config.apiBaseUrl}/api/veiculos/modelos/all`;
    const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    allModelos = await response.json();
}

function preencherSelectModelos() {
    const modeloForm = document.getElementById('modeloIdForm');
    const filtroModelo = document.getElementById('filtroModelo');
    modeloForm.innerHTML = '<option value="">Selecione o modelo...</option>';
    filtroModelo.innerHTML = '<option value="">Todos</option>';
    allModelos.forEach(modelo => {
        const option1 = document.createElement('option');
        option1.value = modelo.id;
        option1.textContent = `${modelo.marca?.nome || 'Sem marca'} - ${modelo.nome}`;
        modeloForm.appendChild(option1);
        const option2 = document.createElement('option');
        option2.value = modelo.id;
        option2.textContent = `${modelo.marca?.nome || 'Sem marca'} - ${modelo.nome}`;
        filtroModelo.appendChild(option2);
    });
}

function filterVersoesByModeloInForm(modeloId) {
    const select = document.getElementById('versaoIdForm');
    select.innerHTML = '<option value="">Selecione a versão...</option>';
    const versoes = allVersoes.filter(v => v.modeloId == modeloId);
    versoes.forEach(versao => {
        const option = document.createElement('option');
        option.value = versao.id;
        option.textContent = versao.nome_versao;
        select.appendChild(option);
    });
}

function filterVersoesByModeloInFiltro(modeloId) {
    const select = document.getElementById('filtroVersao');
    select.innerHTML = '<option value="">Todas</option>';
    const versoes = allVersoes.filter(v => v.modeloId == modeloId);
    versoes.forEach(versao => {
        const option = document.createElement('option');
        option.value = versao.id;
        option.textContent = versao.nome_versao;
        select.appendChild(option);
    });
    filterTable();
}

async function loadAllVersoes() {
    const token = auth.getToken();
    const url = `${config.apiBaseUrl}/api/versoes/public`;
    const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    allVersoes = await response.json();
}

async function loadAllPinturas() {
    const token = auth.getToken();
    const url = `${config.apiBaseUrl}/configurador/pinturas`;
    try {
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!response.ok) {
            throw new Error(`Erro ao buscar pinturas: ${response.status} ${response.statusText}`);
        }
        allPinturas = await response.json();
        if (!Array.isArray(allPinturas)) {
            throw new Error('Resposta de pinturas não é um array!');
        }
        preencherSelectPinturas();
    } catch (error) {
        allPinturas = [];
        console.error('Falha ao carregar pinturas:', error);
        // Opcional: exibir mensagem de erro para o usuário
        const select = document.getElementById('pinturaIdForm');
        if (select) {
            select.innerHTML = '<option value="">Erro ao carregar pinturas</option>';
        }
    }
}

function preencherSelectPinturas() {
    const select = document.getElementById('pinturaIdForm');
    select.innerHTML = '<option value="">Selecione a pintura...</option>';
    allPinturas.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.nome;
        select.appendChild(option);
    });
}

// --- CRUD PRINCIPAL ---
async function loadVersaoPinturas() {
    const token = auth.getToken();
    const url = `${config.apiBaseUrl}/api/veiculos/versao-pintura/public`;
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    let data = await res.json();
    // Se vier um objeto com .items, use o array interno
    if (data && data.items && Array.isArray(data.items)) {
        data = data.items;
    }
    window.versaoPinturaData = data;
    updateTable(data);
}

function updateTable(items) {
    const tbody = document.getElementById('versaoPinturaTableBody');
    tbody.innerHTML = '';
    if (!items || !items.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum registro encontrado</td></tr>';
        return;
    }
    items.forEach(item => {
        const modelo = item.versao?.modelo?.nome || '-';
        const versao = item.versao?.nome_versao || '-';
        const pintura = item.pintura?.nome || '-';
        const preco = item.preco !== undefined && item.preco !== null ? Number(item.preco).toLocaleString('pt-BR', {style:'currency',currency:'BRL'}) : '-';
        const imageUrl = item.imageUrl ? 
            `<a href="${item.imageUrl}" target="_blank" title="Ver imagem">
                <img src="${item.imageUrl}" alt="Miniatura" style="max-height: 40px; max-width: 60px;">
            </a>` : 
            '<span class="text-muted">Sem imagem</span>';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${modelo}</td>
            <td>${versao}</td>
            <td>${pintura}</td>
            <td>${preco}</td>
            <td>${imageUrl}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-primary me-1" onclick="editVersaoPintura(${item.id})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-danger" onclick="confirmDeleteVersaoPintura(${item.id}, '${modelo}', '${pintura}')"><i class="bi bi-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterTable() {
    const modeloId = document.getElementById('filtroModelo').value;
    const versaoId = document.getElementById('filtroVersao').value;
    let data = window.versaoPinturaData || [];
    if (!Array.isArray(data)) {
        console.error('Dados da tabela não são um array:', data);
        updateTable([]);
        return;
    }
    if (modeloId) {
        data = data.filter(item => item.versao?.modeloId == modeloId);
    }
    if (versaoId) {
        data = data.filter(item => item.versaoId == versaoId);
    }
    updateTable(data);
}

async function saveVersaoPintura() {
    const id = document.getElementById('versaoPinturaId').value;
    const versaoId = document.getElementById('versaoIdForm').value;
    const pinturaId = document.getElementById('pinturaIdForm').value;
    const preco = document.getElementById('precoForm').value.replace(/\./g,'').replace(',','.');
    const imageUrl = document.getElementById('imageUrlForm').value;
    const payload = { 
        versaoId: Number(versaoId), 
        pinturaId: Number(pinturaId), 
        preco: Number(preco),
        imageUrl: imageUrl
    };
    const token = auth.getToken();
    const url = id ? `${config.apiBaseUrl}/api/veiculos/versao-pintura/${id}` : `${config.apiBaseUrl}/api/veiculos/versao-pintura`;
    const method = id ? 'PUT' : 'POST';
    await fetch(url, {method, headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}, body:JSON.stringify(payload)});
    loadVersaoPinturas();
    resetForm();
    showSuccess('Associação salva com sucesso!');
}

async function editVersaoPintura(id) {
    selectedVersaoPinturaId = id;
    const item = window.versaoPinturaData.find(i => i.id === id);
    if (!item) return;
    document.getElementById('versaoPinturaId').value = id;
    const modeloId = item.versao?.modelo?.id;
    document.getElementById('modeloIdForm').value = modeloId || '';
    if (modeloId) {
        filterVersoesByModeloInForm(modeloId);
        document.getElementById('versaoIdForm').value = item.versaoId || '';
    }
    document.getElementById('pinturaIdForm').value = item.pinturaId || '';
    document.getElementById('precoForm').value = item.preco !== undefined ? Number(item.preco).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}).replace('.', ',') : '';
    document.getElementById('imageUrlForm').value = item.imageUrl || '';
    window.scrollTo(0, 0);
}

function confirmDeleteVersaoPintura(id, modeloNome, pinturaNome) {
    selectedVersaoPinturaId = id;
    confirmDeleteModal.show();
}

async function deleteVersaoPintura() {
    if (!selectedVersaoPinturaId) return;
    const token = auth.getToken();
    await fetch(`${config.apiBaseUrl}/api/veiculos/versao-pintura/${selectedVersaoPinturaId}`, {method:'DELETE', headers:{'Authorization':`Bearer ${token}`}});
    confirmDeleteModal.hide();
    loadVersaoPinturas();
    showSuccess('Associação excluída com sucesso!');
}

function resetForm() {
    document.getElementById('versaoPinturaId').value = '';
    document.getElementById('modeloIdForm').value = '';
    document.getElementById('versaoIdForm').innerHTML = '<option value="">Selecione a versão...</option>';
    document.getElementById('pinturaIdForm').value = '';
    document.getElementById('precoForm').value = '';
    document.getElementById('imageUrlForm').value = '';
    selectedVersaoPinturaId = null;
}

function showSuccess(message) {
    if (window.bootstrap && window.bootstrap.Toast) {
        const toastEl = document.getElementById('toastSuccess');
        if (toastEl) {
            toastEl.querySelector('.toast-body').textContent = message;
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        }
    } else {
        alert(message);
    }
}

document.addEventListener('DOMContentLoaded', initApp);
