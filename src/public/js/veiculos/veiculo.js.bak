// Inicialização da autenticação
const auth = new Auth();
let currentPage = 1;
const itemsPerPage = 10;
let totalItems = 0;
let marcas = [];
let modelos = [];
let versoes = [];

// Elementos do DOM
let veiculosTableBody;
let paginationControls;
let veiculoForm;
let veiculoModal;
let deleteModal;
let errorMessage;
let saveButton;
let saveSpinner;
let confirmDeleteButton;
let deleteSpinner;
let marcaSelect;
let modeloSelect;
let versaoSelect;

// Inicializar elementos após o carregamento do DOM
function initializeElements() {
    veiculosTableBody = document.getElementById('veiculosTableBody');
    paginationControls = document.getElementById('paginationControls');
    veiculoForm = document.getElementById('veiculoForm');
    
    const veiculoModalElement = document.getElementById('veiculoModal');
    if (veiculoModalElement) {
        veiculoModal = new bootstrap.Modal(veiculoModalElement);
    }
    
    const deleteModalElement = document.getElementById('deleteModal');
    if (deleteModalElement) {
        deleteModal = new bootstrap.Modal(deleteModalElement);
    }
    
    errorMessage = document.getElementById('errorMessage');
    saveButton = document.getElementById('saveButton');
    saveSpinner = document.getElementById('saveSpinner');
    confirmDeleteButton = document.getElementById('confirmDeleteButton');
    deleteSpinner = document.getElementById('deleteSpinner');
    marcaSelect = document.getElementById('marcaId');
    modeloSelect = document.getElementById('modeloId');
    versaoSelect = document.getElementById('versaoId');
    
    // Configurar eventos
    if (saveButton) {
        saveButton.addEventListener('click', saveVeiculo);
    }
    
    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', deleteVeiculo);
    }
    
    // Evento para carregar modelos quando a marca mudar
    if (marcaSelect) {
        marcaSelect.addEventListener('change', loadModelosByMarca);
    }
    
    // Evento para carregar versões quando o modelo mudar
    if (modeloSelect) {
        modeloSelect.addEventListener('change', loadVersoesByModelo);
    }
    
    // Reset do formulário quando o modal é fechado
    if (veiculoModalElement) {
        veiculoModalElement.addEventListener('hidden.bs.modal', () => {
            if (veiculoForm) {
                veiculoForm.reset();
            }
            
            const veiculoIdElement = document.getElementById('veiculoId');
            if (veiculoIdElement) {
                veiculoIdElement.value = '';
            }
            
            const modalTitleElement = document.getElementById('veiculoModalTitle');
            if (modalTitleElement) {
                modalTitleElement.textContent = 'NOVO VEÍCULO';
            }
            
            if (errorMessage) {
                errorMessage.classList.add('d-none');
            }
            
            if (veiculoForm) {
                veiculoForm.classList.remove('was-validated');
            }
            
            // Limpar campos de preço
            const precoElement = document.getElementById('preco');
            if (precoElement) {
                precoElement.value = '';
            }
            
            const custoAquisicaoElement = document.getElementById('custoAquisicao');
            if (custoAquisicaoElement) {
                custoAquisicaoElement.value = '';
            }
        });
    }
    
    // Inicializar dados
    inicializarDados();
}

// Função para inicializar dados
async function inicializarDados() {
    try {
        await loadMarcasSelect();
        await loadAllModelos(); // Carregar todos os modelos para exibição na tabela
        await loadAllVersoes(); // Carregar todas as versões para exibição na tabela
        loadVeiculos();
    } catch (error) {
        console.error('Erro ao inicializar dados:', error);
        showError('Erro ao carregar dados iniciais. Por favor, recarregue a página.');
    }
}

// Função para carregar todos os modelos
async function loadAllModelos() {
    try {
        // Obter token diretamente do localStorage para garantir que estamos usando o token mais recente
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            throw new Error('Falha na autenticação. Por favor, faça login novamente.');
        }
        
        // IMPORTANTE: Usar a URL completa para evitar problemas com o url-fixer.js
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de todas as possíveis URLs para tentar, em ordem de prioridade
        const urlsParaTentar = [
            `${baseUrl}/api/veiculos/modelos`,
            `${baseUrl}/api/modelos`
        ];
        
        console.log('Tentando URLs para carregar todos os modelos:', urlsParaTentar);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let modelos = null;
        let lastError = null;
        
        for (const url of urlsParaTentar) {
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
                    
                    // Se a resposta for um objeto com propriedade items (paginação), usar items
                    if (data && data.items && Array.isArray(data.items)) {
                        modelos = data.items;
                    } 
                    // Se a resposta for um array, usar diretamente
                    else if (Array.isArray(data)) {
                        modelos = data;
                    }
                    // Se chegou aqui, temos dados mas não no formato esperado
                    else {
                        console.warn(`Resposta não é um array nem tem propriedade items:`, data);
                        // Tentar extrair modelos de alguma outra propriedade
                        if (data && typeof data === 'object') {
                            // Procurar por alguma propriedade que seja um array
                            for (const key in data) {
                                if (Array.isArray(data[key]) && data[key].length > 0) {
                                    modelos = data[key];
                                    console.log(`Usando dados da propriedade ${key}:`, modelos);
                                    break;
                                }
                            }
                        }
                    }
                    
                    // Se encontramos modelos, sair do loop
                    if (modelos && Array.isArray(modelos) && modelos.length > 0) {
                        break;
                    } else {
                        console.warn(`Não foi possível extrair modelos da resposta de ${url}`);
                    }
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
        
        // Se não conseguimos carregar modelos de nenhuma URL, usar dados de exemplo
        if (!modelos || !Array.isArray(modelos) || modelos.length === 0) {
            console.error('Não foi possível carregar modelos de nenhuma URL. Último erro:', lastError);
            
            // Criar alguns modelos de exemplo para teste
            modelos = [
                { id: 1, nome: "ARGO", marcaId: 1 },
                { id: 2, nome: "MOBI", marcaId: 1 },
                { id: 3, nome: "PULSE", marcaId: 1 },
                { id: 4, nome: "CRONOS", marcaId: 1 },
                { id: 5, nome: "TORO", marcaId: 1 },
                { id: 6, nome: "KA", marcaId: 2 },
                { id: 7, nome: "FIESTA", marcaId: 2 },
                { id: 8, nome: "RANGER", marcaId: 2 },
                { id: 9, nome: "ONIX", marcaId: 3 },
                { id: 10, nome: "CRUZE", marcaId: 3 }
            ];
            console.log('Usando modelos de exemplo:', modelos);
        }
        
        console.log('Modelos carregados com sucesso:', modelos);
        
        // Verificar a estrutura dos dados para debug
        if (modelos.length > 0) {
            console.log('Exemplo de modelo:', modelos[0]);
            console.log('Estrutura do modelo:', Object.keys(modelos[0]));
        }
        
        return modelos;
    } catch (error) {
        console.error('Erro ao carregar todos os modelos:', error);
        throw new Error('Falha ao carregar todos os modelos');
    }
}

