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
    
    // Inicializar menu
    const menuManager = window.menuManager;
    if (menuManager) {
        menuManager.init(user);
    } else {
        console.error('Menu Manager não encontrado!');
        // Tentar inicializar o menu usando a função global
        if (typeof initMenu === 'function') {
            initMenu();
        }
    }
    
    // Carregar marcas para os filtros e formulário
    carregarMarcas();
    
    // Carregar versões
    carregarVersoes();
    
    // Event listeners
    document.getElementById('filtroMarca').addEventListener('change', function() {
        carregarModelos(this.value, 'filtroModelo');
        carregarVersoes();
    });
    
    document.getElementById('filtroModelo').addEventListener('change', carregarVersoes);
    document.getElementById('filtroStatus').addEventListener('change', carregarVersoes);
    
    document.getElementById('marcaSelect').addEventListener('change', function() {
        carregarModelos(this.value, 'modeloSelect');
    });
    
    document.getElementById('salvarVersao').addEventListener('click', salvarVersao);
    
    // Limpar formulário quando o modal for fechado
    document.getElementById('modalVersao').addEventListener('hidden.bs.modal', function() {
        document.getElementById('formVersao').reset();
        document.getElementById('versaoId').value = '';
        document.getElementById('modalVersaoLabel').textContent = 'Nova Versão';
    });
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
    
    // TEMPORÁRIO: Criar um usuário de teste para depuração
    if (!localStorage.getItem('token') || !localStorage.getItem('user')) {
        console.log('Criando usuário de teste para depuração...');
        const testUser = {
            id: 1,
            nome: 'Admin',
            email: 'admin@example.com',
            role: 'admin'
        };
        const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NzIzMzY3MjAsImV4cCI6MTY3MjQyMzEyMH0.8Jj9OLLVvxI9zFQOdjkWsQ9MzBqWMvf1j-jyFOKk5Nc';
        
        localStorage.setItem('user', JSON.stringify(testUser));
        localStorage.setItem('token', testToken);
        
        if (typeof auth !== 'undefined') {
            auth.setAuth(testToken, testUser);
        }
    }
    
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

// Função para carregar as marcas
function carregarMarcas() {
    console.log('Carregando marcas...');
    
    // Obter elementos dos selects
    const filtroMarcaSelect = document.getElementById('filtroMarca');
    const marcaSelect = document.getElementById('marcaSelect');
    
    // Limpar opções existentes
    filtroMarcaSelect.innerHTML = '<option value="">Todas as marcas</option>';
    marcaSelect.innerHTML = '<option value="">Selecione uma marca</option>';
    
    // Fazer requisição para API
    const token = getToken();
    fetch(`${config.apiBaseUrl}/api/veiculos/marcas/all`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar marcas');
            }
            return response.json();
        })
        .then(data => {
            console.log('Marcas carregadas:', data);
            
            // Adicionar opções aos selects
            data.forEach(marca => {
                // Adicionar ao filtro
                const optionFiltro = document.createElement('option');
                optionFiltro.value = marca.id;
                optionFiltro.textContent = marca.nome;
                filtroMarcaSelect.appendChild(optionFiltro);
                
                // Adicionar ao select do formulário
                const optionForm = document.createElement('option');
                optionForm.value = marca.id;
                optionForm.textContent = marca.nome;
                marcaSelect.appendChild(optionForm);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar marcas:', error);
            exibirMensagem('Erro ao carregar marcas. Por favor, tente novamente.', 'danger');
        });
}

// Função para carregar os modelos com base na marca selecionada
function carregarModelos(marcaId, selectId) {
    console.log(`Carregando modelos para marca ID ${marcaId} no select ${selectId}...`);
    
    // Obter elemento do select
    const modeloSelect = document.getElementById(selectId);
    
    // Limpar opções existentes
    if (selectId === 'filtroModelo') {
        modeloSelect.innerHTML = '<option value="">Todos os modelos</option>';
    } else {
        modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
    }
    
    // Se não houver marca selecionada, não fazer requisição
    if (!marcaId) {
        return;
    }
    
    // Fazer requisição para API
    const token = getToken();
    fetch(`${config.apiBaseUrl}/api/veiculos/modelos/by-marca/${marcaId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar modelos');
            }
            return response.json();
        })
        .then(data => {
            console.log(`Modelos carregados para marca ${marcaId}:`, data);
            
            // Adicionar opções ao select
            data.forEach(modelo => {
                const option = document.createElement('option');
                option.value = modelo.id;
                option.textContent = modelo.nome;
                modeloSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar modelos:', error);
            exibirMensagem('Erro ao carregar modelos. Por favor, tente novamente.', 'danger');
        });
}

// Função para carregar as versões com base nos filtros
function carregarVersoes() {
    console.log('Carregando versões...');
    
    // Obter valores dos filtros
    const marcaId = document.getElementById('filtroMarca').value;
    const modeloId = document.getElementById('filtroModelo').value;
    const status = document.getElementById('filtroStatus').value;
    
    // Construir URL da requisição
    let url = `${config.apiBaseUrl}/api/versoes`;
    
    // Adicionar parâmetros de filtro se necessário
    const params = new URLSearchParams();
    if (modeloId) {
        url = `${config.apiBaseUrl}/api/versoes/modelo/${modeloId}`;
    }
    
    // Fazer requisição para API
    const token = getToken();
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar versões');
            }
            return response.json();
        })
        .then(data => {
            console.log('Versões carregadas:', data);
            
            // Filtrar por status se necessário
            let versoes = data;
            if (status) {
                versoes = versoes.filter(versao => versao.status === (status === 'ativo'));
            }
            
            // Filtrar por marca se necessário (quando não filtramos por modelo)
            if (marcaId && !modeloId) {
                versoes = versoes.filter(versao => versao.modelo && versao.modelo.marcaId == marcaId);
            }
            
            // Renderizar tabela
            renderizarTabelaVersoes(versoes);
        })
        .catch(error => {
            console.error('Erro ao carregar versões:', error);
            exibirMensagem('Erro ao carregar versões. Por favor, tente novamente.', 'danger');
        });
}

// Função para renderizar a tabela de versões
function renderizarTabelaVersoes(versoes) {
    const tbody = document.getElementById('tabelaVersoes');
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

// Função para carregar uma versão para edição
function carregarVersaoParaEdicao(versaoId) {
    console.log(`Carregando versão ${versaoId} para edição...`);
    
    const token = getToken();
    fetch(`${config.apiBaseUrl}/api/versoes/${versaoId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar versão');
            }
            return response.json();
        })
        .then(versao => {
            console.log('Versão carregada para edição:', versao);
            
            // Preencher formulário
            document.getElementById('versaoId').value = versao.id;
            document.getElementById('nomeVersao').value = versao.nome_versao;
            document.getElementById('statusVersao').checked = versao.status === 'ativo';
            
            // Selecionar marca e carregar modelos
            const marcaSelect = document.getElementById('marcaSelect');
            if (versao.modelo && versao.modelo.marcaId) {
                marcaSelect.value = versao.modelo.marcaId;
                
                // Carregar modelos da marca e depois selecionar o modelo correto
                carregarModelos(versao.modelo.marcaId, 'modeloSelect');
                
                // Aguardar um pouco para os modelos serem carregados
                setTimeout(() => {
                    document.getElementById('modeloSelect').value = versao.modeloId;
                }, 500);
            }
            
            // Atualizar título do modal
            document.getElementById('modalVersaoLabel').textContent = 'Editar Versão';
            
            // Abrir modal
            new bootstrap.Modal(document.getElementById('modalVersao')).show();
        })
        .catch(error => {
            console.error('Erro ao carregar versão para edição:', error);
            exibirMensagem('Erro ao carregar versão para edição. Por favor, tente novamente.', 'danger');
        });
}

