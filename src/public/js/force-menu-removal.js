/**
 * Script para remover forçadamente o menu VEÍCULOS para usuários comuns
 * Esta é uma solução definitiva que usa várias técnicas para garantir que o menu não apareça
 */

// Executar imediatamente
(function() {
    console.log('🛡️ Force Menu Removal: Iniciando...');
    
    // Função para remover completamente o menu VEÍCULOS
    function forceRemoveVeiculosMenu() {
        // Obter o papel do usuário
        let userRole = '';
        
        try {
            const userJson = localStorage.getItem('user');
            if (userJson) {
                const user = JSON.parse(userJson);
                userRole = user.role;
                console.log('🛡️ Force Menu Removal: Papel do usuário:', userRole);
            }
        } catch (error) {
            console.error('🛡️ Force Menu Removal: Erro ao obter papel do usuário:', error);
            return;
        }
        
        // Se não for admin ou cadastrador, remover o menu VEÍCULOS
        if (userRole !== 'admin' && userRole !== 'cadastrador') {
            console.log('🛡️ Force Menu Removal: Usuário comum, removendo menu VEÍCULOS');
            
            // 1. Remover elementos com a classe veiculos-access
            document.querySelectorAll('.veiculos-access').forEach(function(element) {
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                    console.log('🛡️ Force Menu Removal: Elemento veiculos-access removido');
                }
            });
            
            // 2. Remover elementos que contêm "VEÍCULOS" no texto
            document.querySelectorAll('a, button, li').forEach(function(element) {
                if (element.textContent && element.textContent.includes('VEÍCULOS')) {
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                        console.log('🛡️ Force Menu Removal: Elemento com texto VEÍCULOS removido');
                    }
                }
            });
            
            // 3. Remover elementos dropdown que podem conter o menu VEÍCULOS
            document.querySelectorAll('.dropdown').forEach(function(element) {
                const dropdownToggle = element.querySelector('.dropdown-toggle');
                if (dropdownToggle && dropdownToggle.textContent && dropdownToggle.textContent.includes('VEÍCULOS')) {
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                        console.log('🛡️ Force Menu Removal: Dropdown VEÍCULOS removido');
                    }
                }
            });
            
            console.log('🛡️ Force Menu Removal: Remoção do menu VEÍCULOS concluída');
            
            // 4. Redirecionar para a página de usuário se estiver na página principal
            if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                console.log('🛡️ Force Menu Removal: Redirecionando para página de usuário');
                window.location.href = '/usuario.html';
            }
        } else {
            console.log('🛡️ Force Menu Removal: Usuário é admin ou cadastrador, mantendo menu VEÍCULOS');
        }
    }
    
    // Remover o menu imediatamente
    forceRemoveVeiculosMenu();
    
    // Remover o menu quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🛡️ Force Menu Removal: DOM carregado');
        forceRemoveVeiculosMenu();
    });
    
    // Remover o menu após um pequeno delay
    setTimeout(forceRemoveVeiculosMenu, 500);
    setTimeout(forceRemoveVeiculosMenu, 1000);
    setTimeout(forceRemoveVeiculosMenu, 2000);
    
    // Verificar periodicamente
    setInterval(forceRemoveVeiculosMenu, 5000);
    
    // Observar mudanças no DOM
    const observer = new MutationObserver(function() {
        console.log('🛡️ Force Menu Removal: Mudança no DOM detectada');
        forceRemoveVeiculosMenu();
    });
    
    // Iniciar observação quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', function() {
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('🛡️ Force Menu Removal: Observador de DOM iniciado');
    });
})();
