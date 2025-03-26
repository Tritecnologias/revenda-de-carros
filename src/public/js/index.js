// Declarar variável auth global
let auth;

// Função para inicializar a aplicação
function initApp() {
    console.log('Inicializando aplicação...');
    
    // Inicializar auth
    auth = new Auth();
    console.log('Auth inicializado');
    
    auth.checkAuthAndRedirect();
    console.log('Verificação de autenticação concluída');

    const user = auth.getUser();
    console.log('Usuário atual:', user);
    
    // Mostrar/ocultar itens do menu baseado no papel do usuário
    if (user && user.role === 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = '';
        });
        console.log('Elementos de admin exibidos');
    }

    // Elementos do configurador
    const marcaSelect = document.getElementById('configuradorMarca');
    const modeloSelect = document.getElementById('configuradorModelo');
    const versaoSelect = document.getElementById('configuradorVersao');
    const recarregarMarcasBtn = document.getElementById('recarregarMarcas');
    const descontoInput = document.getElementById('descontoInput');
    
    console.log('Elementos do configurador encontrados:', {
        marcaSelect: !!marcaSelect,
        modeloSelect: !!modeloSelect,
        versaoSelect: !!versaoSelect,
        recarregarMarcasBtn: !!recarregarMarcasBtn,
        descontoInput: !!descontoInput
    });

    // Adicionar evento para o campo de desconto
    if (descontoInput) {
        descontoInput.addEventListener('input', function() {
            // Converter o valor para número
            const valorDesconto = parseFloat(this.value.replace(',', '.')) || 0;
            window.percentualDesconto = valorDesconto;
            
            // Atualizar o texto do desconto no resumo
            const descontoLabel = document.getElementById('descontoLabel');
            if (descontoLabel) {
                descontoLabel.textContent = `Desc. ${valorDesconto}%`;
            }
            
            // Atualizar o resumo de valores
            if (typeof window.atualizarResumoValores === 'function') {
                window.atualizarResumoValores();
            }
        });
    }

    // Carregar marcas ao iniciar a página
    console.log('Chamando loadMarcas() na inicialização...');
    loadMarcas();

    // Event listener para o botão de recarregar marcas
    if (recarregarMarcasBtn) {
        recarregarMarcasBtn.addEventListener('click', function() {
            console.log('Botão de recarregar marcas clicado');
            loadMarcas();
        });
    }

    // Event listeners para os selects
    if (marcaSelect) {
        marcaSelect.addEventListener('change', function() {
            console.log('Select de marca alterado');
            if (modeloSelect) modeloSelect.disabled = !this.value;
            if (versaoSelect) {
                versaoSelect.disabled = true;
                versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
            }
            
            if (this.value) {
                console.log('Carregando modelos para marca:', this.value);
                loadModelos(this.value);
                loadVendasDiretas(this.value); // Adicionado evento para carregar vendas diretas
            } else if (modeloSelect) {
                modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
            }
        });
    }

    if (modeloSelect) {
        modeloSelect.addEventListener('change', function() {
            console.log('Select de modelo alterado');
            if (versaoSelect) versaoSelect.disabled = !this.value;
            
            if (this.value) {
                console.log('Carregando versões para modelo:', this.value);
                loadVersoes(this.value);
            } else if (versaoSelect) {
                versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
            }
        });
    }

    if (versaoSelect) {
        versaoSelect.addEventListener('change', function() {
            console.log('Select de versão alterado');
            if (this.value) {
                // Atualizar as informações do veículo com base na versão selecionada
                console.log('Carregando detalhes do veículo:', this.value);
                loadVeiculoDetails(this.value);
            } else {
                // Limpar os detalhes do veículo quando nenhuma versão estiver selecionada
                limparDetalhesVeiculo();
            }
        });
    }
    
    // Inicializar campos monetários
    initMonetaryInputs();
    
    // Inicializar o card de resumo com valores zerados
    limparDetalhesVeiculo();
    
    // Adicionar event listeners aos cards de preço
    setupPriceCardListeners();
}

