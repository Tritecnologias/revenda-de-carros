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
    
    // Lista de rotas conhecidas e suas alternativas corretas
    const routeMappings = {
        // Rotas incorretas -> Rotas corretas
        '/api/veiculos/versoes/all': '/api/versoes/public',
        '/api/veiculos/versoes/': '/api/versoes/',
        '/api/veiculos/versoes/modelo/': '/api/versoes/modelo/',
        '/api/veiculos/versoes/by-modelo/': '/api/versoes/modelo/',
        '/api/marcas': '/api/veiculos/marcas/all',
        '/api/modelos/marca/': '/api/veiculos/modelos/by-marca/'
    };
    
    // Função para corrigir uma URL com base nos mapeamentos conhecidos
    function fixApiUrl(url) {
        if (typeof url !== 'string') return url;
        
        // Verificar cada mapeamento
        for (const [incorrectPath, correctPath] of Object.entries(routeMappings)) {
            if (url.includes(incorrectPath)) {
                const fixedUrl = url.replace(incorrectPath, correctPath);
                console.log(`URL Fixer: Corrigindo rota: ${url} -> ${fixedUrl}`);
                return fixedUrl;
            }
        }
        
        return url;
    }
    
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
        
        // Corrigir rotas conhecidas incorretas
        fixedUrl = fixApiUrl(fixedUrl);
        
        // Chamar o fetch original com a URL corrigida
        return originalFetch(fixedUrl, options);
    };
    
    console.log('URL Fixer: Método fetch sobrescrito com sucesso');
    console.log('URL Fixer: Inicialização concluída');
})();
