// Funções para detalhes do veículo
async function loadVeiculoDetails(veiculoId, dadosSelecionados) {
    try {
        console.log(`Carregando detalhes do veículo ID: ${veiculoId}`);
        console.log('Dados selecionados pelo usuário:', dadosSelecionados);
        
        // Obter a URL base com base no ambiente atual
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
        
        // Obter token de autenticação usando a classe Auth
        const auth = new Auth();
        const token = auth.getToken();
        
        if (!token) {
            console.error('Token de autenticação não encontrado');
            // Redirecionar para a página de login
            auth.redirectToLogin();
            throw new Error('Falha na autenticação. Por favor, faça login novamente.');
        }
        
        // URL para carregar detalhes do veículo
        const url = `${baseUrl}/api/veiculos/${veiculoId}`;
        console.log(`Tentando carregar veículo de: ${url}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Resposta da API:', response.status, response.statusText);
        
        // Verificar se a resposta é 401 (Unauthorized)
        if (response.status === 401) {
            console.error('Token expirado ou inválido');
            // Limpar token e redirecionar para login
            auth.logout();
            auth.redirectToLogin();
            throw new Error('Sua sessão expirou. Por favor, faça login novamente.');
        }
        
        // Verificar se o veículo não foi encontrado (404)
        if (response.status === 404) {
            console.log(`Veículo ID ${veiculoId} não encontrado no sistema`);
            
            // Limpar os detalhes do veículo na interface
            if (typeof window.limparDetalhesVeiculo === 'function') {
                window.limparDetalhesVeiculo();
            }
            
            // Mostrar mensagem amigável ao usuário
            const mensagemElement = document.getElementById('mensagemVeiculo');
            if (mensagemElement) {
                mensagemElement.textContent = `Este veículo não está mais disponível. Por favor, selecione outro.`;
                mensagemElement.classList.remove('d-none');
                mensagemElement.classList.add('alert', 'alert-warning');
                
                // Esconder a mensagem após 5 segundos
                setTimeout(() => {
                    mensagemElement.classList.add('d-none');
                }, 5000);
            }
            
            return null; // Retornar null em vez de lançar erro
        }
        
        // Verificar outras respostas de erro
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Falha na URL ${url}:`, errorText);
            throw new Error(`Erro ao carregar veículo: ${response.status} ${response.statusText}`);
        }
        
        // Se chegou aqui, a resposta foi bem-sucedida
        const veiculo = await response.json();
        console.log('Veículo carregado com sucesso:', veiculo);
        
        // Esconder qualquer mensagem de erro anterior
        const mensagemElement = document.getElementById('mensagemVeiculo');
        if (mensagemElement) {
            mensagemElement.classList.add('d-none');
        }
        
        // Continuar com o processamento do veículo
        console.log('Detalhes do veículo carregados:', veiculo);
        // Corrigir: garantir que os campos de preço sejam tratados como número
        veiculo.preco = Number(veiculo.preco);
        veiculo.defisicoicms = Number(veiculo.defisicoicms);
        veiculo.defisicoipi = Number(veiculo.defisicoipi);
        veiculo.taxicms = Number(veiculo.taxicms);
        veiculo.taxipi = Number(veiculo.taxipi);
        // Formatar o título do veículo usando os dados selecionados pelo usuário
        let titulo = '';
        // Se temos dados selecionados pelo usuário, usá-los prioritariamente
        if (dadosSelecionados) {
            if (dadosSelecionados.marcaNome) {
                titulo += dadosSelecionados.marcaNome + ' ';
                console.log('Usando marca do select:', dadosSelecionados.marcaNome);
            }
            if (dadosSelecionados.modeloNome) {
                titulo += dadosSelecionados.modeloNome + ' ';
                console.log('Usando modelo do select:', dadosSelecionados.modeloNome);
            }
            if (dadosSelecionados.versaoNome) {
                titulo += dadosSelecionados.versaoNome + ' ';
                console.log('Usando versão do select:', dadosSelecionados.versaoNome);
            }
        } else {
            // Se não temos dados do usuário, usar os dados do veículo
            if (veiculo.marca && veiculo.marca.nome) {
                titulo += veiculo.marca.nome + ' ';
            }
            if (veiculo.modelo && veiculo.modelo.nome) {
                titulo += veiculo.modelo.nome + ' ';
            }
            if (veiculo.versao && veiculo.versao.nome_versao) {
                titulo += veiculo.versao.nome_versao + ' ';
            }
        }
        
        // Adicionar o ano ao título
        if (veiculo.ano) {
            titulo += veiculo.ano;
        }
        
        // Atualizar o título do veículo
        const veiculoTitulo = document.getElementById('veiculoTitulo');
        if (veiculoTitulo) {
            veiculoTitulo.textContent = titulo;
        }
        
        // Atualizar os preços na interface
        updatePrices(veiculo);
        
        // Disparar um evento para informar que os detalhes do veículo foram carregados
        // Incluir o ID da versão para carregar as pinturas associadas
        const versaoId = veiculo.versao ? veiculo.versao.id : null;
        const modeloId = veiculo.modelo ? veiculo.modelo.id : null;
        const event = new CustomEvent('veiculoDetalhesCarregados', {
            detail: {
                veiculo: veiculo,
                versaoId: versaoId,
                modeloId: modeloId
            }
        });
        document.dispatchEvent(event);
        
        return veiculo;
    } catch (error) {
        console.error('Erro ao carregar detalhes do veículo:', error);
        const veiculoTitulo = document.getElementById('veiculoTitulo');
        if (veiculoTitulo) {
            veiculoTitulo.textContent = 'Erro ao carregar detalhes do veículo: ' + error.message;
        }
        throw error;
    }
}

