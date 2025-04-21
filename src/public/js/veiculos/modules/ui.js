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

// Função para mostrar modal de exclusão
function showDeleteModal(id) {
    const modal = document.getElementById('deleteModal');
    const confirmBtn = document.getElementById('confirmDelete');
    
    if (modal && confirmBtn) {
        // Definir o ID do veículo a ser excluído
        confirmBtn.setAttribute('data-id', id);
        
        // Mostrar o modal
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    }
}

// Função para renderizar veículos na tabela
function renderVeiculos(data) {
    console.log('Renderizando veículos:', data);
    
    const tableBody = document.getElementById('veiculosTableBody');
    if (!tableBody) {
        console.error('Elemento tableBody não encontrado');
        return;
    }
    
    // Limpar tabela
    tableBody.innerHTML = '';
    
    // Verificar se temos dados
    if (!data || !data.items || data.items.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="8" class="text-center">Nenhum veículo encontrado</td>';
        tableBody.appendChild(tr);
        return;
    }
    
    // Renderizar cada veículo
    data.items.forEach(veiculo => {
        const tr = document.createElement('tr');
        
        // Formatar situação com badge
        const situacaoBadgeClass = getSituacaoBadgeClass(veiculo.situacao);
        const situacaoText = getSituacaoText(veiculo.situacao);
        
        // Construir HTML da linha
        tr.innerHTML = `
            <td>${veiculo.id}</td>
            <td>${veiculo.marca?.nome || 'N/A'}</td>
            <td>${veiculo.modelo?.nome || 'N/A'}</td>
            <td>${veiculo.versao?.nome_versao || 'N/A'}</td>
            <td>${veiculo.ano || 'N/A'}</td>
            <td>${formatarPreco(veiculo.preco)}</td>
            <td><span class="badge ${situacaoBadgeClass}">${situacaoText}</span></td>
            <td>
                <button class="btn btn-sm btn-primary edit-btn" data-id="${veiculo.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${veiculo.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        // Adicionar event listeners para os botões
        const editBtn = tr.querySelector('.edit-btn');
        const deleteBtn = tr.querySelector('.delete-btn');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                window.editVeiculo(veiculo.id);
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                window.showDeleteModal(veiculo.id);
            });
        }
        
        // Adicionar linha à tabela
        tableBody.appendChild(tr);
    });
}

// Função para renderizar a paginação
function renderPagination(data) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) {
        console.error('Elemento pagination não encontrado');
        return;
    }
    
    // Limpar paginação
    paginationContainer.innerHTML = '';
    
    // Verificar se temos dados
    if (!data || !data.totalPages || data.totalPages <= 1) {
        return;
    }
    
    // Obter página atual e total de páginas
    const currentPage = parseInt(data.page) || 1;
    const totalPages = parseInt(data.totalPages) || 1;
    
    // Criar elemento de paginação
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Paginação');
    
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
    
    // Páginas
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
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
    
    nav.appendChild(ul);
    paginationContainer.appendChild(nav);
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
    showDeleteModal,
    renderVeiculos,
    renderPagination,
    updatePagination
};