// Função para limpar os detalhes do veículo quando nenhum estiver selecionado
function limparDetalhesVeiculo() {
    // Limpar o título
    const veiculoTitle = document.getElementById('veiculoTitulo');
    if (veiculoTitle) {
        veiculoTitle.textContent = 'Selecione um veículo para configurar';
    }
    
    // Limpar o nome no card da imagem
    const carName = document.querySelector('.car-name');
    if (carName) {
        carName.textContent = 'Selecione um veículo';
    }
    
    // Limpar a tabela de opcionais
    const opcionaisTableBody = document.querySelector('.table-striped tbody');
    if (opcionaisTableBody) {
        opcionaisTableBody.innerHTML = '<tr><td colspan="4" class="text-center">Selecione um modelo para ver os opcionais disponíveis</td></tr>';
    }
    
    // Resetar as variáveis globais
    window.precoPublicoVeiculo = 0;
    window.valorPinturasSelecionadas = 0;
    window.valorOpcionaisSelecionados = 0;
    window.percentualDesconto = 0;
    window.opcionaisSelecionados = [];
    
    // Resetar os campos de input
    document.getElementById('descontoReaisInput').value = '0';
    document.getElementById('agioReaisInput').value = '0';
    document.getElementById('quantidadeInput').value = '1';
    
    // Atualizar o resumo de valores com zeros
    if (typeof window.atualizarResumoValores === 'function') {
        window.atualizarResumoValores();
    }
    
    // Limpar os preços na interface - cards de resumo
    const precoPublicoElement = document.getElementById('resumoPrecoPublico');
    if (precoPublicoElement) {
        precoPublicoElement.textContent = formatarMoeda(0);
    }
    
    const precoElement = document.querySelector('.car-price strong');
    if (precoElement) {
        precoElement.textContent = formatarMoeda(0);
    }
    
    // Limpar os cards de preços específicos
    document.getElementById('precoPublicoCard').textContent = formatarMoeda(0);
    document.getElementById('pcdIpiIcmsCard').textContent = formatarMoeda(0);
    document.getElementById('pcdIpiCard').textContent = formatarMoeda(0);
    document.getElementById('taxiIpiIcmsCard').textContent = formatarMoeda(0);
    document.getElementById('taxiIpiCard').textContent = formatarMoeda(0);
    
    // Limpar os novos cards
    document.getElementById('resumoDescontoReais').textContent = formatarMoeda(0);
    document.getElementById('resumoAgio').textContent = formatarMoeda(0);
    document.getElementById('resumoQuantidade').textContent = '1';
}

// Chamar a função de inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initApp);

