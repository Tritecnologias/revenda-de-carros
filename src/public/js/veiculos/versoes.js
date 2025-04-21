document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de versões carregada');
    
    // Verificar se config.js foi carregado corretamente
    if (typeof config === 'undefined') {
        console.error('O arquivo config.js não foi carregado corretamente.');
        alert('Erro ao carregar configurações. Por favor, recarregue a página.');
        return;
    }
    
    console.log('API Base URL:', config.apiBaseUrl);
    
    // Verificar autenticação
    const userString = localStorage.getItem('user');
    if (!userString) {
        window.location.href = '/login.html';
        return;
    }
    
    const user = JSON.parse(userString);
    console.log('Usuário logado:', user);
    
    // Garantir que o usuário tenha a propriedade 'role' para compatibilidade
    if (user.papel && !user.role) {
        user.role = user.papel;
        // Atualizar no localStorage para manter a consistência
        localStorage.setItem('user', JSON.stringify(user));
    }
    
    // Obter usuário autenticado
    const authUser = auth.getUser();
    if (!authUser) {
        console.error('Usuário não autenticado');
        window.location.href = '/login.html';
        return;
    }
    
    // Inicializar menu
    const menuManager = window.menuManager;
    if (menuManager) {
        menuManager.init(authUser);
    } else {
        console.error('Menu Manager não encontrado!');
        // Tentar inicializar o menu usando a função global
        if (typeof initMenu === 'function') {
            initMenu();
        }
    }
    
    // Função para inicializar a página de versões
    function inicializarPaginaVersoes() {
        console.log('Inicializando página de versões...');
        
        // Verificar se estamos na página correta que contém os elementos de versões
        const filtroMarca = document.getElementById('filtroMarca');
        const filtroModelo = document.getElementById('filtroModelo');
        const filtroStatus = document.getElementById('filtroStatus');
        
        // Verificar tanto o ID versoesTableBody quanto tabelaVersoes (usado na página admin/versoes.html)
        const versoesTableBody = document.getElementById('versoesTableBody') || document.getElementById('tabelaVersoes');
        
        const marcaSelect = document.getElementById('marcaSelect');
        const modeloSelect = document.getElementById('modeloSelect');
        const salvarVersaoBtn = document.getElementById('salvarVersao');
        
        // Se os elementos essenciais não existirem, estamos em uma página diferente
        if (!filtroMarca || !filtroModelo || !filtroStatus || !versoesTableBody) {
            console.log('Elementos essenciais da página de versões não encontrados. Provavelmente estamos em uma página diferente.');
            console.log('filtroMarca:', filtroMarca);
            console.log('filtroModelo:', filtroModelo);
            console.log('filtroStatus:', filtroStatus);
            console.log('versoesTableBody:', versoesTableBody);
            return;
        }
        
        console.log('Elementos essenciais encontrados, continuando inicialização...');
        
        // Carregar marcas para os filtros e formulário
        carregarMarcas();
        
        // Carregar versões
        carregarVersoes();
        
        // Event listeners para filtros
        filtroMarca.addEventListener('change', function() {
            carregarModelos(this.value);
            carregarVersoes();
        });
        
        filtroModelo.addEventListener('change', carregarVersoes);
        filtroStatus.addEventListener('change', carregarVersoes);
        
        // Event listeners para formulário (se existirem)
        if (marcaSelect) {
            marcaSelect.addEventListener('change', function() {
                carregarModelosFormulario(this.value);
            });
        }
        
        if (salvarVersaoBtn) {
            salvarVersaoBtn.addEventListener('click', salvarVersao);
        }
        
        console.log('Página de versões inicializada com sucesso');
    }
    
    // Inicializar página de versões (apenas se estivermos na página correta)
    inicializarPaginaVersoes();
});

// Função para obter o token de autenticação
function getToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token de autenticação não encontrado');
        window.location.href = '/login.html';
        return null;
    }
    return token;
}

