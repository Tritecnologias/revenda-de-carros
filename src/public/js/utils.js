/**
 * Formata um valor numérico para o formato de moeda brasileira
 * @param {number} valor - Valor a ser formatado
 * @returns {string} - Valor formatado como moeda (ex: R$ 1.234,56)
 */
function formatarMoeda(valor) {
  if (valor === null || valor === undefined) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

/**
 * Converte um valor formatado como moeda para número
 * @param {string} valorFormatado - Valor formatado como moeda (ex: R$ 1.234,56)
 * @returns {number} - Valor numérico
 */
function converterParaNumero(valorFormatado) {
  if (!valorFormatado) return 0;
  
  // Remove R$, pontos e substitui vírgula por ponto
  return parseFloat(
    valorFormatado
      .replace(/R\$\s?/g, '')
      .replace(/\./g, '')
      .replace(',', '.')
  );
}

// Tornar as funções disponíveis globalmente
window.formatarMoeda = formatarMoeda;
window.converterParaNumero = converterParaNumero;

/**
 * Inicializa os inputs monetários na página
 */
function initMonetaryInputs() {
  const monetaryInputs = document.querySelectorAll('.monetary');
  
  monetaryInputs.forEach(input => {
    // Formata o valor inicial
    if (input.value) {
      input.value = formatarMoeda(converterParaNumero(input.value));
    }
    
    // Adiciona eventos para formatar ao ganhar e perder foco
    input.addEventListener('focus', function() {
      const valor = converterParaNumero(this.value);
      this.value = valor === 0 ? '' : valor.toString().replace('.', ',');
    });
    
    input.addEventListener('blur', function() {
      const valor = converterParaNumero(this.value);
      this.value = formatarMoeda(valor);
    });
  });
}