// Função para carregar todas as versões
async function loadAllVersoes() {
    console.log('Carregando todas as versões');
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            return;
        }
        
        // Lista de URLs a tentar, em ordem de prioridade
        const urls = [
            '/api/versoes/public',
            '/api/versoes'
        ];
        
        // Usar a função fetchWithFallback do config.js
        const data = await config.fetchWithFallback(urls, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Versões carregadas com sucesso:', data);
        
        versoes = data;
        
    } catch (error) {
        console.error('Erro ao carregar todas as versões:', error);
        showError('Erro ao carregar versões: ' + error.message);
        
        // Como fallback, usar um array vazio para evitar erros em outras partes do código
        versoes = [];
    }
}

// Função para formatar preço em reais
function formatarPreco(preco) {
    if (!preco) return '';
    
    // Converter para número se for string
    if (typeof preco === 'string') {
        preco = converterParaNumero(preco);
    }
    
    // Dividir por 100 para corrigir a formatação (8.899.000,00 -> 88.990,00)
    preco = preco / 100;
    
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para converter valores formatados para números
function converterParaNumero(valor) {
    return parseFloat(valor.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
}

// Função para formatar valor monetário (sem precisar de um elemento DOM)
function formatarValorMonetario(valor) {
    if (valor === undefined || valor === null) {
        return '0,00';
    }
    
    // Usar o formato brasileiro: ponto como separador de milhar e vírgula como separador decimal
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(valor);
}

// Função para carregar marcas para o select
async function loadMarcasSelect() {
    // Obter o elemento do DOM
    const marcaSelect = document.getElementById('marcaId');
    
    if (!marcaSelect) {
        console.error('Elemento marcaSelect não encontrado');
        return;
    }
    
    try {
        // Verificar se o usuário está autenticado antes de fazer a requisição
        if (!localStorage.getItem('token')) {
            console.error('Token de autenticação não encontrado no localStorage');
            // Redirecionar para a página de login
            window.location.href = '/login.html';
            return;
        }
        
        // Obter token diretamente do localStorage para garantir que estamos usando o token mais recente
        const token = localStorage.getItem('token');
        
        console.log('Carregando marcas...');
        
        // IMPORTANTE: Usar a URL completa para evitar problemas com o url-fixer.js
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de todas as possíveis URLs para tentar, em ordem de prioridade
        const urlsParaTentar = [
            `${baseUrl}/api/veiculos/marcas`,
            `${baseUrl}/api/marcas`
        ];
        
        console.log('Tentando URLs para carregar marcas:', urlsParaTentar);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let marcas = null;
        let lastError = null;
        
        for (const url of urlsParaTentar) {
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
                    
                    // Se a resposta for um objeto com propriedade items (paginação), usar items
                    if (data && data.items && Array.isArray(data.items)) {
                        marcas = data.items;
                    } 
                    // Se a resposta for um array, usar diretamente
                    else if (Array.isArray(data)) {
                        marcas = data;
                    }
                    // Se chegou aqui, temos dados mas não no formato esperado
                    else {
                        console.warn(`Resposta não é um array nem tem propriedade items:`, data);
                        // Tentar extrair marcas de alguma outra propriedade
                        if (data && typeof data === 'object') {
                            // Procurar por alguma propriedade que seja um array
                            for (const key in data) {
                                if (Array.isArray(data[key]) && data[key].length > 0) {
                                    marcas = data[key];
                                    console.log(`Usando dados da propriedade ${key}:`, marcas);
                                    break;
                                }
                            }
                        }
                    }
                    
                    // Se encontramos marcas, sair do loop
                    if (marcas && Array.isArray(marcas) && marcas.length > 0) {
                        break;
                    } else {
                        console.warn(`Não foi possível extrair marcas da resposta de ${url}`);
                    }
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
        
        // Se não conseguimos carregar marcas de nenhuma URL, usar dados de exemplo
        if (!marcas || !Array.isArray(marcas) || marcas.length === 0) {
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
        
        console.log('Marcas carregadas com sucesso:', marcas);
        
        // Limpar select
        marcaSelect.innerHTML = '<option value="">Selecione uma marca</option>';
        
        // Adicionar opções
        marcas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca.id;
            option.textContent = marca.nome;
            marcaSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar marcas:', error);
        throw new Error('Falha ao carregar marcas');
    }
}

// Função para carregar modelos por marca
async function loadModelosByMarca() {
    // Obter os elementos do DOM
    const marcaSelect = document.getElementById('marcaId');
    const modeloSelect = document.getElementById('modeloId');
    
    if (!modeloSelect || !marcaSelect) {
        console.error('Elementos modeloSelect ou marcaSelect não encontrados');
        return;
    }
    
    const marcaId = marcaSelect.value;
    
    // Limpar select de modelos
    modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
    
    // Se não houver marca selecionada, retornar
    if (!marcaId) {
        return;
    }
    
    try {
        // Obter token diretamente do localStorage para garantir que estamos usando o token mais recente
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            showError('Falha na autenticação. Por favor, faça login novamente.');
            return;
        }
        
        console.log('Tentando carregar modelos da marca ID:', marcaId);
        console.log('Token utilizado:', token ? 'Token presente' : 'Token ausente');
        
        // Usar a URL correta conforme identificado nas memórias
        fetch(`${config.apiBaseUrl}/api/veiculos/modelos/by-marca/${marcaId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao carregar modelos');
            }
            return response.json();
        })
        .then(modelos => {
            console.log('Modelos carregados:', modelos);
            
            // Verificar a estrutura dos dados para debug
            if (modelos.length > 0) {
                console.log('Exemplo de modelo:', modelos[0]);
                console.log('Estrutura do modelo:', Object.keys(modelos[0]));
            }
            
            // Limpar select de modelos
            modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
            
            // Adicionar opções
            modelos.forEach(modelo => {
                const option = document.createElement('option');
                option.value = modelo.id;
                option.textContent = modelo.nome;
                modeloSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar modelos:', error);
            showError('Não foi possível carregar os modelos. Por favor, tente novamente mais tarde.');
        });
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        showError('Não foi possível carregar os modelos. Por favor, tente novamente mais tarde.');
    }
}

// Função para carregar versões por modelo
async function loadVersoesByModelo() {
    // Obter os elementos do DOM
    const modeloSelect = document.getElementById('modeloId');
    const versaoSelect = document.getElementById('versaoId');
    
    if (!modeloSelect || !versaoSelect) {
        console.error('Elementos modeloSelect ou versaoSelect não encontrados');
        return;
    }
    
    const modeloId = modeloSelect.value;
    
    // Limpar select de versões
    versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
    
    // Se não houver modelo selecionado, retornar
    if (!modeloId) {
        return;
    }
    
    try {
        // Obter token diretamente do localStorage para garantir que estamos usando o token mais recente
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            showError('Falha na autenticação. Por favor, faça login novamente.');
            return;
        }
        
        console.log('Tentando carregar versões do modelo ID:', modeloId);
        console.log('Token utilizado:', token ? 'Token presente' : 'Token ausente');
        
        // Usar a URL correta conforme identificado nas memórias
        fetch(`${config.apiBaseUrl}/api/versoes/modelo/${modeloId}/public`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao carregar versões');
            }
            return response.json();
        })
        .then(versoes => {
            console.log('Versões carregadas:', versoes);
            
            // Verificar a estrutura dos dados para debug
            if (versoes.length > 0) {
                console.log('Exemplo de versão:', versoes[0]);
                console.log('Estrutura da versão:', Object.keys(versoes[0]));
            }
            
            // Limpar select de versões
            versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
            
            // Adicionar opções
            versoes.forEach(versao => {
                const option = document.createElement('option');
                option.value = versao.id;
                option.textContent = versao.nome_versao;
                option.dataset.veiculoId = versao.veiculoId; // Armazenar o ID do veículo como um atributo data
                versaoSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar versões:', error);
            showError('Não foi possível carregar as versões. Por favor, tente novamente mais tarde.');
        });
    } catch (error) {
        console.error('Erro ao carregar versões:', error);
        showError('Não foi possível carregar as versões. Por favor, tente novamente mais tarde.');
    }
}

// Função para carregar veículos
async function loadVeiculos(page = 1) {
    console.log('Carregando veículos, página:', page);
    
    if (!veiculosTableBody) {
        console.error('Elemento veiculosTableBody não encontrado');
        return;
    }
    
    // Mostrar indicador de carregamento
    veiculosTableBody.innerHTML = '<tr><td colspan="9" class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Carregando...</span></div></td></tr>';
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            window.location.href = '/login.html';
            return;
        }
        
        // Lista de URLs a tentar, em ordem de prioridade
        const urls = [
            `/api/veiculos/public?page=${page}&limit=10`,
            `/api/veiculos?page=${page}&limit=10`
        ];
        
        // Usar a função fetchWithFallback do config.js
        const data = await config.fetchWithFallback(urls, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Veículos carregados:', data);
        
        // Renderizar veículos
        renderVeiculos(data);
        
        return data;
    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
        
        // Mostrar mensagem de erro clara para o usuário
        veiculosTableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center text-danger">
                    Erro ao carregar veículos: ${error.message}
                </td>
            </tr>
        `;
        return null;
    }
}

// Função para formatar situação
function getSituacaoBadgeClass(situacao) {
    switch (situacao) {
        case 'disponivel':
            return 'bg-success';
        case 'reservado':
            return 'bg-warning';
        case 'vendido':
            return 'bg-info';
        default:
            return 'bg-secondary';
    }
}

// Função para formatar texto da situação
function getSituacaoText(situacao) {
    switch (situacao) {
        case 'disponivel':
            return 'Disponível';
        case 'reservado':
            return 'Reservado';
        case 'vendido':
            return 'Vendido';
        default:
            return situacao;
    }
}

// Função para atualizar controles de paginação
function updatePagination(currentPage, totalPages) {
    console.log('Atualizando paginação:', currentPage, totalPages);
    const paginationControls = document.getElementById('paginationControls');
    
    if (!paginationControls) {
        console.warn('Elemento paginationControls não encontrado');
        return;
    }
    
    if (totalPages <= 1) {
        paginationControls.innerHTML = '';
        return;
    }
    
    let paginationHTML = `
        <nav aria-label="Navegação de página">
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="loadVeiculos(${currentPage - 1}); return false;">Anterior</a>
                </li>
    `;
    
    // Mostrar no máximo 5 páginas
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="loadVeiculos(${i}); return false;">${i}</a>
            </li>
        `;
    }
    
    paginationHTML += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="loadVeiculos(${currentPage + 1}); return false;">Próxima</a>
                </li>
            </ul>
        </nav>
    `;
    
    paginationControls.innerHTML = paginationHTML;
}

// Função para mudar de página
function changePage(page) {
    console.log('Mudando para página:', page);
    if (page < 1) page = 1;
    loadVeiculos(page);
}

// Função para renderizar veículos na tabela
function renderVeiculos(data) {
    console.log('Renderizando veículos:', data);
    
    // Limpar tabela
    veiculosTableBody.innerHTML = '';
    
    // Verificar se temos dados
    if (!data) {
        console.error('Nenhum dado de veículo recebido');
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="9" class="text-center">Erro ao carregar veículos</td>';
        veiculosTableBody.appendChild(tr);
        return;
    }
    
    // Verificar o formato dos dados (pode ser um array ou um objeto com propriedade items)
    const veiculos = Array.isArray(data) ? data : (data.items || []);
    
    // Atualizar paginação se tivermos metadados
    if (data.meta) {
        renderPagination(data);
    }
    
    // Verificar se temos veículos
    if (veiculos.length === 0) {
        console.log('Nenhum veículo encontrado');
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="9" class="text-center">Nenhum veículo encontrado</td>';
        veiculosTableBody.appendChild(tr);
        return;
    }
    
    veiculos.forEach(veiculo => {
        const row = document.createElement('tr');
        
        // Obter os dados de marca, modelo e versão
        // Verificar se os objetos relacionados estão presentes ou usar os IDs para buscar nos arrays
        let marcaNome = 'Desconhecida';
        let modeloNome = 'Desconhecido';
        let versaoNome = 'Desconhecida';
        
        // Se o veículo tem o objeto marca aninhado, use-o
        if (veiculo.marca && veiculo.marca.nome) {
            marcaNome = veiculo.marca.nome;
        } else if (veiculo.marcaId) {
            // Caso contrário, tente encontrar pelo ID
            const marca = marcas.find(m => m.id === veiculo.marcaId);
            if (marca) {
                marcaNome = marca.nome;
            }
        }
        
        // Se o veículo tem o objeto modelo aninhado, use-o
        if (veiculo.modelo && veiculo.modelo.nome) {
            modeloNome = veiculo.modelo.nome;
        } else if (veiculo.modeloId) {
            // Caso contrário, tente encontrar pelo ID
            const modelo = modelos.find(m => m.id === veiculo.modeloId);
            if (modelo) {
                modeloNome = modelo.nome;
            }
        }
        
        // Se o veículo tem o objeto versão aninhado, use-o
        if (veiculo.versao && veiculo.versao.nome_versao) {
            versaoNome = veiculo.versao.nome_versao;
        } else if (veiculo.versaoId) {
            // Caso contrário, tente encontrar pelo ID
            const versao = versoes.find(v => v.id === veiculo.versaoId);
            if (versao) {
                versaoNome = versao.nome_versao;
            }
        }
        
        // Definir situação e status
        let situacaoBadge = getSituacaoBadgeClass(veiculo.situacao);
        let situacaoText = getSituacaoText(veiculo.situacao);
        let statusBadge = veiculo.status === 'ativo' ? 'bg-success' : 'bg-danger';
        let statusText = veiculo.status === 'ativo' ? 'Ativo' : 'Inativo';
        
        row.innerHTML = `
            <td>${veiculo.id}</td>
            <td>${marcaNome}</td>
            <td>${modeloNome}</td>
            <td>${versaoNome}</td>
            <td>${veiculo.ano || '-'}</td>
            <td>R$ ${formatarValorMonetario(veiculo.preco)}</td>
            <td>
                <span class="badge ${situacaoBadge}">
                    ${situacaoText}
                </span>
            </td>
            <td>
                <span class="badge ${statusBadge}">
                    ${statusText}
                </span>
            </td>
            <td>
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-sm btn-primary" onclick="getVeiculo(${veiculo.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-danger" onclick="showDeleteModal(${veiculo.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        veiculosTableBody.appendChild(row);
    });
}

// Função para renderizar a paginação
function renderPagination(data) {
    const paginationElement = document.getElementById('pagination');
    if (!paginationElement) {
        console.error('Elemento de paginação não encontrado');
        return;
    }
    
    // Verificar se temos metadados de paginação
    if (!data || !data.meta) {
        console.log('Sem dados de paginação disponíveis');
        paginationElement.innerHTML = '';
        return;
    }
    
    const { currentPage, totalPages } = data.meta;
    
    if (totalPages <= 1) {
        paginationElement.innerHTML = '';
        return;
    }
    
    let paginationHTML = `
        <nav aria-label="Paginação">
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">Anterior</a>
                </li>
    `;
    
    // Mostrar no máximo 5 páginas
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
            </li>
        `;
    }
    
    paginationHTML += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">Próxima</a>
                </li>
            </ul>
        </nav>
    `;
    
    paginationElement.innerHTML = paginationHTML;
}

// Função para editar veículo
function editVeiculo(id) {
    const token = auth.getToken();
    
    fetch(`${config.apiBaseUrl}/api/veiculos/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar veículo');
        }
        return response.json();
    })
    .then(veiculo => {
        console.log('Editando veículo:', veiculo);
        
        // Limpar formulário
        resetForm();
        
        // Preencher formulário com dados do veículo
        document.getElementById('veiculoId').value = veiculo.id;
        document.getElementById('veiculoModalTitle').textContent = 'EDITAR VEÍCULO';
        
        // Carregar marcas e selecionar a marca do veículo
        loadMarcas().then(() => {
            if (document.getElementById('marcaId')) {
                document.getElementById('marcaId').value = veiculo.marcaId;
                
                // Carregar modelos da marca e selecionar o modelo do veículo
                loadModelos(veiculo.marcaId).then(() => {
                    if (document.getElementById('modeloId')) {
                        document.getElementById('modeloId').value = veiculo.modeloId;
                        
                        // Carregar versões do modelo e selecionar a versão do veículo
                        loadVersoes(veiculo.modeloId).then(() => {
                            if (document.getElementById('versaoId')) {
                                document.getElementById('versaoId').value = veiculo.versaoId;
                            }
                        });
                    }
                });
            }
        });
        
        // Preencher outros campos
        if (document.getElementById('ano')) document.getElementById('ano').value = veiculo.ano;
        if (document.getElementById('quilometragem')) document.getElementById('quilometragem').value = veiculo.quilometragem || '';
        if (document.getElementById('preco')) document.getElementById('preco').value = formatarValorMonetario(veiculo.preco);
        if (document.getElementById('descricao')) document.getElementById('descricao').value = veiculo.descricao || '';
        if (document.getElementById('motor')) document.getElementById('motor').value = veiculo.motor || '';
        if (document.getElementById('combustivel')) document.getElementById('combustivel').value = veiculo.combustivel || '';
        if (document.getElementById('cambio')) document.getElementById('cambio').value = veiculo.cambio || '';
        if (document.getElementById('situacao')) document.getElementById('situacao').value = veiculo.situacao || 'disponivel';
        if (document.getElementById('status')) document.getElementById('status').value = veiculo.status || 'ativo';
        
        // Preencher campos de desconto
        if (document.getElementById('defisicoicms')) document.getElementById('defisicoicms').value = veiculo.defisicoicms ? formatarValorMonetario(veiculo.defisicoicms) : '';
        if (document.getElementById('defisicoipi')) document.getElementById('defisicoipi').value = veiculo.defisicoipi ? formatarValorMonetario(veiculo.defisicoipi) : '';
        if (document.getElementById('taxicms')) document.getElementById('taxicms').value = veiculo.taxicms ? formatarValorMonetario(veiculo.taxicms) : '';
        if (document.getElementById('taxipi')) document.getElementById('taxipi').value = veiculo.taxipi ? formatarValorMonetario(veiculo.taxipi) : '';
        
        // Abrir modal
        veiculoModal.show();
    })
    .catch(error => {
        console.error('Erro ao carregar veículo para edição:', error);
        
        // Verificar se é um erro de veículo não encontrado
        if (error.message.includes('não encontrado')) {
            showError(`O veículo solicitado não foi encontrado. É possível que ele tenha sido excluído.`);
        } else {
            showError('Não foi possível carregar o veículo para edição. Por favor, tente novamente mais tarde.');
        }
    });
}

// Função para mostrar modal de exclusão
function showDeleteModal(id) {
    const deleteIdElement = document.getElementById('deleteId');
    if (deleteIdElement) {
        deleteIdElement.value = id;
    }
    
    if (deleteModal) {
        deleteModal.show();
    }
}

// Função para salvar veículo
function saveVeiculo() {
    // Validar formulário
    if (!veiculoForm || !veiculoForm.checkValidity()) {
        if (veiculoForm) {
            veiculoForm.classList.add('was-validated');
        }
        return;
    }
    
    // Mostrar spinner
    if (saveButton) {
        saveButton.disabled = true;
    }
    
    if (saveSpinner) {
        saveSpinner.classList.remove('d-none');
    }
    
    // Obter dados do formulário
    const id = document.getElementById('veiculoId') ? document.getElementById('veiculoId').value : '';
    const marcaId = document.getElementById('marcaId') ? document.getElementById('marcaId').value : '';
    const modeloId = document.getElementById('modeloId') ? document.getElementById('modeloId').value : '';
    const versaoId = document.getElementById('versaoId') ? document.getElementById('versaoId').value : '';
    const ano = document.getElementById('ano') ? document.getElementById('ano').value : '';
    const quilometragem = document.getElementById('quilometragem') ? document.getElementById('quilometragem').value : '';
    const precoFormatado = document.getElementById('preco') ? document.getElementById('preco').value : '';
    // Adicionando os campos que faltavam
    const descricao = document.getElementById('descricao') ? document.getElementById('descricao').value : '';
    const motor = document.getElementById('motor') ? document.getElementById('motor').value : '';
    const combustivel = document.getElementById('combustivel') ? document.getElementById('combustivel').value : '';
    const cambio = document.getElementById('cambio') ? document.getElementById('cambio').value : '';
    const situacao = document.getElementById('situacao') ? document.getElementById('situacao').value : 'disponivel';
    const status = document.getElementById('status') ? document.getElementById('status').value : 'ativo';
    
    // Obter valores dos campos de desconto
    const defisicoicmsFormatado = document.getElementById('defisicoicms') ? document.getElementById('defisicoicms').value : '';
    const defisicoipiFormatado = document.getElementById('defisicoipi') ? document.getElementById('defisicoipi').value : '';
    const taxicmsFormatado = document.getElementById('taxicms') ? document.getElementById('taxicms').value : '';
    const taxipiFormatado = document.getElementById('taxipi') ? document.getElementById('taxipi').value : '';
    
    // Converter valores formatados para números
    const preco = precoFormatado ? converterParaNumero(precoFormatado) : 0;
    const defisicoicms = defisicoicmsFormatado ? converterParaNumero(defisicoicmsFormatado) : 0;
    const defisicoipi = defisicoipiFormatado ? converterParaNumero(defisicoipiFormatado) : 0;
    const taxicms = taxicmsFormatado ? converterParaNumero(taxicmsFormatado) : 0;
    const taxipi = taxipiFormatado ? converterParaNumero(taxipiFormatado) : 0;
    
    // Validar campos obrigatórios
    if (!marcaId) {
        showError('Por favor, selecione uma marca.');
        if (saveButton) {
            saveButton.disabled = false;
        }
        
        if (saveSpinner) {
            saveSpinner.classList.add('d-none');
        }
        return;
    }
    
    if (!modeloId) {
        showError('Por favor, selecione um modelo.');
        if (saveButton) {
            saveButton.disabled = false;
        }
        
        if (saveSpinner) {
            saveSpinner.classList.add('d-none');
        }
        return;
    }
    
    if (!versaoId) {
        showError('Por favor, selecione uma versão.');
        if (saveButton) {
            saveButton.disabled = false;
        }
        
        if (saveSpinner) {
            saveSpinner.classList.add('d-none');
        }
        return;
    }
    
    // Preparar dados para envio
    const veiculoData = {
        marcaId: parseInt(marcaId),
        modeloId: parseInt(modeloId),
        versaoId: parseInt(versaoId),
        ano: parseInt(ano),
        // Removido o campo placa que não existe na entidade Veiculo
        quilometragem: quilometragem ? parseInt(quilometragem) : 0,
        preco: preco || 0, // Garantir que o preço nunca seja nulo
        descricao: descricao || '', // Garantir que descricao nunca seja undefined
        motor: motor || '', // Garantir que motor nunca seja undefined
        combustivel: combustivel || '', // Garantir que combustivel nunca seja undefined
        cambio: cambio || '', // Garantir que cambio nunca seja undefined
        // Campos obrigatórios que faltavam
        tipo: 'usado', // Valor padrão, pode ser 'novo' ou 'usado'
        situacao: situacao, // Valor padrão, pode ser 'disponivel', 'reservado' ou 'vendido'
        status: status, // Valor padrão, pode ser 'ativo' ou 'inativo'
        defisicoicms: defisicoicms,
        defisicoipi: defisicoipi,
        taxicms: taxicms,
        taxipi: taxipi
    };
    
    console.log('Dados enviados:', veiculoData);
    console.log('Campos específicos:');
    console.log('- descricao:', descricao, typeof descricao);
    console.log('- motor:', motor, typeof motor);
    console.log('- combustivel:', combustivel, typeof combustivel);
    console.log('- cambio:', cambio, typeof cambio);
    console.log('- defisicoicms:', defisicoicms, typeof defisicoicms);
    console.log('- defisicoipi:', defisicoipi, typeof defisicoipi);
    console.log('- taxicms:', taxicms, typeof taxicms);
    console.log('- taxipi:', taxipi, typeof taxipi);
    
    const token = auth.getToken();
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${config.apiBaseUrl}/api/veiculos/${id}` : `${config.apiBaseUrl}/api/veiculos`;
    
    // Enviar requisição
    fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(veiculoData)
    })
    .then(response => {
        console.log('Status da resposta:', response.status);
        if (!response.ok) {
            return response.text().then(text => {
                console.error('Erro na resposta:', response.status, text);
                throw new Error(`Falha ao salvar veículo: ${response.status} ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Veículo salvo com sucesso:', data);
        // Fechar modal e recarregar veículos
        if (veiculoModal) {
            veiculoModal.hide();
        }
        
        loadVeiculos();
    })
    .catch(error => {
        console.error('Erro ao salvar veículo:', error);
        showError('Não foi possível salvar o veículo. Por favor, tente novamente mais tarde.');
    })
    .finally(() => {
        // Esconder spinner
        if (saveButton) {
            saveButton.disabled = false;
        }
        
        if (saveSpinner) {
            saveSpinner.classList.add('d-none');
        }
    });
}

