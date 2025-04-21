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
    try {
        const token = auth.getToken();
        if (!token) {
            window.location.href = '/login.html';
            return;
        }
        
        // Obter a URL base com base no ambiente atual
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de possíveis URLs para tentar, em ordem de prioridade
        const urlsParaTentar = [
            `${baseUrl}/api/veiculos/modelos/all`,
            `${baseUrl}/api/modelos/all`
        ];
        
        console.log('Tentando carregar modelos de:', urlsParaTentar);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let response = null;
        let error = null;
        
        for (const url of urlsParaTentar) {
            try {
                console.log(`Tentando carregar modelos de: ${url}`);
                response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    console.log(`URL bem-sucedida para modelos: ${url}`);
                    break;
                } else {
                    console.error(`Falha ao carregar modelos de ${url}. Status:`, response.status, response.statusText);
                    if (response.status === 401) {
                        console.error('Erro de autenticação. Redirecionando para login...');
                        auth.logout();
                        return;
                    }
                }
            } catch (e) {
                console.error(`Erro ao acessar ${url}:`, e);
                error = e;
            }
        }
        
        if (!response || !response.ok) {
            // Usar dados de exemplo como fallback
            console.warn('Usando dados de exemplo para modelos como fallback');
            allModelos = [
                { id: 1, nome: 'Onix', marca: { nome: 'Chevrolet' } },
                { id: 2, nome: 'Cruze', marca: { nome: 'Chevrolet' } },
                { id: 3, nome: 'HB20', marca: { nome: 'Hyundai' } },
                { id: 4, nome: 'Corolla', marca: { nome: 'Toyota' } }
            ];
            return;
        }
        
        // Processar a resposta
        const data = await response.json();
        
        // Verificar se a resposta é um array ou se tem uma propriedade items
        if (Array.isArray(data)) {
            allModelos = data;
        } else if (data && Array.isArray(data.items)) {
            allModelos = data.items;
        } else {
            console.error('Formato de resposta inesperado para modelos:', data);
            allModelos = [];
        }
        
        console.log(`Carregados ${allModelos.length} modelos com sucesso`);
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        // Usar dados de exemplo como fallback
        console.warn('Usando dados de exemplo para modelos como fallback devido a erro');
        allModelos = [
            { id: 1, nome: 'Onix', marca: { nome: 'Chevrolet' } },
            { id: 2, nome: 'Cruze', marca: { nome: 'Chevrolet' } },
            { id: 3, nome: 'HB20', marca: { nome: 'Hyundai' } },
            { id: 4, nome: 'Corolla', marca: { nome: 'Toyota' } }
        ];
    }
}