// Função para carregar marcas
function loadMarcas() {
    console.log('Iniciando carregamento de marcas via XMLHttpRequest...');
    
    // Exibir mensagem de carregamento
    const marcaSelect = document.getElementById('configuradorMarca');
    if (marcaSelect) {
        marcaSelect.innerHTML = '<option value="">Carregando marcas...</option>';
        marcaSelect.disabled = true;
    } else {
        console.error('Elemento select de marca não encontrado');
        return;
    }
    
    // Usar XMLHttpRequest em vez de fetch
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${config.apiBaseUrl}/api/veiculos/marcas/public`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = function() {
        console.log('Resposta da API recebida:', xhr.status);
        
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const marcas = JSON.parse(xhr.responseText);
                console.log('Marcas carregadas:', marcas);
                
                // Habilitar o select
                marcaSelect.disabled = false;
                
                // Limpar select atual
                marcaSelect.innerHTML = '<option value="">Selecione uma marca</option>';
                
                // Adicionar opções de marcas
                if (Array.isArray(marcas)) {
                    marcas.forEach(marca => {
                        console.log('Adicionando marca:', marca.id, marca.nome);
                        const option = document.createElement('option');
                        option.value = marca.id;
                        option.textContent = marca.nome;
                        marcaSelect.appendChild(option);
                    });
                    
                    if (marcas.length === 0) {
                        console.log('Nenhuma marca encontrada');
                        const option = document.createElement('option');
                        option.value = "";
                        option.textContent = "Nenhuma marca disponível";
                        marcaSelect.appendChild(option);
                    }
                } else {
                    console.error('Resposta da API não é um array:', marcas);
                    marcaSelect.innerHTML = '<option value="">Formato de resposta inválido</option>';
                }
            } catch (error) {
                console.error('Erro ao processar resposta da API:', error);
                marcaSelect.disabled = false;
                marcaSelect.innerHTML = '<option value="">Erro ao processar resposta</option>';
            }
        } else {
            console.error('Erro na resposta da API:', xhr.status, xhr.statusText);
            marcaSelect.disabled = false;
            marcaSelect.innerHTML = '<option value="">Erro ao carregar marcas</option>';
        }
    };
    
    xhr.onerror = function() {
        console.error('Erro de rede ao carregar marcas');
        marcaSelect.disabled = false;
        marcaSelect.innerHTML = '<option value="">Erro de conexão</option>';
    };
    
    xhr.send();
    console.log('Requisição enviada para carregar marcas');
}

// Função para carregar modelos por marca
async function loadModelos(marcaId) {
    try {
        console.log(`Carregando modelos para marca ID: ${marcaId}`);
        
        // Exibir mensagem de carregamento
        const modeloSelect = document.getElementById('configuradorModelo');
        if (modeloSelect) {
            modeloSelect.innerHTML = '<option value="">Carregando modelos...</option>';
        } else {
            console.error('Elemento select de modelo não encontrado');
            return;
        }
        
        // Usar o endpoint público para teste
        const response = await fetch(`${config.apiBaseUrl}/api/veiculos/modelos/public/by-marca/${marcaId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Resposta da API:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Resposta de erro:', errorText);
            throw new Error(`Falha ao carregar modelos: ${response.status} ${response.statusText}`);
        }
        
        const modelos = await response.json();
        console.log('Modelos carregados:', modelos);
        
        // Limpar select atual
        modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
        
        // Adicionar opções de modelos
        if (Array.isArray(modelos)) {
            modelos.forEach(modelo => {
                console.log('Adicionando modelo:', modelo.id, modelo.nome);
                const option = document.createElement('option');
                option.value = modelo.id;
                option.textContent = modelo.nome;
                modeloSelect.appendChild(option);
            });
            
            if (modelos.length === 0) {
                console.log('Nenhum modelo encontrado');
                const option = document.createElement('option');
                option.value = "";
                option.textContent = "Nenhum modelo disponível";
                modeloSelect.appendChild(option);
            }
        } else {
            console.error('Resposta da API não é um array:', modelos);
            modeloSelect.innerHTML = '<option value="">Formato de resposta inválido</option>';
        }
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        
        // Adicionar mensagem de erro no select
        const modeloSelect = document.getElementById('configuradorModelo');
        if (modeloSelect) {
            modeloSelect.innerHTML = '<option value="">Erro ao carregar modelos</option>';
        }
    }
}

