// Variáveis globais para armazenar o preço base do veículo e a pintura selecionada
let precoBaseVeiculo = 0;
let pinturaAtual = null;

// Função para obter o preço público do veículo
function obterPrecoPublicoVeiculo() {
  try {
    // Obter o preço público do veículo (preço normal)
    const precoPublicoElement = document.querySelector('.border.p-2 strong');
    if (precoPublicoElement) {
      const precoTexto = precoPublicoElement.textContent;
      // Usar a função converterParaNumero do utils.js
      return window.converterParaNumero ? window.converterParaNumero(precoTexto) : 0;
    }
    return 0;
  } catch (error) {
    console.error('Erro ao obter preço público do veículo:', error);
    return 0;
  }
}

// Função para criar um card de pintura
function criarCardPintura(pintura) {
  const card = document.createElement('div');
  card.className = 'card pintura-card';
  
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  
  const titulo = document.createElement('h6');
  titulo.className = 'card-title';
  titulo.textContent = `Pintura ${pintura.tipo || 'SÓLIDA'}`;
  
  const nome = document.createElement('p');
  nome.className = 'card-text';
  nome.textContent = pintura.nome;
  
  const preco = document.createElement('p');
  preco.className = 'card-text text-primary';
  preco.textContent = window.formatarMoeda ? window.formatarMoeda(pintura.preco) : 'R$ 0,00';
  
  // Montar a estrutura do card
  cardBody.appendChild(titulo);
  cardBody.appendChild(nome);
  cardBody.appendChild(preco);
  card.appendChild(cardBody);
  
  // Adicionar evento de clique
  card.addEventListener('click', () => {
    // Usar a função unificada de seleção de pintura
    atualizarPinturaSelecionada(card, pintura);
  });
  
  return card;
}