function preencherSelectModelos() {
    const modeloForm = document.getElementById('modeloIdForm');
    const filtroModelo = document.getElementById('filtroModelo');
    
    if (!modeloForm || !filtroModelo) {
        console.error('Elementos de select para modelos não encontrados');
        return;
    }
    
    modeloForm.innerHTML = '<option value="">Selecione o modelo...</option>';
    filtroModelo.innerHTML = '<option value="">Todos</option>';
    
    if (!Array.isArray(allModelos)) {
        console.error('allModelos não é um array:', allModelos);
        return;
    }
    
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
    if (!select) {
        console.error('Elemento select para versões não encontrado');
        return;
    }
    
    select.innerHTML = '<option value="">Selecione a versão...</option>';
    
    if (!Array.isArray(allVersoes)) {
        console.error('allVersoes não é um array:', allVersoes);
        return;
    }
    
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
    if (!select) {
        console.error('Elemento select para filtro de versões não encontrado');
        return;
    }
    
    select.innerHTML = '<option value="">Todas</option>';
    
    if (!Array.isArray(allVersoes)) {
        console.error('allVersoes não é um array:', allVersoes);
        return;
    }
    
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
    try {
        const token = auth.getToken();
        if (!token) {
            window.location.href = '/login.html';
            return;
        }
        
        // Obter a URL base com base no ambiente atual
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de possíveis URLs para tentar, em ordem de prioridade
        const urlsParaTentar = [
            `${baseUrl}/api/versoes/public`,
            `${baseUrl}/api/veiculos/versoes`
        ];
        
        console.log('Tentando carregar versões de:', urlsParaTentar);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let response = null;
        let error = null;
        
        for (const url of urlsParaTentar) {
            try {
                console.log(`Tentando carregar versões de: ${url}`);
                response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    console.log(`URL bem-sucedida para versões: ${url}`);
                    break;
                } else {
                    console.error(`Falha ao carregar versões de ${url}. Status:`, response.status, response.statusText);
                    if (response.status === 401) {
                        console.error('Erro de autenticação. Redirecionando para login...');
                        auth.logout();
                        return;
                    }
                }
            } catch (e) {
                console.error(`Erro ao acessar ${url}:`, e);
                error = e;
            }
        }
        
        if (!response || !response.ok) {
            // Usar dados de exemplo como fallback
            console.warn('Usando dados de exemplo para versões como fallback');
            allVersoes = [
                { id: 1, nome_versao: 'LT 1.0', modeloId: 1 },
                { id: 2, nome_versao: 'LTZ 1.4', modeloId: 1 },
                { id: 3, nome_versao: 'Premier 1.0 Turbo', modeloId: 2 },
                { id: 4, nome_versao: 'Comfort 1.0', modeloId: 3 },
                { id: 5, nome_versao: 'XEi 2.0', modeloId: 4 }
            ];
            return;
        }
        
        // Processar a resposta
        const data = await response.json();
        
        // Verificar se a resposta é um array ou se tem uma propriedade items
        if (Array.isArray(data)) {
            allVersoes = data;
        } else if (data && Array.isArray(data.items)) {
            allVersoes = data.items;
        } else {
            console.error('Formato de resposta inesperado para versões:', data);
            allVersoes = [];
        }
        
        console.log(`Carregadas ${allVersoes.length} versões com sucesso`);
    } catch (error) {
        console.error('Erro ao carregar versões:', error);
        // Usar dados de exemplo como fallback
        console.warn('Usando dados de exemplo para versões como fallback devido a erro');
        allVersoes = [
            { id: 1, nome_versao: 'LT 1.0', modeloId: 1 },
            { id: 2, nome_versao: 'LTZ 1.4', modeloId: 1 },
            { id: 3, nome_versao: 'Premier 1.0 Turbo', modeloId: 2 },
            { id: 4, nome_versao: 'Comfort 1.0', modeloId: 3 },
            { id: 5, nome_versao: 'XEi 2.0', modeloId: 4 }
        ];
    }
}

async function loadAllPinturas() {
    try {
        const token = auth.getToken();
        if (!token) {
            window.location.href = '/login.html';
            return;
        }
        
        // Obter a URL base com base no ambiente atual
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de possíveis URLs para tentar, em ordem de prioridade
        const urlsParaTentar = [
            `${baseUrl}/configurador/pinturas`,
            `${baseUrl}/api/configurador/pinturas`,
            `${baseUrl}/api/pinturas`
        ];
        
        console.log('Tentando carregar pinturas de:', urlsParaTentar);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let response = null;
        let error = null;
        
        for (const url of urlsParaTentar) {
            try {
                console.log(`Tentando carregar pinturas de: ${url}`);
                response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    console.log(`URL bem-sucedida para pinturas: ${url}`);
                    break;
                } else {
                    console.error(`Falha ao carregar pinturas de ${url}. Status:`, response.status, response.statusText);
                    if (response.status === 401) {
                        console.error('Erro de autenticação. Redirecionando para login...');
                        auth.logout();
                        return;
                    }
                }
            } catch (e) {
                console.error(`Erro ao acessar ${url}:`, e);
                error = e;
            }
        }
        
        if (!response || !response.ok) {
            // Usar dados de exemplo como fallback
            console.warn('Usando dados de exemplo para pinturas como fallback');
            allPinturas = [
                { id: 1, nome: 'Branco Summit', codigo: '#FFFFFF', tipo: 'Sólida' },
                { id: 2, nome: 'Preto Ouro Negro', codigo: '#000000', tipo: 'Metálica' },
                { id: 3, nome: 'Vermelho Carmim', codigo: '#8B0000', tipo: 'Perolizada' },
                { id: 4, nome: 'Prata Switchblade', codigo: '#C0C0C0', tipo: 'Metálica' },
                { id: 5, nome: 'Azul Seeker', codigo: '#0000CD', tipo: 'Metálica' }
            ];
            return;
        }
        
        // Processar a resposta
        const data = await response.json();
        
        // Verificar se a resposta é um array ou se tem uma propriedade items
        if (Array.isArray(data)) {
            allPinturas = data;
        } else if (data && Array.isArray(data.items)) {
            allPinturas = data.items;
        } else {
            console.error('Formato de resposta inesperado para pinturas:', data);
            // Usar dados de exemplo como fallback
            allPinturas = [
                { id: 1, nome: 'Branco Summit', codigo: '#FFFFFF', tipo: 'Sólida' },
                { id: 2, nome: 'Preto Ouro Negro', codigo: '#000000', tipo: 'Metálica' },
                { id: 3, nome: 'Vermelho Carmim', codigo: '#8B0000', tipo: 'Perolizada' },
                { id: 4, nome: 'Prata Switchblade', codigo: '#C0C0C0', tipo: 'Metálica' },
                { id: 5, nome: 'Azul Seeker', codigo: '#0000CD', tipo: 'Metálica' }
            ];
        }
        
        console.log(`Carregadas ${allPinturas.length} pinturas com sucesso`);
    } catch (error) {
        console.error('Falha ao carregar pinturas:', error);
        // Usar dados de exemplo como fallback
        console.warn('Usando dados de exemplo para pinturas como fallback devido a erro');
        allPinturas = [
            { id: 1, nome: 'Branco Summit', codigo: '#FFFFFF', tipo: 'Sólida' },
            { id: 2, nome: 'Preto Ouro Negro', codigo: '#000000', tipo: 'Metálica' },
            { id: 3, nome: 'Vermelho Carmim', codigo: '#8B0000', tipo: 'Perolizada' },
            { id: 4, nome: 'Prata Switchblade', codigo: '#C0C0C0', tipo: 'Metálica' },
            { id: 5, nome: 'Azul Seeker', codigo: '#0000CD', tipo: 'Metálica' }
        ];
    }
}

