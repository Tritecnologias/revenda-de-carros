// Inicializar variáveis globais
let auth;
let currentPage = 1;
let totalPages = 1;
let itemsPerPage = 10;
let selectedVersaoOpcionalId = null;
let confirmDeleteModal;
let allVersoes = []; // Armazenar todas as versões para filtrar localmente
let allModelos = []; // Armazenar todos os modelos para o formulário

// Função para inicializar a aplicação
function initApp() {
    console.log('Inicializando aplicação de opcionais por versão...');
    
    // Inicializar auth
    auth = new Auth();
    console.log('Auth inicializado');
    
    // Verificar autenticação
    auth.checkAuthAndRedirect();
    console.log('Verificação de autenticação concluída');

    // Exibir informações do usuário
    const user = auth.getUser();
    document.getElementById('userInfo').textContent = `${user.nome} (${user.role})`;
    
    // Configurar evento de logout
    const logoutBtn = document.getElementById('logoutButton');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => auth.logout());
    }
    
    // Inicializar modal de confirmação de exclusão
    confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    
    // Carregar modelos e opcionais
    loadAllModelos();
    loadOpcionais();
    
    // Carregar lista de opcionais por versão
    loadVersaoOpcionais();
    
    // Configurar eventos dos formulários
    setupFormEvents();
    
    // Configurar eventos de filtro
    setupFilterEvents();
    setupFiltroModeloEvents();
    
    console.log('Aplicação inicializada com sucesso');
}

// Função para configurar eventos dos formulários
function setupFormEvents() {
    // Form submit
    document.getElementById('versaoOpcionalForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveVersaoOpcional();
    });
    
    // Botão limpar
    document.getElementById('limparBtn').addEventListener('click', resetForm);
    
    // Botão confirmar exclusão
    document.getElementById('confirmDeleteBtn').addEventListener('click', deleteVersaoOpcional);
    
    // Filtro de modelo no formulário
    document.getElementById('modeloIdForm').addEventListener('change', function() {
        const modeloId = this.value;
        filterVersoesByModeloInForm(modeloId);
    });
}