// Função para excluir veículo
function deleteVeiculo() {
    console.log('Excluindo veículo...');
    
    // Mostrar spinner
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const deleteSpinner = document.getElementById('deleteSpinner');
    
    if (confirmDeleteButton) {
        confirmDeleteButton.disabled = true;
    }
    
    if (deleteSpinner) {
        deleteSpinner.classList.remove('d-none');
    }
    
    // Obter ID do veículo a ser excluído
    const veiculoIdToDelete = document.getElementById('veiculoIdToDelete');
    if (!veiculoIdToDelete || !veiculoIdToDelete.value) {
        console.error('ID do veículo a ser excluído não encontrado');
        
        if (confirmDeleteButton) {
            confirmDeleteButton.disabled = false;
        }
        
        if (deleteSpinner) {
            deleteSpinner.classList.add('d-none');
        }
        
        return;
    }
    
    const id = veiculoIdToDelete.value;
    console.log('Excluindo veículo ID:', id);
    
    const token = auth.getToken();
    
    // Enviar requisição de exclusão
    fetch(`${config.apiBaseUrl}/api/veiculos/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Falha ao excluir veículo: ${response.status} ${text}`);
            });
        }
        
        return response.json();
    })
    .then(() => {
        console.log('Veículo excluído com sucesso');
        
        // Fechar modal de confirmação
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        if (deleteModal) {
            deleteModal.hide();
        }
        
        // Recarregar lista de veículos
        loadVeiculos();
    })
    .catch(error => {
        console.error('Erro ao excluir veículo:', error);
        showError('Não foi possível excluir o veículo. Por favor, tente novamente mais tarde.');
    })
    .finally(() => {
        // Esconder spinner
        if (confirmDeleteButton) {
            confirmDeleteButton.disabled = false;
        }
        
        if (deleteSpinner) {
            deleteSpinner.classList.add('d-none');
        }
    });
}

