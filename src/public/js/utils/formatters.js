/**
 * Funções utilitárias para formatação de valores
 */

/**
 * Formata um valor numérico para o formato de moeda brasileira
 * @param {number} valor - Valor a ser formatado
 * @returns {string} - Valor formatado como moeda (R$ 1.234,56)
 */
function formatarMoeda(valor) {
    if (valor === null || valor === undefined) return 'R$ 0,00';
    
    // Converte para número se for string
    if (typeof valor === 'string') {
        valor = converterParaNumero(valor);
    }
    
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/**
 * Converte um valor formatado como moeda para número
 * @param {string} valor - Valor formatado (ex: "R$ 1.234,56")
 * @returns {number} - Valor numérico
 */
function converterParaNumero(valor) {
    if (!valor) return 0;
    
    // Remove caracteres não numéricos, exceto vírgula e ponto
    valor = valor.replace(/[^\d,.-]/g, '');
    
    // Substitui vírgula por ponto para conversão correta
    valor = valor.replace(',', '.');
    
    return parseFloat(valor) || 0;
}

/**
 * Inicializa os inputs monetários com formatação automática
 */
function initMonetaryInputs() {
    document.querySelectorAll('.money-input').forEach(input => {
        // Formata o valor inicial se existir
        if (input.value) {
            const valorNumerico = converterParaNumero(input.value);
            input.value = formatarMoeda(valorNumerico).replace('R$ ', '');
        }
        
        // Evento de foco: remove formatação para facilitar edição
        input.addEventListener('focus', function() {
            const valor = converterParaNumero(this.value);
            this.value = valor === 0 ? '' : valor.toString().replace('.', ',');
        });
        
        // Evento de perda de foco: formata o valor
        input.addEventListener('blur', function() {
            const valor = converterParaNumero(this.value);
            this.value = formatarMoeda(valor).replace('R$ ', '');
        });
    });
}
