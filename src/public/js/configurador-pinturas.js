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
    
    // Criar duas colunas para os cards
    const coluna1 = document.createElement('div');
    coluna1.className = 'col-6';
    
    const coluna2 = document.createElement('div');
    coluna2.className = 'col-6';
    
    // Distribuir os cards entre as duas colunas
    pinturas.forEach((pintura, index) => {
      const card = criarCardPintura(pintura);
      
      // Adicionar à coluna apropriada (alternando)
      if (index % 2 === 0) {
        coluna1.appendChild(card);
      } else {
        coluna2.appendChild(card);
      }
    });
    
    // Adicionar as colunas ao container
    containerPinturas.appendChild(coluna1);
    containerPinturas.appendChild(coluna2);
    
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
  const cardContainer = document.createElement('div');
  cardContainer.className = 'paint-option mb-3';
  
  const card = document.createElement('div');
  card.className = 'card';
  card.style.cursor = 'pointer';
  
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  
  const titulo = document.createElement('h6');
  titulo.textContent = `Pintura ${pintura.tipo}`;
  
  const nome = document.createElement('p');
  nome.textContent = pintura.nome;
  
  const preco = document.createElement('strong');
  preco.textContent = window.formatarMoeda ? window.formatarMoeda(pintura.preco) : 'R$ 0,00';
  
  // Montar a estrutura do card
  cardBody.appendChild(titulo);
  cardBody.appendChild(nome);
  cardBody.appendChild(preco);
  card.appendChild(cardBody);
  cardContainer.appendChild(card);
  
  // Adicionar evento de clique
  card.addEventListener('click', () => {
    // Guardar o valor da pintura anterior
    const valorPinturaAnterior = pinturaAtual ? (parseFloat(pinturaAtual.preco) || 0) : 0;
    
    // Atualizar a pintura atual
    pinturaAtual = pintura;
    
    // Atualizar a cor selecionada
    const corElement = document.getElementById('selectedColor');
    if (corElement) {
      corElement.textContent = pintura.nome;
    }
    
    // Atualizar a imagem do veículo com a imagem da pintura, se disponível
    const carImage = document.getElementById('carImage');
    if (carImage && pintura.imageUrl) {
      carImage.src = pintura.imageUrl;
      console.log('Imagem da pintura atualizada:', pintura.imageUrl);
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
      const precoElement = document.querySelector('.car-price strong');
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
      
    } catch (error) {
      console.error('Erro ao calcular preço total:', error);
    }
    
    // Destacar o card selecionado
    document.querySelectorAll('.paint-option .card').forEach(c => {
      c.classList.remove('border-primary');
    });
    card.classList.add('border-primary');
  });
  
  return cardContainer;
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Verificar se estamos na página do configurador
  const configuradorModelo = document.getElementById('configuradorModelo');
  const opcoesPin = document.getElementById('opcoesPin');
  
  if (configuradorModelo && opcoesPin) {
    // Carregar cards iniciais se houver um modelo selecionado
    if (configuradorModelo.value) {
      carregarCardsPinturas(configuradorModelo.value);
    }
    
    // Adicionar evento para recarregar os cards quando o modelo mudar
    configuradorModelo.addEventListener('change', () => {
      if (configuradorModelo.value) {
        carregarCardsPinturas(configuradorModelo.value);
      }
    });
    
    // Adicionar evento para atualizar o preço base quando a versão mudar
    const configuradorVersao = document.getElementById('configuradorVersao');
    if (configuradorVersao) {
      configuradorVersao.addEventListener('change', () => {
        // Aguardar um pouco para que os preços sejam atualizados pelo index.js
        setTimeout(() => {
          // Obter o preço público atualizado
          precoBaseVeiculo = obterPrecoPublicoVeiculo();
          console.log('Preço público atualizado:', window.formatarMoeda ? window.formatarMoeda(precoBaseVeiculo) : 'R$ 0,00');
          
          // Se houver uma pintura selecionada, recalcular o preço total
          if (pinturaAtual) {
            const precoPintura = parseFloat(pinturaAtual.preco) || 0;
            const precoTotal = precoBaseVeiculo + precoPintura;
            
            const precoElement = document.querySelector('.car-price strong');
            if (precoElement) {
              precoElement.textContent = window.formatarMoeda ? window.formatarMoeda(precoTotal) : 'R$ 0,00';
            }
          }
        }, 500); // Aguardar 500ms para garantir que os preços foram atualizados
      });
    }
  }
});
