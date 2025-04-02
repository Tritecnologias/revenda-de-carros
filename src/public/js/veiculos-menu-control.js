/**
 * Script para controlar o acesso ao menu VEÍCULOS
 * Esta é uma solução definitiva que garante que o menu VEÍCULOS
 * só seja visível para usuários com papel "admin" ou "cadastrador"
 */

// Executar imediatamente quando o script for carregado
(function() {
    console.log('Veículos Menu Control: Inicializando...');
    
    // Aplicar controle imediatamente
    applyVeiculosMenuControl();
    
    // Aplicar novamente quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Veículos Menu Control: DOM carregado');
        applyVeiculosMenuControl();
        
        // Aplicar periodicamente para garantir que o menu não apareça
        setInterval(applyVeiculosMenuControl, 1000);
    });
    
    // Aplicar após um pequeno delay
    setTimeout(applyVeiculosMenuControl, 500);
})();

/**
 * Aplica o controle de acesso ao menu VEÍCULOS
 */
function applyVeiculosMenuControl() {
    try {
        // Verificar o papel do usuário
        let userRole = '';
        const userJson = localStorage.getItem('user');
        
        if (userJson) {
            try {
                const user = JSON.parse(userJson);
                userRole = user.role;
                console.log('Veículos Menu Control: Papel do usuário:', userRole);
            } catch (error) {
                console.error('Veículos Menu Control: Erro ao analisar dados do usuário', error);
            }
        }
        
        // Se o usuário for admin ou cadastrador, garantir que o menu VEÍCULOS esteja visível
        if (userRole === 'admin' || userRole === 'cadastrador') {
            console.log('Veículos Menu Control: Usuário é admin ou cadastrador, garantindo que o menu VEÍCULOS esteja visível');
            
            // Mostrar o menu VEÍCULOS para admin/cadastrador
            document.querySelectorAll('.admin-only, .cadastrador-only').forEach(function(el) {
                el.style.display = '';
            });
            
            // Garantir que o dropdown de VEÍCULOS esteja visível
            const veiculosDropdown = document.getElementById('veiculosDropdown');
            if (veiculosDropdown) {
                const menuItem = veiculosDropdown.closest('.nav-item');
                if (menuItem) {
                    console.log('Veículos Menu Control: Tornando o menu VEÍCULOS visível');
                    menuItem.style.display = '';
                }
            }
            
            // Garantir que todos os itens com "veiculo" no href estejam visíveis
            document.querySelectorAll('a[href*="veiculo"]').forEach(function(el) {
                const menuItem = el.closest('.dropdown-item') || el.closest('li') || el.parentNode;
                if (menuItem) {
                    console.log('Veículos Menu Control: Tornando link para veículos visível');
                    menuItem.style.display = '';
                }
            });
        } else {
            console.log('Veículos Menu Control: Usuário comum, removendo menu VEÍCULOS');
            
            // Remover todos os elementos relacionados ao menu VEÍCULOS
            
            // 1. Remover por ID
            const veiculosDropdown = document.getElementById('veiculosDropdown');
            if (veiculosDropdown) {
                const menuItem = veiculosDropdown.closest('.nav-item');
                if (menuItem) {
                    console.log('Veículos Menu Control: Menu VEÍCULOS encontrado por ID, removendo...');
                    menuItem.remove();
                }
            }
            
            // 2. Remover por texto
            document.querySelectorAll('a, button').forEach(function(el) {
                if (el.textContent && el.textContent.trim() === 'VEÍCULOS') {
                    const menuItem = el.closest('.nav-item') || el.closest('li') || el.parentNode;
                    if (menuItem) {
                        console.log('Veículos Menu Control: Menu VEÍCULOS encontrado por texto, removendo...');
                        menuItem.remove();
                    }
                }
            });
            
            // 3. Remover por classe
            document.querySelectorAll('.veiculos-menu, .veiculos-access').forEach(function(el) {
                console.log('Veículos Menu Control: Menu VEÍCULOS encontrado por classe, removendo...');
                el.remove();
            });
            
            // 4. Remover por href
            document.querySelectorAll('a[href*="veiculo"]').forEach(function(el) {
                const menuItem = el.closest('.dropdown-item') || el.closest('li') || el.parentNode;
                if (menuItem) {
                    console.log('Veículos Menu Control: Link para veículos encontrado, removendo...');
                    menuItem.remove();
                }
            });
            
            // 5. Remover dropdown menu que contém links para veículos
            document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
                const veiculosLinks = menu.querySelectorAll('a[href*="veiculo"]');
                if (veiculosLinks.length > 0) {
                    const dropdown = menu.closest('.dropdown');
                    if (dropdown) {
                        console.log('Veículos Menu Control: Dropdown com links para veículos encontrado, removendo...');
                        dropdown.remove();
                    }
                }
            });
            
            // 6. Redirecionar para usuario.html se estiver na página principal
            const currentPath = window.location.pathname;
            if ((currentPath === '/' || currentPath === '/index.html') && window.location.href.indexOf('redirected=true') === -1) {
                console.log('Veículos Menu Control: Usuário comum na página principal, redirecionando...');
                window.location.href = '/usuario.html?redirected=true';
            }
        }
    } catch (error) {
        console.error('Veículos Menu Control: Erro ao aplicar controle', error);
    }
}
