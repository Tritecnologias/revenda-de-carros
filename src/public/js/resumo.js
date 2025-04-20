// Função para calcular o total de forma confiável, usando sempre os campos globais já sanitizados
window.calcularTotalResumo = function() {
    sanitizarCamposGlobaisResumo();
    
    // Garantir que todas as variáveis estejam definidas e sejam números
    const precoPublico = Number(window.precoPublicoVeiculo) || 0;
    const valorPinturas = Number(window.valorPinturasSelecionadas) || 0;
    const valorOpcionais = Number(window.valorOpcionaisSelecionados) || 0;
    const descontoReais = Number(window.descontoReais) || 0;
    const percentualDesconto = Number(window.percentualDesconto) || 0; // Mantido apenas para log
    const agioReais = Number(window.agioReais) || 0;
    const quantidade = Number(window.quantidadeResumo) || 1;
    
    console.log('[DEBUG CALCULO] ', 
        'precoPublico:', precoPublico, 
        'valorPinturas:', valorPinturas, 
        'valorOpcionais:', valorOpcionais, 
        'descontoReais:', descontoReais,
        'percentualDesconto:', percentualDesconto, // Apenas para log
        'agioReais:', agioReais, 
        'quantidade:', quantidade
    );
    
    // Calcular o subtotal
    const subtotal = precoPublico + valorPinturas + valorOpcionais;
    
    // Não aplicar o desconto percentual, conforme solicitado
    // Usar apenas o desconto fixo em reais
    const descontoTotal = descontoReais;
    
    // Calcular o total usando variáveis locais para evitar problemas com variáveis globais
    const totalComDesconto = subtotal - descontoTotal + agioReais;
    const total = totalComDesconto * quantidade;
    
    console.log('[CALCULO DETALHADO] Subtotal =', subtotal, 
        '- Desconto Fixo =', descontoReais,
        '+ Ágio =', agioReais,
        '* Quantidade =', quantidade,
        '= Total:', total);
    
    // Se o total for NaN ou undefined, retornar 0
    return isNaN(total) || total === undefined ? 0 : total;
};

// Função para atualizar o resumo de valores
window.atualizarResumoValores = function() {
    try {
        // Garantir que todas as variáveis globais sejam números válidos
        sanitizarCamposGlobaisResumo();
        
        console.log('[DEBUG HTML] Atualizando resumo de valores...');
        
        // Verificar se estamos em uma página que tem os elementos de resumo
        const elementosResumo = {
            precoBaseResumo: document.getElementById('precoBaseResumo'),
            precoPinturaResumo: document.getElementById('precoPinturaResumo'),
            precoOpcionaisResumo: document.getElementById('precoOpcionaisResumo'),
            subtotalResumo: document.getElementById('subtotalResumo'),
            descontoResumo: document.getElementById('descontoResumo'),
            agioResumo: document.getElementById('agioResumo'),
            quantidadeResumo: document.getElementById('quantidadeResumo'),
            totalFinalResumo: document.getElementById('totalFinalResumo')
        };
        
        // Verificar se pelo menos um dos elementos existe
        const temElementosResumo = Object.values(elementosResumo).some(el => el !== null);
        
        if (!temElementosResumo) {
            console.warn('Nenhum elemento de resumo encontrado na página. Pulando atualização.');
            return false;
        }
        
        // Use a função de cálculo confiável
        const total = window.calcularTotalResumo();
        console.log('Total calculado:', total);
        
        // Registrar quais elementos foram encontrados e quais não foram
        Object.entries(elementosResumo).forEach(([id, elemento]) => {
            if (!elemento) {
                console.warn(`Elemento ${id} não encontrado no DOM`);
            }
        });
        
        // Atualizar os elementos que existem
        if (elementosResumo.precoBaseResumo) {
            elementosResumo.precoBaseResumo.textContent = formatarMoeda(window.precoPublicoVeiculo);
        }
        
        if (elementosResumo.precoPinturaResumo) {
            elementosResumo.precoPinturaResumo.textContent = formatarMoeda(window.valorPinturasSelecionadas);
        }
        
        if (elementosResumo.precoOpcionaisResumo) {
            elementosResumo.precoOpcionaisResumo.textContent = formatarMoeda(window.valorOpcionaisSelecionados);
        }
        
        // Calcular subtotal
        const subtotal = Number(window.precoPublicoVeiculo) + Number(window.valorPinturasSelecionadas) + Number(window.valorOpcionaisSelecionados);
        
        if (elementosResumo.subtotalResumo) {
            elementosResumo.subtotalResumo.textContent = formatarMoeda(subtotal);
        }
        
        // Calcular e atualizar o desconto
        const descontoTotal = window.descontoReais;
        
        if (elementosResumo.descontoResumo) {
            elementosResumo.descontoResumo.textContent = formatarMoeda(descontoTotal);
        }
        
        // Atualizar ágio
        if (elementosResumo.agioResumo) {
            elementosResumo.agioResumo.textContent = formatarMoeda(window.agioReais);
        }
        
        // Atualizar quantidade
        if (elementosResumo.quantidadeResumo) {
            elementosResumo.quantidadeResumo.textContent = window.quantidadeResumo.toString();
        }
        
        // Atualizar total final
        if (elementosResumo.totalFinalResumo) {
            elementosResumo.totalFinalResumo.textContent = formatarMoeda(total);
        }
        
        // Atualizar também o preço total no card do veículo
        const precoTotal = document.getElementById('precoTotal');
        if (precoTotal) {
            precoTotal.textContent = formatarMoeda(total);
        }
        
        console.log('[RESUMO ATUALIZADO] Total final:', total, formatarMoeda(total));
        
        return true; // Indica que a atualização foi bem-sucedida
    } catch (error) {
        console.error('Erro ao atualizar resumo de valores:', error);
        return false; // Indica que a atualização falhou
    }
};

