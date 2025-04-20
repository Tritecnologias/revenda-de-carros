// Inicializar variáveis globais para o resumo
window.precoPublicoVeiculo = 0;
window.valorPinturasSelecionadas = 0;
window.valorOpcionaisSelecionados = 0;
window.descontoReais = 0;
window.agioReais = 0;
window.quantidadeResumo = 1;
window.opcionaisSelecionados = [];

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
                
                // Carregar vendas diretas para a marca selecionada
                if (typeof window.loadVendasDiretas === 'function') {
                    console.log('Carregando vendas diretas para marca:', this.value);
                    window.loadVendasDiretas(this.value);
                } else {
                    console.error('Função loadVendasDiretas não encontrada');
                }
            } else if (modeloSelect) {
                modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
                
                // Resetar vendas diretas quando nenhuma marca estiver selecionada
                const vendasDiretasSelect = document.getElementById('vendasDiretasSelect');
                if (vendasDiretasSelect) {
                    vendasDiretasSelect.innerHTML = '';
                    const defaultOption = document.createElement('option');
                    defaultOption.value = "";
                    defaultOption.textContent = "DESCONTOS VENDA DIRETA";
                    vendasDiretasSelect.appendChild(defaultOption);
                    vendasDiretasSelect.disabled = true;
                }
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
            const versaoId = versaoSelect.value;
            if (versaoId) {
                // Buscar detalhes completos do veículo pela versão selecionada
                const selectedOption = this.options[this.selectedIndex];
                // Corrigir: garantir que veiculoId seja preenchido, mas se não houver, buscar pelo próprio versaoId
                let veiculoId = selectedOption && selectedOption.dataset.veiculoId;
                if (!veiculoId) {
                    veiculoId = versaoId;
                }
                if (veiculoId && typeof window.loadVeiculoDetails === 'function') {
                    window.loadVeiculoDetails(veiculoId, {
                        marcaNome: marcaSelect && marcaSelect.selectedOptions.length > 0 ? marcaSelect.selectedOptions[0].textContent : '',
                        modeloNome: modeloSelect && modeloSelect.selectedOptions.length > 0 ? modeloSelect.selectedOptions[0].textContent : '',
                        versaoNome: this.selectedOptions.length > 0 ? this.selectedOptions[0].textContent : ''
                    });
                }
                
                // Carregar opcionais específicos para esta versão
                if (typeof window.loadOpcionaisPorVersao === 'function') {
                    console.log(`Carregando opcionais específicos para a versão ID: ${versaoId}`);
                    window.loadOpcionaisPorVersao(versaoId);
                } else {
                    console.error('Função loadOpcionaisPorVersao não encontrada');
                    // Fallback para carregamento por modelo se a função por versão não estiver disponível
                    if (modeloSelect && modeloSelect.value && typeof window.loadOpcionaisModelo === 'function') {
                        console.log('Usando fallback: carregando opcionais por modelo');
                        window.loadOpcionaisModelo(modeloSelect.value);
                    }
                }
            } else {
                limparDetalhesVeiculo();
            }
        });
    }
    
    // Inicializar campos monetários
    // initMonetaryInputs();
    
    // Inicializar o card de resumo com valores zerados
    limparDetalhesVeiculo();
    
    // Adicionar event listeners aos cards de preço
    if (typeof window.setupPriceCardListeners === 'function') {
        window.setupPriceCardListeners();
    }
    
    // Adicionar event listeners para os campos de input de desconto, ágio e quantidade
    setupInputListeners();
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
    window.precoPublicoVeiculo = Number(0);
    window.valorPinturasSelecionadas = 0;
    window.valorOpcionaisSelecionados = 0;
    window.vendaDiretaSelecionada = null;
    window.percentualDesconto = 0;
    window.opcionaisSelecionados = [];
    // Resetar os campos de input
    const descontoReaisInput = document.getElementById('descontoReaisInput');
    if (descontoReaisInput) descontoReaisInput.value = '0';
    const agioReaisInput = document.getElementById('agioReaisInput');
    if (agioReaisInput) agioReaisInput.value = '0';
    const quantidadeInput = document.getElementById('quantidadeInput');
    if (quantidadeInput) quantidadeInput.value = '1';
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
    const precoPublicoCard = document.getElementById('precoPublicoCard');
    if (precoPublicoCard) precoPublicoCard.textContent = formatarMoeda(0);
    const pcdIpiIcmsCard = document.getElementById('pcdIpiIcmsCard');
    if (pcdIpiIcmsCard) pcdIpiIcmsCard.textContent = formatarMoeda(0);
    const pcdIpiCard = document.getElementById('pcdIpiCard');
    if (pcdIpiCard) pcdIpiCard.textContent = formatarMoeda(0);
    const taxiIpiIcmsCard = document.getElementById('taxiIpiIcmsCard');
    if (taxiIpiIcmsCard) taxiIpiIcmsCard.textContent = formatarMoeda(0);
    const taxiIpiCard = document.getElementById('taxiIpiCard');
    if (taxiIpiCard) taxiIpiCard.textContent = formatarMoeda(0);
    // Limpar os novos cards
    const resumoDescontoReais = document.getElementById('resumoDescontoReais');
    if (resumoDescontoReais) resumoDescontoReais.textContent = formatarMoeda(0);
    const resumoAgio = document.getElementById('resumoAgio');
    if (resumoAgio) resumoAgio.textContent = formatarMoeda(0);
    const resumoQuantidade = document.getElementById('resumoQuantidade');
    if (resumoQuantidade) resumoQuantidade.textContent = '1';
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