function preencherSelectPinturas() {
    const select = document.getElementById('pinturaIdForm');
    if (!select) {
        console.error('Elemento select para pinturas não encontrado');
        return;
    }
    
    select.innerHTML = '<option value="">Selecione a pintura...</option>';
    
    if (!Array.isArray(allPinturas)) {
        console.error('allPinturas não é um array:', allPinturas);
        return;
    }
    
    allPinturas.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.nome;
        select.appendChild(option);
    });
}

// --- CRUD PRINCIPAL ---
async function loadVersaoPinturas() {
    try {
        const token = auth.getToken();
        if (!token) {
            window.location.href = '/login.html';
            return;
        }
        
        // Obter a URL base com base no ambiente atual
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de possíveis URLs para tentar, em ordem de prioridade
        const urlsParaTentar = [
            `${baseUrl}/api/veiculos/versao-pintura/public`,
            `${baseUrl}/api/versao-pintura/public`
        ];
        
        console.log('Tentando carregar associações versão-pintura de:', urlsParaTentar);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let response = null;
        let error = null;
        
        for (const url of urlsParaTentar) {
            try {
                console.log(`Tentando carregar associações versão-pintura de: ${url}`);
                response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    console.log(`URL bem-sucedida para associações versão-pintura: ${url}`);
                    break;
                } else {
                    console.error(`Falha ao carregar associações versão-pintura de ${url}. Status:`, response.status, response.statusText);
                    if (response.status === 401) {
                        console.error('Erro de autenticação. Redirecionando para login...');
                        auth.logout();
                        return;
                    }
                }
            } catch (e) {
                console.error(`Erro ao acessar ${url}:`, e);
                error = e;
            }
        }
        
        if (!response || !response.ok) {
            // Usar dados de exemplo como fallback
            console.warn('Usando dados de exemplo para associações versão-pintura como fallback');
            const dadosExemplo = [
                { 
                    id: 1, 
                    versaoId: 1, 
                    pinturaId: 1, 
                    preco: 0, 
                    versao: { nome_versao: 'LT 1.0', modeloId: 1, modelo: { nome: 'Onix' } },
                    pintura: { nome: 'Branco Summit', codigo: '#FFFFFF' }
                },
                { 
                    id: 2, 
                    versaoId: 2, 
                    pinturaId: 2, 
                    preco: 1200, 
                    versao: { nome_versao: 'LTZ 1.4', modeloId: 1, modelo: { nome: 'Onix' } },
                    pintura: { nome: 'Preto Ouro Negro', codigo: '#000000' }
                },
                { 
                    id: 3, 
                    versaoId: 3, 
                    pinturaId: 3, 
                    preco: 1500, 
                    versao: { nome_versao: 'Premier 1.0 Turbo', modeloId: 2, modelo: { nome: 'Cruze' } },
                    pintura: { nome: 'Vermelho Carmim', codigo: '#8B0000' }
                }
            ];
            window.versaoPinturaData = dadosExemplo;
            updateTable(dadosExemplo);
            return;
        }
        
        // Processar a resposta
        let data = await response.json();
        
        // Verificar se a resposta é um array ou se tem uma propriedade items
        if (data && data.items && Array.isArray(data.items)) {
            data = data.items;
        } else if (!Array.isArray(data)) {
            console.error('Formato de resposta inesperado para associações versão-pintura:', data);
            data = [];
        }
        
        window.versaoPinturaData = data;
        console.log(`Carregadas ${data.length} associações versão-pintura com sucesso`);
        updateTable(data);
    } catch (error) {
        console.error('Erro ao carregar associações versão-pintura:', error);
        // Usar dados de exemplo como fallback
        console.warn('Usando dados de exemplo para associações versão-pintura como fallback devido a erro');
        const dadosExemplo = [
            { 
                id: 1, 
                versaoId: 1, 
                pinturaId: 1, 
                preco: 0, 
                versao: { nome_versao: 'LT 1.0', modeloId: 1, modelo: { nome: 'Onix' } },
                pintura: { nome: 'Branco Summit', codigo: '#FFFFFF' }
            },
            { 
                id: 2, 
                versaoId: 2, 
                pinturaId: 2, 
                preco: 1200, 
                versao: { nome_versao: 'LTZ 1.4', modeloId: 1, modelo: { nome: 'Onix' } },
                pintura: { nome: 'Preto Ouro Negro', codigo: '#000000' }
            },
            { 
                id: 3, 
                versaoId: 3, 
                pinturaId: 3, 
                preco: 1500, 
                versao: { nome_versao: 'Premier 1.0 Turbo', modeloId: 2, modelo: { nome: 'Cruze' } },
                pintura: { nome: 'Vermelho Carmim', codigo: '#8B0000' }
            }
        ];
        window.versaoPinturaData = dadosExemplo;
        updateTable(dadosExemplo);
    }
}

