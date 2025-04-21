// Funções para opcionais do veículo

// Função para carregar opcionais por modelo
async function loadOpcionaisModelo(modeloId) {
    try {
        console.log(`Carregando opcionais para o modelo ID: ${modeloId}`);
        
        // URLs para tentar carregar opcionais do modelo
        const apiUrls = [
            `/api/modelo-opcional/by-modelo/${modeloId}/public`,
            `http://localhost:3000/api/modelo-opcional/by-modelo/${modeloId}/public`,
            `http://69.62.91.195:3000/api/modelo-opcional/by-modelo/${modeloId}/public`
        ];
        
        // Tentar cada URL em sequência
        let response = null;
        let lastError = null;
        let opcionais = null;
        
        for (const url of apiUrls) {
            try {
                console.log(`Tentando carregar opcionais de: ${url}`);
                response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    opcionais = await response.json();
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
        if (!opcionais) {
            throw new Error(`Falha ao carregar opcionais do modelo: ${lastError}`);
        }
        
        console.log('Opcionais carregados:', opcionais);
        // Renderizar os opcionais na tabela
        renderOpcionais(opcionais);
    } catch (error) {
        console.error('Erro ao carregar opcionais do modelo:', error);
    }
}

// Função para carregar opcionais por versão
async function loadOpcionaisPorVersao(versaoId) {
    try {
        console.log(`Carregando opcionais para a versão ID: ${versaoId}`);
        
        // URLs para tentar carregar opcionais da versão
        const apiUrls = [
            `/api/veiculos/versao-opcional/public/versao/${versaoId}`,
            `http://localhost:3000/api/veiculos/versao-opcional/public/versao/${versaoId}`,
            `http://69.62.91.195:3000/api/veiculos/versao-opcional/public/versao/${versaoId}`
        ];
        
        // Tentar cada URL em sequência
        let response = null;
        let lastError = null;
        let versaoOpcionais = null;
        
        for (const url of apiUrls) {
            try {
                console.log(`Tentando carregar opcionais de: ${url}`);
                response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    versaoOpcionais = await response.json();
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
        if (!versaoOpcionais) {
            throw new Error(`Falha ao carregar opcionais por versão: ${lastError}`);
        }
        
        console.log('Opcionais da versão carregados:', versaoOpcionais);
        
        // Transformar os dados para o formato esperado pela função renderOpcionais
        const opcionais = versaoOpcionais.map(item => ({
            id: item.opcional_id,
            codigo: item.opcional?.codigo || 'N/A',
            descricao: item.opcional?.descricao || 'Opcional não encontrado',
            preco: Number(item.preco) || 0 // Garantir que o preço seja um número
        }));
        
        console.log('Opcionais transformados para renderização:', opcionais);
        
        // Renderizar os opcionais na tabela
        renderOpcionais(opcionais);
    } catch (error) {
        console.error('Erro ao carregar opcionais da versão:', error);
    }
}

// Exportar funções para uso global
window.loadOpcionaisModelo = loadOpcionaisModelo;
window.loadOpcionaisPorVersao = loadOpcionaisPorVersao;

// Função para renderizar os opcionais na tabela
function renderOpcionais(opcionais) {
    console.log('Renderizando opcionais na tabela:', opcionais);
    
    const opcionaisTableBody = document.querySelector('.table-striped tbody');
    if (!opcionaisTableBody) {
        console.error('Tabela de opcionais não encontrada');
        return;
    }
    
    // Limpar a tabela
    opcionaisTableBody.innerHTML = '';
    
    if (opcionais.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="3" class="text-center">Nenhum opcional disponível para este modelo</td>';
        opcionaisTableBody.appendChild(row);
        return;
    }
    
    // Adicionar cada opcional à tabela
    opcionais.forEach(opcional => {
        // Garantir que o preço seja um número
        const preco = Number(opcional.preco) || 0;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${opcional.descricao}</td>
            <td>${typeof window.formatarMoeda === 'function' ? window.formatarMoeda(preco) : `R$ ${preco.toFixed(2)}`}</td>
            <td>
                <button class="btn btn-sm btn-primary adicionar-opcional" data-id="${opcional.id}" data-preco="${preco}">Adicionar</button>
            </td>
        `;
        opcionaisTableBody.appendChild(row);
    });
    
    console.log('Adicionando event listeners para os botões de adicionar');
    
    // Adicionar event listeners para os botões de adicionar
    document.querySelectorAll('.adicionar-opcional').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Prevenir comportamento padrão do botão
            
            const opcionalId = this.getAttribute('data-id');
            const preco = parseFloat(this.getAttribute('data-preco')) || 0;
            
            console.log(`Botão clicado para opcional ID: ${opcionalId}, Preço: ${preco}`);
            
            // Chamar a função global adicionarOpcional
            if (typeof window.adicionarOpcional === 'function') {
                window.adicionarOpcional(opcionalId, preco);
            } else {
                console.error('Função adicionarOpcional não está disponível globalmente');
                // Fallback para chamar a função local se disponível
                if (typeof adicionarOpcional === 'function') {
                    adicionarOpcional(opcionalId, preco);
                } else {
                    console.error('Função adicionarOpcional não está disponível nem localmente');
                }
            }
        });
    });
    
    console.log('Opcionais renderizados com sucesso');
}

// Função auxiliar para atualizar o total manualmente
function atualizarTotalManualmente() {
    try {
        const total = typeof window.calcularTotalResumo === 'function' ? 
            window.calcularTotalResumo() : 
            calcularTotalLocalmente();
        
        console.log('Total calculado:', total);
        
        const totalFinalResumo = document.getElementById('totalFinalResumo');
        if (totalFinalResumo) {
            if (typeof window.formatarMoeda === 'function') {
                totalFinalResumo.textContent = window.formatarMoeda(total);
            } else {
                totalFinalResumo.textContent = `R$ ${total.toFixed(2)}`;
                console.log('ALERTA: formatarMoeda não está disponível, usando formatação básica');
            }
        } else {
            console.warn('Elemento totalFinalResumo não encontrado no DOM');
        }
    } catch (error) {
        console.error('Erro ao atualizar total manualmente:', error);
    }
}

// Exportar função para o objeto window
window.atualizarTotalManualmente = atualizarTotalManualmente;

// Função para adicionar um opcional ao veículo
function adicionarOpcional(opcionalId, preco) {
    try {
        console.log(`Adicionando opcional ID: ${opcionalId}, Preço: ${preco}`);
        
        // Garantir que window.opcionaisSelecionados esteja inicializado
        if (!window.opcionaisSelecionados) {
            window.opcionaisSelecionados = [];
            console.log('Inicializando array de opcionais selecionados');
        }
        
        // Garantir que window.valorOpcionaisSelecionados esteja inicializado
        if (typeof window.valorOpcionaisSelecionados !== 'number') {
            window.valorOpcionaisSelecionados = 0;
            console.log('Inicializando valor total de opcionais como 0');
        }
        
        // Converter o preço para número, garantindo que seja um valor numérico válido
        preco = Number(preco);
        if (isNaN(preco)) {
            console.error(`Preço inválido para o opcional ID ${opcionalId}: ${preco}`);
            preco = 0;
        }
        
        console.log(`Preço convertido para número: ${preco}`);
        
        // Adicionar ao array de opcionais selecionados se ainda não estiver lá
        if (!window.opcionaisSelecionados.find(item => item.id === opcionalId)) {
            window.opcionaisSelecionados.push({
                id: opcionalId,
                preco: preco
            });
            
            // Atualizar o valor total dos opcionais
            window.valorOpcionaisSelecionados += preco;
            console.log(`Valor total dos opcionais atualizado para: ${window.valorOpcionaisSelecionados}`);
            
            // Verificar se estamos em uma página que tem os elementos de resumo
            const elementosResumo = {
                precoOpcionaisResumo: document.getElementById('precoOpcionaisResumo'),
                subtotalResumo: document.getElementById('subtotalResumo'),
                totalFinalResumo: document.getElementById('totalFinalResumo')
            };
            
            // Verificar se pelo menos um dos elementos existe
            const temElementosResumo = Object.values(elementosResumo).some(el => el !== null);
            
            if (!temElementosResumo) {
                console.warn('Nenhum elemento de resumo encontrado na página. Pulando atualização visual.');
            } else {
                // Atualizar diretamente o elemento de resumo dos opcionais
                if (elementosResumo.precoOpcionaisResumo) {
                    console.log('Atualizando elemento precoOpcionaisResumo com valor:', window.valorOpcionaisSelecionados);
                    if (typeof window.formatarMoeda === 'function') {
                        elementosResumo.precoOpcionaisResumo.textContent = window.formatarMoeda(window.valorOpcionaisSelecionados);
                        console.log('Usando formatarMoeda para formatar o valor');
                    } else {
                        elementosResumo.precoOpcionaisResumo.textContent = `R$ ${window.valorOpcionaisSelecionados.toFixed(2)}`;
                        console.log('ALERTA: formatarMoeda não está disponível, usando formatação básica');
                    }
                }
            }
            
            // Atualizar o resumo de valores de forma segura
            try {
                // Tentar usar a função global
                if (typeof window.atualizarResumoValores === 'function') {
                    console.log('Chamando função global atualizarResumoValores');
                    window.atualizarResumoValores();
                } 
                // Tentar usar a função local
                else if (typeof atualizarResumoValores === 'function') {
                    console.log('Chamando função local atualizarResumoValores');
                    atualizarResumoValores();
                }
                // Usar a função de cálculo do total se disponível
                else if (typeof window.calcularTotalResumo === 'function' && temElementosResumo) {
                    console.log('Função atualizarResumoValores não disponível, usando calcularTotalResumo');
                    const total = window.calcularTotalResumo();
                    console.log('Total calculado:', total);
                    
                    // Atualizar o elemento totalFinalResumo
                    if (elementosResumo.totalFinalResumo) {
                        if (typeof window.formatarMoeda === 'function') {
                            elementosResumo.totalFinalResumo.textContent = window.formatarMoeda(total);
                        } else {
                            elementosResumo.totalFinalResumo.textContent = `R$ ${total.toFixed(2)}`;
                        }
                    }
                    
                    // Atualizar o elemento subtotalResumo
                    const subtotal = Number(window.precoPublicoVeiculo) + Number(window.valorPinturasSelecionadas) + Number(window.valorOpcionaisSelecionados);
                    if (elementosResumo.subtotalResumo) {
                        if (typeof window.formatarMoeda === 'function') {
                            elementosResumo.subtotalResumo.textContent = window.formatarMoeda(subtotal);
                        } else {
                            elementosResumo.subtotalResumo.textContent = `R$ ${subtotal.toFixed(2)}`;
                        }
                    }
                }
                // Usar a função de atualização manual
                else if (typeof window.atualizarTotalManualmente === 'function' && temElementosResumo) {
                    console.log('Usando função atualizarTotalManualmente');
                    window.atualizarTotalManualmente();
                }
                // Nenhuma função disponível
                else {
                    console.log('Nenhuma função de atualização de resumo disponível ou não há elementos para atualizar');
                }
            } catch (error) {
                console.error('Erro ao atualizar resumo:', error);
                
                // Tentar atualizar manualmente os elementos críticos
                if (temElementosResumo) {
                    try {
                        const total = calcularTotalLocalmente();
                        console.log('Total calculado localmente:', total);
                        
                        if (elementosResumo.totalFinalResumo) {
                            elementosResumo.totalFinalResumo.textContent = `R$ ${total.toFixed(2)}`;
                        }
                    } catch (innerError) {
                        console.error('Erro ao tentar atualização manual de emergência:', innerError);
                    }
                }
            }
            
            // Mudar o botão para "Remover"
            const button = document.querySelector(`.adicionar-opcional[data-id="${opcionalId}"]`);
            if (button) {
                console.log('Alterando botão para "Remover"');
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
            } else {
                console.error(`Botão para opcional ID ${opcionalId} não encontrado`);
            }
        } else {
            console.log(`Opcional ID ${opcionalId} já está selecionado, não será adicionado novamente`);
        }
        
        // Imprimir valores globais para depuração
        console.log('DEBUG - Valores globais:');
        console.log('precoPublicoVeiculo:', window.precoPublicoVeiculo);
        console.log('valorPinturasSelecionadas:', window.valorPinturasSelecionadas);
        console.log('valorOpcionaisSelecionados:', window.valorOpcionaisSelecionados);
        console.log('descontoReais:', window.descontoReais);
        console.log('agioReais:', window.agioReais);
        console.log('quantidadeResumo:', window.quantidadeResumo);
    } catch (error) {
        console.error('Erro ao adicionar opcional:', error);
    }
}

// Função para remover um opcional do veículo
function removerOpcional(opcionalId, preco) {
    try {
        console.log(`Removendo opcional ID: ${opcionalId}, Preço: ${preco}`);
        
        // Garantir que window.opcionaisSelecionados esteja inicializado
        if (!window.opcionaisSelecionados) {
            window.opcionaisSelecionados = [];
            console.log('Inicializando array de opcionais selecionados');
            return; // Não há nada para remover
        }
        
        // Remover do array de opcionais selecionados
        const index = window.opcionaisSelecionados.findIndex(item => item.id === opcionalId);
        if (index !== -1) {
            window.opcionaisSelecionados.splice(index, 1);
            
            // Garantir que window.valorOpcionaisSelecionados esteja inicializado
            if (typeof window.valorOpcionaisSelecionados !== 'number') {
                window.valorOpcionaisSelecionados = 0;
                console.log('Inicializando valor total de opcionais como 0');
            } else {
                // Atualizar o valor total dos opcionais
                window.valorOpcionaisSelecionados -= preco;
                console.log(`Valor total dos opcionais atualizado para: ${window.valorOpcionaisSelecionados}`);
            }
            
            // Verificar se estamos em uma página que tem os elementos de resumo
            const elementosResumo = {
                precoOpcionaisResumo: document.getElementById('precoOpcionaisResumo'),
                subtotalResumo: document.getElementById('subtotalResumo'),
                totalFinalResumo: document.getElementById('totalFinalResumo')
            };
            
            // Verificar se pelo menos um dos elementos existe
            const temElementosResumo = Object.values(elementosResumo).some(el => el !== null);
            
            if (!temElementosResumo) {
                console.warn('Nenhum elemento de resumo encontrado na página. Pulando atualização visual.');
            } else {
                // Atualizar diretamente o elemento de resumo dos opcionais
                if (elementosResumo.precoOpcionaisResumo) {
                    console.log('Atualizando elemento precoOpcionaisResumo com valor:', window.valorOpcionaisSelecionados);
                    if (typeof window.formatarMoeda === 'function') {
                        elementosResumo.precoOpcionaisResumo.textContent = window.formatarMoeda(window.valorOpcionaisSelecionados);
                    } else {
                        elementosResumo.precoOpcionaisResumo.textContent = `R$ ${window.valorOpcionaisSelecionados.toFixed(2)}`;
                    }
                }
            }
            
            // Atualizar o resumo de valores de forma segura
            try {
                // Tentar usar a função global
                if (typeof window.atualizarResumoValores === 'function') {
                    console.log('Chamando função global atualizarResumoValores');
                    window.atualizarResumoValores();
                } 
                // Tentar usar a função local
                else if (typeof atualizarResumoValores === 'function') {
                    console.log('Chamando função local atualizarResumoValores');
                    atualizarResumoValores();
                }
                // Usar a função de cálculo do total se disponível
                else if (typeof window.calcularTotalResumo === 'function' && temElementosResumo) {
                    console.log('Função atualizarResumoValores não disponível, usando calcularTotalResumo');
                    const total = window.calcularTotalResumo();
                    console.log('Total calculado:', total);
                    
                    // Atualizar o elemento totalFinalResumo
                    if (elementosResumo.totalFinalResumo) {
                        if (typeof window.formatarMoeda === 'function') {
                            elementosResumo.totalFinalResumo.textContent = window.formatarMoeda(total);
                        } else {
                            elementosResumo.totalFinalResumo.textContent = `R$ ${total.toFixed(2)}`;
                        }
                    }
                    
                    // Atualizar o elemento subtotalResumo
                    const subtotal = Number(window.precoPublicoVeiculo) + Number(window.valorPinturasSelecionadas) + Number(window.valorOpcionaisSelecionados);
                    if (elementosResumo.subtotalResumo) {
                        if (typeof window.formatarMoeda === 'function') {
                            elementosResumo.subtotalResumo.textContent = window.formatarMoeda(subtotal);
                        } else {
                            elementosResumo.subtotalResumo.textContent = `R$ ${subtotal.toFixed(2)}`;
                        }
                    }
                }
                // Usar a função de atualização manual
                else if (typeof window.atualizarTotalManualmente === 'function' && temElementosResumo) {
                    console.log('Usando função atualizarTotalManualmente');
                    window.atualizarTotalManualmente();
                }
                // Nenhuma função disponível
                else {
                    console.log('Nenhuma função de atualização de resumo disponível ou não há elementos para atualizar');
                }
            } catch (error) {
                console.error('Erro ao atualizar resumo:', error);
                
                // Tentar atualizar manualmente os elementos críticos
                if (temElementosResumo) {
                    try {
                        const total = calcularTotalLocalmente();
                        console.log('Total calculado localmente:', total);
                        
                        if (elementosResumo.totalFinalResumo) {
                            elementosResumo.totalFinalResumo.textContent = `R$ ${total.toFixed(2)}`;
                        }
                    } catch (innerError) {
                        console.error('Erro ao tentar atualização manual de emergência:', innerError);
                    }
                }
            }
        } else {
            console.log(`Opcional ID ${opcionalId} não encontrado no array de selecionados`);
        }
        
        // Mudar o botão de volta para "Adicionar"
        const button = document.querySelector(`.remover-opcional[data-id="${opcionalId}"]`);
        if (button) {
            console.log('Alterando botão para "Adicionar"');
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
        } else {
            console.error(`Botão para opcional ID ${opcionalId} não encontrado`);
        }
        
        // Imprimir valores globais para depuração
        console.log('DEBUG - Valores globais após remoção:');
        console.log('precoPublicoVeiculo:', window.precoPublicoVeiculo);
        console.log('valorPinturasSelecionadas:', window.valorPinturasSelecionadas);
        console.log('valorOpcionaisSelecionados:', window.valorOpcionaisSelecionados);
        console.log('descontoReais:', window.descontoReais);
        console.log('agioReais:', window.agioReais);
        console.log('quantidadeResumo:', window.quantidadeResumo);
    } catch (error) {
        console.error('Erro ao remover opcional:', error);
    }
}

// Exportar funções para o objeto window
window.adicionarOpcional = adicionarOpcional;
window.removerOpcional = removerOpcional;

// Função para calcular o total localmente se calcularTotalResumo não estiver disponível
function calcularTotalLocalmente() {
    const precoPublico = Number(window.precoPublicoVeiculo) || 0;
    const valorPinturas = Number(window.valorPinturasSelecionadas) || 0;
    const valorOpcionais = Number(window.valorOpcionaisSelecionados) || 0;
    const descontoReais = Number(window.descontoReais) || 0;
    const agioReais = Number(window.agioReais) || 0;
    const quantidade = Number(window.quantidadeResumo) || 1;
    
    const subtotal = precoPublico + valorPinturas + valorOpcionais - descontoReais + agioReais;
    return subtotal * quantidade;
}