// Função para carregar modelos
function loadModelos(marcaId) { 
    console.log('Iniciando carregamento de modelos via XMLHttpRequest...');
    const modeloSelect = document.getElementById('configuradorModelo');
    if (modeloSelect) {
        modeloSelect.innerHTML = '<option value="">Carregando modelos...</option>';
        modeloSelect.disabled = true;
    } else {
        console.error('Elemento select de modelo não encontrado');
        return;
    }
    // Usar o endpoint correto e autenticação
    const xhr = new XMLHttpRequest();
    const url = `${config.apiBaseUrl}/api/veiculos/modelos/public/by-marca/${marcaId}`;
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (typeof auth !== 'undefined' && auth.getToken) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + auth.getToken());
    }
    xhr.onload = function() {
        console.log('Resposta da API recebida:', xhr.status);
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const modelos = JSON.parse(xhr.responseText);
                console.log('Modelos carregados:', modelos);
                modeloSelect.disabled = false;
                modeloSelect.innerHTML = '<option value="">Selecione um modelo</option>';
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
                console.error('Erro ao processar resposta da API:', error);
                modeloSelect.disabled = false;
                modeloSelect.innerHTML = '<option value="">Erro ao processar resposta</option>';
            }
        } else {
            console.error('Erro na resposta da API:', xhr.status, xhr.statusText);
            modeloSelect.disabled = false;
            modeloSelect.innerHTML = '<option value="">Erro ao carregar modelos</option>';
        }
    };
    xhr.onerror = function() {
        console.error('Erro de rede ao carregar modelos');
        modeloSelect.disabled = false;
        modeloSelect.innerHTML = '<option value="">Erro de conexão</option>';
    };
    xhr.send();
    console.log('Requisição enviada para carregar modelos');
}

// Função para configurar os event listeners dos campos de input
function setupInputListeners() {
    // Event listener para o campo de desconto em reais
    const descontoReaisInput = document.getElementById('descontoReaisInput');
    if (descontoReaisInput) {
        descontoReaisInput.addEventListener('input', function() {
            // Atualizar o valor global de desconto
            window.descontoReais = converterParaNumero(this.value);
            console.log('Desconto em reais atualizado para:', window.descontoReais);
            
            // Atualizar o resumo de valores
            if (typeof window.atualizarResumoValores === 'function') {
                window.atualizarResumoValores();
            }
        });
        
        // Formatar o valor ao perder o foco
        descontoReaisInput.addEventListener('blur', function() {
            this.value = formatarMoeda(converterParaNumero(this.value)).replace('R$ ', '');
        });
        
        // Limpar a formatação ao ganhar o foco
        descontoReaisInput.addEventListener('focus', function() {
            const valor = converterParaNumero(this.value);
            this.value = valor === 0 ? '' : valor.toString();
        });
    }
    
    // Event listener para o campo de ágio
    const agioReaisInput = document.getElementById('agioReaisInput');
    if (agioReaisInput) {
        agioReaisInput.addEventListener('input', function() {
            // Atualizar o valor global de ágio
            window.agioReais = converterParaNumero(this.value);
            console.log('Ágio atualizado para:', window.agioReais);
            
            // Atualizar o resumo de valores
            if (typeof window.atualizarResumoValores === 'function') {
                window.atualizarResumoValores();
            }
        });
        
        // Formatar o valor ao perder o foco
        agioReaisInput.addEventListener('blur', function() {
            this.value = formatarMoeda(converterParaNumero(this.value)).replace('R$ ', '');
        });
        
        // Limpar a formatação ao ganhar o foco
        agioReaisInput.addEventListener('focus', function() {
            const valor = converterParaNumero(this.value);
            this.value = valor === 0 ? '' : valor.toString();
        });
    }
    
    // Event listener para o campo de quantidade
    const quantidadeInput = document.getElementById('quantidadeInput');
    if (quantidadeInput) {
        quantidadeInput.addEventListener('input', function() {
            // Atualizar o valor global de quantidade
            window.quantidadeResumo = Number(this.value) || 1;
            // Garantir que a quantidade seja pelo menos 1
            if (window.quantidadeResumo < 1) {
                window.quantidadeResumo = 1;
                this.value = '1';
            }
            console.log('Quantidade atualizada para:', window.quantidadeResumo);
            
            // Atualizar o resumo de valores
            if (typeof window.atualizarResumoValores === 'function') {
                window.atualizarResumoValores();
            }
        });
    }
    
    // Event listener para o campo de desconto percentual
    const descontoInput = document.getElementById('descontoInput');
    if (descontoInput) {
        descontoInput.addEventListener('input', function() {
            // Atualizar o valor global de desconto percentual
            window.percentualDesconto = Number(this.value) || 0;
            console.log('Desconto percentual atualizado para:', window.percentualDesconto);
            
            // Calcular o desconto em reais com base no percentual e no preço do veículo
            if (window.precoPublicoVeiculo && window.percentualDesconto) {
                const descontoCalculado = (window.precoPublicoVeiculo * window.percentualDesconto) / 100;
                window.descontoReais = descontoCalculado;
                
                // Atualizar o campo de desconto em reais
                if (descontoReaisInput) {
                    descontoReaisInput.value = formatarMoeda(descontoCalculado).replace('R$ ', '');
                }
                
                console.log('Desconto em reais calculado:', window.descontoReais);
            }
            
            // Atualizar o resumo de valores
            if (typeof window.atualizarResumoValores === 'function') {
                window.atualizarResumoValores();
            }
        });
    }
}