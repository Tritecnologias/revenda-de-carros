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

// Função para carregar e exibir os cards de pinturas
async function carregarCardsPinturas(modeloId) {
  try {
    // Se não for fornecido um ID de modelo, usar o modelo selecionado no configurador
    if (!modeloId) {
      const configuradorModelo = document.getElementById('configuradorModelo');
      if (configuradorModelo && configuradorModelo.value) {
        modeloId = configuradorModelo.value;
      } else {
        console.error('Nenhum modelo selecionado');
        return;
      }
    }

    const response = await fetch(`/configurador/pinturas/modelo/${modeloId}/cards`);
    const pinturas = await response.json();
    
    // Obter o container onde os cards serão exibidos
    const containerPinturas = document.getElementById('opcoesPin');
    if (!containerPinturas) {
      console.error('Container de pinturas não encontrado');
      return;
    }
    
    // Limpar o container
    containerPinturas.innerHTML = '';
    
    // Adicionar cada pintura como um card
    pinturas.forEach((pintura, index) => {
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
    
    // Resetar o valor de pinturas selecionadas na variável global
    if (window.valorPinturasSelecionadas !== undefined) {
      window.valorPinturasSelecionadas = 0;
      
      // Atualizar o resumo de valores se a função existir
      if (typeof window.atualizarResumoValores === 'function') {
        window.atualizarResumoValores();
      }
    }
    
  } catch (error) {
    console.error('Erro ao carregar cards de pinturas:', error);
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
    // Guardar o valor da pintura anterior
    const valorPinturaAnterior = pinturaAtual ? (parseFloat(pinturaAtual.preco) || 0) : 0;
    
    // Atualizar a pintura atual
    pinturaAtual = pintura;
    
    // Atualizar a cor selecionada no card do veículo
    const corElement = document.getElementById('veiculoCor');
    if (corElement) {
      corElement.textContent = `Cor: ${pintura.nome}`;
    }
    
    // Atualizar a imagem do veículo com a imagem da pintura, se disponível
    const veiculoImagem = document.getElementById('veiculoImagem');
    if (veiculoImagem && pintura.imageUrl) {
      veiculoImagem.src = pintura.imageUrl;
      console.log('Imagem da pintura atualizada:', pintura.imageUrl);
    } else if (veiculoImagem) {
      // Se não tiver imagem específica da pintura, usar a imagem padrão do modelo
      const modeloId = document.getElementById('configuradorModelo').value;
      if (modeloId) {
        veiculoImagem.src = `/images/modelos/${modeloId}.jpg`;
      }
    }
    
    try {
      // Obter o preço público atual do veículo
      const precoPublico = obterPrecoPublicoVeiculo();
      
      // Garantir que o preço da pintura seja um número
      const precoPintura = parseFloat(pintura.preco) || 0;
      
      // Logs para depuração
      console.log('Preço público do veículo:', precoPublico);
      console.log('Preço da pintura:', precoPintura);
      
      // Calcular o novo preço total
      const precoTotal = precoPublico + precoPintura;
      console.log('Preço total:', precoTotal);
      
      // Atualizar o preço exibido no card da imagem
      const precoElement = document.getElementById('veiculoPreco');
      if (precoElement) {
        precoElement.textContent = window.formatarMoeda ? window.formatarMoeda(precoTotal) : 'R$ 0,00';
      }
      
      // Atualizar o valor da pintura na variável global para o resumo de valores
      if (window.valorPinturasSelecionadas !== undefined) {
        // Remover o valor da pintura anterior e adicionar o valor da nova pintura
        window.valorPinturasSelecionadas = (window.valorPinturasSelecionadas - valorPinturaAnterior) + precoPintura;
        
        // Atualizar o resumo de valores se a função existir
        if (typeof window.atualizarResumoValores === 'function') {
          window.atualizarResumoValores();
        }
      }
      
      // Atualizar o valor no resumo de pintura
      const precoPinturaResumo = document.getElementById('precoPinturaResumo');
      if (precoPinturaResumo) {
        precoPinturaResumo.textContent = window.formatarMoeda ? window.formatarMoeda(precoPintura) : 'R$ 0,00';
      }
      
    } catch (error) {
      console.error('Erro ao calcular preço total:', error);
    }
    
    // Destacar o card selecionado
    document.querySelectorAll('.pintura-card').forEach(c => {
      c.classList.remove('selected');
    });
    card.classList.add('selected');
  });
  
  return card;
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Verificar se estamos na página do configurador
  const configuradorModelo = document.getElementById('configuradorModelo');
  const opcoesPin = document.getElementById('opcoesPin');
  
  if (configuradorModelo && opcoesPin) {
    // Adicionar evento para carregar pinturas quando um modelo for selecionado
    configuradorModelo.addEventListener('change', function() {
      if (this.value) {
        carregarCardsPinturas(this.value);
      } else {
        // Limpar o container de pinturas se nenhum modelo estiver selecionado
        opcoesPin.innerHTML = '';
      }
    });
    
    // Verificar se já existe um modelo selecionado
    if (configuradorModelo.value) {
      carregarCardsPinturas(configuradorModelo.value);
    }
  }
  
  // Adicionar evento para carregar pinturas quando os detalhes do veículo forem carregados
  document.addEventListener('veiculoDetalhesCarregados', function(event) {
    if (event.detail && event.detail.modeloId) {
      carregarCardsPinturas(event.detail.modeloId);
    }
  });
});
