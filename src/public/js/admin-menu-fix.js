/**
 * Script para garantir que o menu VEÍCULOS esteja sempre visível para administradores
 * Este script é carregado por último para sobrescrever qualquer outra configuração
 */

(function() {
    console.log('Admin Menu Fix: Inicializando...');
    
    // Aplicar imediatamente
    fixAdminMenu();
    
    // Aplicar quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Admin Menu Fix: DOM carregado');
        fixAdminMenu();
        
        // Aplicar periodicamente para garantir que o menu esteja sempre visível
        setInterval(fixAdminMenu, 500);
    });
    
    // Aplicar após um pequeno delay
    setTimeout(fixAdminMenu, 100);
    setTimeout(fixAdminMenu, 300);
    setTimeout(fixAdminMenu, 1000);
})();

/**
 * Garante que o menu VEÍCULOS esteja visível para administradores
 */
function fixAdminMenu() {
    try {
        // Verificar o papel do usuário
        let userRole = '';
        const userJson = localStorage.getItem('user');
        
        if (userJson) {
            try {
                const user = JSON.parse(userJson);
                userRole = user.role;
                console.log('Admin Menu Fix: Papel do usuário:', userRole);
            } catch (error) {
                console.error('Admin Menu Fix: Erro ao analisar dados do usuário', error);
                return;
            }
        } else {
            console.log('Admin Menu Fix: Nenhum usuário encontrado');
            return;
        }
        
        // Se o usuário for admin, garantir que o menu VEÍCULOS esteja visível
        if (userRole === 'admin') {
            console.log('Admin Menu Fix: Usuário é admin, garantindo que o menu VEÍCULOS esteja visível');
            
            // Mostrar o menu VEÍCULOS para admin
            document.querySelectorAll('.admin-only, .cadastrador-only, .veiculos-access').forEach(function(el) {
                console.log('Admin Menu Fix: Mostrando elemento:', el);
                el.style.display = '';
                el.style.visibility = 'visible';
                el.classList.remove('d-none');
            });
            
            // Garantir que o dropdown de VEÍCULOS esteja visível
            const veiculosDropdown = document.getElementById('veiculosDropdown');
            if (veiculosDropdown) {
                console.log('Admin Menu Fix: Encontrou o dropdown de VEÍCULOS');
                
                // Garantir que o elemento e seus pais estejam visíveis
                let element = veiculosDropdown;
                while (element && element.tagName !== 'BODY') {
                    console.log('Admin Menu Fix: Tornando elemento visível:', element);
                    element.style.display = '';
                    element.style.visibility = 'visible';
                    element.classList.remove('d-none');
                    element = element.parentNode;
                }
            } else {
                console.log('Admin Menu Fix: Dropdown de VEÍCULOS não encontrado');
            }
        }
    } catch (error) {
        console.error('Admin Menu Fix: Erro ao aplicar fix', error);
    }
}