// Função para salvar uma versão (criar ou atualizar)
function salvarVersao() {
    console.log('Salvando versão...');
    
    // Obter dados do formulário
    const versaoId = document.getElementById('versaoId').value;
    const modeloId = document.getElementById('modeloSelect').value;
    const nomeVersao = document.getElementById('nomeVersao').value;
    const status = document.getElementById('statusVersao').checked ? 'ativo' : 'inativo';
    
    // Validar dados
    if (!modeloId || !nomeVersao) {
        exibirMensagem('Por favor, preencha todos os campos obrigatórios.', 'warning');
        return;
    }
    
    // Preparar dados para envio
    const versaoData = {
        nome_versao: nomeVersao,
        modeloId: parseInt(modeloId),
        status: status
    };
    
    // Determinar método e URL com base em criação ou atualização
    const method = versaoId ? 'PATCH' : 'POST';
    const url = versaoId ? `${config.apiBaseUrl}/api/versoes/${versaoId}` : `${config.apiBaseUrl}/api/versoes`;
    
    // Fazer requisição para API
    fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(versaoData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao salvar versão');
            }
            return response.json();
        })
        .then(data => {
            console.log('Versão salva com sucesso:', data);
            
            // Fechar modal
            bootstrap.Modal.getInstance(document.getElementById('modalVersao')).hide();
            
            // Exibir mensagem de sucesso
            exibirMensagem(`Versão ${versaoId ? 'atualizada' : 'criada'} com sucesso!`, 'success');
            
            // Recarregar versões
            carregarVersoes();
        })
        .catch(error => {
            console.error('Erro ao salvar versão:', error);
            exibirMensagem('Erro ao salvar versão. Por favor, tente novamente.', 'danger');
        });
}

// Função para excluir uma versão
function excluirVersao(versaoId) {
    console.log(`Excluindo versão ${versaoId}...`);
    
    fetch(`${config.apiBaseUrl}/api/versoes/${versaoId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao excluir versão');
            }
            return response.json();
        })
        .then(data => {
            console.log('Versão excluída com sucesso:', data);
            
            // Exibir mensagem de sucesso
            exibirMensagem('Versão excluída com sucesso!', 'success');
            
            // Recarregar versões
            carregarVersoes();
        })
        .catch(error => {
            console.error('Erro ao excluir versão:', error);
            exibirMensagem('Erro ao excluir versão. Por favor, tente novamente.', 'danger');
        });
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
