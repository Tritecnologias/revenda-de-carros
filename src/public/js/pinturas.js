document.addEventListener('DOMContentLoaded', () => {
  // Inicializar formatação monetária
  initMonetaryInputs();
  
  // Carregar dados iniciais
  if (document.getElementById('pinturasList')) {
    carregarPinturas();
  }
  carregarModelos();
  if (document.getElementById('filtroModelo')) {
    carregarAssociacoes();
  }
  
  // Event listeners para formulários
  const pinturaForm = document.getElementById('pinturaForm');
  if (pinturaForm) pinturaForm.addEventListener('submit', salvarPintura);
  const modeloPinturaForm = document.getElementById('modeloPinturaForm');
  if (modeloPinturaForm) modeloPinturaForm.addEventListener('submit', associarPintura);
  const btnLimpar = document.getElementById('btnLimpar');
  if (btnLimpar) btnLimpar.addEventListener('click', limparFormularioPintura);
  const btnLimparAssociacao = document.getElementById('btnLimparAssociacao');
  if (btnLimparAssociacao) btnLimparAssociacao.addEventListener('click', limparFormularioAssociacao);
  const filtroModelo = document.getElementById('filtroModelo');
  if (filtroModelo) filtroModelo.addEventListener('change', filtrarAssociacoes);
});

