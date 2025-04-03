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
        const token = auth.getToken();
        const response = await fetch(`${config.apiBaseUrl}/api/veiculos/modelos/all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar todos os modelos');
        }
        
        modelos = await response.json();
        console.log('Modelos carregados:', modelos);
        
        // Verificar a estrutura dos dados para debug
        if (modelos.length > 0) {
            console.log('Exemplo de modelo:', modelos[0]);
            console.log('Estrutura do modelo:', Object.keys(modelos[0]));
        }
    } catch (error) {
        console.error('Erro ao carregar todos os modelos:', error);
        // Não exibir erro para o usuário, pois isso não deve impedir o carregamento da tabela
    }
}

// Função para carregar todas as versões
async function loadAllVersoes() {
    try {
        const token = auth.getToken();
        const response = await fetch(`${config.apiBaseUrl}/api/versoes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar todas as versões');
        }
        
        versoes = await response.json();
        console.log('Versões carregadas:', versoes);
        
        // Verificar a estrutura dos dados para debug
        if (versoes.length > 0) {
            console.log('Exemplo de versão:', versoes[0]);
            console.log('Estrutura da versão:', Object.keys(versoes[0]));
        }
    } catch (error) {
        console.error('Erro ao carregar todas as versões:', error);
        // Não exibir erro para o usuário, pois isso não deve impedir o carregamento da tabela
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

// Função para carregar marcas para o select
async function loadMarcasSelect() {
    if (!marcaSelect) {
        console.error('Elemento marcaSelect não encontrado');
        return;
    }
    
    try {
        const token = auth.getToken();
        const response = await fetch(`${config.apiBaseUrl}/api/veiculos/marcas/all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar marcas');
        }
        
        marcas = await response.json();
        
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
        throw new Error('Não foi possível carregar as marcas. Por favor, tente novamente mais tarde.');
    }
}

// Função para carregar modelos por marca
async function loadModelosByMarca() {
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
        const token = auth.getToken();
        const response = await fetch(`${config.apiBaseUrl}/api/veiculos/modelos/by-marca/${marcaId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar modelos');
        }
        
        modelos = await response.json();
        
        if (modelos.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Nenhum modelo encontrado para esta marca';
            modeloSelect.appendChild(option);
            return;
        }
        
        // Adicionar opções
        modelos.forEach(modelo => {
            const option = document.createElement('option');
            option.value = modelo.id;
            option.textContent = modelo.nome;
            modeloSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        showError('Não foi possível carregar os modelos. Por favor, tente novamente mais tarde.');
    }
}

// Função para carregar versões por modelo
async function loadVersoesByModelo() {
    if (!versaoSelect || !modeloSelect) {
        console.error('Elementos versaoSelect ou modeloSelect não encontrados');
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
        const token = auth.getToken();
        const response = await fetch(`${config.apiBaseUrl}/api/versoes/modelo/${modeloId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar versões');
        }
        
        versoes = await response.json();
        
        if (versoes.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Nenhuma versão encontrada para este modelo';
            versaoSelect.appendChild(option);
            return;
        }
        
        // Adicionar opções
        versoes.forEach(versao => {
            const option = document.createElement('option');
            option.value = versao.id;
            option.textContent = versao.nome_versao;
            versaoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar versões:', error);
        showError('Não foi possível carregar as versões. Por favor, tente novamente mais tarde.');
    }
}

// Função para carregar veículos
async function loadVeiculos() {
    try {
        const token = auth.getToken();
        const response = await fetch(`${config.apiBaseUrl}/api/veiculos?page=${currentPage}&limit=${itemsPerPage}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Falha ao carregar veículos');
        }
        
        const data = await response.json();
        console.log('Veículos carregados:', data);
        
        // Verificar a estrutura dos dados para debug
        if (data.items && data.items.length > 0) {
            console.log('Exemplo de veículo:', data.items[0]);
            console.log('Estrutura do veículo:', Object.keys(data.items[0]));
            
            // Verificar se os objetos relacionados estão presentes
            if (data.items[0].marca) {
                console.log('Estrutura da marca no veículo:', Object.keys(data.items[0].marca));
            }
            if (data.items[0].modelo) {
                console.log('Estrutura do modelo no veículo:', Object.keys(data.items[0].modelo));
            }
            if (data.items[0].versao) {
                console.log('Estrutura da versão no veículo:', Object.keys(data.items[0].versao));
            }
        }
        
        renderVeiculos(data.items || []);
        renderPagination(data);
        
    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
        showError('Erro ao carregar veículos. Por favor, tente novamente.');
    }
}

// Função para renderizar veículos na tabela
function renderVeiculos(veiculos) {
    if (!veiculosTableBody) {
        console.error('Elemento veiculosTableBody não encontrado');
        return;
    }
    
    veiculosTableBody.innerHTML = '';
    
    if (veiculos.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="9" class="text-center">Nenhum veículo encontrado</td>';
        veiculosTableBody.appendChild(tr);
        return;
    }
    
    veiculos.forEach(veiculo => {
        const tr = document.createElement('tr');
        
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
        
        // Definir situação e status (placeholders por enquanto)
        const situacao = '<span class="badge bg-success">Disponível</span>';
        const status = '<span class="badge bg-primary">Ativo</span>';
        
        tr.innerHTML = `
            <td>${veiculo.id}</td>
            <td>${marcaNome}</td>
            <td>${modeloNome}</td>
            <td>${versaoNome}</td>
            <td>${veiculo.ano || '-'}</td>
            <td>${formatarPreco(veiculo.preco)}</td>
            <td>${situacao}</td>
            <td>${status}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editVeiculo(${veiculo.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="showDeleteModal(${veiculo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        veiculosTableBody.appendChild(tr);
    });
}

// Função para renderizar controles de paginação
function renderPagination(data) {
    if (!paginationControls) {
        console.error('Elemento paginationControls não encontrado');
        return;
    }
    
    const totalPages = Math.ceil(data.total / itemsPerPage);
    
    if (totalPages <= 1) {
        paginationControls.innerHTML = '';
        return;
    }
    
    let paginationHTML = `
        <nav aria-label="Navegação de página">
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">Anterior</a>
                </li>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
            </li>
        `;
    }
    
    paginationHTML += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">Próximo</a>
                </li>
            </ul>
        </nav>
    `;
    
    paginationControls.innerHTML = paginationHTML;
}

// Função para mudar de página
function changePage(page) {
    if (page < 1) page = 1;
    currentPage = page;
    loadVeiculos();
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
    .then(async veiculo => {
        const veiculoIdElement = document.getElementById('veiculoId');
        if (veiculoIdElement) {
            veiculoIdElement.value = veiculo.id;
        }
        
        // Selecionar marca
        if (marcaSelect) {
            marcaSelect.value = veiculo.marcaId;
        }
        
        // Carregar modelos da marca e depois selecionar o modelo
        await loadModelosByMarca();
        if (modeloSelect) {
            modeloSelect.value = veiculo.modeloId;
        }
        
        // Carregar versões do modelo e depois selecionar a versão
        await loadVersoesByModelo();
        if (versaoSelect) {
            versaoSelect.value = veiculo.versaoId;
        }
        
        // Preencher outros campos
        const anoElement = document.getElementById('ano');
        if (anoElement) {
            anoElement.value = veiculo.ano;
        }
        
        const quilometragemElement = document.getElementById('quilometragem');
        if (quilometragemElement) {
            quilometragemElement.value = veiculo.quilometragem;
        }
        
        const precoElement = document.getElementById('preco');
        if (precoElement) {
            precoElement.value = formatarPreco(veiculo.preco);
        }
        
        const descricaoElement = document.getElementById('descricao');
        if (descricaoElement) {
            descricaoElement.value = veiculo.descricao;
        }
        
        const motorElement = document.getElementById('motor');
        if (motorElement) {
            motorElement.value = veiculo.motor;
        }
        
        const combustivelElement = document.getElementById('combustivel');
        if (combustivelElement) {
            combustivelElement.value = veiculo.combustivel;
        }
        
        const cambioElement = document.getElementById('cambio');
        if (cambioElement) {
            cambioElement.value = veiculo.cambio;
        }
        
        const modalTitleElement = document.getElementById('veiculoModalTitle');
        if (modalTitleElement) {
            modalTitleElement.textContent = 'EDITAR VEÍCULO';
        }
        
        if (veiculoModal) {
            veiculoModal.show();
        }
    })
    .catch(error => {
        console.error('Erro ao carregar veículo para edição:', error);
        showError('Não foi possível carregar o veículo para edição. Por favor, tente novamente mais tarde.');
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
    
    // Converter valores formatados para números
    const preco = precoFormatado ? converterParaNumero(precoFormatado) : 0;
    
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
        situacao: 'disponivel', // Valor padrão, pode ser 'disponivel', 'reservado' ou 'vendido'
        status: 'ativo' // Valor padrão, pode ser 'ativo' ou 'inativo'
    };
    
    console.log('Dados enviados:', veiculoData);
    console.log('Campos específicos:');
    console.log('- descricao:', descricao, typeof descricao);
    console.log('- motor:', motor, typeof motor);
    console.log('- combustivel:', combustivel, typeof combustivel);
    console.log('- cambio:', cambio, typeof cambio);
    
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
        if (!response.ok) {
            return response.text().then(text => {
                console.error('Erro na resposta:', response.status, text);
                throw new Error(`Falha ao salvar veículo: ${response.status} ${text}`);
            });
        }
        return response.json();
    })
    .then(() => {
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
    // Mostrar spinner
    if (confirmDeleteButton) {
        confirmDeleteButton.disabled = true;
    }
    
    if (deleteSpinner) {
        deleteSpinner.classList.remove('d-none');
    }
    
    // Obter ID do veículo a ser excluído
    const id = document.getElementById('deleteId') ? document.getElementById('deleteId').value : '';
    
    const token = auth.getToken();
    
    // Enviar requisição
    fetch(`${config.apiBaseUrl}/api/veiculos/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao excluir veículo');
        }
        return response.json();
    })
    .then(() => {
        // Fechar modal e recarregar veículos
        if (deleteModal) {
            deleteModal.hide();
        }
        
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
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('d-none');
        
        // Esconder a mensagem após 5 segundos
        setTimeout(() => {
            errorMessage.classList.add('d-none');
        }, 5000);
    } else {
        console.error('Elemento errorMessage não encontrado. Erro:', message);
        // Fallback para alert se o elemento não existir
        alert(message);
    }
}

// Verificar autenticação e redirecionar se não estiver autenticado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    auth.checkAuthAndRedirect();
    
    // Inicializar elementos após garantir que o DOM está completamente carregado
    // e que o cabeçalho foi carregado pelo layout-manager.js
    setTimeout(initializeElements, 500);
});
