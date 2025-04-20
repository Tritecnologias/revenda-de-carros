/**
 * URL Fixer - Script para corrigir URLs absolutas em chamadas à API
 * Este script deve ser incluído em todas as páginas HTML após config.js
 * e antes de qualquer outro script que faça chamadas à API.
 * 
 * IMPORTANTE: Esta versão foi atualizada para trabalhar em conjunto com config.js
 * e seu sistema de fallback resiliente.
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
    
    // Salvar a implementação original do fetch
    const originalFetch = window.fetch;
    
    // Sobrescrever o método fetch para interceptar e corrigir chamadas à API
    window.fetch = function(url, options) {
        let fixedUrl = url;
        
        // Corrigir URLs absolutas para localhost
        if (typeof url === 'string' && (url.startsWith('http://localhost:') || url.startsWith('https://localhost:'))) {
            // Extrair o caminho da URL (remover http://localhost:3000)
            fixedUrl = url.replace(/https?:\/\/localhost:[0-9]+/, '');
            console.log(`URL Fixer: Convertendo URL absoluta para relativa: ${url} -> ${fixedUrl}`);
        }
        
        // Corrigir rotas conhecidas incorretas usando a função do config.js
        if (typeof config.fixApiUrl === 'function') {
            fixedUrl = config.fixApiUrl(fixedUrl);
        }
        
        // Correção adicional para rotas de versões que podem estar retornando 404
        if (typeof fixedUrl === 'string' && fixedUrl.includes('/api/versoes/public')) {
            console.log(`URL Fixer: Detectada rota problemática: ${fixedUrl}`);
            // Não modificar a URL aqui, deixar o sistema de fallback lidar com isso
        }
        
        // Chamar o fetch original com a URL corrigida
        return originalFetch(fixedUrl, options);
    };
    
    console.log('URL Fixer: Método fetch sobrescrito com sucesso');
    console.log('URL Fixer: Inicialização concluída');
})();
