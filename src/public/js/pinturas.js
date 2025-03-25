document.addEventListener('DOMContentLoaded', () => {
  // Inicializar formatação monetária
  initMonetaryInputs();
  
  // Carregar dados iniciais
  carregarPinturas();
  carregarModelos();
  carregarAssociacoes();
  
  // Event listeners para formulários
  document.getElementById('pinturaForm').addEventListener('submit', salvarPintura);
  document.getElementById('modeloPinturaForm').addEventListener('submit', associarPintura);
  document.getElementById('btnLimpar').addEventListener('click', limparFormularioPintura);
  document.getElementById('btnLimparAssociacao').addEventListener('click', limparFormularioAssociacao);
  document.getElementById('filtroModelo').addEventListener('change', filtrarAssociacoes);
});

// Funções para gerenciar pinturas
async function carregarPinturas() {
  try {
    const response = await fetch('/configurador/pinturas');
    const pinturas = await response.json();
    
    // Preencher tabela de pinturas
    const pinturasList = document.getElementById('pinturasList');
    pinturasList.innerHTML = '';
    
    pinturas.forEach(pintura => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${pintura.tipo}</td>
        <td>${pintura.nome}</td>
        <td>${pintura.imageUrl ? `<a href="${pintura.imageUrl}" target="_blank">Ver imagem</a>` : 'Sem imagem'}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="editarPintura(${pintura.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="excluirPintura(${pintura.id})">Excluir</button>
        </td>
      `;
      pinturasList.appendChild(row);
    });
    
    // Preencher select de pinturas
    const pinturaSelect = document.getElementById('pinturaSelect');
    pinturaSelect.innerHTML = '<option value="">Selecione a pintura...</option>';
    
    pinturas.forEach(pintura => {
      const option = document.createElement('option');
      option.value = pintura.id;
      option.textContent = `${pintura.tipo} - ${pintura.nome}`;
      pinturaSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar pinturas:', error);
    alert('Erro ao carregar pinturas. Verifique o console para mais detalhes.');
  }
}

async function salvarPintura(event) {
  event.preventDefault();
  
  const pinturaId = document.getElementById('pinturaId').value;
  const tipo = document.getElementById('tipo').value;
  const nome = document.getElementById('nome').value;
  const imageUrl = document.getElementById('imageUrl').value;
  
  const pintura = { tipo, nome, imageUrl };
  
  try {
    let url = '/configurador/pinturas';
    let method = 'POST';
    
    if (pinturaId) {
      url = `${url}/${pinturaId}`;
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
      alert(pinturaId ? 'Pintura atualizada com sucesso!' : 'Pintura cadastrada com sucesso!');
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
    
    document.getElementById('pinturaId').value = pintura.id;
    document.getElementById('tipo').value = pintura.tipo;
    document.getElementById('nome').value = pintura.nome;
    document.getElementById('imageUrl').value = pintura.imageUrl || '';
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
  document.getElementById('pinturaId').value = '';
  document.getElementById('tipo').value = '';
  document.getElementById('nome').value = '';
  document.getElementById('imageUrl').value = '';
}

// Funções para gerenciar modelos
async function carregarModelos() {
  try {
    const response = await fetch('/api/veiculos/modelos/public/all');
    let modelos = await response.json();
    
    // Verificar se a resposta é um objeto com uma propriedade 'items'
    if (modelos && typeof modelos === 'object' && !Array.isArray(modelos) && modelos.items) {
      modelos = modelos.items;
    }
    
    // Verificar se modelos é um array
    if (!Array.isArray(modelos)) {
      console.error('Resposta não é um array:', modelos);
      modelos = []; // Definir como array vazio para evitar erros
    }
    
    // Preencher select de modelos
    const modeloSelect = document.getElementById('modeloSelect');
    const filtroModelo = document.getElementById('filtroModelo');
    
    modeloSelect.innerHTML = '<option value="">Selecione o modelo...</option>';
    filtroModelo.innerHTML = '<option value="">Todos os modelos</option>';
    
    modelos.forEach(modelo => {
      // Adicionar ao select principal
      const option1 = document.createElement('option');
      option1.value = modelo.id;
      option1.textContent = `${modelo.marca?.nome || 'Sem marca'} - ${modelo.nome}`;
      modeloSelect.appendChild(option1);
      
      // Adicionar ao filtro
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
    const filtroModeloId = document.getElementById('filtroModelo').value;
    let url = '/configurador/modelo-pintura';
    
    if (filtroModeloId) {
      const response = await fetch(`/configurador/pinturas/modelo/${filtroModeloId}`);
      const associacoes = await response.json();
      exibirAssociacoes(associacoes);
    } else {
      // Carregar todos os modelos e suas pinturas
      const responseModelos = await fetch('/api/veiculos/modelos/public/all');
      let modelos = await responseModelos.json();
      
      // Verificar se a resposta é um objeto com uma propriedade 'items'
      if (modelos && typeof modelos === 'object' && !Array.isArray(modelos) && modelos.items) {
        modelos = modelos.items;
      }
      
      // Verificar se modelos é um array
      if (!Array.isArray(modelos)) {
        console.error('Resposta não é um array:', modelos);
        modelos = []; // Definir como array vazio para evitar erros
      }
      
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
          console.error(`Erro ao carregar pinturas para o modelo ${modelo.id}:`, error);
        }
      }
      
      exibirAssociacoes(todasAssociacoes);
    }
  } catch (error) {
    console.error('Erro ao carregar associações:', error);
    alert('Erro ao carregar associações. Verifique o console para mais detalhes.');
  }
}

function exibirAssociacoes(associacoes, filtroModeloId = '') {
  const modeloPinturasList = document.getElementById('modeloPinturasList');
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
  
  const modeloPinturaId = document.getElementById('modeloPinturaId').value;
  const modeloId = document.getElementById('modeloSelect').value;
  const pinturaId = document.getElementById('pinturaSelect').value;
  const preco = converterParaNumero(document.getElementById('preco').value);
  
  const modeloPintura = { modeloId, pinturaId, preco };
  
  try {
    let url = '/configurador/modelo-pintura';
    let method = 'POST';
    
    if (modeloPinturaId) {
      url = `${url}/${modeloPinturaId}`;
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
      alert(modeloPinturaId ? 'Associação atualizada com sucesso!' : 'Associação cadastrada com sucesso!');
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
    
    document.getElementById('modeloPinturaId').value = modeloPintura.id;
    document.getElementById('modeloSelect').value = modeloPintura.modeloId;
    document.getElementById('pinturaSelect').value = modeloPintura.pinturaId;
    document.getElementById('preco').value = formatarMoeda(modeloPintura.preco);
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
  document.getElementById('modeloPinturaId').value = '';
  document.getElementById('modeloSelect').value = '';
  document.getElementById('pinturaSelect').value = '';
  document.getElementById('preco').value = '';
}

function filtrarAssociacoes() {
  const filtroModeloId = document.getElementById('filtroModelo').value;
  
  if (filtroModeloId) {
    fetch(`/configurador/pinturas/modelo/${filtroModeloId}`)
      .then(response => response.json())
      .then(associacoes => {
        exibirAssociacoes(associacoes);
      })
      .catch(error => {
        console.error('Erro ao filtrar associações:', error);
        alert('Erro ao filtrar associações. Verifique o console para mais detalhes.');
      });
  } else {
    carregarAssociacoes();
  }
}