// Função para verificar autenticação
function checkAuth(allowedRoles = ['admin', 'cadastrador']) {
    console.log('Verificando autenticação...');
    
    // Verificar se auth.js está carregado e funcionando
    if (typeof auth === 'undefined') {
        console.error('Auth não está disponível. Verifique se auth.js foi carregado.');
        window.location.href = '/login.html';
        return;
    }
    
    if (!auth.isAuthenticated()) {
        console.log('Usuário não autenticado, redirecionando para login...');
        window.location.href = '/login.html';
        return;
    }
    
    const user = auth.getUser();
    if (!user || !user.role || !allowedRoles.includes(user.role)) {
        console.log('Usuário não tem permissão para acessar esta página.');
        window.location.href = '/index.html';
        return;
    }
    
    console.log('Autenticação verificada com sucesso.');
    return user;
}

// Função para inicializar o menu
function initMenu() {
    console.log('Inicializando menu...');
    
    // Verificar se menu-manager.js está carregado
    if (typeof window.menuManager === 'undefined') {
        console.error('MenuManager não está disponível. Verifique se menu-manager.js foi carregado.');
        return;
    }
    
    const user = auth.getUser();
    if (user) {
        // Inicializar menu com o usuário atual e o ID correto do container
        window.menuManager.init(user, 'navbarNavBlue');
        console.log('Menu inicializado com sucesso.');
    } else {
        console.error('Usuário não encontrado para inicialização do menu.');
    }
}

