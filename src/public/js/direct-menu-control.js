/**
 * Controle direto de menus - abordagem radical
 * Este script usa o método mais direto possível para remover o menu VEÍCULOS
 */

// Executar imediatamente
(function() {
    console.log('⚡ Direct Menu Control: Iniciando...');
    
    // Função para verificar e remover o menu a cada 100ms
    function checkAndRemoveMenu() {
        // Obter o papel do usuário
        let userRole = 'user'; // Papel padrão
        
        try {
            const userJson = localStorage.getItem('user');
            if (userJson) {
                const user = JSON.parse(userJson);
                userRole = user.role;
                console.log('⚡ Direct Menu Control: Papel do usuário:', userRole);
            }
        } catch (error) {
            console.error('⚡ Direct Menu Control: Erro ao obter papel do usuário:', error);
        }
        
        // Se não for admin ou cadastrador, remover o menu VEÍCULOS
        if (userRole !== 'admin' && userRole !== 'cadastrador') {
            console.log('⚡ Direct Menu Control: Removendo menu VEÍCULOS para usuário comum');
            
            // Remover do menu mobile
            const mobileVeiculosItem = document.querySelector('#mobileNav .veiculos-access');
            if (mobileVeiculosItem) {
                mobileVeiculosItem.remove();
                console.log('⚡ Direct Menu Control: Menu VEÍCULOS mobile removido');
            }
            
            // Remover do menu desktop
            const desktopVeiculosItem = document.querySelector('.bg-primary.d-none.d-lg-block .veiculos-access');
            if (desktopVeiculosItem) {
                desktopVeiculosItem.remove();
                console.log('⚡ Direct Menu Control: Menu VEÍCULOS desktop removido');
            }
            
            // Remover qualquer outro elemento com a classe veiculos-access
            document.querySelectorAll('.veiculos-access').forEach(function(element) {
                element.remove();
                console.log('⚡ Direct Menu Control: Elemento adicional com classe veiculos-access removido');
            });
        }
    }
    
    // Verificar e remover o menu imediatamente
    checkAndRemoveMenu();
    
    // Verificar e remover o menu a cada 100ms
    setInterval(checkAndRemoveMenu, 100);
    
    // Verificar quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', function() {
        console.log('⚡ Direct Menu Control: DOM carregado');
        checkAndRemoveMenu();
    });
    
    // Verificar após um pequeno delay
    setTimeout(checkAndRemoveMenu, 500);
    setTimeout(checkAndRemoveMenu, 1000);
    setTimeout(checkAndRemoveMenu, 2000);
})();