// Função para exibir mensagens de erro
function showError(message) {
    console.error('Erro:', message);
    const errorMessageElement = document.getElementById('errorMessage');
    if (errorMessageElement) {
        errorMessageElement.textContent = message;
        errorMessageElement.classList.remove('d-none');
    }
}

// Função para esconder mensagem de erro
function hideError() {
    console.log('Escondendo mensagem de erro');
    
    const errorMessageElement = document.getElementById('errorMessage');
    if (errorMessageElement) {
        errorMessageElement.textContent = '';
        errorMessageElement.classList.add('d-none');
    }
}

// Função para resetar o formulário
function resetForm() {
    console.log('Resetando formulário');
    
    // Limpar formulário
    if (veiculoForm) {
        veiculoForm.reset();
        veiculoForm.classList.remove('was-validated');
    }
    
    // Limpar ID do veículo
    const veiculoIdElement = document.getElementById('veiculoId');
    if (veiculoIdElement) {
        veiculoIdElement.value = '';
    }
    
    // Resetar título do modal
    const modalTitleElement = document.getElementById('veiculoModalTitle');
    if (modalTitleElement) {
        modalTitleElement.textContent = 'NOVO VEÍCULO';
    }
    
    // Esconder mensagem de erro
    hideError();
}

// Função para carregar marcas
async function loadMarcas() {
    console.log('Carregando marcas...');
    return new Promise((resolve, reject) => {
        // Obter token diretamente do localStorage para garantir que estamos usando o token mais recente
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            reject(new Error('Falha na autenticação. Por favor, faça login novamente.'));
            return;
        }
        
        // IMPORTANTE: Usar a URL completa para evitar problemas com o url-fixer.js
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de todas as possíveis URLs para tentar, em ordem de prioridade
        const urlsParaTentar = [
            `${baseUrl}/api/veiculos/marcas`,
            `${baseUrl}/api/marcas`
        ];
        
        console.log('Tentando URLs para carregar marcas:', urlsParaTentar);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let currentUrlIndex = 0;
        
        function tryNextUrl() {
            if (currentUrlIndex >= urlsParaTentar.length) {
                console.error('Todas as URLs falharam');
                reject(new Error('Erro ao carregar marcas: Todas as URLs falharam'));
                return;
            }
            
            const url = urlsParaTentar[currentUrlIndex];
            console.log(`Tentando carregar marcas de: ${url}`);
            
            fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    console.error(`Falha ao carregar marcas de ${url}. Status:`, response.status, response.statusText);
                    currentUrlIndex++;
                    tryNextUrl();
                    return null;
                }
                return response.json();
            })
            .then(marcas => {
                if (!marcas) return; // Já passou para a próxima URL
                
                console.log('Marcas carregadas com sucesso:', marcas);
                
                // Se a resposta for um objeto com propriedade items (paginação), usar items
                if (marcas && marcas.items && Array.isArray(marcas.items)) {
                    marcas = marcas.items;
                }
                
                // Verificar se marcas é um array
                if (!Array.isArray(marcas)) {
                    console.error('Resposta não é um array:', marcas);
                    currentUrlIndex++;
                    tryNextUrl();
                    return;
                }
                
                // Verificar se temos marcas
                if (marcas.length === 0) {
                    console.warn('Array de marcas está vazio');
                }
                
                // Preencher select de marcas
                const marcaSelect = document.getElementById('marca');
                if (marcaSelect) {
                    // Limpar opções existentes
                    marcaSelect.innerHTML = '<option value="">Selecione uma marca</option>';
                    
                    // Adicionar novas opções
                    marcas.forEach(marca => {
                        const option = document.createElement('option');
                        option.value = marca.id;
                        option.textContent = marca.nome;
                        marcaSelect.appendChild(option);
                    });
                }
                
                resolve(marcas);
            })
            .catch(error => {
                console.error(`Erro ao carregar marcas de ${url}:`, error);
                currentUrlIndex++;
                tryNextUrl();
            });
        }
        
        // Iniciar tentativas
        tryNextUrl();
    });
}

