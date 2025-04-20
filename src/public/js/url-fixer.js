/**
 * URL Fixer - Script para corrigir URLs absolutas em chamadas à API
 * Este script deve ser incluído em todas as páginas HTML após config.js
 * e antes de qualquer outro script que faça chamadas à API.
 */

(function() {
    console.log('URL Fixer: Inicializando...');
    
    // Verificar se config está disponível
    if (typeof config === 'undefined') {
        console.error('URL Fixer: config.js não está carregado. Certifique-se de incluir config.js antes deste arquivo.');
        return;
    }
    
    // Detectar ambiente
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    console.log('URL Fixer: Ambiente detectado:', isProduction ? 'Produção' : 'Desenvolvimento');
    
    // Se estiver em produção, monitorar e corrigir chamadas fetch
    if (isProduction) {
        console.log('URL Fixer: Aplicando correções para ambiente de produção');
        
        // Salvar a implementação original do fetch
        const originalFetch = window.fetch;
        
        // Sobrescrever o método fetch para interceptar chamadas com URLs absolutas
        window.fetch = function(url, options) {
            // Verificar se a URL é absoluta e começa com http://localhost
            if (typeof url === 'string' && (url.startsWith('http://localhost:') || url.startsWith('https://localhost:'))) {
                // Extrair o caminho da URL (remover http://localhost:3000)
                const path = url.replace(/https?:\/\/localhost:[0-9]+/, '');
                console.log(`URL Fixer: Convertendo URL absoluta para relativa: ${url} -> ${path}`);
                
                // Chamar o fetch original com a URL relativa
                return originalFetch(path, options);
            }
            
            // Se não for uma URL absoluta para localhost, chamar o fetch original
            return originalFetch(url, options);
        };
        
        console.log('URL Fixer: Método fetch sobrescrito com sucesso');
    }
    
    console.log('URL Fixer: Inicialização concluída');
})();
