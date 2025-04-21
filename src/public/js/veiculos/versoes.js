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
        
        // IMPORTANTE: Usar a URL completa para evitar problemas com o url-fixer.js
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de todas as possíveis URLs para tentar, em ordem de prioridade
        const urls = [];
        
        if (modeloId) {
            // URLs para modelo específico
            urls.push(
                `${baseUrl}/api/veiculos/versoes/modelo/${modeloId}${queryString}`,
                `${baseUrl}/api/versoes/modelo/${modeloId}/public${queryString}`,
                `${baseUrl}/api/versoes/modelo/${modeloId}${queryString}`
            );
        } else {
            // URLs para todas as versões
            urls.push(
                `${baseUrl}/api/veiculos/versoes${queryString}`,
                `${baseUrl}/api/versoes/public${queryString}`,
                `${baseUrl}/api/versoes${queryString}`
            );
        }
        
        console.log('Tentando URLs para buscar versões:', urls);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let versoes = null;
        let lastError = null;
        
        for (const url of urls) {
            try {
                console.log(`Tentando carregar versões de: ${url}`);
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    signal: AbortSignal.timeout(5000) // 5 segundos de timeout
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`URL bem-sucedida: ${url}, dados recebidos:`, data);
                    
                    // Verificar se a resposta é um array
                    if (Array.isArray(data) && data.length > 0) {
                        versoes = data;
                        break; // Sair do loop se a resposta for bem-sucedida
                    } 
                    // Verificar se a resposta é um objeto com uma propriedade items (paginação)
                    else if (data && data.items && Array.isArray(data.items) && data.items.length > 0) {
                        versoes = data.items;
                        break; // Sair do loop se a resposta for bem-sucedida
                    }
                    
                    // Se chegou aqui, a resposta foi bem-sucedida mas não contém dados utilizáveis
                    console.warn(`A URL ${url} retornou uma resposta vazia ou em formato inesperado:`, data);
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
        
        // Se encontramos versões, renderizá-las
        if (versoes && versoes.length > 0) {
            console.log('Versões carregadas com sucesso:', versoes);
            renderizarVersoes(versoes, versoesTableBody);
        } else {
            // Se não conseguimos carregar versões de nenhuma URL, mostrar mensagem de erro
            console.error('Não foi possível carregar versões de nenhuma URL. Último erro:', lastError);
            versoesTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Não foi possível carregar as versões do banco de dados. Erro: ${lastError || 'Desconhecido'}</td></tr>`;
            exibirMensagem(`Erro ao carregar versões: ${lastError || 'Desconhecido'}`, 'danger');
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
        // Verificar se a versão tem o nome correto (nome_versao)
        const nomeVersao = versao.nome_versao || versao.nome || 'Nome não disponível';
        
        // Verificar se a versão tem um modelo associado
        let nomeModelo = 'Modelo não disponível';
        if (versao.modelo) {
            nomeModelo = versao.modelo.nome || 'Modelo sem nome';
        }
        
        // Verificar se a versão tem uma marca associada através do modelo
        let nomeMarca = 'Marca não disponível';
        if (versao.modelo && versao.modelo.marca) {
            nomeMarca = versao.modelo.marca.nome || 'Marca sem nome';
        }
        
        // Criar a linha da tabela
        const row = document.createElement('tr');
        
        // Definir o conteúdo da linha
        row.innerHTML = `
            <td>${versao.id}</td>
            <td>${nomeVersao}</td>
            <td>${nomeModelo}</td>
            <td>${nomeMarca}</td>
            <td>
                <span class="badge ${versao.status === 'ativo' ? 'bg-success' : 'bg-danger'}">
                    ${versao.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="carregarVersaoParaEdicao(${versao.id})">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-sm btn-danger" onclick="confirmarExclusaoVersao(${versao.id}, '${nomeVersao.replace(/'/g, "\\'")}')">
                    <i class="bi bi-trash"></i> Excluir
                </button>
            </td>
        `;
        
        // Adicionar a linha à tabela
        tableBody.appendChild(row);
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
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de todas as possíveis URLs para tentar, em ordem de prioridade
        const urls = [
            `${baseUrl}/api/veiculos/versoes/${versaoId}`,
            `${baseUrl}/api/versoes/${versaoId}`,
            `${baseUrl}/api/versoes/${versaoId}/public`
        ];
        
        console.log('Tentando URLs para buscar versão:', urls);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let versao = null;
        let lastError = null;
        
        for (const url of urls) {
            try {
                console.log(`Tentando carregar versão de: ${url}`);
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    signal: AbortSignal.timeout(5000) // 5 segundos de timeout
                });
                
                if (response.ok) {
                    versao = await response.json();
                    console.log(`URL bem-sucedida: ${url}, dados recebidos:`, versao);
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
        
        if (!versao) {
            console.error('Não foi possível carregar a versão de nenhuma URL. Último erro:', lastError);
            exibirMensagem(`Erro ao carregar versão: ${lastError || 'Desconhecido'}`, 'danger');
            return null;
        }
        
        console.log('Versão carregada:', versao);
        
        // Preencher o formulário de edição
        document.getElementById('editVersaoId').value = versao.id;
        document.getElementById('editVersaoNome').value = versao.nome_versao; // Usar nome_versao, não nome
        document.getElementById('editVersaoModelo').value = versao.modeloId;
        document.getElementById('editVersaoStatus').value = versao.status || 'ativo';
        
        // Verificar se o modal existe
        let editModal = document.getElementById('editVersaoModal');
        if (!editModal) {
            console.warn('Modal de edição não encontrado no DOM. Criando dinamicamente...');
            
            // Criar o modal dinamicamente
            const modalHtml = `
                <div class="modal fade" id="editVersaoModal" tabindex="-1" aria-labelledby="editVersaoModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="editVersaoModalLabel">Editar Versão</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form id="editVersaoForm">
                                    <input type="hidden" id="editVersaoId">
                                    <div class="mb-3">
                                        <label for="editVersaoNome" class="form-label">Nome da Versão</label>
                                        <input type="text" class="form-control" id="editVersaoNome" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="editVersaoModelo" class="form-label">Modelo</label>
                                        <select class="form-select" id="editVersaoModelo" required>
                                            <option value="">Selecione um modelo</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label for="editVersaoStatus" class="form-label">Status</label>
                                        <select class="form-select" id="editVersaoStatus">
                                            <option value="ativo">Ativo</option>
                                            <option value="inativo">Inativo</option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" onclick="salvarVersao()">Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Adicionar o modal ao corpo do documento
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            
            // Obter a referência ao modal recém-criado
            editModal = document.getElementById('editVersaoModal');
            
            // Carregar modelos para o select
            carregarModelos('editVersaoModelo');
        }
        
        // Verificar se já existe uma instância do modal
        let modalInstance = bootstrap.Modal.getInstance(editModal);
        
        if (!modalInstance) {
            // Se não existir, criar uma nova instância
            modalInstance = new bootstrap.Modal(editModal);
        }
        
        // Abrir o modal
        modalInstance.show();
        
        return versao;
    } catch (error) {
        console.error('Erro ao carregar versão para edição:', error);
        exibirMensagem('Erro ao carregar versão para edição. Por favor, tente novamente.', 'danger');
        return null;
    }
}