// Função para carregar todos os modelos
async function loadAllModelos() {
    try {
        console.log('Carregando todos os modelos...');
        
        const token = auth.getToken();
        if (!token) {
            console.error('Token de autenticação não encontrado');
            window.location.href = '/login.html';
            return;
        }
        
        // Usando a URL correta conforme definido no controlador
        const url = `${config.apiBaseUrl}/api/veiculos/modelos/all`;
        console.log(`Fazendo requisição para: ${url}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.error(`Erro na resposta: ${response.status} ${response.statusText}`);
            if (response.status === 401) {
                console.error('Erro de autenticação. Redirecionando para login...');
                auth.logout();
                return;
            }
            throw new Error(`Erro ao carregar modelos: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Resposta da API de modelos:', data);
        
        allModelos = Array.isArray(data) ? data : (data.items || []);
        
        console.log(`${allModelos.length} modelos carregados`);
        
        preencherSelectModelos();
        
        // Carregar todas as versões após carregar os modelos
        loadAllVersoes();
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        showError('Erro ao carregar modelos. Por favor, tente novamente mais tarde.');
    }
}

// Função para preencher select de modelos no formulário E no filtro da direita
function preencherSelectModelos() {
    const modeloSelectForm = document.getElementById('modeloIdForm');
    const modeloSelectFiltro = document.getElementById('filtroModeloId');
    if (modeloSelectForm) {
        modeloSelectForm.innerHTML = '<option value="">Selecione um modelo</option>';
        allModelos.forEach(modelo => {
            const option = document.createElement('option');
            option.value = modelo.id;
            option.textContent = `${modelo.marca.nome} - ${modelo.nome}`;
            modeloSelectForm.appendChild(option);
        });
    }
    if (modeloSelectFiltro) {
        modeloSelectFiltro.innerHTML = '<option value="">Todos os modelos</option>';
        allModelos.forEach(modelo => {
            const option = document.createElement('option');
            option.value = modelo.id;
            option.textContent = `${modelo.marca.nome} - ${modelo.nome}`;
            modeloSelectFiltro.appendChild(option);
        });
    }
}

// Função para filtrar versões por modelo no formulário
function filterVersoesByModeloInForm(modeloId) {
    console.log(`Filtrando versões por modelo ID ${modeloId} no formulário...`);
    
    const versaoSelect = document.getElementById('versaoIdForm');
    if (!versaoSelect) return;
    // Limpar opções existentes, mantendo a primeira
    versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
    
    // Se não houver modelo selecionado, mostrar todas as versões
    if (!modeloId) {
        // Adicionar todas as versões ao select
        allVersoes.forEach(versao => {
            const option = document.createElement('option');
            // Tenta usar nome_versao, nome ou descricao
            option.value = versao.id;
            option.textContent = versao.nome_versao || versao.nome || versao.descricao || `Versão ${versao.id}`;
            versaoSelect.appendChild(option);
        });
        return;
    }
    
    // Filtrar versões pelo modelo selecionado
    const versoesDoModelo = allVersoes.filter(versao => versao.modelo.id === parseInt(modeloId));
    console.log(`${versoesDoModelo.length} versões encontradas para o modelo ID ${modeloId}`);
    
    // Adicionar versões filtradas ao select
    versoesDoModelo.forEach(versao => {
        const option = document.createElement('option');
        option.value = versao.id;
        option.textContent = versao.nome_versao || versao.nome || versao.descricao || `Versão ${versao.id}`;
        versaoSelect.appendChild(option);
    });
}

// Função para carregar todas as versões
async function loadAllVersoes() {
    try {
        console.log('Carregando todas as versões...');
        
        const token = auth.getToken();
        if (!token) {
            console.error('Token de autenticação não encontrado');
            window.location.href = '/login.html';
            return;
        }
        
        // Usando a URL correta conforme definido no controlador
        const url = `${config.apiBaseUrl}/api/versoes/public`;
        console.log(`Fazendo requisição para: ${url}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.error(`Erro na resposta: ${response.status} ${response.statusText}`);
            if (response.status === 401) {
                console.error('Erro de autenticação. Redirecionando para login...');
                auth.logout();
                return;
            }
            throw new Error(`Erro ao carregar versões: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Resposta da API de versões:', data);
        
        allVersoes = Array.isArray(data) ? data : (data.items || []);
        
        console.log(`${allVersoes.length} versões carregadas`);
        
        // Preencher select de versão no formulário
        const versaoSelect = document.getElementById('versaoId');
        
        // Limpar opções existentes, mantendo a primeira
        versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
        
        // Adicionar versões ao select
        allVersoes.forEach(versao => {
            // Criar opção para o select principal
            const option = document.createElement('option');
            option.value = versao.id;
            option.textContent = `${versao.modelo.marca.nome} ${versao.modelo.nome} ${versao.nome_versao}`;
            versaoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar versões:', error);
        showError('Erro ao carregar versões. Por favor, tente novamente mais tarde.');
    }
}

// Função para configurar eventos de filtro
function setupFilterEvents() {
    // Filtro por versão
    document.getElementById('filtroVersaoId').addEventListener('change', function() {
        currentPage = 1;
        loadVersaoOpcionais();
    });
}

// Função para carregar opcionais
async function loadOpcionais() {
    try {
        console.log('Carregando opcionais...');
        
        const token = auth.getToken();
        if (!token) {
            console.error('Token de autenticação não encontrado');
            window.location.href = '/login.html';
            return;
        }
        
        const response = await fetch(`${config.apiBaseUrl}/opcionais/api/list`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.error(`Erro na resposta: ${response.status} ${response.statusText}`);
            if (response.status === 401) {
                console.error('Erro de autenticação. Redirecionando para login...');
                auth.logout();
                return;
            }
            throw new Error(`Erro ao carregar opcionais: ${response.status}`);
        }
        
        const data = await response.json();
        // A API pode retornar os dados diretamente como array ou dentro de uma propriedade items
        const opcionais = Array.isArray(data) ? data : (data.items || []);
        
        console.log(`${opcionais.length} opcionais carregados`);
        
        // Preencher select de opcionais
        const opcionalSelect = document.getElementById('opcionalId');
        
        // Limpar opções existentes, mantendo a primeira
        opcionalSelect.innerHTML = '<option value="">Selecione um opcional</option>';
        
        // Adicionar opcionais ao select
        opcionais.forEach(opcional => {
            const option = document.createElement('option');
            option.value = opcional.id;
            option.textContent = (opcional.codigo ? opcional.codigo + ' - ' : '') + (opcional.descricao || opcional.nome || '');
            option.textContent = option.textContent.trim();
            option.textContent = option.textContent === '-' ? '' : option.textContent;
            option.textContent = option.textContent || `Opcional ${opcional.id}`;
            opcionalSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar opcionais:', error);
        showError('Erro ao carregar opcionais. Por favor, tente novamente mais tarde.');
    }
}

// Função para carregar lista de opcionais por versão
async function loadVersaoOpcionais() {
    try {
        console.log('Carregando lista de opcionais por versão...');
        
        const token = auth.getToken();
        if (!token) {
            console.error('Token de autenticação não encontrado');
            window.location.href = '/login.html';
            return;
        }
        
        const filtroVersaoId = document.getElementById('filtroVersaoId').value;
        
        // Usando a função getApiUrl para garantir URLs corretas em qualquer ambiente
        let url = config.getApiUrl(`api/veiculos/versao-opcional/public?page=${currentPage}&limit=${itemsPerPage}`);
        if (filtroVersaoId) {
            url += `&versaoId=${filtroVersaoId}`;
        }
        
        console.log(`Fazendo requisição para: ${url}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.error(`Erro na resposta: ${response.status} ${response.statusText}`);
            if (response.status === 401) {
                console.error('Erro de autenticação. Redirecionando para login...');
                auth.logout();
                return;
            }
            throw new Error(`Erro ao carregar lista: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Resposta da API:', data);
        
        // A API pode retornar os dados diretamente como array ou dentro de uma propriedade items
        const items = Array.isArray(data) ? data : (data.items || []);
        totalPages = data.totalPages || 1;
        
        console.log(`${items.length} associações carregadas`);
        
        // Atualizar tabela
        updateTable(items);
        
        // Atualizar paginação
        updatePagination();
        
        // Atualizar contador de registros
        document.getElementById('totalRegistros').textContent = data.total || items.length || 0;
    } catch (error) {
        console.error('Erro ao carregar lista de opcionais por versão:', error);
        showError('Erro ao carregar lista. Por favor, tente novamente mais tarde.');
    }
}

// Função para atualizar a tabela com os dados
function updateTable(items) {
    const tableBody = document.getElementById('versaoOpcionalTableBody');
    
    // Limpar tabela
    tableBody.innerHTML = '';
    
    if (items.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4" class="text-center">Nenhum registro encontrado</td>';
        tableBody.appendChild(row);
        return;
    }
    
    // Adicionar itens à tabela
    items.forEach(item => {
        const row = document.createElement('tr');
        
        // Formatar nome da versão
        const versaoNome = item.versao ? 
            `${item.versao.modelo?.marca?.nome || ''} ${item.versao.modelo?.nome || ''} ${item.versao.nome_versao}` : 
            'Versão não encontrada';
        
        // Formatar nome do opcional
        const opcionalNome = item.opcional ? 
            `${item.opcional.codigo} - ${item.opcional.descricao}` : 
            'Opcional não encontrado';
        
        // Formatar preço
        const preco = (item.preco !== undefined && item.preco !== null && item.preco !== '')
            ? formatarMoeda(Number(item.preco))
            : '-';
        
        row.innerHTML = `
            <td>${versaoNome}</td>
            <td>${opcionalNome}</td>
            <td>${preco}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-btn" data-id="${item.id}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${item.id}" 
                    data-versao="${versaoNome}" data-opcional="${opcionalNome}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Adicionar event listeners para os botões de edição e exclusão
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => getVersaoOpcional(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => confirmDeleteVersaoOpcional(
            btn.dataset.id, 
            btn.dataset.versao, 
            btn.dataset.opcional
        ));
    });
}

// Função para atualizar a paginação
function updatePagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    // Não mostrar paginação se houver apenas uma página
    if (totalPages <= 1) {
        return;
    }
    
    // Botão anterior
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = '<a class="page-link" href="#" aria-label="Anterior"><span aria-hidden="true">&laquo;</span></a>';
    if (currentPage > 1) {
        prevLi.addEventListener('click', () => {
            currentPage--;
            loadVersaoOpcionais();
        });
    }
    pagination.appendChild(prevLi);
    
    // Páginas
    for (let i = 1; i <= totalPages; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageLi.addEventListener('click', () => {
            currentPage = i;
            loadVersaoOpcionais();
        });
        pagination.appendChild(pageLi);
    }
    
    // Botão próximo
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = '<a class="page-link" href="#" aria-label="Próximo"><span aria-hidden="true">&raquo;</span></a>';
    if (currentPage < totalPages) {
        nextLi.addEventListener('click', () => {
            currentPage++;
            loadVersaoOpcionais();
        });
    }
    pagination.appendChild(nextLi);
}

// Função para obter uma associação específica para edição
async function getVersaoOpcional(id) {
    try {
        console.log(`Obtendo associação ${id} para edição...`);
        
        const token = auth.getToken();
        if (!token) {
            console.error('Token de autenticação não encontrado');
            window.location.href = '/login.html';
            return;
        }
        
        const response = await fetch(`${config.apiBaseUrl}/api/veiculos/versao-opcional/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.error(`Erro na resposta: ${response.status} ${response.statusText}`);
            if (response.status === 401) {
                console.error('Erro de autenticação. Redirecionando para login...');
                auth.logout();
                return;
            }
            throw new Error(`Erro ao obter associação: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Associação obtida:', data);
        
        // Preencher formulário
        document.getElementById('versaoOpcionalId').value = data.id;
        document.getElementById('versaoIdForm').value = data.versao_id;
        document.getElementById('opcionalIdForm').value = data.opcional_id;
        document.getElementById('precoForm').value = formatarMoeda(data.preco).replace('R$ ', '');
        
        // Atualizar título do formulário
        document.getElementById('formTitle').textContent = 'Editar Associação';
        
        // Rolar até o formulário
        document.getElementById('versaoOpcionalForm').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Erro ao obter associação:', error);
        showError('Erro ao obter dados da associação. Por favor, tente novamente mais tarde.');
    }
}

// Função para salvar uma associação (criar ou atualizar)
async function saveVersaoOpcional() {
    try {
        console.log('Salvando associação...');
        
        const token = auth.getToken();
        if (!token) {
            console.error('Token de autenticação não encontrado');
            window.location.href = '/login.html';
            return;
        }
        
        const id = document.getElementById('versaoOpcionalId')?.value;
        const versaoId = document.getElementById('versaoIdForm')?.value;
        const opcionalId = document.getElementById('opcionalIdForm')?.value;
        const precoStr = document.getElementById('precoForm')?.value;
        
        // Converter preço para número
        const preco = converterParaNumero(precoStr);
        
        // Validar campos
        if (!versaoId) {
            showError('Selecione uma versão');
            return;
        }
        
        if (!opcionalId) {
            showError('Selecione um opcional');
            return;
        }
        
        if (isNaN(preco) || preco < 0) {
            showError('Informe um preço válido');
            return;
        }
        
        // Preparar dados
        const data = {
            versao_id: parseInt(versaoId),
            opcional_id: parseInt(opcionalId),
            preco: preco
        };
        console.log('Payload enviado para API:', data);
        
        // Determinar URL e método com base na operação (criar ou atualizar)
        const isUpdate = id && id.trim() !== '';
        const url = isUpdate 
            ? `${config.apiBaseUrl}/api/veiculos/versao-opcional/${id}` 
            : `${config.apiBaseUrl}/api/veiculos/versao-opcional`;
        const method = isUpdate ? 'PUT' : 'POST';
        
        console.log(`${isUpdate ? 'Atualizando' : 'Criando'} associação:`, data);
        
        // Desabilitar botão de salvar e mostrar spinner
        const saveButton = document.querySelector('#versaoOpcionalForm button[type="submit"]');
        const originalText = saveButton.innerHTML;
        saveButton.disabled = true;
        saveButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao ${isUpdate ? 'atualizar' : 'criar'} associação`);
        }
        
        console.log(`Associação ${isUpdate ? 'atualizada' : 'criada'} com sucesso`);
        
        // Limpar formulário
        document.getElementById('versaoOpcionalForm').reset();
        document.getElementById('versaoOpcionalId').value = '';
        
        // Recarregar lista
        loadVersaoOpcionais();
        
        // Mostrar mensagem de sucesso
        showSuccess(`Associação ${isUpdate ? 'atualizada' : 'criada'} com sucesso!`);
    } catch (error) {
        console.error('Erro ao salvar associação:', error);
        showError(error.message || 'Erro ao salvar associação. Por favor, tente novamente mais tarde.');
    } finally {
        // Restaurar botão de salvar
        const saveButton = document.querySelector('#versaoOpcionalForm button[type="submit"]');
        saveButton.disabled = false;
        saveButton.innerHTML = 'Salvar';
    }
}

// Função para confirmar exclusão
function confirmDeleteVersaoOpcional(id, versaoNome, opcionalNome) {
    console.log(`Confirmando exclusão da associação ID: ${id}`);
    
    // Armazenar ID para exclusão
    selectedVersaoOpcionalId = id;
    
    // Atualizar informações no modal
    document.getElementById('deleteItemInfo').textContent = `Versão: ${versaoNome}\nOpcional: ${opcionalNome}`;
    
    // Exibir modal
    confirmDeleteModal.show();
}

// Função para excluir uma associação
async function deleteVersaoOpcional() {
    try {
        const id = selectedVersaoOpcionalId;
        console.log(`Excluindo associação ${id}...`);
        
        const token = auth.getToken();
        if (!token) {
            console.error('Token de autenticação não encontrado');
            window.location.href = '/login.html';
            return;
        }
        
        const response = await fetch(`${config.apiBaseUrl}/api/veiculos/versao-opcional/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            console.error(`Erro na resposta: ${response.status} ${response.statusText}`);
            if (response.status === 401) {
                console.error('Erro de autenticação. Redirecionando para login...');
                auth.logout();
                return;
            }
            throw new Error(`Erro ao excluir associação: ${response.status}`);
        }
        
        console.log('Associação excluída com sucesso');
        
        // Fechar modal
        confirmDeleteModal.hide();
        
        // Limpar ID selecionado
        selectedVersaoOpcionalId = null;
        
        // Recarregar lista
        loadVersaoOpcionais();
        
        // Mostrar mensagem de sucesso
        showSuccess('Associação excluída com sucesso');
    } catch (error) {
        console.error('Erro ao excluir associação:', error);
        showError('Erro ao excluir associação. Por favor, tente novamente mais tarde.');
    }
}

// Função para limpar o formulário
function resetForm() {
    console.log('Limpando formulário');
    
    // Limpar campos
    document.getElementById('versaoOpcionalId').value = '';
    document.getElementById('versaoIdForm').value = '';
    document.getElementById('opcionalIdForm').value = '';
    document.getElementById('precoForm').value = '';
    document.getElementById('modeloIdForm').value = '';
    
    // Resetar título
    document.getElementById('formTitle').textContent = 'Associar Opcional a Versão';
    
    // Limpar ID selecionado
    selectedVersaoOpcionalId = null;
}

// Função para mostrar mensagem de erro
function showError(message) {
    const errorAlert = document.createElement('div');
    errorAlert.className = 'alert alert-danger alert-dismissible fade show';
    errorAlert.role = 'alert';
    errorAlert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    `;
    
    // Inserir no topo da página
    const container = document.querySelector('.container');
    container.insertBefore(errorAlert, container.firstChild);
    
    // Remover após 5 segundos
    setTimeout(() => {
        errorAlert.classList.remove('show');
        setTimeout(() => errorAlert.remove(), 150);
    }, 5000);
}

// Função para mostrar mensagem de sucesso
function showSuccess(message) {
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success alert-dismissible fade show';
    successAlert.role = 'alert';
    successAlert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    `;
    
    // Inserir no topo da página
    const container = document.querySelector('.container');
    container.insertBefore(successAlert, container.firstChild);
    
    // Remover após 5 segundos
    setTimeout(() => {
        successAlert.classList.remove('show');
        setTimeout(() => successAlert.remove(), 150);
    }, 5000);
}

// Função para formatar valor monetário
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Função para formatar valor monetário para exibição em input
function formatarValorMonetario(valor) {
    if (valor === null || valor === undefined || valor === '') {
        return '';
    }
    
    // Converter para número se for string
    if (typeof valor === 'string') {
        valor = parseFloat(valor.replace(/[^\d,.-]/g, '').replace(',', '.'));
    }
    
    // Verificar se é um número válido
    if (isNaN(valor)) {
        return '';
    }
    
    // Formatar como número com 2 casas decimais
    return valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Função para converter valor monetário formatado para número
function converterParaNumero(valorFormatado) {
    if (!valorFormatado) {
        return 0;
    }
    
    // Remover todos os caracteres não numéricos, exceto vírgula e ponto
    const valor = valorFormatado.replace(/[^\d,.-]/g, '').replace(',', '.');
    
    return parseFloat(valor);
}

// Função para carregar opcionais
async function loadOpcionais() {
    try {
        const token = auth.getToken();
        if (!token) {
            window.location.href = '/login.html';
            return;
        }
        const url = `${config.apiBaseUrl}/opcionais/api/list`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Erro ao buscar opcionais: ${response.status}`);
        }
        const data = await response.json();
        // Preencher select do formulário de associação
        const opcionalSelect = document.getElementById('opcionalIdForm');
        if (opcionalSelect) {
            opcionalSelect.innerHTML = '<option value="">Selecione um opcional</option>';
            data.forEach(opcional => {
                const option = document.createElement('option');
                option.value = opcional.id;
                option.textContent = (opcional.codigo ? opcional.codigo + ' - ' : '') + (opcional.descricao || opcional.nome || '');
                option.textContent = option.textContent.trim();
                option.textContent = option.textContent === '-' ? '' : option.textContent;
                option.textContent = option.textContent || `Opcional ${opcional.id}`;
                opcionalSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar opcionais:', error);
        showError('Erro ao carregar opcionais.');
    }
}

// Função para carregar todas as versões
async function loadAllVersoes() {
    try {
        const token = auth.getToken();
        if (!token) {
            window.location.href = '/login.html';
            return;
        }
        const url = `${config.apiBaseUrl}/api/versoes/public`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Erro ao buscar versões: ${response.status}`);
        }
        const data = await response.json();
        allVersoes = data;
        // Preencher selects de versão (formulário e filtro)
        const versaoSelectForm = document.getElementById('versaoIdForm');
        if (versaoSelectForm) {
            versaoSelectForm.innerHTML = '<option value="">Selecione uma versão</option>';
            allVersoes.forEach(versao => {
                const option = document.createElement('option');
                option.value = versao.id;
                option.textContent = versao.nome_versao || versao.nome || versao.descricao || `Versão ${versao.id}`;
                versaoSelectForm.appendChild(option);
            });
        }
        const versaoSelectFiltro = document.getElementById('filtroVersaoId');
        if (versaoSelectFiltro) {
            versaoSelectFiltro.innerHTML = '<option value="">Todas as versões</option>';
            allVersoes.forEach(versao => {
                const option = document.createElement('option');
                option.value = versao.id;
                option.textContent = versao.nome_versao || versao.nome || versao.descricao || `Versão ${versao.id}`;
                versaoSelectFiltro.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar versões:', error);
        showError('Erro ao carregar versões.');
    }
}

// Função para configurar eventos de filtro de modelo no card da direita
function setupFiltroModeloEvents() {
    const filtroModeloSelect = document.getElementById('filtroModeloId');
    const filtroVersaoSelect = document.getElementById('filtroVersaoId');
    if (!filtroModeloSelect || !filtroVersaoSelect) return;
    filtroVersaoSelect.disabled = true;
    filtroModeloSelect.addEventListener('change', function() {
        filterVersoesByModeloInFiltro(this.value);
    });
}

// Função para filtrar versões por modelo no card da direita
function filterVersoesByModeloInFiltro(modeloId) {
    const versaoSelect = document.getElementById('filtroVersaoId');
    if (!versaoSelect) return;
    versaoSelect.innerHTML = '<option value="">Todas as versões</option>';
    if (!modeloId) {
        versaoSelect.disabled = true;
        return;
    }
    versaoSelect.disabled = false;
    const versoesDoModelo = allVersoes.filter(versao => versao.modelo.id === parseInt(modeloId));
    versoesDoModelo.forEach(versao => {
        const option = document.createElement('option');
        option.value = versao.id;
        option.textContent = versao.nome_versao || versao.nome || versao.descricao || `Versão ${versao.id}`;
        versaoSelect.appendChild(option);
    });
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initApp);