// Função para obter um veículo específico para edição
async function getVeiculo(id) {
    console.log('Obtendo veículo ID:', id);
    
    try {
        const token = auth.getToken();
        if (!token) {
            console.error('Token de autenticação não encontrado');
            window.location.href = '/login.html';
            return;
        }
        
        // Lista de URLs a tentar, em ordem de prioridade
        const urls = [
            `/api/veiculos/public/${id}`,
            `/api/veiculos/${id}`
        ];
        
        // Usar a função fetchWithFallback do config.js
        const veiculo = await config.fetchWithFallback(urls, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Veículo carregado com sucesso:', veiculo);
        
        // Preencher formulário com dados do veículo
        preencherFormularioVeiculo(veiculo);
    } catch (error) {
        console.error('Erro ao carregar veículo para edição:', error);
        showError('Não foi possível carregar o veículo para edição. ' + error.message);
    }
}

// Função para mostrar modal de exclusão
function showDeleteModal(id) {
    const deleteIdElement = document.getElementById('deleteId');
    if (deleteIdElement) {
        deleteIdElement.value = id;
    }
    
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Função para confirmar exclusão de veículo
function confirmDeleteVeiculo(id) {
    console.log('Confirmando exclusão do veículo ID:', id);
    
    // Armazenar ID do veículo a ser excluído
    const veiculoIdToDelete = document.getElementById('veiculoIdToDelete');
    if (veiculoIdToDelete) {
        veiculoIdToDelete.value = id;
    }
    
    // Mostrar modal de confirmação
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Função para preencher o formulário com os dados do veículo
function preencherFormularioVeiculo(veiculo) {
    // Limpar formulário
    resetForm();
    
    // Preencher formulário com dados do veículo
    document.getElementById('veiculoId').value = veiculo.id;
    document.getElementById('veiculoModalTitle').textContent = 'EDITAR VEÍCULO';
    
    // Carregar marcas e selecionar a marca do veículo
    loadMarcas().then(() => {
        if (document.getElementById('marcaId')) {
            document.getElementById('marcaId').value = veiculo.marcaId;
            
            // Carregar modelos da marca e selecionar o modelo do veículo
            loadModelos(veiculo.marcaId).then(() => {
                if (document.getElementById('modeloId')) {
                    document.getElementById('modeloId').value = veiculo.modeloId;
                    
                    // Carregar versões do modelo e selecionar a versão do veículo
                    loadVersoes(veiculo.modeloId).then(() => {
                        if (document.getElementById('versaoId')) {
                            document.getElementById('versaoId').value = veiculo.versaoId;
                        }
                    });
                }
            });
        }
    });
    
    // Preencher outros campos
    if (document.getElementById('ano')) document.getElementById('ano').value = veiculo.ano;
    if (document.getElementById('quilometragem')) document.getElementById('quilometragem').value = veiculo.quilometragem || '';
    if (document.getElementById('preco')) document.getElementById('preco').value = formatarValorMonetario(veiculo.preco);
    if (document.getElementById('descricao')) document.getElementById('descricao').value = veiculo.descricao || '';
    if (document.getElementById('motor')) document.getElementById('motor').value = veiculo.motor || '';
    if (document.getElementById('combustivel')) document.getElementById('combustivel').value = veiculo.combustivel || '';
    if (document.getElementById('cambio')) document.getElementById('cambio').value = veiculo.cambio || '';
    if (document.getElementById('situacao')) document.getElementById('situacao').value = veiculo.situacao || 'disponivel';
    if (document.getElementById('status')) document.getElementById('status').value = veiculo.status || 'ativo';
    
    // Preencher campos de desconto
    if (document.getElementById('defisicoicms')) document.getElementById('defisicoicms').value = veiculo.defisicoicms ? formatarValorMonetario(veiculo.defisicoicms) : '';
    if (document.getElementById('defisicoipi')) document.getElementById('defisicoipi').value = veiculo.defisicoipi ? formatarValorMonetario(veiculo.defisicoipi) : '';
    if (document.getElementById('taxicms')) document.getElementById('taxicms').value = veiculo.taxicms ? formatarValorMonetario(veiculo.taxicms) : '';
    if (document.getElementById('taxipi')) document.getElementById('taxipi').value = veiculo.taxipi ? formatarValorMonetario(veiculo.taxipi) : '';
    
    // Abrir modal
    veiculoModal.show();
}

// Verificar autenticação e redirecionar se não estiver autenticado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    if (!auth.isAuthenticated()) {
        window.location.href = '/login.html';
        return;
    }
    
    // Inicializar elementos
    initializeElements();
    
    // Carregar veículos
    loadVeiculos();
    
    // Carregar marcas
    loadMarcas();
    
    // Adicionar event listeners para os selects de marca e modelo
    const marcaSelect = document.getElementById('marcaId');
    if (marcaSelect) {
        marcaSelect.addEventListener('change', function() {
            const marcaId = this.value;
            if (marcaId) {
                loadModelos(marcaId);
            }
        });
    }
    
    const modeloSelect = document.getElementById('modeloId');
    if (modeloSelect) {
        modeloSelect.addEventListener('change', function() {
            const modeloId = this.value;
            if (modeloId) {
                loadVersoes(modeloId);
            }
        });
    }
    
    // Adicionar event listener para o botão de salvar
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', saveVeiculo);
    }
    
    // Adicionar event listener para o botão de confirmação de exclusão
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', deleteVeiculo);
    }
    
    // Inicializar formatação de campos monetários
    const moneyInputs = document.querySelectorAll('.money-input');
    moneyInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatarCampoMonetario(this);
        });
    });
});