// Função para carregar marcas
async function carregarMarcas() {
    console.log('Carregando marcas...');
    
    const filtroMarca = document.getElementById('filtroMarca');
    if (!filtroMarca) return;
    
    try {
        const token = getToken();
        if (!token) {
            console.error('Token de autenticação não encontrado');
            return;
        }
        
        // Lista de URLs a tentar, em ordem de prioridade
        const urls = [
            '/api/veiculos/marcas/all',
            '/api/marcas/all',
            '/api/marcas'
        ];
        
        // Usar a função fetchWithFallback do config.js
        const marcas = await config.fetchWithFallback(urls, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Marcas carregadas:', marcas);
        
        // Limpar opções existentes
        filtroMarca.innerHTML = '<option value="">Todas as marcas</option>';
        
        // Adicionar novas opções
        marcas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca.id;
            option.textContent = marca.nome;
            filtroMarca.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar marcas:', error);
        exibirMensagem('Erro ao carregar marcas. Por favor, tente novamente.', 'danger');
    }
}

// Função para carregar modelos com base na marca selecionada
async function carregarModelos(marcaId) {
    console.log('Carregando modelos para marca ID:', marcaId);
    
    const filtroModelo = document.getElementById('filtroModelo');
    if (!filtroModelo) return;
    
    // Limpar opções existentes
    filtroModelo.innerHTML = '<option value="">Todos os modelos</option>';
    
    // Se não houver marca selecionada, não carrega modelos
    if (!marcaId) return;
    
    try {
        const token = getToken();
        if (!token) {
            console.error('Token de autenticação não encontrado');
            return;
        }
        
        // URLs para tentar carregar modelos
        const apiUrls = [
            `/api/veiculos/modelos/by-marca/${marcaId}`,
            `http://localhost:3000/api/veiculos/modelos/by-marca/${marcaId}`,
            `http://69.62.91.195:3000/api/veiculos/modelos/by-marca/${marcaId}`,
            `/api/modelos/marca/${marcaId}`,
            `http://localhost:3000/api/modelos/marca/${marcaId}`,
            `http://69.62.91.195:3000/api/modelos/marca/${marcaId}`
        ];
        
        // Tentar cada URL em sequência
        let response = null;
        let lastError = null;
        let modelos = null;
        
        for (const url of apiUrls) {
            try {
                console.log(`Tentando carregar modelos de: ${url}`);
                response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    modelos = await response.json();
                    console.log(`URL bem-sucedida: ${url}`);
                    break; // Sair do loop se a resposta for bem-sucedida
                } else {
                    const errorText = await response.text();
                    console.error(`Falha na URL ${url}:`, errorText);
                    lastError = `${response.status} ${response.statusText}`;
                }
            } catch (error) {
                console.error(`Erro ao acessar ${url}:`, error.message);
                lastError = error.message;
            }
        }
        
        // Se todas as URLs falharam
        if (!modelos) {
            throw new Error(`Falha ao carregar modelos: ${lastError}`);
        }
        
        console.log('Modelos carregados:', modelos);
        
        // Adicionar novas opções
        modelos.forEach(modelo => {
            const option = document.createElement('option');
            option.value = modelo.id;
            option.textContent = modelo.nome;
            filtroModelo.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        exibirMensagem('Erro ao carregar modelos. Por favor, tente novamente.', 'danger');
    }
}

// Função para carregar as versões com base nos filtros
async function carregarVersoes() {
    console.log('Carregando versões...');
    
    // Verificar se estamos na página correta que contém os elementos de versões
    const filtroMarca = document.getElementById('filtroMarca');
    const filtroModelo = document.getElementById('filtroModelo');
    const filtroStatus = document.getElementById('filtroStatus');
    
    // Verificar tanto o ID versoesTableBody quanto tabelaVersoes (usado na página admin/versoes.html)
    const versoesTableBody = document.getElementById('versoesTableBody') || document.getElementById('tabelaVersoes');
    
    // Se os elementos essenciais não existirem, estamos em uma página diferente
    if (!filtroMarca || !filtroModelo || !filtroStatus) {
        console.log('Elementos de filtro não encontrados. Provavelmente estamos em uma página diferente.');
        return;
    }
    
    // Obter valores dos filtros
    const marcaId = filtroMarca.value;
    const modeloId = filtroModelo.value;
    const status = filtroStatus.value;
    
    // Obter token de autenticação
    const token = getToken();
    if (!token) {
        console.error('Token de autenticação não encontrado');
        return;
    }
    
    // Mostrar indicador de carregamento
    if (versoesTableBody) {
        versoesTableBody.innerHTML = '<tr><td colspan="6" class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Carregando...</span></div></td></tr>';
    } else {
        console.warn('Elemento da tabela de versões não encontrado. Continuando sem mostrar indicador de carregamento.');
    }
    
    try {
        // Construir parâmetros de filtro
        const params = new URLSearchParams();
        if (marcaId && !modeloId) params.append('marcaId', marcaId);
        if (status) params.append('status', status);
        const queryString = params.toString() ? `?${params.toString()}` : '';
        
        // Determinar a URL base atual
        const currentUrl = window.location.href;
        const isExternalIP = currentUrl.includes('69.62.91.195');
        
        // Definir a URL base correta para o ambiente atual
        let baseUrl = isExternalIP ? 'http://69.62.91.195:3000' : '';
        
        // Definir as URLs específicas para o ambiente atual
        let url;
        if (modeloId) {
            // Usar a rota correta para versões de um modelo específico
            url = `${baseUrl}/api/versoes/modelo/${modeloId}/public${queryString}`;
        } else {
            // Usar a rota correta para todas as versões
            url = `${baseUrl}/api/versoes/public${queryString}`;
        }
        
        console.log(`Tentando carregar versões de: ${url}`);
        
        // Fazer a requisição diretamente para a URL correta
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(`Dados carregados com sucesso:`, data);
            
            // Verificar se a resposta é um array
            if (Array.isArray(data)) {
                // Renderizar os dados
                renderizarVersoes(data, versoesTableBody);
            } 
            // Verificar se a resposta é um objeto com uma propriedade items (paginação)
            else if (data && data.items && Array.isArray(data.items)) {
                // Renderizar os items
                renderizarVersoes(data.items, versoesTableBody);
            } else {
                console.warn(`A resposta não está no formato esperado:`, data);
                versoesTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Formato de resposta inválido do servidor.</td></tr>';
            }
        } else {
            const errorText = await response.text();
            console.error(`Falha ao carregar versões: ${response.status} ${response.statusText}`, errorText);
            
            // Tentar a rota alternativa se a primeira falhar
            console.log('Tentando rota alternativa...');
            const alternativeUrl = modeloId 
                ? `${baseUrl}/api/veiculos/versoes/modelo/${modeloId}${queryString}`
                : `${baseUrl}/api/versoes/all${queryString}`;
            
            console.log(`Tentando carregar versões de: ${alternativeUrl}`);
            
            try {
                const alternativeResponse = await fetch(alternativeUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (alternativeResponse.ok) {
                    const alternativeData = await alternativeResponse.json();
                    console.log(`Dados carregados com sucesso da rota alternativa:`, alternativeData);
                    
                    // Verificar se a resposta é um array
                    if (Array.isArray(alternativeData)) {
                        // Renderizar os dados
                        renderizarVersoes(alternativeData, versoesTableBody);
                        return;
                    } 
                    // Verificar se a resposta é um objeto com uma propriedade items (paginação)
                    else if (alternativeData && alternativeData.items && Array.isArray(alternativeData.items)) {
                        // Renderizar os items
                        renderizarVersoes(alternativeData.items, versoesTableBody);
                        return;
                    }
                }
                
                // Se chegou aqui, a rota alternativa também falhou
                versoesTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Erro ${response.status}: Não foi possível carregar as versões do banco de dados.</td></tr>`;
                exibirMensagem(`Erro ao carregar versões: ${response.status} ${response.statusText}`, 'danger');
            } catch (alternativeError) {
                console.error('Erro ao acessar rota alternativa:', alternativeError);
                versoesTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Erro ${response.status}: Não foi possível carregar as versões do banco de dados.</td></tr>`;
                exibirMensagem(`Erro ao carregar versões: ${response.status} ${response.statusText}`, 'danger');
            }
        }
    } catch (error) {
        console.error('Erro ao carregar versões:', error);
        
        // Em caso de erro, mostrar mensagem e limpar tabela
        if (versoesTableBody) {
            versoesTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Erro ao carregar versões do banco de dados. Por favor, tente novamente.</td></tr>';
        }
        
        exibirMensagem('Erro ao carregar versões do banco de dados. Por favor, tente novamente.', 'danger');
    }
}

// Função para renderizar a tabela de versões
function renderizarVersoes(data, tableBody) {
    // Limpar a tabela
    tableBody.innerHTML = '';
    
    // Verificar se há dados para exibir
    if (!data || data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhuma versão encontrada no banco de dados.</td></tr>';
        return;
    }
    
    console.log('Dados para renderizar:', data);
    
    // Renderizar cada versão
    data.forEach(versao => {
        const tr = document.createElement('tr');
        
        // Verificar todas as possíveis propriedades para o nome da versão
        // Priorizar nome_versao que é o nome da coluna no banco de dados conforme versao.entity.ts
        const versaoNome = versao.nome_versao || versao.nome || versao.versaoNome || versao.name || 'N/A';
        
        // Verificar se a versão tem um modelo associado
        const modeloNome = versao.modelo?.nome || versao.modelo_nome || versao.modeloNome || 'N/A';
        const marcaNome = versao.modelo?.marca?.nome || versao.marca_nome || versao.marcaNome || 'N/A';
        
        // Construir a linha da tabela
        tr.innerHTML = `
            <td>${versao.id}</td>
            <td>${versaoNome}</td>
            <td>${modeloNome}</td>
            <td>${marcaNome}</td>
            <td>${versao.status || 'ativo'}</td>
            <td>
                <button class="btn btn-sm btn-primary editar-versao" data-id="${versao.id}" title="Editar">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-sm btn-danger excluir-versao" data-id="${versao.id}" data-nome="${versaoNome}" title="Excluir">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
    
    // Adicionar event listeners para os botões de editar e excluir
    document.querySelectorAll('.editar-versao').forEach(btn => {
        btn.addEventListener('click', function() {
            const versaoId = this.getAttribute('data-id');
            carregarVersaoParaEdicao(versaoId);
        });
    });
    
    document.querySelectorAll('.excluir-versao').forEach(btn => {
        btn.addEventListener('click', function() {
            const versaoId = this.getAttribute('data-id');
            const versaoNome = this.getAttribute('data-nome');
            
            // Verificar se o modal de exclusão existe e criá-lo se necessário
            if (!document.getElementById('modalExcluirVersao')) {
                verificarECriarModais();
            }
            
            // Configurar o modal de confirmação
            document.getElementById('versaoIdExcluir').value = versaoId;
            document.getElementById('versaoNomeExcluir').textContent = versaoNome;
            
            // Abrir o modal
            const modalElement = document.getElementById('modalExcluirVersao');
            if (modalElement) {
                // Verificar se já existe uma instância do modal
                let modalInstance = bootstrap.Modal.getInstance(modalElement);
                
                // Se não existir, criar uma nova instância
                if (!modalInstance) {
                    modalInstance = new bootstrap.Modal(modalElement);
                }
                
                // Mostrar o modal
                modalInstance.show();
            } else {
                console.error('Modal de exclusão não encontrado');
                exibirMensagem('Erro ao abrir modal de exclusão', 'danger');
            }
        });
    });
}

// Função para carregar uma versão específica para edição
async function carregarVersaoParaEdicao(versaoId) {
    console.log(`Carregando versão ${versaoId} para edição...`);
    
    // Obter token de autenticação
    const token = getToken();
    if (!token) {
        console.error('Token de autenticação não encontrado');
        return;
    }
    
    try {
        // Determinar a URL base atual
        const currentUrl = window.location.href;
        const isExternalIP = currentUrl.includes('69.62.91.195');
        
        // Definir a URL base correta para o ambiente atual
        let baseUrl = isExternalIP ? 'http://69.62.91.195:3000' : '';
        
        // URL para carregar versão específica
        const url = `${baseUrl}/api/versoes/${versaoId}`;
        
        console.log(`Tentando carregar versão de: ${url}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ${response.status}: ${errorText}`);
        }
        
        const versao = await response.json();
        console.log('Versão carregada:', versao);
        
        // Verificar se o modal existe
        const versaoModal = document.getElementById('versaoModal');
        if (!versaoModal) {
            console.error('Modal de versão não encontrado. Tentando criar um modal dinamicamente.');
            
            // Criar o modal dinamicamente se não existir
            criarModalVersao();
        }
        
        // Preencher o formulário com os dados da versão
        document.getElementById('versaoId').value = versao.id;
        
        // Verificar qual ID do campo de nome está presente na página
        const nomeField = document.getElementById('nome') || document.getElementById('nomeVersao');
        if (!nomeField) {
            throw new Error('Campo de nome da versão não encontrado no formulário');
        }
        // Usar nome_versao conforme definido na entidade
        nomeField.value = versao.nome_versao || '';
        
        // Obter valores dos campos opcionais se existirem
        let descricao = '';
        const descricaoField = document.getElementById('descricao');
        if (descricaoField) {
            descricao = descricaoField.value = versao.descricao || '';
        }
        
        let ano = null;
        const anoField = document.getElementById('ano');
        if (anoField) {
            ano = anoField.value = versao.ano || '';
        }
        
        let preco = null;
        const precoField = document.getElementById('preco');
        if (precoField) {
            preco = precoField.value = versao.preco || '';
        }
        
        // Obter modelo
        const modeloSelect = document.getElementById('modeloSelect');
        if (!modeloSelect) {
            throw new Error('Campo de modelo não encontrado no formulário');
        }
        const modeloId = modeloSelect.value = versao.modeloId || '';
        
        // Verificar qual campo de status está presente na página
        let status = 'ativo';
        const statusField = document.getElementById('status');
        const statusCheckbox = document.getElementById('statusVersao');
        
        if (statusField) {
            status = statusField.value = versao.status || 'ativo';
        } else if (statusCheckbox) {
            // Se for um checkbox, marcar se o status for 'ativo'
            statusCheckbox.checked = versao.status === 'ativo';
            status = statusCheckbox.checked ? 'ativo' : 'inativo';
        }
        
        // Se a versão tem um modelo e o modelo tem uma marca, carregar os modelos da marca
        if (versao.modelo && versao.modelo.marca) {
            try {
                await carregarModelosFormulario(versao.modelo.marca.id);
                
                // Selecionar o modelo correto
                modeloSelect.value = versao.modelo.id || versao.modeloId;
            }
            catch (error) {
                console.error('Erro ao carregar modelos da marca:', error);
            }
        }
        
        // Abrir o modal de edição - verificar se o modal existe e usar a instância correta
        const modalElement = document.getElementById('versaoModal');
        if (modalElement) {
            // Verificar se já existe uma instância do modal
            let modalInstance = bootstrap.Modal.getInstance(modalElement);
            
            // Se não existir, criar uma nova instância
            if (!modalInstance) {
                modalInstance = new bootstrap.Modal(modalElement);
            }
            
            // Mostrar o modal
            modalInstance.show();
        } else {
            throw new Error('Modal de versão não encontrado na página');
        }
        
    } catch (error) {
        console.error('Erro ao carregar versão para edição:', error);
        exibirMensagem(`Erro ao carregar versão: ${error.message}`, 'danger');
    }
}

// Função para criar o modal de versão dinamicamente se não existir
function criarModalVersao() {
    console.log('Criando modal de versão dinamicamente');
    
    // Verificar se o modal já existe
    if (document.getElementById('versaoModal')) {
        console.log('Modal já existe, não é necessário criar novamente');
        return;
    }
    
    // Criar o elemento do modal
    const modalHTML = `
    <div class="modal fade" id="versaoModal" tabindex="-1" aria-labelledby="versaoModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="versaoModalLabel">Versão</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>
                <div class="modal-body">
                    <form id="versaoForm">
                        <input type="hidden" id="versaoId">
                        <div class="mb-3">
                            <label for="nome" class="form-label">Nome</label>
                            <input type="text" class="form-control" id="nome" required>
                        </div>
                        <div class="mb-3">
                            <label for="modeloSelect" class="form-label">Modelo</label>
                            <select class="form-select" id="modeloSelect" required>
                                <option value="">Selecione um modelo</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="status" class="form-label">Status</label>
                            <select class="form-select" id="status">
                                <option value="ativo">Ativo</option>
                                <option value="inativo">Inativo</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="btnSalvarVersao">Salvar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Adicionar o modal ao final do body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Adicionar event listener para o botão de salvar
    document.getElementById('btnSalvarVersao').addEventListener('click', salvarVersao);
    
    console.log('Modal criado com sucesso');
}

// Função para excluir uma versão
async function excluirVersao() {
    console.log('Excluindo versão...');
    
    // Obter o ID da versão a ser excluída
    const versaoId = document.getElementById('versaoIdExcluir').value;
    if (!versaoId) {
        console.error('ID da versão não encontrado');
        return;
    }
    
    // Obter token de autenticação
    const token = getToken();
    if (!token) {
        console.error('Token de autenticação não encontrado');
        return;
    }
    
    try {
        // Determinar a URL base atual
        const currentUrl = window.location.href;
        const isExternalIP = currentUrl.includes('69.62.91.195');
        
        // Definir a URL base correta para o ambiente atual
        let baseUrl = isExternalIP ? 'http://69.62.91.195:3000' : '';
        
        // URL para excluir versão
        const url = `${baseUrl}/api/versoes/${versaoId}`;
        
        console.log(`Tentando excluir versão: ${url}`);
        
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ${response.status}: ${errorText}`);
        }
        
        console.log('Versão excluída com sucesso');
        
        // Fechar modal - verificar se o modal existe
        const modalElement = document.getElementById('modalExcluirVersao');
        if (modalElement) {
            // Verificar se já existe uma instância do modal
            let modalInstance = bootstrap.Modal.getInstance(modalElement);
            
            // Se não existir, criar uma nova instância
            if (!modalInstance) {
                modalInstance = new bootstrap.Modal(modalElement);
            }
            
            // Fechar o modal
            modalInstance.hide();
        }
        
        // Exibir mensagem de sucesso
        exibirMensagem('Versão excluída com sucesso!', 'success');
        
        // Recarregar lista de versões
        await carregarVersoes();
        
    } catch (error) {
        console.error('Erro ao excluir versão:', error);
        exibirMensagem(`Erro ao excluir versão: ${error.message}`, 'danger');
    }
}

// Função para verificar se os modais existem e criá-los se necessário
function verificarECriarModais() {
    console.log('Verificando e criando modais se necessário');
    
    // Verificar se o modal de versão existe
    if (!document.getElementById('versaoModal')) {
        criarModalVersao();
    }
    
    // Verificar se o modal de exclusão existe
    if (!document.getElementById('modalExcluirVersao')) {
        // Criar o modal de exclusão
        const modalExcluirHTML = `
        <div class="modal fade" id="modalExcluirVersao" tabindex="-1" aria-labelledby="modalExcluirVersaoLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalExcluirVersaoLabel">Confirmar Exclusão</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                    </div>
                    <div class="modal-body">
                        <p>Tem certeza que deseja excluir a versão <span id="versaoNomeExcluir"></span>?</p>
                        <input type="hidden" id="versaoIdExcluir">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-danger" id="btnConfirmarExclusao">Excluir</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        // Adicionar o modal ao final do body
        document.body.insertAdjacentHTML('beforeend', modalExcluirHTML);
        
        // Adicionar event listener para o botão de confirmar exclusão
        document.getElementById('btnConfirmarExclusao').addEventListener('click', excluirVersao);
        
        console.log('Modal de exclusão criado com sucesso');
    }
}

// Função para inicializar a página de versões
function inicializarPaginaVersoes() {
    console.log('Inicializando página de versões...');
    
    // Verificar se estamos na página correta
    const filtroMarca = document.getElementById('filtroMarca');
    const filtroModelo = document.getElementById('filtroModelo');
    const filtroStatus = document.getElementById('filtroStatus');
    
    if (!filtroMarca || !filtroModelo || !filtroStatus) {
        console.log('Elementos de filtro não encontrados. Provavelmente estamos em uma página diferente.');
        return;
    }
    
    // Verificar e criar modais se necessário
    verificarECriarModais();
    
    // Carregar marcas para o filtro
    carregarMarcas();
    
    // Adicionar event listeners para os filtros
    filtroMarca.addEventListener('change', function() {
        if (this.value) {
            carregarModelos(this.value);
        } else {
            // Se nenhuma marca for selecionada, limpar o select de modelos
            filtroModelo.innerHTML = '<option value="">Todos os modelos</option>';
            // Recarregar versões com os filtros atuais
            carregarVersoes();
        }
    });
    
    filtroModelo.addEventListener('change', carregarVersoes);
    filtroStatus.addEventListener('change', carregarVersoes);
    
    // Adicionar event listener para o botão de nova versão
    const btnNovaVersao = document.querySelector('.btn-nova-versao');
    if (btnNovaVersao) {
        btnNovaVersao.addEventListener('click', function() {
            // Limpar o formulário
            document.getElementById('versaoForm').reset();
            document.getElementById('versaoId').value = '';
            
            // Abrir o modal
            const modalElement = document.getElementById('versaoModal');
            if (modalElement) {
                // Verificar se já existe uma instância do modal
                let modalInstance = bootstrap.Modal.getInstance(modalElement);
                
                // Se não existir, criar uma nova instância
                if (!modalInstance) {
                    modalInstance = new bootstrap.Modal(modalElement);
                }
                
                // Mostrar o modal
                modalInstance.show();
            } else {
                console.error('Modal de versão não encontrado na página');
            }
        });
    }
    
    // Carregar versões iniciais
    carregarVersoes();
}

// Função para salvar uma versão (criar ou atualizar)
async function salvarVersao(event) {
    event.preventDefault();
    
    console.log('Salvando versão...');
    
    // Obter token de autenticação
    const token = getToken();
    if (!token) {
        console.error('Token de autenticação não encontrado');
        return;
    }
    
    // Obter dados do formulário
    const versaoId = document.getElementById('versaoId').value;
    
    // Verificar qual ID do campo de nome está presente na página
    const nomeField = document.getElementById('nome') || document.getElementById('nomeVersao');
    if (!nomeField) {
        exibirMensagem('Campo de nome da versão não encontrado no formulário', 'danger');
        return;
    }
    
    // Obter modelo
    const modeloSelect = document.getElementById('modeloSelect');
    if (!modeloSelect) {
        exibirMensagem('Campo de modelo não encontrado no formulário', 'danger');
        return;
    }
    
    const modeloId = modeloSelect.value;
    if (!modeloId) {
        exibirMensagem('Por favor, selecione um modelo', 'warning');
        return;
    }
    
    // Verificar qual campo de status está presente na página
    let status = 'ativo';
    const statusField = document.getElementById('status');
    const statusCheckbox = document.getElementById('statusVersao');
    
    if (statusField) {
        status = statusField.value;
    } else if (statusCheckbox) {
        status = statusCheckbox.checked ? 'ativo' : 'inativo';
    }
    
    // Construir objeto de dados da versão - usar nome_versao conforme a entidade
    const versaoData = {
        nome_versao: nomeField.value,
        modeloId: parseInt(modeloId),
        status: status
    };
    
    // Adicionar campos opcionais se existirem
    const descricaoField = document.getElementById('descricao');
    if (descricaoField) {
        versaoData.descricao = descricaoField.value;
    }
    
    const anoField = document.getElementById('ano');
    if (anoField && anoField.value) {
        versaoData.ano = parseInt(anoField.value);
    }
    
    const precoField = document.getElementById('preco');
    if (precoField && precoField.value) {
        versaoData.preco = parseFloat(precoField.value.replace(',', '.'));
    }
    
    console.log('Dados da versão a salvar:', versaoData);
    
    try {
        // Determinar a URL base atual
        const currentUrl = window.location.href;
        const isExternalIP = currentUrl.includes('69.62.91.195');
        
        // Definir a URL base correta para o ambiente atual
        let baseUrl = isExternalIP ? 'http://69.62.91.195:3000' : '';
        
        let url, method;
        
        if (versaoId) {
            // Atualizar versão existente
            url = `${baseUrl}/api/versoes/${versaoId}`;
            method = 'PATCH';
        } else {
            // Criar nova versão
            url = `${baseUrl}/api/versoes`;
            method = 'POST';
        }
        
        console.log(`${method} para ${url} com dados:`, versaoData);
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(versaoData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
        }
        
        const savedVersao = await response.json();
        console.log('Versão salva com sucesso:', savedVersao);
        
        // Fechar modal
        const versaoModal = bootstrap.Modal.getInstance(document.getElementById('versaoModal'));
        if (versaoModal) {
            versaoModal.hide();
        }
        
        // Exibir mensagem de sucesso
        exibirMensagem(versaoId ? 'Versão atualizada com sucesso!' : 'Versão criada com sucesso!', 'success');
        
        // Recarregar lista de versões
        await carregarVersoes();
        
    } catch (error) {
        console.error('Erro ao salvar versão:', error);
        exibirMensagem(`Erro ao salvar versão: ${error.message}`, 'danger');
    }
}

// Função para carregar marcas no formulário
async function carregarMarcasFormulario() {
    console.log('Carregando marcas para formulário...');
    
    const marcaSelect = document.getElementById('marcaSelect');
    if (!marcaSelect) return;
    
    try {
        const token = getToken();
        if (!token) {
            console.error('Token de autenticação não encontrado');
            return;
        }
        
        // Lista de URLs a tentar, em ordem de prioridade
        const urls = [
            '/api/veiculos/marcas/all',
            '/api/marcas/all',
            '/api/marcas'
        ];
        
        // Usar a função fetchWithFallback do config.js
        const marcas = await config.fetchWithFallback(urls, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Marcas carregadas para formulário:', marcas);
        
        // Limpar opções existentes
        marcaSelect.innerHTML = '<option value="">Selecione uma marca</option>';
        
        // Adicionar novas opções
        marcas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca.id;
            option.textContent = marca.nome;
            marcaSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar marcas para formulário:', error);
        exibirMensagem('Erro ao carregar marcas. Por favor, tente novamente.', 'danger');
    }
}

// Função para carregar modelos no formulário
async function carregarModelosFormulario(marcaId) {
    console.log('Carregando modelos para formulário, marca ID:', marcaId);
    
    const modeloSelect = document.getElementById('modeloSelect');
    if (!modeloSelect) return;
    
    // Limpar opções existentes
    modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
    
    // Se não houver marca selecionada, não carrega modelos
    if (!marcaId) return;
    
    try {
        const token = getToken();
        if (!token) {
            console.error('Token de autenticação não encontrado');
            return;
        }
        
        // Lista de URLs a tentar, em ordem de prioridade
        const urls = [
            `/api/veiculos/modelos/by-marca/${marcaId}`,
            `/api/modelos/marca/${marcaId}`
        ];
        
        // Usar a função fetchWithFallback do config.js
        const modelos = await config.fetchWithFallback(urls, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Modelos carregados para formulário:', modelos);
        
        // Adicionar novas opções
        modelos.forEach(modelo => {
            const option = document.createElement('option');
            option.value = modelo.id;
            option.textContent = modelo.nome;
            modeloSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar modelos para formulário:', error);
        exibirMensagem('Erro ao carregar modelos. Por favor, tente novamente.', 'danger');
    }
}

// Função para exibir mensagens
function exibirMensagem(mensagem, tipo) {
    // Criar elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Adicionar ao topo da página
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Configurar para fechar automaticamente após 5 segundos
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 5000);
}
