/**
 * Módulo UI - Funções de interface do usuário
 * Este módulo contém funções para manipulação da interface do usuário
 */

import { getSituacaoBadgeClass, getSituacaoText, formatarPreco } from './utils.js';

// Função para exibir mensagens de erro
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('d-none');
        
        // Rolar para o topo para garantir que a mensagem seja vista
        window.scrollTo(0, 0);
        
        console.error('Erro:', message);
    }
}

// Função para esconder mensagem de erro
function hideError() {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.classList.add('d-none');
    }
}

// Função para exibir mensagens de sucesso
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.classList.remove('d-none');
        
        // Rolar para o topo para garantir que a mensagem seja vista
        // Usar scrollTo com behavior: smooth para uma experiência melhor
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        console.log('Mensagem de sucesso exibida:', message);
        
        // Esconder após 5 segundos
        setTimeout(() => {
            hideSuccess();
        }, 5000);
    }
}

// Função para esconder mensagem de sucesso
function hideSuccess() {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        // Adicionar uma transição suave
        successDiv.style.opacity = '0';
        setTimeout(() => {
            successDiv.classList.add('d-none');
            successDiv.style.opacity = '1';
        }, 300);
    }
}

// Função para mostrar indicador de carregamento
function showLoading(message = 'Carregando...') {
    // Verificar se já existe um indicador de carregamento
    let loadingDiv = document.getElementById('loadingIndicator');
    
    // Se não existir, criar um novo
    if (!loadingDiv) {
        loadingDiv = document.createElement('div');
        loadingDiv.id = 'loadingIndicator';
        loadingDiv.className = 'loading-overlay';
        loadingDiv.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
            <div class="loading-message mt-2">${message}</div>
        `;
        document.body.appendChild(loadingDiv);
    } else {
        // Se já existir, apenas atualizar a mensagem
        const messageElement = loadingDiv.querySelector('.loading-message');
        if (messageElement) {
            messageElement.textContent = message;
        }
        loadingDiv.classList.remove('d-none');
    }
    
    console.log('Indicador de carregamento exibido:', message);
}

// Função para esconder indicador de carregamento
function hideLoading() {
    const loadingDiv = document.getElementById('loadingIndicator');
    if (loadingDiv) {
        // Adicionar classe d-none em vez de remover o elemento
        // para evitar recriá-lo em carregamentos subsequentes
        loadingDiv.classList.add('d-none');
    }
    
    console.log('Indicador de carregamento escondido');
}

// Função para mostrar modal de exclusão
function showDeleteModal(id) {
    console.log(`Abrindo modal de exclusão para veículo ID: ${id}`);
    
    const modal = document.getElementById('deleteModal');
    const veiculoIdInput = document.getElementById('veiculoIdToDelete');
    
    if (modal && veiculoIdInput) {
        // Definir o ID do veículo a ser excluído
        veiculoIdInput.value = id;
        console.log(`ID do veículo definido para exclusão: ${id}`);
        
        // Mostrar o modal
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    } else {
        console.error('Elementos do modal de exclusão não encontrados:', {
            modal: !!modal,
            veiculoIdInput: !!veiculoIdInput
        });
    }
}

// Função para renderizar veículos na tabela
function renderVeiculos(data) {
    const tableBody = document.getElementById('veiculosTableBody');
    
    if (!tableBody) {
        console.error('Elemento da tabela não encontrado!');
        return;
    }
    
    // Limpar tabela
    tableBody.innerHTML = '';
    
    if (!data || !data.veiculos || !Array.isArray(data.veiculos) || data.veiculos.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="7" class="text-center">Nenhum veículo encontrado</td>
        `;
        tableBody.appendChild(emptyRow);
        return;
    }
    
    // Log para verificar a estrutura dos dados
    console.log('Estrutura do primeiro veículo:', JSON.stringify(data.veiculos[0], null, 2));
    
    // Adicionar veículos à tabela
    data.veiculos.forEach(veiculo => {
        const row = document.createElement('tr');
        
        // Formatação de preço
        let precoFormatado = 'N/A';
        if (veiculo.preco !== null && veiculo.preco !== undefined) {
            precoFormatado = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(veiculo.preco);
        }
        
        // Obter classe de badge para situação
        const situacaoBadgeClass = getSituacaoBadgeClass(veiculo.situacao);
        const situacaoText = getSituacaoText(veiculo.situacao);
        
        // Verificar as propriedades da versão
        console.log('Propriedades da versão:', veiculo.versao);
        
        // Determinar o nome da versão corretamente
        let versaoNome = 'N/A';
        if (veiculo.versao) {
            // Tentar diferentes propriedades possíveis para o nome da versão
            versaoNome = veiculo.versao.nome_versao || veiculo.versao.nome || veiculo.versao.descricao || 'N/A';
        }
        
        row.innerHTML = `
            <td>${veiculo.id}</td>
            <td>
                <strong>${veiculo.marca?.nome || 'N/A'}</strong><br>
                ${veiculo.modelo?.nome || 'N/A'} - ${versaoNome}
            </td>
            <td>${veiculo.ano || 'N/A'}</td>
            <td>${precoFormatado}</td>
            <td>
                <span class="badge ${situacaoBadgeClass}">${situacaoText}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${veiculo.id}">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${veiculo.id}">
                    <i class="bi bi-trash"></i> Excluir
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
        
        // Adicionar event listeners para os botões
        const editBtn = row.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                console.log(`Clicou em editar veículo ID: ${veiculo.id}`);
                window.editVeiculo(veiculo.id);
            });
        }
        
        const deleteBtn = row.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                console.log(`Clicou em excluir veículo ID: ${veiculo.id}`);
                window.showDeleteModal(veiculo.id);
            });
        }
    });
    
    console.log(`Renderizados ${data.veiculos.length} veículos na tabela`);
}

// Função para renderizar a paginação
function renderPagination(data) {
    console.log('Renderizando paginação com dados:', data);
    
    const paginationElement = document.getElementById('paginationControls');
    if (!paginationElement) {
        console.error('Elemento de paginação não encontrado!');
        return;
    }
    
    // Limpar paginação
    paginationElement.innerHTML = '';
    
    // Verificar se temos dados válidos
    if (!data || !data.totalPages || data.totalPages <= 0) {
        console.log('Sem dados de paginação válidos');
        return;
    }
    
    const currentPage = data.currentPage || 1;
    const totalPages = data.totalPages || 1;
    
    console.log(`Renderizando paginação: página ${currentPage} de ${totalPages}`);
    
    // Criar elemento de paginação
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Paginação de veículos');
    
    const ul = document.createElement('ul');
    ul.className = 'pagination justify-content-center';
    
    // Botão "Anterior"
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    
    const prevLink = document.createElement('a');
    prevLink.className = 'page-link';
    prevLink.href = '#';
    prevLink.setAttribute('aria-label', 'Anterior');
    prevLink.innerHTML = '<span aria-hidden="true">&laquo;</span>';
    
    if (currentPage > 1) {
        prevLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.changePage(currentPage - 1);
        });
    }
    
    prevLi.appendChild(prevLink);
    ul.appendChild(prevLi);
    
    // Determinar quais páginas mostrar
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Ajustar se estamos perto do final
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    // Renderizar números de página
    for (let i = startPage; i <= endPage; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
        
        const pageLink = document.createElement('a');
        pageLink.className = 'page-link';
        pageLink.href = '#';
        pageLink.textContent = i;
        
        if (i !== currentPage) {
            pageLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.changePage(i);
            });
        }
        
        pageLi.appendChild(pageLink);
        ul.appendChild(pageLi);
    }
    
    // Botão "Próximo"
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    
    const nextLink = document.createElement('a');
    nextLink.className = 'page-link';
    nextLink.href = '#';
    nextLink.setAttribute('aria-label', 'Próximo');
    nextLink.innerHTML = '<span aria-hidden="true">&raquo;</span>';
    
    if (currentPage < totalPages) {
        nextLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.changePage(currentPage + 1);
        });
    }
    
    nextLi.appendChild(nextLink);
    ul.appendChild(nextLi);
    
    // Adicionar paginação ao DOM
    nav.appendChild(ul);
    paginationElement.appendChild(nav);
    
    console.log('Paginação renderizada com sucesso');
}

// Função para atualizar controles de paginação
function updatePagination(currentPage, totalPages) {
    const paginationInfo = document.getElementById('paginationInfo');
    if (paginationInfo) {
        paginationInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    }
    
    // Atualizar botões de paginação
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (prevPageBtn) {
        prevPageBtn.disabled = currentPage <= 1;
    }
    
    if (nextPageBtn) {
        nextPageBtn.disabled = currentPage >= totalPages;
    }
}

// Exportar funções
export {
    showError,
    hideError,
    showSuccess,
    hideSuccess,
    showLoading,
    hideLoading,
    showDeleteModal,
    renderVeiculos,
    renderPagination,
    updatePagination
};
