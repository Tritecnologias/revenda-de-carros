/**
 * Controle final de acesso baseado em papel do usuário
 * Esta abordagem é simples e direta, sem complexidades
 */

// Executar imediatamente
(function() {
    console.log('Final Role Control: Iniciando...');
    
    // Aplicar controle de papel imediatamente
    applyRoleControl();
    
    // Aplicar novamente quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Final Role Control: DOM carregado');
        applyRoleControl();
    });
    
    // Aplicar novamente após um pequeno delay
    setTimeout(applyRoleControl, 500);
    setTimeout(applyRoleControl, 1000);
})();

/**
 * Aplica o controle de acesso baseado no papel do usuário
 */
function applyRoleControl() {
    try {
        // Obter o usuário do localStorage
        const userJson = localStorage.getItem('user');
        if (!userJson) {
            console.log('Final Role Control: Nenhum usuário encontrado');
            return;
        }
        
        const user = JSON.parse(userJson);
        console.log('Final Role Control: Usuário encontrado', user);
        
        if (!user.role) {
            console.log('Final Role Control: Usuário sem papel definido');
            return;
        }
        
        console.log('Final Role Control: Papel do usuário:', user.role);
        
        // Adicionar classe ao body para controle via CSS
        document.body.classList.add('role-' + user.role);
        
        // Se o usuário não for admin ou cadastrador, remover menu VEÍCULOS
        if (user.role !== 'admin' && user.role !== 'cadastrador') {
            console.log('Final Role Control: Removendo menu VEÍCULOS para usuário comum');
            
            // Remover o menu VEÍCULOS do DOM
            const veiculosMenus = document.querySelectorAll('.dropdown');
            veiculosMenus.forEach(function(menu) {
                const toggleLink = menu.querySelector('.dropdown-toggle');
                if (toggleLink && toggleLink.textContent && toggleLink.textContent.includes('VEÍCULOS')) {
                    console.log('Final Role Control: Menu VEÍCULOS encontrado, removendo...');
                    menu.remove();
                }
            });
            
            // Remover também pelo ID
            const veiculosDropdown = document.getElementById('veiculosDropdown');
            if (veiculosDropdown) {
                const menuItem = veiculosDropdown.closest('.nav-item');
                if (menuItem) {
                    console.log('Final Role Control: Menu VEÍCULOS encontrado pelo ID, removendo...');
                    menuItem.remove();
                }
            }
            
            // Remover também pelo ID mobile
            const mobileVeiculosDropdown = document.getElementById('mobileVeiculosDropdown');
            if (mobileVeiculosDropdown) {
                const menuItem = mobileVeiculosDropdown.closest('.nav-item');
                if (menuItem) {
                    console.log('Final Role Control: Menu VEÍCULOS mobile encontrado pelo ID, removendo...');
                    menuItem.remove();
                }
            }
            
            // Remover qualquer elemento com texto VEÍCULOS
            document.querySelectorAll('a, button, span').forEach(function(element) {
                if (element.textContent && element.textContent.trim() === 'VEÍCULOS') {
                    const menuItem = element.closest('.nav-item');
                    if (menuItem) {
                        console.log('Final Role Control: Elemento com texto VEÍCULOS encontrado, removendo...');
                        menuItem.remove();
                    }
                }
            });
        }
    } catch (error) {
        console.error('Final Role Control: Erro ao processar usuário', error);
    }
}