// Torna a função global para uso pelo index.js
window.loadVeiculoDetails = loadVeiculoDetails;

// Função para atualizar os preços na interface
function updatePrices(veiculo) {
    try {
        console.log('Atualizando preços na interface com base no veículo:', veiculo);
        // Verificar se o veículo tem preço definido
        if (!veiculo.preco && veiculo.preco !== 0) {
            console.warn('Veículo sem preço definido:', veiculo.id);
            // Tentar buscar o preço novamente do servidor
            fetchVeiculoPrecos(veiculo.id).then(precos => {
                if (precos) {
                    // Atualizar o objeto veículo com os preços obtidos
                    Object.assign(veiculo, precos);
                    // Chamar novamente updatePrices com o veículo atualizado
                    updatePrices(veiculo);
                }
            }).catch(error => {
                console.error('Erro ao buscar preços do veículo:', error);
            });
            return;
        }
        
        // Garantir que o preço seja um número válido
        const precoPublico = Number(veiculo.preco) || 0;
        
        // Preço público (preço normal)
        const precoPublicoElement = document.getElementById('precoPublicoCard');
        if (precoPublicoElement) {
            precoPublicoElement.textContent = formatarMoeda(precoPublico);
        }
        // PCD IPI/ICMS (Def. Físico IPI/ICMS)
        const pcdIpiIcmsElement = document.getElementById('pcdIpiIcmsCard');
        if (pcdIpiIcmsElement) {
            pcdIpiIcmsElement.textContent = formatarMoeda(veiculo.defisicoicms || 0);
        }
        // PCD IPI (Def. Físico IPI)
        const pcdIpiElement = document.getElementById('pcdIpiCard');
        if (pcdIpiElement) {
            pcdIpiElement.textContent = formatarMoeda(veiculo.defisicoipi || 0);
        }
        // TAXI IPI/ICMS
        const taxiIpiIcmsElement = document.getElementById('taxiIpiIcmsCard');
        if (taxiIpiIcmsElement) {
            taxiIpiIcmsElement.textContent = formatarMoeda(veiculo.taxicms || 0);
        }
        // TAXI IPI
        const taxiIpiElement = document.getElementById('taxiIpiCard');
        if (taxiIpiElement) {
            taxiIpiElement.textContent = formatarMoeda(veiculo.taxipi || 0);
        }
        // Atualizar preço no card da imagem
        const carPriceElement = document.querySelector('.car-price strong');
        if (carPriceElement) {
            carPriceElement.textContent = formatarMoeda(precoPublico);
        }
        
        // Armazenar o preço público do veículo na variável global
        window.precoPublicoVeiculo = precoPublico;
        console.log('Preço público do veículo atualizado para:', window.precoPublicoVeiculo);
        
        // Atualizar diretamente o elemento de resumo do preço base
        const precoBaseResumo = document.getElementById('precoBaseResumo');
        if (precoBaseResumo) {
            precoBaseResumo.textContent = window.formatarMoeda ? 
                window.formatarMoeda(precoPublico) : 
                `R$ ${precoPublico.toFixed(2)}`;
        }
        
        // Atualizar o resumo de valores
        if (typeof window.atualizarResumoValores === 'function') {
            window.atualizarResumoValores();
            console.log('Resumo de valores atualizado após carregar detalhes do veículo');
        } else if (typeof window.calcularTotalResumo === 'function') {
            // Fallback se atualizarResumoValores não estiver disponível
            const total = window.calcularTotalResumo();
            const totalFinalResumo = document.getElementById('totalFinalResumo');
            if (totalFinalResumo) {
                totalFinalResumo.textContent = window.formatarMoeda ? 
                    window.formatarMoeda(total) : 
                    `R$ ${total.toFixed(2)}`;
            }
        }
        
        console.log('Preços atualizados com sucesso');
    } catch (error) {
        console.error('Erro ao atualizar preços:', error);
    }
}

