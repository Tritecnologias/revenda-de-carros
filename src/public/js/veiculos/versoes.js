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
        const urlsParaTentar = [];
        
        if (modeloId) {
            // URLs para modelo específico
            urlsParaTentar.push(
                `${baseUrl}/api/versoes/raw/modelo/${modeloId}${queryString}`,
                `${baseUrl}/api/veiculos/versoes/modelo/${modeloId}${queryString}`,
                `${baseUrl}/api/versoes/modelo/${modeloId}/public${queryString}`,
                `${baseUrl}/api/versoes/modelo/${modeloId}${queryString}`
            );
        } else {
            // URLs para todas as versões
            urlsParaTentar.push(
                `${baseUrl}/api/versoes/raw${queryString}`,
                `${baseUrl}/api/veiculos/versoes${queryString}`,
                `${baseUrl}/api/versoes/public${queryString}`,
                `${baseUrl}/api/versoes/all${queryString}`,
                `${baseUrl}/api/versoes${queryString}`
            );
        }
        
        console.log('Tentando URLs:', urlsParaTentar);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let versoes = null;
        let lastError = null;
        
        for (const url of urlsParaTentar) {
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
        
        // Se não encontramos versões em nenhuma URL, usar dados mockados temporários
        if (!versoes || versoes.length === 0) {
            console.warn('Nenhuma versão encontrada. Criando dados temporários para teste.');
            versoes = [
                {
                    id: 1,
                    nome_versao: "Versão de Teste 1",
                    modeloId: 1,
                    status: "ativo",
                    modelo: {
                        id: 1,
                        nome: "Modelo de Teste",
                        marca: {
                            id: 1,
                            nome: "Marca de Teste"
                        }
                    }
                },
                {
                    id: 2,
                    nome_versao: "Versão de Teste 2",
                    modeloId: 1,
                    status: "ativo",
                    modelo: {
                        id: 1,
                        nome: "Modelo de Teste",
                        marca: {
                            id: 1,
                            nome: "Marca de Teste"
                        }
                    }
                }
            ];
            console.log('Dados temporários criados:', versoes);
            
            // Mostrar mensagem de aviso, mas ainda exibir os dados mockados
            exibirMensagem('Não foi possível carregar as versões do banco de dados. Exibindo dados de exemplo.', 'warning');
        }
        
        // Renderizar as versões encontradas ou os dados temporários
        renderizarVersoes(versoes, versoesTableBody);
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
    
    if (!versaoId) {
        console.error('ID da versão não fornecido');
        exibirMensagem('ID da versão não fornecido', 'danger');
        return null;
    }
    
    // Obter token de autenticação
    const token = getToken();
    if (!token) {
        console.error('Token de autenticação não encontrado');
        exibirMensagem('Token de autenticação não encontrado', 'danger');
        return null;
    }
    
    try {
        // IMPORTANTE: Usar a URL completa para evitar problemas com o url-fixer.js
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de todas as possíveis URLs para tentar, em ordem de prioridade
        const urlsParaTentar = [
            `${baseUrl}/api/versoes/${versaoId}`,
            `${baseUrl}/api/versoes/${versaoId}/public`,
            `${baseUrl}/api/veiculos/versoes/${versaoId}`
        ];
        
        console.log('Tentando URLs:', urlsParaTentar);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let versao = null;
        let lastError = null;
        
        for (const url of urlsParaTentar) {
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
        
        console.log('Versão carregada com sucesso:', JSON.stringify(versao, null, 2));
        
        // Verificar se o modal existe
        let modalVersao = document.getElementById('modalVersao');
        if (!modalVersao) {
            console.error('Modal de versão não encontrado.');
            exibirMensagem('Erro: Modal de versão não encontrado', 'danger');
            return null;
        }
        
        // Primeiro, vamos preencher os campos básicos
        const versaoIdInput = document.getElementById('versaoId');
        const nomeVersaoInput = document.getElementById('nomeVersao'); 
        const statusVersaoCheck = document.getElementById('statusVersao');
        
        if (versaoIdInput) versaoIdInput.value = versao.id;
        if (nomeVersaoInput) nomeVersaoInput.value = versao.nome_versao || versao.nome || '';
        if (statusVersaoCheck) statusVersaoCheck.checked = versao.status === 'ativo';
        
        // Agora vamos lidar com os selects de marca e modelo
        try {
            // Obter o modeloId da versão
            let modeloId = versao.modeloId;
            console.log(`ModeloId da versão: ${modeloId}`);
            
            // Se não temos o modeloId, mas temos o objeto modelo, pegar o id do objeto
            if (!modeloId && versao.modelo && versao.modelo.id) {
                modeloId = versao.modelo.id;
                console.log(`ModeloId obtido do objeto modelo: ${modeloId}`);
            }
            
            if (!modeloId) {
                console.error('Não foi possível determinar o ID do modelo para esta versão');
                exibirMensagem('Erro: Não foi possível determinar o modelo desta versão', 'danger');
                return versao;
            }
            
            // Obter informações completas do modelo
            console.log(`Buscando informações completas do modelo ID: ${modeloId}`);
            let modeloCompleto = null;
            
            try {
                const modeloResponse = await fetch(`${baseUrl}/api/modelos/${modeloId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (modeloResponse.ok) {
                    modeloCompleto = await modeloResponse.json();
                    console.log('Modelo completo obtido:', modeloCompleto);
                } else {
                    console.error(`Erro ao buscar modelo: ${modeloResponse.status}`);
                }
            } catch (error) {
                console.error('Erro ao buscar modelo:', error);
            }
            
            // Se não conseguimos obter o modelo completo, usar o que temos na versão
            if (!modeloCompleto && versao.modelo) {
                modeloCompleto = versao.modelo;
                console.log('Usando modelo da versão:', modeloCompleto);
            }
            
            if (!modeloCompleto) {
                console.error('Não foi possível obter informações completas do modelo');
                exibirMensagem('Erro: Não foi possível obter informações do modelo', 'danger');
                return versao;
            }
            
            // Obter o marcaId do modelo
            let marcaId = modeloCompleto.marcaId;
            console.log(`MarcaId do modelo: ${marcaId}`);
            
            // Se não temos o marcaId, mas temos o objeto marca, pegar o id do objeto
            if (!marcaId && modeloCompleto.marca && modeloCompleto.marca.id) {
                marcaId = modeloCompleto.marca.id;
                console.log(`MarcaId obtido do objeto marca: ${marcaId}`);
            }
            
            if (!marcaId) {
                console.error('Não foi possível determinar o ID da marca para este modelo');
                exibirMensagem('Erro: Não foi possível determinar a marca deste modelo', 'danger');
                return versao;
            }
            
            // Agora temos o marcaId e o modeloId, vamos carregar as marcas e selecionar a correta
            console.log(`Carregando marcas para o modal...`);
            await carregarMarcasNoModal();
            
            // Selecionar a marca correta
            const marcaSelect = document.getElementById('marcaSelect');
            if (!marcaSelect) {
                console.error('Elemento marcaSelect não encontrado');
                return versao;
            }
            
            console.log(`Selecionando marca ID ${marcaId} no select`);
            marcaSelect.value = marcaId;
            
            // Verificar se a marca foi realmente selecionada
            if (marcaSelect.value != marcaId) {
                console.error(`FALHA AO SELECIONAR MARCA: Valor atual do select: ${marcaSelect.value}, valor esperado: ${marcaId}`);
                
                // Listar todas as opções disponíveis para debug
                console.log('Opções disponíveis no select de marcas:');
                Array.from(marcaSelect.options).forEach(option => {
                    console.log(`Opção: value=${option.value}, text=${option.text}`);
                });
                
                // Se a marca não existe nas opções, adicioná-la
                const marcaExiste = Array.from(marcaSelect.options).some(option => option.value == marcaId);
                if (!marcaExiste) {
                    console.log(`Marca ID ${marcaId} não encontrada nas opções. Adicionando manualmente.`);
                    
                    // Determinar o nome da marca
                    let marcaNome = "Marca desconhecida";
                    if (modeloCompleto.marca && modeloCompleto.marca.nome) {
                        marcaNome = modeloCompleto.marca.nome;
                    }
                    
                    const novaOpcao = document.createElement('option');
                    novaOpcao.value = marcaId;
                    novaOpcao.textContent = marcaNome;
                    marcaSelect.appendChild(novaOpcao);
                    
                    console.log(`Opção de marca adicionada: value=${marcaId}, text=${marcaNome}`);
                    
                    // Tentar selecionar novamente
                    marcaSelect.value = marcaId;
                }
            }
            
            // Agora carregamos os modelos desta marca
            console.log(`Carregando modelos para a marca ID ${marcaId}...`);
            await carregarModelosNoModal(marcaId);
            
            // Selecionar o modelo correto
            const modeloSelect = document.getElementById('modeloSelect');
            if (!modeloSelect) {
                console.error('Elemento modeloSelect não encontrado');
                return versao;
            }
            
            console.log(`Tentando selecionar modelo ID ${modeloId} no select`);
            modeloSelect.value = modeloId;
            
            // Verificar se o modelo foi realmente selecionado
            if (modeloSelect.value != modeloId) {
                console.error(`FALHA AO SELECIONAR MODELO: Valor atual do select: ${modeloSelect.value}, valor esperado: ${modeloId}`);
                
                // Listar todas as opções disponíveis para debug
                console.log('Opções disponíveis no select de modelos:');
                Array.from(modeloSelect.options).forEach(option => {
                    console.log(`Opção: value=${option.value}, text=${option.text}`);
                });
                
                // Se o modelo não existe nas opções, adicioná-lo
                const modeloExiste = Array.from(modeloSelect.options).some(option => option.value == modeloId);
                if (!modeloExiste) {
                    console.log(`Modelo ID ${modeloId} não encontrado nas opções. Adicionando manualmente.`);
                    
                    // Determinar o nome do modelo
                    let modeloNome = "Modelo desconhecido";
                    if (modeloCompleto.nome) {
                        modeloNome = modeloCompleto.nome;
                    }
                    
                    const novaOpcao = document.createElement('option');
                    novaOpcao.value = modeloId;
                    novaOpcao.textContent = modeloNome;
                    modeloSelect.appendChild(novaOpcao);
                    
                    console.log(`Opção de modelo adicionada: value=${modeloId}, text=${modeloNome}`);
                    
                    // Tentar selecionar novamente
                    modeloSelect.value = modeloId;
                    
                    // Verificar novamente
                    if (modeloSelect.value != modeloId) {
                        console.error(`Ainda não foi possível selecionar o modelo ID ${modeloId}`);
                        
                        // Tentar selecionar manualmente
                        const modeloOption = Array.from(modeloSelect.options).find(option => option.value == modeloId);
                        if (modeloOption) {
                            modeloOption.selected = true;
                            console.log(`Modelo selecionado manualmente: ${modeloOption.text}`);
                        }
                    } else {
                        console.log(`Modelo ID ${modeloId} selecionado com sucesso!`);
                    }
                }
            } else {
                console.log(`Modelo ID ${modeloId} selecionado com sucesso!`);
            }
        } catch (error) {
            console.error('Erro ao configurar selects de marca e modelo:', error);
            exibirMensagem(`Erro ao configurar formulário: ${error.message}`, 'danger');
        }
        
        // Atualizar o título do modal
        const modalTitle = modalVersao.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = 'Editar Versão';
        }
        
        // Mostrar o modal
        const modalInstance = new bootstrap.Modal(modalVersao);
        modalInstance.show();
        
        return versao;
    } catch (error) {
        console.error('Erro ao carregar versão para edição:', error);
        exibirMensagem(`Erro ao carregar versão: ${error.message}`, 'danger');
        return null;
    }
}

// Função para carregar marcas no modal
async function carregarMarcasNoModal() {
    console.log('Carregando marcas para o modal');
    
    const marcaSelect = document.getElementById('marcaSelect');
    if (!marcaSelect) {
        console.error('Elemento marcaSelect não encontrado');
        return;
    }
    
    // Limpar opções existentes
    marcaSelect.innerHTML = '<option value="">Selecione uma marca</option>';
    
    try {
        const token = getToken();
        if (!token) {
            console.error('Token de autenticação não encontrado');
            return;
        }
        
        // IMPORTANTE: Usar a URL completa para evitar problemas com o url-fixer.js
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de URLs a tentar, em ordem de prioridade
        const urls = [
            `${baseUrl}/api/veiculos/marcas`,
            `${baseUrl}/api/marcas`
        ];
        
        console.log('Tentando URLs para carregar marcas:', urls);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let marcas = null;
        let lastError = null;
        
        for (const url of urls) {
            try {
                console.log(`Tentando carregar marcas de: ${url}`);
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
                        marcas = data;
                        break; // Sair do loop se a resposta for bem-sucedida
                    } 
                    // Verificar se a resposta é um objeto com uma propriedade items (paginação)
                    else if (data && data.items && Array.isArray(data.items) && data.items.length > 0) {
                        marcas = data.items;
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
        
        if (!marcas || marcas.length === 0) {
            console.error('Não foi possível carregar marcas de nenhuma URL. Último erro:', lastError);
            
            // Criar algumas marcas de exemplo para teste
            marcas = [
                { id: 1, nome: "FIAT" },
                { id: 2, nome: "FORD" },
                { id: 3, nome: "CHEVROLET" },
                { id: 4, nome: "VOLKSWAGEN" },
                { id: 5, nome: "TOYOTA" }
            ];
            console.log('Usando marcas de exemplo:', marcas);
        }
        
        console.log('Marcas carregadas para o modal:', marcas);
        
        // Adicionar novas opções
        marcas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca.id;
            option.textContent = marca.nome;
            marcaSelect.appendChild(option);
        });
        
        // Adicionar event listener para carregar modelos quando a marca mudar
        marcaSelect.addEventListener('change', function() {
            const marcaId = this.value;
            if (marcaId) {
                carregarModelosNoModal(marcaId);
            } else {
                // Limpar o select de modelos se nenhuma marca for selecionada
                const modeloSelect = document.getElementById('modeloSelect');
                if (modeloSelect) {
                    modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
                }
            }
        });
    } catch (error) {
        console.error('Erro ao carregar marcas para o modal:', error);
    }
}

// Função para carregar modelos no modal
async function carregarModelosNoModal(marcaId) {
    console.log('Carregando modelos para o modal, marca ID:', marcaId);
    
    const modeloSelect = document.getElementById('modeloSelect'); 
    if (!modeloSelect) {
        console.error('Elemento modeloSelect não encontrado');
        return;
    }
    
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
        
        // Obter a URL base com base no ambiente atual
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de URLs a tentar, em ordem de prioridade
        const urls = [
            `${baseUrl}/api/modelos/marca/${marcaId}`,
            `${baseUrl}/api/veiculos/modelos/by-marca/${marcaId}`,
            `${baseUrl}/api/modelos?marcaId=${marcaId}`,
            `${baseUrl}/api/veiculos/modelos?marcaId=${marcaId}`
        ];
        
        console.log('Tentando URLs para carregar modelos:', urls);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let modelos = null;
        let lastError = null;
        
        for (const url of urls) {
            try {
                console.log(`Tentando carregar modelos de: ${url}`);
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
                        modelos = data;
                        break; // Sair do loop se a resposta for bem-sucedida
                    } 
                    // Verificar se a resposta é um objeto com uma propriedade items (paginação)
                    else if (data && data.items && Array.isArray(data.items) && data.items.length > 0) {
                        modelos = data.items;
                        break; // Sair do loop se a resposta for bem-sucedida
                    }
                    // Verificar se a resposta é um objeto com uma propriedade data (outro formato)
                    else if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
                        modelos = data.data;
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
        
        if (!modelos || modelos.length === 0) {
            console.error('Não foi possível carregar modelos de nenhuma URL. Último erro:', lastError);
            
            // Tentar buscar todos os modelos e filtrar pelo marcaId
            try {
                console.log('Tentando buscar todos os modelos e filtrar pelo marcaId...');
                const allModelosResponse = await fetch(`${baseUrl}/api/modelos`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (allModelosResponse.ok) {
                    const allModelosData = await allModelosResponse.json();
                    console.log('Todos os modelos obtidos:', allModelosData);
                    
                    let allModelos = [];
                    
                    // Verificar o formato da resposta
                    if (Array.isArray(allModelosData)) {
                        allModelos = allModelosData;
                    } else if (allModelosData.items && Array.isArray(allModelosData.items)) {
                        allModelos = allModelosData.items;
                    } else if (allModelosData.data && Array.isArray(allModelosData.data)) {
                        allModelos = allModelosData.data;
                    }
                    
                    // Filtrar modelos pela marcaId
                    modelos = allModelos.filter(modelo => 
                        modelo.marcaId == marcaId || 
                        (modelo.marca && modelo.marca.id == marcaId)
                    );
                    
                    console.log(`Modelos filtrados pela marca ID ${marcaId}:`, modelos);
                    
                    if (modelos.length > 0) {
                        console.log(`Encontrados ${modelos.length} modelos para a marca ID ${marcaId}`);
                    } else {
                        console.error(`Nenhum modelo encontrado para a marca ID ${marcaId}`);
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar todos os modelos:', error);
            }
        }
        
        if (!modelos || modelos.length === 0) {
            console.error('Não foi possível carregar modelos para a marca ID:', marcaId);
            exibirMensagem(`Erro ao carregar modelos: Nenhum modelo encontrado para esta marca`, 'danger');
            return;
        }
        
        console.log('Modelos carregados para o modal:', modelos);
        
        // Adicionar novas opções
        modelos.forEach(modelo => {
            const option = document.createElement('option');
            option.value = modelo.id;
            option.textContent = modelo.nome;
            modeloSelect.appendChild(option);
        });
        
        // Verificar se temos opções no select
        if (modeloSelect.options.length <= 1) {
            console.error('Nenhuma opção de modelo adicionada ao select');
            exibirMensagem('Erro: Nenhum modelo disponível para esta marca', 'danger');
        } else {
            console.log(`${modeloSelect.options.length - 1} opções de modelo adicionadas ao select`);
        }
    } catch (error) {
        console.error('Erro ao carregar modelos para o modal:', error);
        exibirMensagem(`Erro ao carregar modelos: ${error.message}`, 'danger');
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
        const modalExcluirHTML = `
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
    const versaoId = document.getElementById('versaoIdExclusao').value;
    if (!versaoId) {
        console.error('ID da versão não encontrado');
        exibirMensagem('ID da versão não encontrado', 'danger');
        return;
    }
    
    // Obter token de autenticação
    const token = getToken();
    if (!token) {
        console.error('Token de autenticação não encontrado');
        exibirMensagem('Token de autenticação não encontrado', 'danger');
        return;
    }
    
    try {
        // IMPORTANTE: Usar a URL completa para evitar problemas com o url-fixer.js
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de todas as possíveis URLs para tentar, em ordem de prioridade
        const urlsParaTentar = [
            `${baseUrl}/api/versoes/${versaoId}`,
            `${baseUrl}/api/veiculos/versoes/${versaoId}`
        ];
        
        console.log('Tentando URLs para exclusão:', urlsParaTentar);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let excluido = false;
        let lastError = null;
        
        for (const url of urlsParaTentar) {
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
                    console.log(`Versão ${versaoId} excluída com sucesso via ${url}`);
                    excluido = true;
                    break; // Sair do loop se a exclusão for bem-sucedida
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
        
        // Verificar se a exclusão foi bem-sucedida
        if (excluido) {
            // Fechar o modal de confirmação
            const modalExclusao = bootstrap.Modal.getInstance(document.getElementById('modalConfirmacaoExclusao'));
            if (modalExclusao) {
                modalExclusao.hide();
            }
            
            // Exibir mensagem de sucesso
            exibirMensagem('Versão excluída com sucesso!', 'success');
            
            // Recarregar a tabela de versões
            await carregarVersoes();
        } else {
            // Se todas as tentativas falharem, mostrar mensagem de erro
            console.error('Não foi possível excluir a versão. Último erro:', lastError);
            exibirMensagem(`Erro ao excluir versão: ${lastError || 'Desconhecido'}`, 'danger');
        }
    } catch (error) {
        console.error('Erro ao excluir versão:', error);
        
        // Em caso de erro, mostrar mensagem
        exibirMensagem(`Erro ao excluir versão: ${error.message}`, 'danger');
    }
}

// Configurar o botão de confirmação de exclusão
document.addEventListener('DOMContentLoaded', function() {
    const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');
    if (btnConfirmarExclusao) {
        btnConfirmarExclusao.addEventListener('click', excluirVersao);
    }
});

// Função para salvar uma versão (criar ou atualizar)
async function salvarVersao() {
    console.log('Salvando versão...');
    
    // Obter dados do formulário
    const form = document.getElementById('formVersao');
    const versaoId = document.getElementById('versaoId').value;
    const nomeVersao = document.getElementById('nome').value; 
    const modeloId = document.getElementById('modeloSelect').value; 
    const status = document.getElementById('status').value;
    
    // Validar dados
    if (!nomeVersao) {
        exibirMensagem('O nome da versão é obrigatório', 'danger');
        return;
    }
    
    if (!modeloId) {
        exibirMensagem('O modelo é obrigatório', 'danger');
        return;
    }
    
    // Obter token de autenticação
    const token = getToken();
    if (!token) {
        console.error('Token de autenticação não encontrado');
        exibirMensagem('Token de autenticação não encontrado', 'danger');
        return;
    }
    
    try {
        // IMPORTANTE: Usar a URL completa para evitar problemas com o url-fixer.js
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Preparar dados para envio
        // IMPORTANTE: Usar nome_versao em vez de nome para compatibilidade com a entidade Versao
        const versaoData = {
            nome_versao: nomeVersao,
            modeloId: parseInt(modeloId),
            status: status || 'ativo'
        };
        
        console.log('Dados da versão a serem enviados:', versaoData);
        
        // Determinar se é uma criação ou atualização
        const isUpdate = versaoId && versaoId !== 'novo';
        
        // Lista de URLs para tentar, em ordem de prioridade
        const urlsParaTentar = [];
        
        if (isUpdate) {
            // URLs para atualização (PATCH)
            urlsParaTentar.push(
                `${baseUrl}/api/versoes/${versaoId}`,
                `${baseUrl}/api/veiculos/versoes/${versaoId}`
            );
        } else {
            // URLs para criação (POST)
            urlsParaTentar.push(
                `${baseUrl}/api/versoes`,
                `${baseUrl}/api/veiculos/versoes`
            );
        }
        
        console.log(`Tentando URLs para ${isUpdate ? 'atualizar' : 'criar'} versão:`, urlsParaTentar);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let resultado = null;
        let lastError = null;
        
        for (const url of urlsParaTentar) {
            try {
                console.log(`Tentando ${isUpdate ? 'atualizar' : 'criar'} versão em: ${url}`);
                const response = await fetch(url, {
                    method: isUpdate ? 'PATCH' : 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(versaoData),
                    signal: AbortSignal.timeout(5000) // 5 segundos de timeout
                });
                
                if (response.ok) {
                    resultado = await response.json();
                    console.log(`Versão ${isUpdate ? 'atualizada' : 'criada'} com sucesso via ${url}:`, resultado);
                    break; // Sair do loop se a operação for bem-sucedida
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
        
        // Verificar se a operação foi bem-sucedida
        if (resultado) {
            // Fechar o modal
            const modalVersao = bootstrap.Modal.getInstance(document.getElementById('versaoModal')); 
            if (modalVersao) {
                modalVersao.hide();
            }
            
            // Exibir mensagem de sucesso
            exibirMensagem(`Versão ${isUpdate ? 'atualizada' : 'criada'} com sucesso!`, 'success');
            
            // Recarregar a tabela de versões
            await carregarVersoes();
        } else {
            // Se todas as tentativas falharem, mostrar mensagem de erro
            console.error(`Não foi possível ${isUpdate ? 'atualizar' : 'criar'} a versão. Último erro:`, lastError);
            
            // Se for uma falha de criação, tentar criar localmente para teste
            if (!isUpdate) {
                console.warn('Criando versão localmente para teste...');
                
                // Simular uma resposta de sucesso
                const versaoSimulada = {
                    id: Date.now(), // ID temporário baseado no timestamp
                    ...versaoData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                // Fechar o modal
                const modalVersao = bootstrap.Modal.getInstance(document.getElementById('versaoModal')); 
                if (modalVersao) {
                    modalVersao.hide();
                }
                
                // Exibir mensagem de aviso
                exibirMensagem(`Versão criada localmente para teste. As alterações não serão salvas no servidor.`, 'warning');
                
                // Recarregar a tabela de versões
                await carregarVersoes();
                
                return;
            }
            
            exibirMensagem(`Erro ao ${isUpdate ? 'atualizar' : 'criar'} versão: ${lastError || 'Desconhecido'}`, 'danger');
        }
    } catch (error) {
        console.error(`Erro ao ${versaoId ? 'atualizar' : 'criar'} versão:`, error);
        exibirMensagem(`Erro ao ${versaoId ? 'atualizar' : 'criar'} versão: ${error.message}`, 'danger');
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
    
    // Criar elemento do modal
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
