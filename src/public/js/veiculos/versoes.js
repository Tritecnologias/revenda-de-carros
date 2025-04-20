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
        
        // Lista de URLs a tentar, em ordem de prioridade
        let urls = [];
        
        if (modeloId) {
            // URLs para modelo específico
            urls = [
                `/api/versoes/modelo/${modeloId}/public${queryString}`,
                `/api/versoes/modelo/${modeloId}${queryString}`,
                `/api/veiculos/versoes/by-modelo/${modeloId}${queryString}`
            ];
        } else {
            // URLs para todas as versões
            urls = [
                `/api/versoes/public${queryString}`,
                `/api/versoes/all${queryString}`,
                `/api/versoes${queryString}`
            ];
        }
        
        console.log('URLs a tentar:', urls);
        
        // Usar a função fetchWithFallback do config.js
        const data = await config.fetchWithFallback(urls, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Versões carregadas com sucesso:', data);
        
        // Armazenar dados como mockados para uso futuro
        if (data && data.length > 0) {
            config.storeMockData('versoes', data);
        }
        
        // Só renderizar se estivermos na página correta
        if (versoesTableBody) {
            renderizarVersoes(data, versoesTableBody);
        } else {
            console.warn('Elemento da tabela de versões não encontrado. Não é possível renderizar versões.');
        }
    } catch (error) {
        console.error('Erro ao carregar versões:', error);
        
        if (versoesTableBody) {
            versoesTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger">
                        Erro ao carregar versões: ${error.message}
                    </td>
                </tr>
            `;
        }
        
        exibirMensagem('Erro ao carregar versões. Por favor, tente novamente.', 'danger');
    }
}

// Função para renderizar a tabela de versões
function renderizarVersoes(versoes, tableBody) {
    // Usar o tableBody passado como parâmetro ou tentar encontrar na página
    const tbody = tableBody || document.getElementById('versoesTableBody') || document.getElementById('tabelaVersoes');
    
    // Verificar se o elemento tbody existe
    if (!tbody) {
        console.error('Elemento da tabela de versões não encontrado na página');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (versoes.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 6;
        td.textContent = 'Nenhuma versão encontrada';
        td.className = 'text-center';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }
    
    versoes.forEach(versao => {
        const tr = document.createElement('tr');
        
        // Coluna ID
        const tdId = document.createElement('td');
        tdId.textContent = versao.id;
        tr.appendChild(tdId);
        
        // Coluna Nome
        const tdNome = document.createElement('td');
        tdNome.textContent = versao.nome_versao;
        tr.appendChild(tdNome);
        
        // Coluna Modelo
        const tdModelo = document.createElement('td');
        tdModelo.textContent = versao.modelo ? versao.modelo.nome : '-';
        tr.appendChild(tdModelo);
        
        // Coluna Marca
        const tdMarca = document.createElement('td');
        tdMarca.textContent = versao.modelo && versao.modelo.marca ? versao.modelo.marca.nome : '-';
        tr.appendChild(tdMarca);
        
        // Coluna Status
        const tdStatus = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = `badge ${versao.status === 'ativo' ? 'bg-success' : 'bg-danger'}`;
        statusBadge.textContent = versao.status === 'ativo' ? 'Ativo' : 'Inativo';
        tdStatus.appendChild(statusBadge);
        tr.appendChild(tdStatus);
        
        // Coluna Ações
        const tdAcoes = document.createElement('td');
        
        // Botão Editar
        const btnEditar = document.createElement('button');
        btnEditar.className = 'btn btn-sm btn-primary me-1';
        btnEditar.innerHTML = '<i class="bi bi-pencil"></i>';
        btnEditar.title = 'Editar';
        btnEditar.addEventListener('click', () => carregarVersaoParaEdicao(versao.id));
        tdAcoes.appendChild(btnEditar);
        
        // Botão Excluir
        const btnExcluir = document.createElement('button');
        btnExcluir.className = 'btn btn-sm btn-danger';
        btnExcluir.innerHTML = '<i class="bi bi-trash"></i>';
        btnExcluir.title = 'Excluir';
        btnExcluir.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja excluir esta versão?')) {
                excluirVersao(versao.id);
            }
        });
        tdAcoes.appendChild(btnExcluir);
        
        tr.appendChild(tdAcoes);
        
        tbody.appendChild(tr);
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
        const versaoModal = bootstrap.Modal.getInstance(document.getElementById('versaoModal'));
        if (versaoModal) {
            versaoModal.hide();
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
