/**
 * Módulo Table - Funções para manipulação de tabelas
 * Este módulo contém funções para manipulação de tabelas de veículos
 */

import { loadVeiculos } from './api.js';
import { renderVeiculos, renderPagination, showError } from './ui.js';

// Variável para armazenar a página atual
let currentPage = 1;

// Função para carregar veículos na tabela
async function loadVeiculosTable(page = 1) {
    try {
        console.log(`Carregando veículos da página ${page}...`);
        
        // Mostrar indicador de carregamento
        const tableBody = document.getElementById('veiculosTableBody');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Carregando...</td></tr>';
        }
        
        // Atualizar página atual
        currentPage = page;
        
        // Carregar veículos
        const data = await loadVeiculos(page);
        
        // Renderizar veículos na tabela
        renderVeiculos(data);
        
        // Renderizar paginação
        renderPagination(data);
        
        return data;
    } catch (error) {
        console.error('Erro ao carregar veículos na tabela:', error);
        
        // Mostrar mensagem de erro na tabela
        const tableBody = document.getElementById('veiculosTableBody');
        if (tableBody) {
            tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Erro ao carregar veículos: ${error.message}</td></tr>`;
        }
        
        // Mostrar mensagem de erro
        showError(`Erro ao carregar veículos: ${error.message}`);
        
        // Retornar objeto vazio para evitar erros
        return { items: [], page: 1, totalPages: 1 };
    }
}

// Função para mudar de página
async function changePage(page) {
    try {
        // Validar página
        if (page < 1) {
            console.warn('Página inválida:', page);
            return;
        }
        
        // Carregar veículos da página
        await loadVeiculosTable(page);
        
        // Rolar para o topo
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('Erro ao mudar de página:', error);
        showError(`Erro ao mudar de página: ${error.message}`);
    }
}

// Função para ir para a página anterior
async function prevPage() {
    if (currentPage > 1) {
        await changePage(currentPage - 1);
    }
}

// Função para ir para a próxima página
async function nextPage() {
    await changePage(currentPage + 1);
}

// Função para atualizar a tabela
async function refreshTable() {
    await loadVeiculosTable(currentPage);
}

// Função para inicializar a tabela
async function initTable() {
    try {
        // Carregar veículos da primeira página
        await loadVeiculosTable(1);
        
        // Adicionar event listeners para botões de paginação
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', prevPage);
        }
        
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', nextPage);
        }
    } catch (error) {
        console.error('Erro ao inicializar tabela:', error);
        showError(`Erro ao inicializar tabela: ${error.message}`);
    }
}

// Exportar funções
export {
    loadVeiculosTable,
    changePage,
    prevPage,
    nextPage,
    refreshTable,
    initTable
};
