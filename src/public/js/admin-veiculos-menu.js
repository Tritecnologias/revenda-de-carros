/**
 * Script para gerenciar o menu VEÍCULOS para administradores
 * Este script garante que o menu VEÍCULOS esteja visível apenas para administradores
 */

// Executar imediatamente
(function() {
    console.log('Admin Veículos Menu: Inicializando...');
    
    // Executar quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Admin Veículos Menu: DOM carregado');
        controlVeiculosMenu();
    });
    
    // Executar após um pequeno delay
    setTimeout(controlVeiculosMenu, 100);
    setTimeout(controlVeiculosMenu, 500);
    setTimeout(controlVeiculosMenu, 1000);
})();

/**
 * Controla a visibilidade do menu VEÍCULOS com base no papel do usuário
 */
function controlVeiculosMenu() {
    try {
        // Obter o usuário atual
        const userJson = localStorage.getItem('user');
        if (!userJson) {
            console.log('Admin Veículos Menu: Nenhum usuário encontrado');
            return;
        }
        
        const user = JSON.parse(userJson);
        console.log('Admin Veículos Menu: Usuário:', user);
        
        // Obter o menu VEÍCULOS
        const veiculosMenu = document.getElementById('veiculosMenuContainer');
        if (!veiculosMenu) {
            console.log('Admin Veículos Menu: Menu VEÍCULOS não encontrado');
            return;
        }
        
        // Controlar a visibilidade do menu com base no papel do usuário
        if (user.role === 'admin') {
            console.log('Admin Veículos Menu: Usuário é administrador, exibindo menu VEÍCULOS');
            veiculosMenu.style.display = '';
            veiculosMenu.style.visibility = 'visible';
        } else {
            console.log('Admin Veículos Menu: Usuário não é administrador, ocultando menu VEÍCULOS');
            veiculosMenu.style.display = 'none';
        }
    } catch (error) {
        console.error('Admin Veículos Menu: Erro ao controlar menu VEÍCULOS', error);
    }
}
