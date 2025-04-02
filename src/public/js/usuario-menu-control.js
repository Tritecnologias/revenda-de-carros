/**
 * Script para controlar a exibição do menu para usuários com função "usuario"
 * Garante que apenas o menu CONFIGURADOR seja exibido
 */

// Executar antes que o DOM esteja completamente carregado para evitar flash de outros menus
(function() {
    // Verificar se estamos na página usuario.html
    if (window.location.pathname === '/usuario.html') {
        console.log('Página usuario.html detectada, configurando menu único imediatamente');
        
        // Adicionar estilos CSS para esconder todos os menus exceto CONFIGURADOR
        const style = document.createElement('style');
        style.textContent = `
            /* Esconder temporariamente todos os menus até que possamos processar */
            #navbarNavBlue .navbar-nav li:not(:first-child),
            [href*="veiculo"], 
            [id*="veiculo"],
            .dropdown:has(a:contains("VEÍCULOS")),
            .dropdown-menu:has(a[href*="veiculo"]),
            .veiculos-access {
                display: none !important;
                visibility: hidden !important;
            }
        `;
        document.head.appendChild(style);
    }
})();

// Função principal quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando controle de menu para usuários');
    
    // Verificar se estamos na página usuario.html
    if (window.location.pathname === '/usuario.html') {
        console.log('Página usuario.html detectada, configurando menu único');
        
        // Função para garantir que apenas o menu CONFIGURADOR esteja visível
        function garantirMenuUnico() {
            // Selecionar o menu azul
            const navbarNav = document.querySelector('#navbarNavBlue .navbar-nav');
            if (!navbarNav) return;
            
            // Remover todos os itens do menu exceto o primeiro (CONFIGURADOR)
            const itensMenu = navbarNav.querySelectorAll('li:not(:first-child)');
            itensMenu.forEach(item => {
                item.remove();
            });
            
            // Verificar se o primeiro item é CONFIGURADOR, caso contrário, corrigir
            const primeiroItem = navbarNav.querySelector('li:first-child a');
            if (primeiroItem && primeiroItem.textContent.trim() !== 'CONFIGURADOR') {
                primeiroItem.textContent = 'CONFIGURADOR';
                primeiroItem.href = '/usuario.html';
            }
            
            // Esconder qualquer menu dropdown de VEÍCULOS
            document.querySelectorAll('.dropdown, .veiculos-access').forEach(el => {
                el.style.display = 'none';
            });
            
            console.log('Menu ajustado para mostrar apenas CONFIGURADOR');
        }
        
        // Executar imediatamente
        garantirMenuUnico();
        
        // Executar novamente após um pequeno atraso para garantir que outros scripts não alterem o menu
        setTimeout(garantirMenuUnico, 100);
        setTimeout(garantirMenuUnico, 500);
        
        // Observar mudanças no DOM que possam afetar o menu
        const observer = new MutationObserver(function(mutations) {
            garantirMenuUnico();
        });
        
        // Observar o menu para quaisquer mudanças
        const navbarNavBlue = document.getElementById('navbarNavBlue');
        if (navbarNavBlue) {
            observer.observe(navbarNavBlue, { 
                childList: true, 
                subtree: true
            });
        }
    }
});
