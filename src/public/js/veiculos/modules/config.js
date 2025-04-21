/**
 * Módulo Config - Configurações para o módulo de veículos
 * Este módulo contém configurações específicas para o módulo de veículos
 */

// Função para obter a URL base com base no ambiente atual
function getBaseUrl() {
    const currentUrl = window.location.href;
    return currentUrl.includes('69.62.91.195') ? 'http://69.62.91.195:3000' : '';
}

// Configurações da API
const apiConfig = {
    baseUrl: getBaseUrl(),
    endpoints: {
        marcas: '/api/veiculos/marcas',
        modelos: '/api/veiculos/modelos',
        versoes: '/api/versoes/public',
        veiculos: '/api/veiculos'
    },
    fallbackEndpoints: {
        marcas: ['/api/marcas', '/api/veiculos/marcas'],
        modelos: ['/api/modelos', '/api/veiculos/modelos'],
        versoes: ['/api/versoes', '/api/veiculos/versoes'],
        veiculos: ['/api/veiculos', '/api/veiculos/list']
    }
};

// Configurações de paginação
const paginationConfig = {
    itemsPerPage: 10,
    maxPagesToShow: 5
};

// Exportar configurações
export {
    getBaseUrl,
    apiConfig,
    paginationConfig
};