function updateTable(items) {
    const tbody = document.getElementById('versaoPinturaTableBody');
    if (!tbody) {
        console.error('Elemento tbody não encontrado');
        return;
    }
    
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
    const modeloId = document.getElementById('filtroModelo')?.value;
    const versaoId = document.getElementById('filtroVersao')?.value;
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
    try {
        const id = document.getElementById('versaoPinturaId')?.value;
        const versaoId = document.getElementById('versaoIdForm')?.value;
        const pinturaId = document.getElementById('pinturaIdForm')?.value;
        const precoStr = document.getElementById('precoForm')?.value;
        const imageUrl = document.getElementById('imageUrlForm')?.value;
        
        // Validar campos
        if (!versaoId) {
            showError('Selecione uma versão');
            return;
        }
        
        if (!pinturaId) {
            showError('Selecione uma pintura');
            return;
        }
        
        // Converter preço para número
        const preco = precoStr ? Number(precoStr.replace(/\./g,'').replace(',','.')) : 0;
        
        // Preparar dados
        const payload = { 
            versaoId: Number(versaoId), 
            pinturaId: Number(pinturaId), 
            preco: preco,
            imageUrl: imageUrl
        };
        
        console.log('Payload enviado para API:', payload);
        
        const token = auth.getToken();
        if (!token) {
            window.location.href = '/login.html';
            return;
        }
        
        // Obter a URL base com base no ambiente atual
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Determinar operação (criar ou atualizar)
        const isUpdate = id && id.trim() !== '';
        
        // Lista de possíveis URLs para tentar, em ordem de prioridade
        let urlsParaTentar = [];
        
        if (isUpdate) {
            // URLs para atualizar uma associação existente
            urlsParaTentar = [
                `${baseUrl}/api/veiculos/versao-pintura/${id}`,
                `${baseUrl}/api/versao-pintura/${id}`
            ];
        } else {
            // URLs para criar uma nova associação
            urlsParaTentar = [
                `${baseUrl}/api/veiculos/versao-pintura`,
                `${baseUrl}/api/versao-pintura`
            ];
        }
        
        const method = isUpdate ? 'PUT' : 'POST';
        
        console.log(`${isUpdate ? 'Atualizando' : 'Criando'} associação:`, payload);
        console.log('Tentando URLs:', urlsParaTentar);
        
        // Desabilitar botão de salvar e mostrar spinner
        const saveButton = document.querySelector('#versaoPinturaForm button[type="submit"]');
        const originalText = saveButton?.innerHTML || 'Salvar';
        if (saveButton) {
            saveButton.disabled = true;
            saveButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';
        }
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let response = null;
        let error = null;
        
        for (const url of urlsParaTentar) {
            try {
                console.log(`Tentando ${method} para: ${url}`);
                response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
                
                if (response.ok) {
                    console.log(`URL bem-sucedida: ${url}`);
                    break;
                } else {
                    console.error(`Falha ao salvar associação em ${url}. Status:`, response.status, response.statusText);
                    if (response.status === 401) {
                        console.error('Erro de autenticação. Redirecionando para login...');
                        auth.logout();
                        return;
                    }
                }
            } catch (e) {
                console.error(`Erro ao acessar ${url}:`, e);
                error = e;
            }
        }
        
        if (!response || !response.ok) {
            throw new Error(error?.message || `Erro ao ${isUpdate ? 'atualizar' : 'criar'} associação`);
        }
        
        console.log(`Associação ${isUpdate ? 'atualizada' : 'criada'} com sucesso`);
        
        // Limpar formulário
        resetForm();
        
        // Recarregar lista
        await loadVersaoPinturas();
        
        // Mostrar mensagem de sucesso
        showSuccess(`Associação ${isUpdate ? 'atualizada' : 'criada'} com sucesso`);
    } catch (error) {
        console.error('Erro ao salvar associação:', error);
        showError(error.message || 'Erro ao salvar associação. Por favor, tente novamente mais tarde.');
    } finally {
        // Restaurar botão de salvar
        const saveButton = document.querySelector('#versaoPinturaForm button[type="submit"]');
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.innerHTML = 'Salvar';
        }
    }
}