// Função unificada para atualizar a pintura selecionada
// Esta função substitui window.selecionarPinturaAssociada para evitar conflitos
window.atualizarPinturaSelecionada = function(element, pintura) {
  console.log('[CONFIGURADOR] atualizarPinturaSelecionada chamada com:', { element, pintura });
  
  // Remover a classe 'selected' de todos os cards
  const cards = document.querySelectorAll('.pintura-card');
  cards.forEach(card => card.classList.remove('selected'));
  
  // Adicionar a classe 'selected' ao card clicado
  if (element) {
    element.classList.add('selected');
  }
  
  // Atualizar a pintura atual
  pinturaAtual = pintura;
  
  // Atualizar o texto da cor selecionada
  const selectedColorElement = document.getElementById('selectedColor');
  if (selectedColorElement) {
    selectedColorElement.textContent = `Cor: ${pintura.nome} (${pintura.tipo || 'SÓLIDA'})`;
  }
  
  // Atualizar a imagem do veículo com a imagem da pintura
  const carImage = document.getElementById('carImage');
  if (carImage && pintura.imageUrl) {
    carImage.src = pintura.imageUrl;
    carImage.alt = `${pintura.nome} (${pintura.tipo || 'SÓLIDA'})`;
    console.log('Imagem do veículo atualizada com:', pintura.imageUrl);
  } else {
    console.log('Não foi possível atualizar a imagem do veículo:', { 
      carImageExiste: !!carImage, 
      imageUrlExiste: !!pintura.imageUrl, 
      imageUrl: pintura.imageUrl 
    });
  }
  
  // Atualizar o texto do modelo no card
  const modeloNomeElement = document.getElementById('modeloNome');
  if (modeloNomeElement) {
    // Obter o nome do modelo e da marca selecionados
    const modeloSelect = document.getElementById('configuradorModelo');
    const marcaSelect = document.getElementById('configuradorMarca');
    
    if (modeloSelect && modeloSelect.selectedOptions.length > 0) {
      const modeloNome = modeloSelect.selectedOptions[0].textContent;
      const marcaNome = marcaSelect && marcaSelect.selectedOptions.length > 0 ? 
                       marcaSelect.selectedOptions[0].textContent : '';
      
      // Se temos um modelo selecionado, usar seu nome
      if (modeloNome && modeloNome !== 'Selecione um modelo') {
        modeloNomeElement.textContent = marcaNome ? `${marcaNome} ${modeloNome}` : modeloNome;
      } else {
        // Caso contrário, deixar em branco
        modeloNomeElement.textContent = '';
      }
    } else {
      // Se não há modelo selecionado, deixar em branco
      modeloNomeElement.textContent = '';
    }
  }
  
  // Atualizar o valor da pintura selecionada na variável global
  if (pintura && pintura.preco !== undefined) {
    // Converter o preço para número, tratando diferentes formatos
    let precoNumerico = 0;
    if (typeof pintura.preco === 'number') {
      precoNumerico = pintura.preco;
    } else if (typeof pintura.preco === 'string') {
      // Remover formatação de moeda e converter para número
      precoNumerico = parseFloat(pintura.preco.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
    }
    
    // Garantir que o preço seja um número válido
    precoNumerico = isNaN(precoNumerico) ? 0 : precoNumerico;
    
    // Atualizar a variável global de forma explícita
    window.valorPinturasSelecionadas = precoNumerico;
    
    console.log('Preço da pintura atualizado para:', window.valorPinturasSelecionadas, 'tipo:', typeof window.valorPinturasSelecionadas);
    
    // Atualizar diretamente o elemento de resumo da pintura
    const precoPinturaResumo = document.getElementById('precoPinturaResumo');
    if (precoPinturaResumo) {
      precoPinturaResumo.textContent = window.formatarMoeda ? window.formatarMoeda(window.valorPinturasSelecionadas) : `R$ ${window.valorPinturasSelecionadas.toFixed(2)}`;
    }
    
    // Forçar a atualização de outras variáveis globais relacionadas ao cálculo
    if (typeof window.sanitizarCamposGlobaisResumo === 'function') {
      window.sanitizarCamposGlobaisResumo();
      console.log('Sanitização realizada após atualização do preço da pintura');
    }
    
    // Verificar se a variável global foi atualizada corretamente
    console.log('Verificação após atualização:', {
      valorPinturasSelecionadas: window.valorPinturasSelecionadas,
      tipo: typeof window.valorPinturasSelecionadas,
      isNaN: isNaN(window.valorPinturasSelecionadas)
    });
  } else {
    window.valorPinturasSelecionadas = 0;
    console.log('Preço da pintura resetado para 0 (pintura sem preço definido)');
  }
  
  // Verificar se a função de cálculo do total existe antes de chamá-la
  if (typeof window.calcularTotalResumo === 'function') {
    const total = window.calcularTotalResumo();
    console.log('Total calculado após seleção da pintura:', total);
  }
  
  // Atualizar o resumo de valores
  if (typeof window.atualizarResumoValores === 'function') {
    window.atualizarResumoValores();
    console.log('Resumo de valores atualizado após seleção da pintura');
  } else {
    console.log('Função atualizarResumoValores não encontrada');
  }
  
  console.log('Pintura selecionada:', pintura);
}

// Manter a compatibilidade com o código existente
window.selecionarPinturaAssociada = function(element, pintura) {
  console.log('[COMPATIBILIDADE] Redirecionando chamada de window.selecionarPinturaAssociada para atualizarPinturaSelecionada');
  window.atualizarPinturaSelecionada(element, pintura);
};

// Função para carregar pinturas associadas a uma versão específica
async function carregarPinturasAssociadas(versaoId) {
  if (!versaoId) {
    console.error('ID da versão não fornecido');
    return;
  }
  
  try {
    console.log('Carregando pinturas associadas à versão ID:', versaoId);
    
    // Fazer requisição para obter as pinturas associadas à versão usando o endpoint correto
    const response = await fetch(`${config.apiBaseUrl}/api/veiculos/versao-pintura/versao/${versaoId}/public`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Falha ao carregar pinturas associadas: ${response.status} ${response.statusText}`);
    }
    
    const pinturas = await response.json();
    console.log('Pinturas associadas carregadas:', pinturas);
    
    // Renderizar as pinturas associadas
    renderizarPinturasAssociadas(pinturas);
    
    return pinturas;
  } catch (error) {
    console.error('Erro ao carregar pinturas associadas:', error);
    return [];
  }
}

// Função para renderizar as pinturas associadas
function renderizarPinturasAssociadas(pinturas) {
  // Obter o container onde os cards serão exibidos
  const containerPinturas = document.getElementById('opcoesPin');
  if (!containerPinturas) {
    console.error('Container de pinturas não encontrado');
    return;
  }
  
  // Limpar o container
  containerPinturas.innerHTML = '';
  
  if (!Array.isArray(pinturas) || pinturas.length === 0) {
    containerPinturas.innerHTML = '<div class="col-12"><p class="text-muted">Nenhuma pintura associada a esta versão.</p></div>';
    return;
  }
  
  // Adicionar cada pintura como um card
  pinturas.forEach((pintura) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'col-md-6 col-12 mb-3';
    
    const card = criarCardPintura(pintura);
    cardDiv.appendChild(card);
    containerPinturas.appendChild(cardDiv);
  });
  
  // Obter o preço base do veículo
  precoBaseVeiculo = obterPrecoPublicoVeiculo();
  console.log('Preço público do veículo:', window.formatarMoeda ? window.formatarMoeda(precoBaseVeiculo) : 'R$ 0,00');
  
  // Resetar a pintura atual
  pinturaAtual = null;
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Verificar se estamos na página do configurador
  const configuradorVersao = document.getElementById('configuradorVersao');
  const opcoesPin = document.getElementById('opcoesPin');
  
  if (configuradorVersao && opcoesPin) {
    // Adicionar evento para carregar pinturas quando uma versão for selecionada
    configuradorVersao.addEventListener('change', function() {
      if (this.value) {
        // Carregar pinturas associadas à versão selecionada
        carregarPinturasAssociadas(this.value);
      } else {
        // Limpar o container de pinturas se nenhuma versão estiver selecionada
        opcoesPin.innerHTML = '';
      }
    });
    
    // Verificar se já existe uma versão selecionada
    if (configuradorVersao.value) {
      carregarPinturasAssociadas(configuradorVersao.value);
    }
  }
  
  // Adicionar evento para carregar pinturas quando os detalhes do veículo forem carregados
  document.addEventListener('veiculoDetalhesCarregados', function(event) {
    if (event.detail && event.detail.versaoId) {
      carregarPinturasAssociadas(event.detail.versaoId);
    }
  });
});