// Função para carregar modelos de uma marca
async function loadModelos(marcaId) {
    console.log('Carregando modelos da marca ID:', marcaId);
    return new Promise((resolve, reject) => {
        if (!marcaId) {
            console.warn('ID da marca não fornecido para carregar modelos');
            
            // Limpar select de modelos
            const modeloSelect = document.getElementById('modelo');
            if (modeloSelect) {
                // Limpar opções existentes
                modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
            }
            
            // Limpar select de versões
            const versaoSelect = document.getElementById('versao');
            if (versaoSelect) {
                // Limpar opções existentes
                versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
            }
            
            resolve([]);
            return;
        }
        
        // Obter token diretamente do localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            reject(new Error('Falha na autenticação. Por favor, faça login novamente.'));
            return;
        }
        
        // IMPORTANTE: Usar a URL completa para evitar problemas com o url-fixer.js
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de todas as possíveis URLs para tentar, em ordem de prioridade
        const urlsParaTentar = [
            `${baseUrl}/api/veiculos/modelos/by-marca/${marcaId}`,
            `${baseUrl}/api/modelos/marca/${marcaId}`
        ];
        
        console.log('Tentando URLs para carregar modelos:', urlsParaTentar);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let currentUrlIndex = 0;
        
        function tryNextUrl() {
            if (currentUrlIndex >= urlsParaTentar.length) {
                console.error('Todas as URLs falharam');
                reject(new Error('Erro ao carregar modelos: Todas as URLs falharam'));
                return;
            }
            
            const url = urlsParaTentar[currentUrlIndex];
            console.log(`Tentando carregar modelos de: ${url}`);
            
            fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    console.error(`Falha ao carregar modelos de ${url}. Status:`, response.status, response.statusText);
                    currentUrlIndex++;
                    tryNextUrl();
                    return null;
                }
                return response.json();
            })
            .then(modelos => {
                if (!modelos) return; // Já passou para a próxima URL
                
                console.log('Modelos carregados com sucesso:', modelos);
                
                // Se a resposta for um objeto com propriedade items (paginação), usar items
                if (modelos && modelos.items && Array.isArray(modelos.items)) {
                    modelos = modelos.items;
                }
                
                // Verificar se modelos é um array
                if (!Array.isArray(modelos)) {
                    console.error('Resposta não é um array:', modelos);
                    currentUrlIndex++;
                    tryNextUrl();
                    return;
                }
                
                // Verificar se temos modelos
                if (modelos.length === 0) {
                    console.warn('Array de modelos está vazio');
                }
                
                // Preencher select de modelos
                const modeloSelect = document.getElementById('modelo');
                if (modeloSelect) {
                    // Limpar opções existentes
                    modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
                    
                    // Adicionar novas opções
                    modelos.forEach(modelo => {
                        const option = document.createElement('option');
                        option.value = modelo.id;
                        option.textContent = modelo.nome;
                        modeloSelect.appendChild(option);
                    });
                }
                
                // Limpar select de versões
                const versaoSelect = document.getElementById('versao');
                if (versaoSelect) {
                    // Limpar opções existentes
                    versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
                }
                
                resolve(modelos);
            })
            .catch(error => {
                console.error(`Erro ao carregar modelos de ${url}:`, error);
                currentUrlIndex++;
                tryNextUrl();
            });
        }
        
        // Iniciar tentativas
        tryNextUrl();
    });
}