// Função para carregar versões por modelo
async function loadVersoes(modeloId) {
    if (!modeloId) {
        const versaoSelect = document.getElementById('configuradorVersao');
        if (versaoSelect) {
            versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
            versaoSelect.disabled = true;
        }
        return;
    }
    
    try {
        const response = await fetch(`${config.apiBaseUrl}/api/veiculos/public?modeloId=${modeloId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Falha ao carregar versões: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const veiculos = data.items || [];
        
        const versaoSelect = document.getElementById('configuradorVersao');
        if (versaoSelect) {
            // Limpar select
            versaoSelect.innerHTML = '<option value="">Selecione uma versão</option>';
            
            // Adicionar versões
            veiculos.forEach(veiculo => {
                const option = document.createElement('option');
                option.value = veiculo.id;
                option.textContent = veiculo.versao;
                versaoSelect.appendChild(option);
            });
            
            // Habilitar select
            versaoSelect.disabled = false;
        }
        
    } catch (error) {
        console.error('Erro ao carregar versões:', error);
        alert('Erro ao carregar versões. Por favor, tente novamente.');
    }
}

// Função para carregar vendas diretas por marca
async function loadVendasDiretas(marcaId) {
    if (!marcaId) {
        const vendasDiretasSelect = document.getElementById('vendasDiretasSelect');
        if (vendasDiretasSelect) {
            vendasDiretasSelect.innerHTML = '';
            // Adicionar opção padrão
            const defaultOption = document.createElement('option');
            defaultOption.value = "";
            defaultOption.textContent = "DESCONTOS VENDA DIRETA";
            vendasDiretasSelect.appendChild(defaultOption);
            vendasDiretasSelect.disabled = true;
        }
        return;
    }
    
    try {
        const response = await fetch(`${config.apiBaseUrl}/api/venda-direta/public?marcaId=${marcaId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Falha ao carregar vendas diretas: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const vendasDiretas = data.items || [];
        
        const vendasDiretasSelect = document.getElementById('vendasDiretasSelect');
        if (vendasDiretasSelect) {
            // Salvar o valor selecionado atualmente (se houver)
            const selectedValue = vendasDiretasSelect.value;
            
            // Limpar select
            vendasDiretasSelect.innerHTML = '';
            
            // Adicionar opção padrão
            const defaultOption = document.createElement('option');
            defaultOption.value = "";
            defaultOption.textContent = "DESCONTOS VENDA DIRETA";
            vendasDiretasSelect.appendChild(defaultOption);
            
            // Adicionar vendas diretas
            vendasDiretas.forEach(vendaDireta => {
                const option = document.createElement('option');
                option.value = vendaDireta.id;
                option.textContent = `${vendaDireta.nome} (${vendaDireta.percentual}%)`;
                vendasDiretasSelect.appendChild(option);
            });
            
            // Habilitar select apenas se houver vendas diretas
            vendasDiretasSelect.disabled = vendasDiretas.length === 0;
            
            // Remover event listeners anteriores para evitar duplicação
            const newSelect = vendasDiretasSelect.cloneNode(true);
            vendasDiretasSelect.parentNode.replaceChild(newSelect, vendasDiretasSelect);
            
            // Tentar restaurar a seleção anterior
            if (window.vendaDiretaSelecionada) {
                // Verificar se a venda direta selecionada anteriormente ainda existe nas opções
                const vendaDiretaExiste = vendasDiretas.some(vd => vd.id == window.vendaDiretaSelecionada.id);
                
                if (vendaDiretaExiste) {
                    newSelect.value = window.vendaDiretaSelecionada.id;
                } else {
                    // Se não existir mais, selecionar a opção padrão
                    newSelect.value = "";
                    window.vendaDiretaSelecionada = null;
                }
            } else if (selectedValue && selectedValue !== "") {
                // Se não tiver uma venda direta global, tenta restaurar a seleção atual
                newSelect.value = selectedValue;
            } else {
                // Caso contrário, selecionar a opção padrão
                newSelect.value = "";
                window.vendaDiretaSelecionada = null;
            }
            
            // Adicionar event listener para quando uma venda direta for selecionada
            newSelect.addEventListener('change', function() {
                if (this.value === "") {
                    // Se a opção padrão for selecionada, limpar a venda direta global
                    window.vendaDiretaSelecionada = null;
                    
                    // Limpar o campo de desconto
                    const descontoInput = document.getElementById('descontoInput');
                    if (descontoInput) {
                        descontoInput.value = "0,0%";
                        // Disparar o evento input para atualizar o desconto
                        const inputEvent = new Event('input', { bubbles: true });
                        descontoInput.dispatchEvent(inputEvent);
                    }
                    return;
                }
                
                const selectedVendaDireta = vendasDiretas.find(vd => vd.id == this.value);
                if (selectedVendaDireta) {
                    // Salvar a venda direta selecionada na variável global
                    window.vendaDiretaSelecionada = selectedVendaDireta;
                    
                    // Atualizar o campo de desconto com o percentual da venda direta
                    const descontoInput = document.getElementById('descontoInput');
                    if (descontoInput) {
                        descontoInput.value = selectedVendaDireta.percentual;
                        // Disparar o evento input para atualizar o desconto
                        const inputEvent = new Event('input', { bubbles: true });
                        descontoInput.dispatchEvent(inputEvent);
                    }
                }
            });
        }
        
    } catch (error) {
        console.error('Erro ao carregar vendas diretas:', error);
        // Não mostrar alerta para não interromper o fluxo do usuário
        const vendasDiretasSelect = document.getElementById('vendasDiretasSelect');
        if (vendasDiretasSelect) {
            vendasDiretasSelect.innerHTML = '';
            // Adicionar opção padrão mesmo em caso de erro
            const defaultOption = document.createElement('option');
            defaultOption.value = "";
            defaultOption.textContent = "DESCONTOS VENDA DIRETA";
            vendasDiretasSelect.appendChild(defaultOption);
            vendasDiretasSelect.disabled = true;
        }
    }
}

// Função para carregar detalhes de um veículo específico
async function loadVeiculoDetails(veiculoId) {
    try {
        console.log(`Carregando detalhes do veículo ID: ${veiculoId}`);
        
        // Usar o endpoint público
        const response = await fetch(`${config.apiBaseUrl}/api/veiculos/public/${veiculoId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Resposta da API:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Resposta de erro:', errorText);
            throw new Error(`Falha ao carregar detalhes do veículo: ${response.status} ${response.statusText}`);
        }
        
        const veiculo = await response.json();
        console.log('Detalhes do veículo carregados:', veiculo);
        
        // Formatar o título do veículo
        let titulo = '';
        if (veiculo.modelo && veiculo.modelo.nome) {
            titulo += veiculo.modelo.nome + ' ';
        }
        titulo += veiculo.versao;
        if (veiculo.ano) {
            titulo += ` ${veiculo.ano}`;
        }
        titulo = titulo.toUpperCase();
        
        // Atualizar o título na seção principal
        const veiculoTitle = document.getElementById('veiculoTitulo');
        if (veiculoTitle) {
            veiculoTitle.textContent = titulo;
        }
        
        // Atualizar o nome do veículo no card da imagem
        const carName = document.querySelector('.car-name');
        if (carName) {
            carName.textContent = titulo;
        }
        
        // Atualizar os preços com base nos valores do veículo
        updatePrices(veiculo);
        
        // Carregar opcionais para o modelo selecionado
        if (veiculo.modelo && veiculo.modelo.id) {
            loadOpcionaisModelo(veiculo.modelo.id);
        }
        
        // Não recarregar vendas diretas aqui, para preservar a seleção atual
        // Se precisar carregar vendas diretas, use a marca do veículo
        // if (veiculo.modelo && veiculo.modelo.marca && veiculo.modelo.marca.id) {
        //     loadVendasDiretas(veiculo.modelo.marca.id);
        // }
        
        // Armazenar o preço público do veículo
        window.precoPublicoVeiculo = veiculo.preco;
        
        // Resetar valores
        window.valorPinturasSelecionadas = 0;
        window.valorOpcionaisSelecionados = 0;
        window.opcionaisSelecionados = [];
        
        // Atualizar o resumo de valores
        window.atualizarResumoValores();
        
    } catch (error) {
        console.error('Erro ao carregar detalhes do veículo:', error);
    }
}

// Função para carregar opcionais por modelo
async function loadOpcionaisModelo(modeloId) {
    try {
        console.log(`Carregando opcionais para o modelo ID: ${modeloId}`);
        
        const response = await fetch(`${config.apiBaseUrl}/api/modelo-opcional/by-modelo/${modeloId}/public`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Falha ao carregar opcionais: ${response.status} ${response.statusText}`);
        }
        
        const opcionais = await response.json();
        console.log('Opcionais carregados:', opcionais);
        
        // Renderizar os opcionais na tabela
        renderOpcionais(opcionais);
        
    } catch (error) {
        console.error('Erro ao carregar opcionais do modelo:', error);
    }
}

// Função para renderizar os opcionais na tabela
function renderOpcionais(opcionais) {
    const opcionaisTableBody = document.querySelector('.table-striped tbody');
    if (!opcionaisTableBody) {
        console.error('Tabela de opcionais não encontrada');
        return;
    }
    
    // Limpar a tabela
    opcionaisTableBody.innerHTML = '';
    
    if (opcionais.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4" class="text-center">Nenhum opcional disponível para este modelo</td>';
        opcionaisTableBody.appendChild(row);
        return;
    }
    
    // Adicionar cada opcional à tabela
    opcionais.forEach(opcional => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${opcional.codigo}</td>
            <td>${opcional.descricao}</td>
            <td>${formatarMoeda(opcional.preco)}</td>
            <td>
                <button class="btn btn-sm btn-primary adicionar-opcional" data-id="${opcional.id}" data-preco="${opcional.preco}">Adicionar</button>
            </td>
        `;
        opcionaisTableBody.appendChild(row);
    });
    
    // Adicionar event listeners para os botões de adicionar
    document.querySelectorAll('.adicionar-opcional').forEach(button => {
        button.addEventListener('click', function() {
            const opcionalId = this.getAttribute('data-id');
            const preco = parseFloat(this.getAttribute('data-preco')) || 0;
            adicionarOpcional(opcionalId, preco);
        });
    });
}

// Função para adicionar um opcional ao veículo
function adicionarOpcional(opcionalId, preco) {
    console.log(`Adicionando opcional ID: ${opcionalId}, Preço: ${preco}`);
    
    // Adicionar ao array de opcionais selecionados se ainda não estiver lá
    if (!window.opcionaisSelecionados.find(item => item.id === opcionalId)) {
        window.opcionaisSelecionados.push({
            id: opcionalId,
            preco: preco
        });
        
        // Atualizar o valor total dos opcionais
        window.valorOpcionaisSelecionados += preco;
        
        // Atualizar o resumo de valores
        window.atualizarResumoValores();
    }
    
    // Mudar o botão para "Remover"
    const button = document.querySelector(`.adicionar-opcional[data-id="${opcionalId}"]`);
    if (button) {
        button.textContent = 'Remover';
        button.classList.remove('btn-primary');
        button.classList.add('btn-danger');
        button.classList.remove('adicionar-opcional');
        button.classList.add('remover-opcional');
        
        // Remover o event listener antigo e adicionar o novo
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', function() {
            const opcionalId = this.getAttribute('data-id');
            const preco = parseFloat(this.getAttribute('data-preco')) || 0;
            removerOpcional(opcionalId, preco);
        });
    }
}

// Função para remover um opcional do veículo
function removerOpcional(opcionalId, preco) {
    console.log(`Removendo opcional ID: ${opcionalId}, Preço: ${preco}`);
    
    // Remover do array de opcionais selecionados
    const index = window.opcionaisSelecionados.findIndex(item => item.id === opcionalId);
    if (index !== -1) {
        window.opcionaisSelecionados.splice(index, 1);
        
        // Atualizar o valor total dos opcionais
        window.valorOpcionaisSelecionados -= preco;
        
        // Atualizar o resumo de valores
        window.atualizarResumoValores();
    }
    
    // Mudar o botão de volta para "Adicionar"
    const button = document.querySelector(`.remover-opcional[data-id="${opcionalId}"]`);
    if (button) {
        button.textContent = 'Adicionar';
        button.classList.remove('btn-danger');
        button.classList.add('btn-primary');
        button.classList.remove('remover-opcional');
        button.classList.add('adicionar-opcional');
        
        // Remover o event listener antigo e adicionar o novo
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', function() {
            const opcionalId = this.getAttribute('data-id');
            const preco = parseFloat(this.getAttribute('data-preco')) || 0;
            adicionarOpcional(opcionalId, preco);
        });
    }
}

// Função para atualizar o resumo de valores
window.atualizarResumoValores = function() {
    // Garantir que os valores sejam números
    const precoPublico = parseFloat(window.precoPublicoVeiculo) || 0;
    const valorPinturas = parseFloat(window.valorPinturasSelecionadas) || 0;
    const valorOpcionais = parseFloat(window.valorOpcionaisSelecionados) || 0;
    const percentualDesconto = parseFloat(window.percentualDesconto) || 0;
    
    // Obter valores dos novos campos
    const descontoReais = converterParaNumero(document.getElementById('descontoReaisInput').value) || 0;
    const agioReais = converterParaNumero(document.getElementById('agioReaisInput').value) || 0;
    const quantidade = parseInt(document.getElementById('quantidadeInput').value) || 1;
    
    // Calcular valores
    const valorPinturaOpcionais = valorPinturas + valorOpcionais;
    const total = precoPublico + valorPinturaOpcionais;
    const valorDescontoPercentual = total * (percentualDesconto / 100);
    
    // Aplicar desconto em reais e ágio
    const precoComDescontoPercentual = total - valorDescontoPercentual;
    const precoComDescontoReais = precoComDescontoPercentual - descontoReais;
    const precoComAgio = precoComDescontoReais + agioReais;
    
    // Preço final considerando a quantidade
    const precoFinal = precoComAgio * quantidade;
    
    // Atualizar os elementos na interface
    document.getElementById('resumoPrecoPublico').textContent = formatarMoeda(precoPublico);
    document.getElementById('resumoPinturaOpcionais').textContent = formatarMoeda(valorPinturaOpcionais);
    document.getElementById('resumoTotal').textContent = formatarMoeda(total);
    document.getElementById('resumoDesconto').textContent = formatarMoeda(valorDescontoPercentual);
    
    // Atualizar os novos cards
    document.getElementById('resumoDescontoReais').textContent = formatarMoeda(descontoReais);
    document.getElementById('resumoAgio').textContent = formatarMoeda(agioReais);
    document.getElementById('resumoQuantidade').textContent = quantidade;
    
    document.getElementById('resumoPrecoFinal').textContent = formatarMoeda(precoFinal);
    
    console.log('Resumo de valores atualizado:', {
        precoPublico: precoPublico,
        pinturaOpcionais: valorPinturaOpcionais,
        total: total,
        descontoPercentual: valorDescontoPercentual,
        descontoReais: descontoReais,
        agio: agioReais,
        quantidade: quantidade,
        precoFinal: precoFinal
    });
}

// Variáveis globais para armazenar valores
window.precoPublicoVeiculo = 0;
window.valorPinturasSelecionadas = 0;
window.valorOpcionaisSelecionados = 0;
window.vendaDiretaSelecionada = null; // Nova variável global para armazenar a venda direta selecionada
window.percentualDesconto = 0;
window.opcionaisSelecionados = [];

// Função para formatar valores monetários
function formatarMoeda(valor) {
    if (valor === null || valor === undefined) return 'N/A';
    return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(valor);
}

// Função para converter string formatada em valor numérico
function converterParaNumero(valorFormatado) {
    if (!valorFormatado) return 0;
    return Number(valorFormatado.replace(/[^\d,-]/g, '').replace('.', '').replace(',', '.'));
}

// Função para atualizar os preços na interface
function updatePrices(veiculo) {
    try {
        console.log('Atualizando preços na interface com base no veículo:', veiculo);
        
        // Preço público (preço normal)
        const precoPublicoElement = document.getElementById('precoPublicoCard');
        if (precoPublicoElement && veiculo.preco) {
            precoPublicoElement.textContent = formatarMoeda(veiculo.preco);
        }
        
        // PCD IPI/ICMS (Def. Físico IPI/ICMS)
        const pcdIpiIcmsElement = document.getElementById('pcdIpiIcmsCard');
        if (pcdIpiIcmsElement && veiculo.defisicoicms) {
            pcdIpiIcmsElement.textContent = formatarMoeda(veiculo.defisicoicms);
        }
        
        // PCD IPI (Def. Físico IPI)
        const pcdIpiElement = document.getElementById('pcdIpiCard');
        if (pcdIpiElement && veiculo.defisicoipi) {
            pcdIpiElement.textContent = formatarMoeda(veiculo.defisicoipi);
        }
        
        // TAXI IPI/ICMS
        const taxiIpiIcmsElement = document.getElementById('taxiIpiIcmsCard');
        if (taxiIpiIcmsElement && veiculo.taxicms) {
            taxiIpiIcmsElement.textContent = formatarMoeda(veiculo.taxicms);
        }
        
        // TAXI IPI
        const taxiIpiElement = document.getElementById('taxiIpiCard');
        if (taxiIpiElement && veiculo.taxipi) {
            taxiIpiElement.textContent = formatarMoeda(veiculo.taxipi);
        }
        
        // Atualizar preço no card da imagem
        const carPriceElement = document.querySelector('.car-price strong');
        if (carPriceElement && veiculo.preco) {
            carPriceElement.textContent = formatarMoeda(veiculo.preco);
        }
        
        console.log('Preços atualizados com sucesso');
    } catch (error) {
        console.error('Erro ao atualizar preços:', error);
    }
}

// Função para inicializar campos monetários
function initMonetaryInputs() {
    // Selecionar todos os campos de entrada que precisam de formatação monetária
    const monetaryInputs = document.querySelectorAll('input[type="text"].form-control');
    
    monetaryInputs.forEach(input => {
        // Verificar se o input está dentro de um input-group com texto que contém R$ ou %
        const inputGroup = input.closest('.input-group');
        if (!inputGroup) return;
        
        const inputGroupText = inputGroup.querySelector('.input-group-text');
        if (!inputGroupText) return;
        
        const textContent = inputGroupText.textContent;
        
        if (textContent.includes('R$')) {
            // Configurar para formatação monetária
            input.addEventListener('focus', function() {
                // Ao focar, converter para número sem formatação
                const rawValue = converterParaNumero(this.value);
                this.value = rawValue === 0 ? '' : rawValue.toString().replace('.', ',');
            });
            
            input.addEventListener('blur', function() {
                // Ao perder foco, formatar como moeda
                const rawValue = converterParaNumero(this.value);
                this.value = formatarMoeda(rawValue).replace('R$', '').trim();
                
                // Atualizar o resumo de valores quando o campo perder o foco
                window.atualizarResumoValores();
            });
            
            // Adicionar event listener para input para atualização em tempo real
            input.addEventListener('input', function() {
                window.atualizarResumoValores();
            });
        } else if (textContent.includes('%')) {
            // Configurar para formatação de percentual
            input.addEventListener('focus', function() {
                // Ao focar, converter para número sem formatação
                const rawValue = this.value.replace('%', '').replace(',', '.').trim();
                this.value = rawValue;
            });
            
            input.addEventListener('blur', function() {
                // Ao perder foco, formatar como percentual
                let value = this.value.replace(',', '.').trim();
                if (value === '') value = '0';
                const numValue = parseFloat(value);
                this.value = numValue.toLocaleString('pt-BR', {minimumFractionDigits: 1, maximumFractionDigits: 1}) + '%';
                
                // Atualizar o resumo de valores quando o campo perder o foco
                window.atualizarResumoValores();
            });
            
            // Adicionar event listener para input para atualização em tempo real
            input.addEventListener('input', function() {
                window.atualizarResumoValores();
            });
        } else if (textContent.includes('QT:')) {
            // Configurar para campo de quantidade
            input.addEventListener('focus', function() {
                // Ao focar, manter o valor como está
            });
            
            input.addEventListener('blur', function() {
                // Ao perder foco, garantir que seja um número inteiro positivo
                let value = parseInt(this.value) || 1;
                if (value < 1) value = 1;
                this.value = value;
                
                // Atualizar o resumo de valores quando o campo perder o foco
                window.atualizarResumoValores();
            });
            
            // Adicionar event listener para input para atualização em tempo real
            input.addEventListener('input', function() {
                window.atualizarResumoValores();
            });
        }
    });
}

// Função para adicionar event listeners aos cards de preço
function setupPriceCardListeners() {
    // Cards de preço
    const precoPublicoCard = document.getElementById('precoPublicoCard');
    const pcdIpiIcmsCard = document.getElementById('pcdIpiIcmsCard');
    const pcdIpiCard = document.getElementById('pcdIpiCard');
    const taxiIpiIcmsCard = document.getElementById('taxiIpiIcmsCard');
    const taxiIpiCard = document.getElementById('taxiIpiCard');
    
    // Adicionar classe para indicar que os cards são clicáveis
    [precoPublicoCard, pcdIpiIcmsCard, pcdIpiCard, taxiIpiIcmsCard, taxiIpiCard].forEach(card => {
        if (card) {
            card.parentElement.classList.add('clickable-card');
        }
    });
    
    // Adicionar event listeners para cada card
    if (precoPublicoCard) {
        precoPublicoCard.parentElement.addEventListener('click', function() {
            const valor = parseFloat(precoPublicoCard.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            window.precoPublicoVeiculo = valor;
            window.atualizarResumoValores();
            highlightCard(this);
            // Não recarregar vendas diretas ao clicar no card
        });
    }
    
    if (pcdIpiIcmsCard) {
        pcdIpiIcmsCard.parentElement.addEventListener('click', function() {
            const valor = parseFloat(pcdIpiIcmsCard.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            window.precoPublicoVeiculo = valor;
            window.atualizarResumoValores();
            highlightCard(this);
            // Não recarregar vendas diretas ao clicar no card
        });
    }
    
    if (pcdIpiCard) {
        pcdIpiCard.parentElement.addEventListener('click', function() {
            const valor = parseFloat(pcdIpiCard.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            window.precoPublicoVeiculo = valor;
            window.atualizarResumoValores();
            highlightCard(this);
            // Não recarregar vendas diretas ao clicar no card
        });
    }
    
    if (taxiIpiIcmsCard) {
        taxiIpiIcmsCard.parentElement.addEventListener('click', function() {
            const valor = parseFloat(taxiIpiIcmsCard.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            window.precoPublicoVeiculo = valor;
            window.atualizarResumoValores();
            highlightCard(this);
            // Não recarregar vendas diretas ao clicar no card
        });
    }
    
    if (taxiIpiCard) {
        taxiIpiCard.parentElement.addEventListener('click', function() {
            const valor = parseFloat(taxiIpiCard.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            window.precoPublicoVeiculo = valor;
            window.atualizarResumoValores();
            highlightCard(this);
            // Não recarregar vendas diretas ao clicar no card
        });
    }
}

// Função para destacar o card selecionado
function highlightCard(selectedCard) {
    // Remover destaque de todos os cards
    document.querySelectorAll('.clickable-card').forEach(card => {
        card.classList.remove('selected-card');
    });
    
    // Adicionar destaque ao card selecionado
    selectedCard.classList.add('selected-card');
}