// Função utilitária para garantir que os campos globais window sejam sempre numéricos válidos
function sanitizarCamposGlobaisResumo() {
    console.log('[SANITIZAÇÃO] Iniciando sanitização de variáveis globais...');
    
    // Inicializar as variáveis globais se não estiverem definidas
    if (window.precoPublicoVeiculo === undefined) window.precoPublicoVeiculo = 0;
    if (window.valorPinturasSelecionadas === undefined) window.valorPinturasSelecionadas = 0;
    if (window.valorOpcionaisSelecionados === undefined) window.valorOpcionaisSelecionados = 0;
    if (window.descontoReais === undefined) window.descontoReais = 0;
    if (window.percentualDesconto === undefined) window.percentualDesconto = 0;
    if (window.agioReais === undefined) window.agioReais = 0;
    if (window.quantidadeResumo === undefined) window.quantidadeResumo = 1;
    
    // Obter valores dos campos de input, se existirem
    const descontoReaisInput = document.getElementById('descontoReaisInput');
    if (descontoReaisInput) {
        window.descontoReais = converterParaNumero(descontoReaisInput.value);
    }
    
    const descontoInput = document.getElementById('descontoInput');
    if (descontoInput) {
        window.percentualDesconto = Number(descontoInput.value) || 0;
    }
    
    const agioReaisInput = document.getElementById('agioReaisInput');
    if (agioReaisInput) {
        window.agioReais = converterParaNumero(agioReaisInput.value);
    }
    
    const quantidadeInput = document.getElementById('quantidadeInput');
    if (quantidadeInput) {
        window.quantidadeResumo = Number(quantidadeInput.value) || 1;
        // Garantir que a quantidade seja pelo menos 1
        if (window.quantidadeResumo < 1) window.quantidadeResumo = 1;
    }
    
    // Converter para números
    window.precoPublicoVeiculo = Number(window.precoPublicoVeiculo) || 0;
    window.valorPinturasSelecionadas = Number(window.valorPinturasSelecionadas) || 0;
    window.valorOpcionaisSelecionados = Number(window.valorOpcionaisSelecionados) || 0;
    window.descontoReais = Number(window.descontoReais) || 0;
    window.percentualDesconto = Number(window.percentualDesconto) || 0;
    window.agioReais = Number(window.agioReais) || 0;
    window.quantidadeResumo = Number(window.quantidadeResumo) || 1;
    
    console.log('[SANITIZAÇÃO] Variáveis globais após sanitização:', {
        precoPublicoVeiculo: window.precoPublicoVeiculo,
        valorPinturasSelecionadas: window.valorPinturasSelecionadas,
        valorOpcionaisSelecionados: window.valorOpcionaisSelecionados,
        descontoReais: window.descontoReais,
        percentualDesconto: window.percentualDesconto,
        agioReais: window.agioReais,
        quantidadeResumo: window.quantidadeResumo
    });
}

// Exportar a função para o objeto window
window.sanitizarCamposGlobaisResumo = sanitizarCamposGlobaisResumo;

// Função para formatar valores monetários
function formatarMoeda(valor) {
    if (valor === null || valor === undefined) return 'R$ 0,00';
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
    // Remove R$, pontos e substitui vírgula por ponto
    return parseFloat(
        valorFormatado
            .replace(/R\$\s?/g, '')
            .replace(/\./g, '')
            .replace(',', '.')
    ) || 0;
}

// Exportar funções para o objeto window
window.formatarMoeda = formatarMoeda;
window.converterParaNumero = converterParaNumero;
window.calcularTotalResumo = window.calcularTotalResumo;
window.atualizarResumoValores = window.atualizarResumoValores;