// Função para buscar preços de um veículo
async function fetchVeiculoPrecos(veiculoId) {
    try {
        console.log(`Buscando preços para o veículo ID: ${veiculoId}`);
        
        // Obter token de autenticação usando a classe Auth
        const auth = new Auth();
        const token = auth.getToken();
        
        if (!token) {
            console.error('Token de autenticação não encontrado');
            // Redirecionar para a página de login
            auth.redirectToLogin();
            throw new Error('Falha na autenticação. Por favor, faça login novamente.');
        }
        
        // URLs para tentar carregar detalhes do veículo
        const apiUrls = [
            `/api/veiculos/${veiculoId}`,
            `http://localhost:3000/api/veiculos/${veiculoId}`,
            `http://69.62.91.195:3000/api/veiculos/${veiculoId}`
        ];
        
        // Tentar cada URL em sequência
        let response = null;
        let lastError = null;
        let veiculo = null;
        
        for (const url of apiUrls) {
            try {
                console.log(`Tentando buscar preços de: ${url}`);
                response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                console.log('Resposta da API:', response.status, response.statusText);
                
                // Verificar se a resposta é 401 (Unauthorized)
                if (response.status === 401) {
                    console.error('Token expirado ou inválido');
                    // Limpar token e redirecionar para login
                    auth.logout();
                    auth.redirectToLogin();
                    throw new Error('Sua sessão expirou. Por favor, faça login novamente.');
                }
                
                // Verificar outras respostas de erro
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Falha na URL ${url}:`, errorText);
                    lastError = `${response.status} ${response.statusText}`;
                } else {
                    veiculo = await response.json();
                    console.log(`URL bem-sucedida: ${url}`);
                    break; // Sair do loop se a resposta for bem-sucedida
                }
            } catch (error) {
                console.error(`Erro ao acessar ${url}:`, error.message);
                lastError = error.message;
            }
        }
        
        // Se todas as URLs falharam
        if (!veiculo) {
            throw new Error(`Falha ao buscar preços: ${lastError}`);
        }
        
        console.log('Dados do veículo obtidos:', veiculo);
        // Extrair apenas os preços do veículo
        const precos = {
            preco: veiculo.preco || 0,
            defisicoicms: veiculo.defisicoicms || 0,
            defisicoipi: veiculo.defisicoipi || 0,
            taxicms: veiculo.taxicms || 0,
            taxipi: veiculo.taxipi || 0
        };
        console.log('Preços extraídos:', precos);
        return precos;
    } catch (error) {
        console.error('Erro ao buscar preços do veículo:', error);
        return null;
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
            const valor = parseFloat(precoPublicoCard.textContent.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
            window.precoPublicoVeiculo = Number(valor);
            window.atualizarResumoValores();
            highlightCard(this);
            // Não recarregar vendas diretas ao clicar no card
        });
    }
    if (pcdIpiIcmsCard) {
        pcdIpiIcmsCard.parentElement.addEventListener('click', function() {
            const valor = parseFloat(pcdIpiIcmsCard.textContent.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
            window.precoPublicoVeiculo = Number(valor);
            window.atualizarResumoValores();
            highlightCard(this);
            // Não recarregar vendas diretas ao clicar no card
        });
    }
    if (pcdIpiCard) {
        pcdIpiCard.parentElement.addEventListener('click', function() {
            const valor = parseFloat(pcdIpiCard.textContent.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
            window.precoPublicoVeiculo = Number(valor);
            window.atualizarResumoValores();
            highlightCard(this);
            // Não recarregar vendas diretas ao clicar no card
        });
    }
    if (taxiIpiIcmsCard) {
        taxiIpiIcmsCard.parentElement.addEventListener('click', function() {
            const valor = parseFloat(taxiIpiIcmsCard.textContent.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
            window.precoPublicoVeiculo = Number(valor);
            window.atualizarResumoValores();
            highlightCard(this);
            // Não recarregar vendas diretas ao clicar no card
        });
    }
    if (taxiIpiCard) {
        taxiIpiCard.parentElement.addEventListener('click', function() {
            const valor = parseFloat(taxiIpiCard.textContent.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
            window.precoPublicoVeiculo = Number(valor);
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