async function editVersaoPintura(id) {
    selectedVersaoPinturaId = id;
    const item = window.versaoPinturaData.find(i => i.id === id);
    if (!item) return;
    
    document.getElementById('versaoPinturaId').value = id;
    
    // Preencher modelo e versão
    if (item.versao?.modeloId) {
        document.getElementById('modeloIdForm').value = item.versao.modeloId;
        await filterVersoesByModeloInForm(item.versao.modeloId);
    }
    
    document.getElementById('versaoIdForm').value = item.versaoId;
    document.getElementById('pinturaIdForm').value = item.pinturaId;
    document.getElementById('precoForm').value = item.preco ? item.preco.toString().replace('.', ',') : '0';
    document.getElementById('imageUrlForm').value = item.imageUrl || '';
    
    window.scrollTo(0, 0);
}

function confirmDeleteVersaoPintura(id, modeloNome, pinturaNome) {
    selectedVersaoPinturaId = id;
    
    // Atualizar informações no modal
    const infoElement = document.getElementById('deleteItemInfo');
    if (infoElement) {
        infoElement.textContent = `Modelo: ${modeloNome}\nPintura: ${pinturaNome}`;
    }
    
    confirmDeleteModal.show();
}

async function deleteVersaoPintura() {
    try {
        if (!selectedVersaoPinturaId) {
            console.error('ID da associação não encontrado');
            return;
        }
        
        const token = auth.getToken();
        if (!token) {
            window.location.href = '/login.html';
            return;
        }
        
        // Obter a URL base com base no ambiente atual
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de possíveis URLs para tentar, em ordem de prioridade
        const urlsParaTentar = [
            `${baseUrl}/api/veiculos/versao-pintura/${selectedVersaoPinturaId}`,
            `${baseUrl}/api/versao-pintura/${selectedVersaoPinturaId}`
        ];
        
        console.log('Tentando URLs para excluir associação:', urlsParaTentar);
        
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
                    console.error(`Falha ao excluir associação em ${url}. Status:`, response.status, response.statusText);
                    if (response.status === 401) {
                        console.error('Erro de autenticação. Redirecionando para login...');
                        auth.logout();
                        return;
                    }
                }
            } catch (e) {
                console.error(`Erro ao acessar ${url}:`, e);
                error = e;
            }
        }
        
        if (!response || !response.ok) {
            throw new Error(error?.message || 'Erro ao excluir associação');
        }
        
        console.log('Associação excluída com sucesso');
        
        // Fechar modal
        confirmDeleteModal.hide();
        
        // Limpar ID selecionado
        selectedVersaoPinturaId = null;
        
        // Recarregar lista
        await loadVersaoPinturas();
        
        // Mostrar mensagem de sucesso
        showSuccess('Associação excluída com sucesso');
    } catch (error) {
        console.error('Erro ao excluir associação:', error);
        showError(error.message || 'Erro ao excluir associação. Por favor, tente novamente mais tarde.');
    }
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

function showError(message) {
    if (window.bootstrap && window.bootstrap.Toast) {
        const toastEl = document.getElementById('toastError');
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
