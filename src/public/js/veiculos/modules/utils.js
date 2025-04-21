/**
 * Módulo Utils - Funções utilitárias
 * Este módulo contém funções utilitárias para formatação, conversão e outras operações comuns
 */

// Função para formatar preço em reais
function formatarPreco(preco) {
    if (preco === null || preco === undefined || isNaN(preco)) {
        return 'R$ 0,00';
    }
    
    // Converter para número se for string
    if (typeof preco === 'string') {
        preco = parseFloat(preco.replace(/[^\d,.-]/g, '').replace(',', '.'));
    }
    
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(preco);
}

// Função para converter valores formatados para números
function converterParaNumero(valor) {
    if (!valor) return 0;
    return parseFloat(valor.replace(/[^\d,.-]/g, '').replace(',', '.'));
}

// Função para formatar valor monetário (sem precisar de um elemento DOM)
function formatarValorMonetario(valor) {
    if (!valor) return '';
    
    // Remover todos os caracteres não numéricos, exceto vírgula e ponto
    valor = valor.replace(/[^\d,.-]/g, '');
    
    // Converter para número
    let numero = parseFloat(valor.replace(',', '.'));
    
    // Verificar se é um número válido
    if (isNaN(numero)) return '';
    
    // Formatar como moeda brasileira
    return formatarPreco(numero);
}

// Função para formatar situação com classe de badge
function getSituacaoBadgeClass(situacao) {
    switch (situacao?.toLowerCase()) {
        case 'disponível':
        case 'disponivel':
        case 'disponível para venda':
        case 'disponivel para venda':
            return 'badge-success text-dark';
        case 'vendido':
        case 'vendido ao cliente':
            return 'badge-danger';
        case 'reservado':
        case 'em negociação':
        case 'em negociacao':
            return 'badge-warning';
        default:
            return 'badge-secondary';
    }
}

// Função para formatar texto da situação
function getSituacaoText(situacao) {
    switch (situacao?.toLowerCase()) {
        case 'disponível':
        case 'disponivel':
        case 'disponível para venda':
        case 'disponivel para venda':
            return 'Disponível';
        case 'vendido':
        case 'vendido ao cliente':
            return 'Vendido';
        case 'reservado':
        case 'em negociação':
        case 'em negociacao':
            return 'Reservado';
        default:
            return situacao || 'Não informado';
    }
}

// Função para obter token de autenticação
function getToken() {
    return localStorage.getItem('token');
}

// Função para verificar se o usuário está autenticado
function isAuthenticated() {
    return !!getToken();
}

// Função para redirecionar para a página de login
function redirectToLogin() {
    window.location.href = '/login.html';
}

// Exportar funções
export {
    formatarPreco,
    converterParaNumero,
    formatarValorMonetario,
    getSituacaoBadgeClass,
    getSituacaoText,
    getToken,
    isAuthenticated,
    redirectToLogin
};