// Função para confirmar exclusão de versão
function confirmarExclusaoVersao(versaoId, versaoNome) {
    console.log(`Confirmando exclusão da versão ${versaoId} (${versaoNome})...`);
    
    // Verificar se o modal existe
    let deleteModal = document.getElementById('deleteVersaoModal');
    if (!deleteModal) {
        console.warn('Modal de exclusão não encontrado no DOM. Criando dinamicamente...');
        
        // Criar o modal dinamicamente
        const modalHtml = `
            <div class="modal fade" id="deleteVersaoModal" tabindex="-1" aria-labelledby="deleteVersaoModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="deleteVersaoModalLabel">Confirmar Exclusão</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>Tem certeza que deseja excluir a versão <span id="deleteVersaoNome"></span>?</p>
                            <input type="hidden" id="deleteVersaoId">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-danger" onclick="excluirVersao()">Excluir</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar o modal ao corpo do documento
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Obter a referência ao modal recém-criado
        deleteModal = document.getElementById('deleteVersaoModal');
    }
    
    // Preencher os dados no modal
    document.getElementById('deleteVersaoId').value = versaoId;
    document.getElementById('deleteVersaoNome').textContent = versaoNome;
    
    // Verificar se já existe uma instância do modal
    let modalInstance = bootstrap.Modal.getInstance(deleteModal);
    
    if (!modalInstance) {
        // Se não existir, criar uma nova instância
        modalInstance = new bootstrap.Modal(deleteModal);
    }
    
    // Abrir o modal
    modalInstance.show();
}

// Função para excluir uma versão
async function excluirVersao() {
    console.log('Excluindo versão...');
    
    // Obter o ID da versão a ser excluída
    const versaoId = document.getElementById('deleteVersaoId').value;
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
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de todas as possíveis URLs para tentar, em ordem de prioridade
        const urls = [
            `${baseUrl}/api/versoes/${versaoId}`,
            `${baseUrl}/api/veiculos/versoes/${versaoId}`
        ];
        
        console.log('Tentando URLs para excluir versão:', urls);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let resultado = null;
        let lastError = null;
        
        for (const url of urls) {
            try {
                console.log(`Tentando excluir versão em: ${url}`);
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    signal: AbortSignal.timeout(5000) // 5 segundos de timeout
                });
                
                if (response.ok) {
                    // Para DELETE, a resposta pode ser vazia
                    try {
                        resultado = await response.json();
                    } catch (e) {
                        resultado = { success: true };
                    }
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
        
        if (!resultado) {
            console.error('Não foi possível excluir a versão em nenhuma URL. Último erro:', lastError);
            exibirMensagem(`Erro ao excluir versão: ${lastError || 'Desconhecido'}`, 'danger');
            return;
        }
        
        console.log('Versão excluída com sucesso');
        
        // Fechar modal
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteVersaoModal'));
        if (deleteModal) {
            deleteModal.hide();
        }
        
        // Exibir mensagem de sucesso
        exibirMensagem('Versão excluída com sucesso!', 'success');
        
        // Recarregar a lista de versões
        carregarVersoes();
    } catch (error) {
        console.error('Erro ao excluir versão:', error);
        exibirMensagem('Erro ao excluir versão. Por favor, tente novamente.', 'danger');
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

// Função para salvar uma versão (criar ou atualizar)
async function salvarVersao() {
    console.log('Salvando versão...');
    
    // Obter dados do formulário
    const versaoId = document.getElementById('editVersaoId').value;
    const nome = document.getElementById('editVersaoNome').value;
    const modeloId = document.getElementById('editVersaoModelo').value;
    const status = document.getElementById('editVersaoStatus').value;
    
    // Validar dados
    if (!nome || !modeloId) {
        exibirMensagem('Por favor, preencha todos os campos obrigatórios.', 'warning');
        return;
    }
    
    // Obter token de autenticação
    const token = getToken();
    if (!token) {
        console.error('Token de autenticação não encontrado');
        return;
    }
    
    // Construir objeto com os dados da versão
    const versaoData = {
        nome_versao: nome,
        modeloId: parseInt(modeloId),
        status: status
    };
    
    console.log('Dados da versão a salvar:', versaoData);
    
    try {
        // Determinar a URL base atual
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de todas as possíveis URLs para tentar, em ordem de prioridade
        let urls = [];
        let method;
        
        if (versaoId) {
            // Atualizar versão existente
            urls = [
                `${baseUrl}/api/versoes/${versaoId}`,
                `${baseUrl}/api/veiculos/versoes/${versaoId}`
            ];
            method = 'PATCH';
        } else {
            // Criar nova versão
            urls = [
                `${baseUrl}/api/versoes`,
                `${baseUrl}/api/veiculos/versoes`
            ];
            method = 'POST';
        }
        
        console.log('Tentando URLs para salvar versão:', urls);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let resultado = null;
        let lastError = null;
        
        for (const url of urls) {
            try {
                console.log(`Tentando salvar versão em: ${url}`);
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(versaoData),
                    signal: AbortSignal.timeout(5000) // 5 segundos de timeout
                });
                
                if (response.ok) {
                    resultado = await response.json();
                    console.log(`URL bem-sucedida: ${url}, dados recebidos:`, resultado);
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
        
        if (!resultado) {
            console.error('Não foi possível salvar a versão em nenhuma URL. Último erro:', lastError);
            exibirMensagem(`Erro ao salvar versão: ${lastError || 'Desconhecido'}`, 'danger');
            return;
        }
        
        console.log('Versão salva com sucesso:', resultado);
        
        // Fechar o modal
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editVersaoModal'));
        if (editModal) {
            editModal.hide();
        }
        
        // Exibir mensagem de sucesso
        exibirMensagem(versaoId ? 'Versão atualizada com sucesso!' : 'Versão criada com sucesso!', 'success');
        
        // Recarregar lista de versões
        carregarVersoes();
        
    } catch (error) {
        console.error('Erro ao salvar versão:', error);
        exibirMensagem('Erro ao salvar versão. Por favor, tente novamente.', 'danger');
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
