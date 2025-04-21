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
        
        // Implementação direta em vez de depender de config.fetchWithFallback
        let versoes = [];
        let lastError = null;
        let usouDadosEstaticos = false;
        
        // Determinar a URL base atual
        const currentUrl = window.location.href;
        const isLocalhost = currentUrl.includes('localhost');
        const isExternalIP = currentUrl.includes('69.62.91.195');
        
        // Priorizar URLs baseadas no ambiente atual
        let urlsPrioritarias = [];
        if (isExternalIP) {
            // Se estamos no IP externo, priorizar URLs absolutas com esse IP
            urlsPrioritarias = [`http://69.62.91.195:3000`];
        } else if (isLocalhost) {
            // Se estamos no localhost, priorizar URLs absolutas com localhost
            urlsPrioritarias = [`http://localhost:3000`];
        } else {
            // Caso contrário, usar URLs relativas
            urlsPrioritarias = [``];
        }
        
        if (modeloId) {
            // URLs para modelo específico, priorizando o ambiente atual
            const urls = [];
            
            // Adicionar URLs prioritárias baseadas no ambiente
            for (const baseUrl of urlsPrioritarias) {
                urls.push(
                    `${baseUrl}/api/versoes/modelo/${modeloId}/public${queryString}`,
                    `${baseUrl}/api/versoes/modelo/${modeloId}${queryString}`,
                    `${baseUrl}/api/veiculos/versoes/modelo/${modeloId}${queryString}`
                );
            }
            
            // Adicionar URLs de fallback para outros ambientes
            if (!isExternalIP) urls.push(`http://69.62.91.195:3000/api/versoes/modelo/${modeloId}/public${queryString}`);
            if (!isLocalhost) urls.push(`http://localhost:3000/api/versoes/modelo/${modeloId}/public${queryString}`);
            
            console.log('Tentando URLs para modelo específico:', urls);
            
            // Tentar cada URL em sequência
            for (const url of urls) {
                try {
                    console.log(`Tentando carregar versões de: ${url}`);
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        // Adicionar timeout para não ficar esperando muito tempo
                        signal: AbortSignal.timeout(5000) // 5 segundos de timeout
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log(`URL bem-sucedida: ${url}, dados recebidos:`, data);
                        
                        // Verificar se a resposta é um array
                        if (Array.isArray(data)) {
                            // Se for um array não vazio, usá-lo diretamente
                            if (data.length > 0) {
                                versoes = data;
                                break; // Sair do loop se a resposta for bem-sucedida
                            }
                        } 
                        // Verificar se a resposta é um objeto com uma propriedade items (paginação)
                        else if (data && data.items && Array.isArray(data.items)) {
                            // Se for um array não vazio, usá-lo
                            if (data.items.length > 0) {
                                versoes = data.items;
                                break; // Sair do loop se a resposta for bem-sucedida
                            }
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
        } else {
            // URLs para todas as versões, priorizando o ambiente atual
            const urls = [];
            
            // Adicionar URLs prioritárias baseadas no ambiente
            for (const baseUrl of urlsPrioritarias) {
                urls.push(
                    `${baseUrl}/api/versoes/public${queryString}`,
                    `${baseUrl}/api/versoes${queryString}`,
                    `${baseUrl}/api/veiculos/versoes${queryString}`
                );
            }
            
            // Adicionar URLs de fallback para outros ambientes
            if (!isExternalIP) urls.push(`http://69.62.91.195:3000/api/versoes/public${queryString}`);
            if (!isLocalhost) urls.push(`http://localhost:3000/api/versoes/public${queryString}`);
            
            console.log('Tentando URLs para todas as versões:', urls);
            
            // Tentar cada URL em sequência
            for (const url of urls) {
                try {
                    console.log(`Tentando carregar versões de: ${url}`);
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        // Adicionar timeout para não ficar esperando muito tempo
                        signal: AbortSignal.timeout(5000) // 5 segundos de timeout
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log(`URL bem-sucedida: ${url}, dados recebidos:`, data);
                        
                        // Verificar se a resposta é um array
                        if (Array.isArray(data)) {
                            // Se for um array não vazio, usá-lo diretamente
                            if (data.length > 0) {
                                versoes = data;
                                break; // Sair do loop se a resposta for bem-sucedida
                            }
                        } 
                        // Verificar se a resposta é um objeto com uma propriedade items (paginação)
                        else if (data && data.items && Array.isArray(data.items)) {
                            // Se for um array não vazio, usá-lo
                            if (data.items.length > 0) {
                                versoes = data.items;
                                break; // Sair do loop se a resposta for bem-sucedida
                            }
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
        }
        
        // Se não conseguimos carregar versões de nenhuma URL, usar dados estáticos como fallback
        if (versoes.length === 0) {
            console.log('Nenhuma versão encontrada. Usando dados estáticos como fallback.');
            versoes = obterDadosEstaticosVersoes(modeloId);
            usouDadosEstaticos = true;
            
            // Mostrar aviso na interface se estamos usando dados mockados
            if (versoesTableBody) {
                const alertaDiv = document.createElement('div');
                alertaDiv.className = 'alert alert-warning mt-2';
                alertaDiv.innerHTML = '<strong>Atenção:</strong> Exibindo dados mockados. Não foi possível conectar ao banco de dados.';
                
                // Inserir o alerta antes da tabela
                const tabelaContainer = versoesTableBody.closest('.table-responsive');
                if (tabelaContainer && tabelaContainer.parentNode) {
                    tabelaContainer.parentNode.insertBefore(alertaDiv, tabelaContainer);
                }
            }
        }
        
        console.log('Versões carregadas com sucesso:', versoes);
        
        // Só renderizar se estivermos na página correta
        if (versoesTableBody) {
            renderizarVersoes(versoes, versoesTableBody, usouDadosEstaticos);
        } else {
            console.warn('Elemento da tabela de versões não encontrado. Não é possível renderizar versões.');
        }
    } catch (error) {
        console.error('Erro ao carregar versões:', error);
        
        // Em caso de erro, mostrar mensagem e limpar tabela
        if (versoesTableBody) {
            versoesTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Erro ao carregar versões. Por favor, tente novamente.</td></tr>';
        }
        
        exibirMensagem('Erro ao carregar versões. Por favor, tente novamente.', 'danger');
    }
}

// Função para renderizar a tabela de versões
function renderizarVersoes(data, tableBody, usouDadosEstaticos = false) {
    // Limpar a tabela
    tableBody.innerHTML = '';
    
    // Verificar se há dados para exibir
    if (!data || data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhuma versão encontrada.</td></tr>';
        return;
    }
    
    // Renderizar cada versão
    data.forEach(versao => {
        const tr = document.createElement('tr');
        
        // Adicionar classe se estamos usando dados mockados
        if (usouDadosEstaticos) {
            tr.classList.add('table-warning');
        }
        
        // Verificar se a versão tem um modelo associado
        const modeloNome = versao.modelo?.nome || versao.modelo_nome || 'N/A';
        const marcaNome = versao.modelo?.marca?.nome || versao.marca_nome || 'N/A';
        
        // Construir a linha da tabela
        tr.innerHTML = `
            <td>${versao.id}</td>
            <td>${versao.nome}</td>
            <td>${modeloNome}</td>
            <td>${marcaNome}</td>
            <td>${versao.status || 'ativo'}</td>
            <td>
                <button class="btn btn-sm btn-primary editar-versao" data-id="${versao.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger excluir-versao" data-id="${versao.id}" data-nome="${versao.nome}">
                    <i class="fas fa-trash"></i>
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
            
            // Configurar o modal de confirmação
            document.getElementById('versaoIdExcluir').value = versaoId;
            document.getElementById('versaoNomeExcluir').textContent = versaoNome;
            
            // Abrir o modal
            const modalExcluir = new bootstrap.Modal(document.getElementById('modalExcluirVersao'));
            modalExcluir.show();
        });
    });
}

// Função para carregar uma versão específica para edição
async function carregarVersaoParaEdicao(versaoId) {
    console.log(`Carregando versão ${versaoId} para edição...`);
    
    try {
        const token = getToken();
        if (!token) {
            console.error('Token de autenticação não encontrado');
            return;
        }
        
        // Lista de URLs a tentar, em ordem de prioridade
        const urls = [
            `/api/versoes/${versaoId}`,
            `/api/veiculos/versoes/${versaoId}`
        ];
        
        // Usar a função fetchWithFallback do config.js
        const versao = await config.fetchWithFallback(urls, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Versão carregada com sucesso:', versao);
        
        // Preencher formulário com dados da versão
        document.getElementById('versaoId').value = versao.id;
        
        // Verificar qual ID do campo de nome está presente na página
        const nomeField = document.getElementById('nome') || document.getElementById('nomeVersao');
        if (nomeField) {
            nomeField.value = versao.nome || versao.nome_versao || '';
        } else {
            console.warn('Campo de nome da versão não encontrado no formulário');
        }
        
        // Verificar se os campos opcionais existem antes de tentar preenchê-los
        const descricaoField = document.getElementById('descricao');
        if (descricaoField) {
            descricaoField.value = versao.descricao || '';
        }
        
        const anoField = document.getElementById('ano');
        if (anoField) {
            anoField.value = versao.ano || '';
        }
        
        const precoField = document.getElementById('preco');
        if (precoField) {
            precoField.value = versao.preco || '';
        }
        
        // Verificar qual campo de status está presente na página
        let status = 'ativo';
        const statusField = document.getElementById('status');
        const statusCheckbox = document.getElementById('statusVersao');
        
        if (statusField) {
            status = statusField.value;
        } else if (statusCheckbox) {
            // Se for um checkbox, marcar se o status for 'ativo'
            statusCheckbox.checked = versao.status === 'ativo';
        }
        
        // Carregar marcas e modelos
        await carregarMarcasFormulario();
        
        if (versao.modelo && versao.modelo.marca) {
            const marcaSelect = document.getElementById('marcaSelect');
            if (marcaSelect) {
                marcaSelect.value = versao.modelo.marca.id;
                
                // Carregar modelos da marca e depois selecionar o modelo correto
                await carregarModelosFormulario(versao.modelo.marca.id);
                
                // Selecionar o modelo correto
                const modeloSelect = document.getElementById('modeloSelect');
                if (modeloSelect) {
                    modeloSelect.value = versao.modelo.id || versao.modeloId;
                }
            }
        }
        
        // Verificar se o botão de exclusão existe antes de tentar modificá-lo
        const btnExcluirVersao = document.getElementById('btnExcluirVersao');
        if (btnExcluirVersao) {
            btnExcluirVersao.style.display = 'block';
        }
        
        // Abrir modal - verificar qual ID do modal está presente na página
        const versaoModal = document.getElementById('versaoModal') || document.getElementById('modalVersao');
        if (versaoModal) {
            const modal = new bootstrap.Modal(versaoModal);
            modal.show();
        } else {
            console.error('Modal de versão não encontrado na página');
        }
    } catch (error) {
        console.error('Erro ao carregar versão para edição:', error);
        exibirMensagem('Erro ao carregar versão para edição: ' + error.message, 'danger');
    }
}

// Função para salvar uma versão (criar ou atualizar)
async function salvarVersao(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    console.log('Salvando versão...');
    
    try {
        // Obter dados do formulário
        const versaoId = document.getElementById('versaoId').value;
        
        // Verificar qual ID do campo de nome está presente na página
        const nomeField = document.getElementById('nome') || document.getElementById('nomeVersao');
        if (!nomeField) {
            throw new Error('Campo de nome da versão não encontrado no formulário');
        }
        const nome = nomeField.value;
        
        // Obter valores dos campos opcionais se existirem
        let descricao = '';
        const descricaoField = document.getElementById('descricao');
        if (descricaoField) {
            descricao = descricaoField.value;
        }
        
        let ano = null;
        const anoField = document.getElementById('ano');
        if (anoField) {
            ano = anoField.value;
        }
        
        let preco = null;
        const precoField = document.getElementById('preco');
        if (precoField) {
            preco = precoField.value;
        }
        
        // Obter modelo
        const modeloSelect = document.getElementById('modeloSelect');
        if (!modeloSelect) {
            throw new Error('Campo de modelo não encontrado no formulário');
        }
        const modeloId = modeloSelect.value;
        
        // Verificar qual campo de status está presente na página
        let status = 'ativo';
        const statusField = document.getElementById('status');
        const statusCheckbox = document.getElementById('statusVersao');
        
        if (statusField) {
            status = statusField.value;
        } else if (statusCheckbox) {
            // Se for um checkbox, o status é 'ativo' se estiver marcado, senão é 'inativo'
            status = statusCheckbox.checked ? 'ativo' : 'inativo';
        }
        
        // Validar campos obrigatórios
        if (!nome || !modeloId) {
            exibirMensagem('Por favor, preencha todos os campos obrigatórios.', 'warning');
            return;
        }
        
        // Criar objeto com dados da versão
        const versaoData = {
            nome,
            nome_versao: nome, // Incluir ambos os campos para compatibilidade
            descricao,
            ano: ano ? parseInt(ano) : null,
            preco: preco ? parseFloat(preco) : null,
            modeloId: parseInt(modeloId),
            status
        };
        
        const token = getToken();
        if (!token) {
            console.error('Token de autenticação não encontrado');
            return;
        }
        
        let url, method;
        
        if (versaoId) {
            // Atualizar versão existente
            url = `/api/versoes/${versaoId}`;
            method = 'PUT';
            versaoData.id = parseInt(versaoId);
        } else {
            // Criar nova versão
            url = '/api/versoes';
            method = 'POST';
        }
        
        // Fazer requisição para API
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
            throw new Error(errorData.message || 'Erro ao salvar versão');
        }
        
        const data = await response.json();
        console.log('Versão salva com sucesso:', data);
        
        // Fechar modal - verificar qual ID do modal está presente na página
        const versaoModal = document.getElementById('versaoModal') || document.getElementById('modalVersao');
        if (versaoModal) {
            const modal = bootstrap.Modal.getInstance(versaoModal);
            if (modal) {
                modal.hide();
            }
        }
        
        // Exibir mensagem de sucesso
        exibirMensagem('Versão salva com sucesso!', 'success');
        
        // Recarregar lista de versões
        carregarVersoes();
    } catch (error) {
        console.error('Erro ao salvar versão:', error);
        exibirMensagem('Erro ao salvar versão: ' + error.message, 'danger');
    }
}

// Função para excluir uma versão
async function excluirVersao() {
    console.log('Excluindo versão...');
    
    try {
        const versaoId = document.getElementById('versaoId').value;
        if (!versaoId) {
            exibirMensagem('ID da versão não encontrado.', 'danger');
            return;
        }
        
        const token = getToken();
        if (!token) {
            console.error('Token de autenticação não encontrado');
            return;
        }
        
        // Fazer requisição para API
        const response = await fetch(`/api/versoes/${versaoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao excluir versão');
        }
        
        console.log('Versão excluída com sucesso');
        
        // Fechar modal
        const modalExcluir = bootstrap.Modal.getInstance(document.getElementById('modalExcluirVersao'));
        if (modalExcluir) {
            modalExcluir.hide();
        }
        
        // Exibir mensagem de sucesso
        exibirMensagem('Versão excluída com sucesso!', 'success');
        
        // Recarregar lista de versões
        carregarVersoes();
    } catch (error) {
        console.error('Erro ao excluir versão:', error);
        exibirMensagem('Erro ao excluir versão: ' + error.message, 'danger');
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

// Função para obter dados estáticos de versões como fallback
function obterDadosEstaticosVersoes(modeloId) {
    console.log('Usando dados estáticos para versões, modelo ID:', modeloId);
    
    // Mapeamento de modelos para versões (dados estáticos)
    const dadosEstaticos = {
        // Modelos de Fiat (ID 1)
        1: [
            { id: 101, nome: 'Attractive 1.0', modeloId: 1, modelo: { id: 1, nome: 'Argo', marcaId: 1 } },
            { id: 102, nome: 'Essence 1.6', modeloId: 1, modelo: { id: 1, nome: 'Argo', marcaId: 1 } },
            { id: 103, nome: 'Sport 1.8', modeloId: 1, modelo: { id: 1, nome: 'Argo', marcaId: 1 } }
        ],
        // Modelos de Chevrolet (ID 2)
        2: [
            { id: 201, nome: 'LT 1.0', modeloId: 2, modelo: { id: 2, nome: 'Onix', marcaId: 2 } },
            { id: 202, nome: 'LTZ 1.4', modeloId: 2, modelo: { id: 2, nome: 'Onix', marcaId: 2 } },
            { id: 203, nome: 'Premier 1.8', modeloId: 2, modelo: { id: 2, nome: 'Onix', marcaId: 2 } }
        ],
        // Modelos de Volkswagen (ID 3)
        3: [
            { id: 301, nome: 'Trendline 1.0', modeloId: 3, modelo: { id: 3, nome: 'Polo', marcaId: 3 } },
            { id: 302, nome: 'Comfortline 1.4', modeloId: 3, modelo: { id: 3, nome: 'Polo', marcaId: 3 } },
            { id: 303, nome: 'Highline 1.8', modeloId: 3, modelo: { id: 3, nome: 'Polo', marcaId: 3 } }
        ],
        // Modelos de Ford (ID 4)
        4: [
            { id: 401, nome: 'SE 1.5', modeloId: 4, modelo: { id: 4, nome: 'Ka', marcaId: 4 } },
            { id: 402, nome: 'SEL 1.5', modeloId: 4, modelo: { id: 4, nome: 'Ka', marcaId: 4 } },
            { id: 403, nome: 'Titanium 2.0', modeloId: 4, modelo: { id: 4, nome: 'Ka', marcaId: 4 } }
        ],
        // Modelos de Hyundai (ID 5)
        5: [
            { id: 501, nome: 'Vision 1.6', modeloId: 5, modelo: { id: 5, nome: 'HB20', marcaId: 5 } },
            { id: 502, nome: 'Comfort 1.6', modeloId: 5, modelo: { id: 5, nome: 'HB20', marcaId: 5 } },
            { id: 503, nome: 'Premium 2.0', modeloId: 5, modelo: { id: 5, nome: 'HB20', marcaId: 5 } }
        ],
        // Dados genéricos para todos os modelos
        default: [
            { id: 901, nome: 'Versão Básica', status: 'ativo' },
            { id: 902, nome: 'Versão Intermediária', status: 'ativo' },
            { id: 903, nome: 'Versão Premium', status: 'ativo' }
        ]
    };
    
    // Se um modelo específico foi selecionado, retornar versões para esse modelo
    if (modeloId && dadosEstaticos[modeloId]) {
        return dadosEstaticos[modeloId];
    }
    
    // Se nenhum modelo específico foi selecionado ou o modelo não existe nos dados estáticos,
    // retornar uma lista combinada de todas as versões
    const todasVersoes = [];
    for (const modelo in dadosEstaticos) {
        if (modelo !== 'default') {
            todasVersoes.push(...dadosEstaticos[modelo]);
        }
    }
    
    return todasVersoes.length > 0 ? todasVersoes : dadosEstaticos.default;
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