// Funções para gerenciar pinturas
async function carregarPinturas() {
  try {
    const response = await fetch('/configurador/pinturas');
    const pinturas = await response.json();
    
    // Preencher tabela de pinturas
    const pinturasList = document.getElementById('pinturasList');
    if (pinturasList) {
      pinturasList.innerHTML = '';
      pinturas.forEach(pintura => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${pintura.tipo}</td>
          <td>${pintura.nome}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="editarPintura(${pintura.id})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="excluirPintura(${pintura.id})">Excluir</button>
          </td>
        `;
        pinturasList.appendChild(row);
      });
    }
    // Preencher select de pinturas
    const pinturaSelect = document.getElementById('pinturaSelect');
    if (pinturaSelect) {
      pinturaSelect.innerHTML = '<option value="">Selecione a pintura...</option>';
      pinturas.forEach(pintura => {
        const option = document.createElement('option');
        option.value = pintura.id;
        option.textContent = `${pintura.tipo} - ${pintura.nome}`;
        pinturaSelect.appendChild(option);
      });
    }
  } catch (error) {
    // Silencioso
  }
}

async function salvarPintura(event) {
  event.preventDefault();
  
  const pinturaId = document.getElementById('pinturaId');
  const tipo = document.getElementById('tipo');
  const nome = document.getElementById('nome');
  
  const pintura = { tipo: tipo ? tipo.value : '', nome: nome ? nome.value : '' };
  
  try {
    let url = '/configurador/pinturas';
    let method = 'POST';
    
    if (pinturaId && pinturaId.value) {
      url = `${url}/${pinturaId.value}`;
      method = 'PUT';
    }
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pintura),
    });
    
    if (response.ok) {
      alert(pinturaId && pinturaId.value ? 'Pintura atualizada com sucesso!' : 'Pintura cadastrada com sucesso!');
      limparFormularioPintura();
      carregarPinturas();
      carregarAssociacoes();
    } else {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao salvar pintura');
    }
  } catch (error) {
    console.error('Erro ao salvar pintura:', error);
    alert(`Erro ao salvar pintura: ${error.message}`);
  }
}

async function editarPintura(id) {
  try {
    const response = await fetch(`/configurador/pinturas/detalhe/${id}`);
    const pintura = await response.json();
    
    const pinturaId = document.getElementById('pinturaId');
    if (pinturaId) pinturaId.value = pintura.id;
    const tipo = document.getElementById('tipo');
    if (tipo) tipo.value = pintura.tipo;
    const nome = document.getElementById('nome');
    if (nome) nome.value = pintura.nome;
  } catch (error) {
    console.error('Erro ao carregar pintura para edição:', error);
    alert('Erro ao carregar pintura para edição. Verifique o console para mais detalhes.');
  }
}

async function excluirPintura(id) {
  if (!confirm('Tem certeza que deseja excluir esta pintura?')) {
    return;
  }
  
  try {
    const response = await fetch(`/configurador/pinturas/${id}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      alert('Pintura excluída com sucesso!');
      carregarPinturas();
      carregarAssociacoes();
    } else {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao excluir pintura');
    }
  } catch (error) {
    console.error('Erro ao excluir pintura:', error);
    alert(`Erro ao excluir pintura: ${error.message}`);
  }
}

function limparFormularioPintura() {
  const pinturaId = document.getElementById('pinturaId');
  if (pinturaId) pinturaId.value = '';
  const tipo = document.getElementById('tipo');
  if (tipo) tipo.value = '';
  const nome = document.getElementById('nome');
  if (nome) nome.value = '';
}

// Funções para gerenciar modelos
async function carregarModelos() {
  try {
    const modeloSelect = document.getElementById('modeloSelect');
    const filtroModelo = document.getElementById('filtroModelo');
    if (modeloSelect) {
      modeloSelect.innerHTML = '<option value="">Selecione o modelo...</option>';
    }
    if (filtroModelo) {
      filtroModelo.innerHTML = '<option value="">Todos os modelos</option>';
    } else {
      return;
    }
    const response = await fetch('/api/veiculos/modelos/public/all');
    const modelos = await response.json();
    modelos.forEach(modelo => {
      if (modeloSelect) {
        const option1 = document.createElement('option');
        option1.value = modelo.id;
        option1.textContent = `${modelo.marca?.nome || 'Sem marca'} - ${modelo.nome}`;
        modeloSelect.appendChild(option1);
      }
      const option2 = document.createElement('option');
      option2.value = modelo.id;
      option2.textContent = `${modelo.marca?.nome || 'Sem marca'} - ${modelo.nome}`;
      filtroModelo.appendChild(option2);
    });
  } catch (error) {
    console.error('Erro ao carregar modelos:', error);
    alert('Erro ao carregar modelos. Verifique o console para mais detalhes.');
  }
}

// Funções para gerenciar associações de pinturas a modelos
async function carregarAssociacoes() {
  try {
    const filtroModeloElem = document.getElementById('filtroModelo');
    if (!filtroModeloElem) return;
    const filtroModeloId = filtroModeloElem.value;
    let url = '/configurador/modelo-pintura';
    
    if (filtroModeloId) {
      const response = await fetch(`/configurador/pinturas/modelo/${filtroModeloId}`);
      const associacoes = await response.json();
      exibirAssociacoes(associacoes);
    } else {
      // Carregar todos os modelos e suas pinturas
      const responseModelos = await fetch('/api/veiculos/modelos/public/all');
      const modelos = await responseModelos.json();
      let todasAssociacoes = [];
      
      for (const modelo of modelos) {
        try {
          const response = await fetch(`/configurador/pinturas/modelo/${modelo.id}`);
          const associacoes = await response.json();
          
          // Adicionar informações do modelo a cada associação
          associacoes.forEach(assoc => {
            assoc.modelo = modelo;
          });
          
          todasAssociacoes = [...todasAssociacoes, ...associacoes];
        } catch (error) {
          // Silencioso
        }
      }
      
      exibirAssociacoes(todasAssociacoes);
    }
  } catch (error) {
    // Silencioso
  }
}

function exibirAssociacoes(associacoes, filtroModeloId = '') {
  const modeloPinturasList = document.getElementById('modeloPinturasList');
  if (!modeloPinturasList) return;
  modeloPinturasList.innerHTML = '';
  
  if (associacoes.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="5" class="text-center">Nenhuma associação encontrada</td>';
    modeloPinturasList.appendChild(row);
    return;
  }
  
  associacoes.forEach(assoc => {
    if (filtroModeloId && assoc.modelo.id != filtroModeloId) {
      return;
    }
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${assoc.modelo?.marca?.nome || 'Sem marca'} - ${assoc.modelo?.nome || 'Desconhecido'}</td>
      <td>${assoc.nome}</td>
      <td>${assoc.tipo}</td>
      <td>${formatarMoeda(assoc.preco)}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editarAssociacao(${assoc.modeloPinturaId})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="excluirAssociacao(${assoc.modeloPinturaId})">Excluir</button>
      </td>
    `;
    modeloPinturasList.appendChild(row);
  });
}

async function associarPintura(event) {
  event.preventDefault();
  
  const modeloPinturaId = document.getElementById('modeloPinturaId');
  const modeloId = document.getElementById('modeloSelect');
  const pinturaId = document.getElementById('pinturaSelect');
  const preco = converterParaNumero(document.getElementById('preco').value);
  
  const modeloPintura = { modeloId: modeloId ? modeloId.value : '', pinturaId: pinturaId ? pinturaId.value : '', preco };
  
  try {
    let url = '/configurador/modelo-pintura';
    let method = 'POST';
    
    if (modeloPinturaId && modeloPinturaId.value) {
      url = `${url}/${modeloPinturaId.value}`;
      method = 'PUT';
    }
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modeloPintura),
    });
    
    if (response.ok) {
      alert(modeloPinturaId && modeloPinturaId.value ? 'Associação atualizada com sucesso!' : 'Associação cadastrada com sucesso!');
      limparFormularioAssociacao();
      carregarAssociacoes();
    } else {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao salvar associação');
    }
  } catch (error) {
    console.error('Erro ao salvar associação:', error);
    alert(`Erro ao salvar associação: ${error.message}`);
  }
}

async function editarAssociacao(id) {
  try {
    const response = await fetch(`/configurador/modelo-pintura/${id}`);
    const modeloPintura = await response.json();
    
    const modeloPinturaId = document.getElementById('modeloPinturaId');
    if (modeloPinturaId) modeloPinturaId.value = modeloPintura.id;
    const modeloSelect = document.getElementById('modeloSelect');
    if (modeloSelect) modeloSelect.value = modeloPintura.modeloId;
    const pinturaSelect = document.getElementById('pinturaSelect');
    if (pinturaSelect) pinturaSelect.value = modeloPintura.pinturaId;
    const preco = document.getElementById('preco');
    if (preco) preco.value = formatarMoeda(modeloPintura.preco);
  } catch (error) {
    console.error('Erro ao carregar associação para edição:', error);
    alert('Erro ao carregar associação para edição. Verifique o console para mais detalhes.');
  }
}

async function excluirAssociacao(id) {
  if (!confirm('Tem certeza que deseja excluir esta associação?')) {
    return;
  }
  
  try {
    const response = await fetch(`/configurador/modelo-pintura/${id}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      alert('Associação excluída com sucesso!');
      carregarAssociacoes();
    } else {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao excluir associação');
    }
  } catch (error) {
    console.error('Erro ao excluir associação:', error);
    alert(`Erro ao excluir associação: ${error.message}`);
  }
}

function limparFormularioAssociacao() {
  const modeloPinturaId = document.getElementById('modeloPinturaId');
  if (modeloPinturaId) modeloPinturaId.value = '';
  const modeloSelect = document.getElementById('modeloSelect');
  if (modeloSelect) modeloSelect.value = '';
  const pinturaSelect = document.getElementById('pinturaSelect');
  if (pinturaSelect) pinturaSelect.value = '';
  const preco = document.getElementById('preco');
  if (preco) preco.value = '';
}

function filtrarAssociacoes() {
  const filtroModelo = document.getElementById('filtroModelo');
  if (!filtroModelo) return;
  const filtroModeloId = filtroModelo.value;
  if (filtroModeloId) {
    fetch(`/configurador/pinturas/modelo/${filtroModeloId}`)
      .then(response => response.json())
      .then(associacoes => {
        exibirAssociacoes(associacoes);
      })
      .catch(() => {});
  } else {
    carregarAssociacoes();
  }
}

// Função para buscar e exibir pinturas associadas à versão
async function carregarPinturasAssociadas(versaoId) {
  try {
    const token = auth.getToken();
    const url = `${config.apiBaseUrl}/api/veiculos/versao-pintura/public`;
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    let data = await res.json();
    // Aceita resposta em data.items ou array direto
    if (data && data.items && Array.isArray(data.items)) {
      data = data.items;
    }
    // Filtra as pinturas para a versão selecionada
    const pinturasAssociadas = Array.isArray(data) ? data.filter(item => item.versaoId == versaoId) : [];
    renderizarPinturasAssociadas(pinturasAssociadas);
  } catch (e) {
    renderizarPinturasAssociadas([]);
  }
}

// Função para renderizar as pinturas associadas
function renderizarPinturasAssociadas(pinturas) {
  const container = document.getElementById('pinturasAssociadas');
  if (!container) return;
  if (!pinturas || pinturas.length === 0) {
    container.innerHTML = '<span class="text-muted">Nenhuma pintura associada para esta versão.</span>';
    // Zera o valor da pintura no resumo usando a função centralizada
    if (typeof window.selecionarPinturaAssociada === 'function') {
      window.selecionarPinturaAssociada(null, { preco: 0, nome: '', imageUrl: '' });
    }
    if (document.getElementById('precoPinturaResumo')) {
      document.getElementById('precoPinturaResumo').textContent = formatarMoeda(0);
    }
    if (typeof window.atualizarResumoValores === 'function') {
      window.atualizarResumoValores();
    }
    return;
  }
  let html = '<ul class="list-group">';
  let selecionou = false;
  for (const item of pinturas) {
    // Adiciona data-image-url e onclick para permitir visualização da imagem ao clicar
    html += `<li class="list-group-item d-flex justify-content-between align-items-center pintura-associada-item"
      style="cursor:pointer;"
      data-nome="${item.pintura?.nome || ''}"
      data-image-url="${item.imageUrl || ''}"
      data-preco="${item.preco || 0}"
      onclick="selecionarPinturaAssociada(this)">
      ${item.pintura?.nome || 'Pintura desconhecida'}
      <span class="badge bg-primary">${item.preco ? 'R$ ' + item.preco.toLocaleString('pt-BR', {minimumFractionDigits: 2}) : ''}</span>
    </li>`;
    if (!selecionou) {
      // Seleciona a primeira pintura automaticamente
      setTimeout(() => {
        const itens = document.querySelectorAll('.pintura-associada-item');
        if (itens.length > 0) selecionarPinturaAssociada(itens[0]);
      }, 0);
      selecionou = true;
    }
  }
  html += '</ul>';
  container.innerHTML = html;
}

// Função global para selecionar pintura associada e trocar imagem do card
window.selecionarPinturaAssociada = function(element, pintura) {
  console.log('[PINTURAS.JS] Redirecionando chamada de selecionarPinturaAssociada para a implementação unificada');
  
  // Extrair dados do elemento se não tiver recebido o objeto pintura
  if (!pintura && element) {
    const imageUrl = element.getAttribute('data-image-url');
    const nome = element.getAttribute('data-nome');
    let preco = element.getAttribute('data-preco');
    
    // Converter o preço para número
    if (preco !== null && preco !== undefined && preco !== '') {
      if (preco.indexOf && preco.indexOf(',') > -1) {
        preco = preco.replace(/\./g, '').replace(',', '.');
      } else {
        preco = preco.replace(/[^\d.\-]/g, '');
      }
      preco = Number(preco);
      if (isNaN(preco)) preco = 0;
    } else {
      preco = 0;
    }
    
    // Criar objeto pintura com os dados extraídos
    pintura = {
      nome: nome || '',
      imageUrl: imageUrl || '',
      preco: preco
    };
  }
  
  // Chamar a implementação unificada em configurador-pinturas.js
  if (typeof window.atualizarPinturaSelecionada === 'function') {
    window.atualizarPinturaSelecionada(element, pintura);
  } else {
    console.error('Função atualizarPinturaSelecionada não encontrada. Verifique se o arquivo configurador-pinturas.js está carregado antes de pinturas.js');
    
    // Implementação de fallback caso a função unificada não esteja disponível
    // Atualizar a variável global com o preço da pintura
    if (pintura && pintura.preco !== undefined) {
      window.valorPinturasSelecionadas = Number(pintura.preco) || 0;
      
      // Atualizar o elemento de resumo da pintura
      const precoPinturaResumo = document.getElementById('precoPinturaResumo');
      if (precoPinturaResumo) {
        precoPinturaResumo.textContent = window.formatarMoeda ? 
          window.formatarMoeda(window.valorPinturasSelecionadas) : 
          `R$ ${window.valorPinturasSelecionadas.toFixed(2)}`;
      }
      
      // Atualizar o resumo de valores
      if (typeof window.atualizarResumoValores === 'function') {
        window.atualizarResumoValores();
      }
    }
  }
};

window.carregarPinturasAssociadas = carregarPinturasAssociadas;
window.renderizarPinturasAssociadas = renderizarPinturasAssociadas;