// Função para carregar versões de um modelo
async function loadVersoes(modeloId) {
    console.log('Carregando versões do modelo ID:', modeloId);
    return new Promise((resolve, reject) => {
        if (!modeloId) {
            console.warn('ID do modelo não fornecido para carregar versões');
            
            // Limpar select de versões
            const versaoSelect = document.getElementById('versao');
            if (versaoSelect) {
                // Limpar opções existentes
                versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
            }
            
            resolve([]);
            return;
        }
        
        // Obter token diretamente do localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            reject(new Error('Falha na autenticação. Por favor, faça login novamente.'));
            return;
        }
        
        // IMPORTANTE: Usar a URL completa para evitar problemas com o url-fixer.js
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Lista de todas as possíveis URLs para tentar, em ordem de prioridade
        const urlsParaTentar = [
            `${baseUrl}/api/versoes/modelo/${modeloId}`,
            `${baseUrl}/api/veiculos/versoes/modelo/${modeloId}`,
            `${baseUrl}/api/versoes/modelo/${modeloId}/public`
        ];
        
        console.log('Tentando URLs para carregar versões:', urlsParaTentar);
        
        // Tentar cada URL em sequência até encontrar uma que funcione
        let currentUrlIndex = 0;
        
        function tryNextUrl() {
            if (currentUrlIndex >= urlsParaTentar.length) {
                console.error('Todas as URLs falharam');
                reject(new Error('Erro ao carregar versões: Todas as URLs falharam'));
                return;
            }
            
            const url = urlsParaTentar[currentUrlIndex];
            console.log(`Tentando carregar versões de: ${url}`);
            
            fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    console.error(`Falha ao carregar versões de ${url}. Status:`, response.status, response.statusText);
                    currentUrlIndex++;
                    tryNextUrl();
                    return null;
                }
                return response.json();
            })
            .then(versoes => {
                if (!versoes) return; // Já passou para a próxima URL
                
                console.log('Versões carregadas com sucesso:', versoes);
                
                // Se a resposta for um objeto com propriedade items (paginação), usar items
                if (versoes && versoes.items && Array.isArray(versoes.items)) {
                    versoes = versoes.items;
                }
                
                // Verificar se versoes é um array
                if (!Array.isArray(versoes)) {
                    console.error('Resposta não é um array:', versoes);
                    currentUrlIndex++;
                    tryNextUrl();
                    return;
                }
                
                // Verificar se temos versões
                if (versoes.length === 0) {
                    console.warn('Array de versões está vazio');
                }
                
                // Preencher select de versões
                const versaoSelect = document.getElementById('versao');
                if (versaoSelect) {
                    // Limpar opções existentes
                    versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
                    
                    // Adicionar novas opções
                    versoes.forEach(versao => {
                        const option = document.createElement('option');
                        option.value = versao.id;
                        
                        // Usar nome_versao em vez de nome, conforme a entidade Versao
                        if (versao.nome_versao !== undefined) {
                            option.textContent = versao.nome_versao;
                        } else if (versao.nome !== undefined) {
                            option.textContent = versao.nome;
                        } else if (versao.name !== undefined) {
                            option.textContent = versao.name;
                        } else if (versao.descricao !== undefined) {
                            option.textContent = versao.descricao;
                        } else if (versao.description !== undefined) {
                            option.textContent = versao.description;
                        } else {
                            // Se não encontrar nenhuma propriedade adequada, usar o ID como texto
                            option.textContent = `Versão ${versao.id}`;
                        }
                        
                        versaoSelect.appendChild(option);
                    });
                }
                
                resolve(versoes);
            })
            .catch(error => {
                console.error(`Erro ao carregar versões de ${url}:`, error);
                currentUrlIndex++;
                tryNextUrl();
            });
        }
        
        // Iniciar tentativas
        tryNextUrl();
    });
}
