/**
 * Script para corrigir definitivamente o problema de acesso ao menu VEÍCULOS
 * Este script deve ser incluído como o primeiro script na página
 */

// Executar imediatamente quando o script for carregado
(function() {
    console.log('🔒 Script de correção de acesso carregado');
    
    // Esconder todos os menus restritos imediatamente
    hideAllMenus();
    
    // Verificar periodicamente para garantir que os menus permaneçam corretamente configurados
    setInterval(function() {
        const user = getUserFromLocalStorage();
        if (user) {
            applyMenuAccess(user.role);
        } else {
            hideAllMenus();
        }
    }, 1000); // Verificar a cada segundo
    
    // Adicionar listener para quando o DOM estiver completamente carregado
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🔒 DOM carregado - aplicando controle de acesso');
        const user = getUserFromLocalStorage();
        if (user) {
            applyMenuAccess(user.role);
        } else {
            hideAllMenus();
        }
        
        // Adicionar listener para mudanças no localStorage
        window.addEventListener('storage', function(e) {
            if (e.key === 'user') {
                console.log('🔒 Usuário alterado no localStorage - atualizando menus');
                const user = getUserFromLocalStorage();
                if (user) {
                    applyMenuAccess(user.role);
                } else {
                    hideAllMenus();
                }
            }
        });
    });
})();

/**
 * Obtém o usuário do localStorage
 */
function getUserFromLocalStorage() {
    try {
        const userJson = localStorage.getItem('user');
        if (!userJson) return null;
        return JSON.parse(userJson);
    } catch (error) {
        console.error('🔒 Erro ao obter usuário do localStorage:', error);
        return null;
    }
}

/**
 * Esconde todos os menus restritos
 */
function hideAllMenus() {
    console.log('🔒 Escondendo todos os menus restritos');
    
    // Usar display: none !important para garantir que os menus fiquem ocultos
    const styleToApply = 'display: none !important';
    
    // Esconder elementos de admin
    document.querySelectorAll('.admin-only').forEach(function(element) {
        element.setAttribute('style', styleToApply);
    });
    
    // Esconder elementos de cadastrador
    document.querySelectorAll('.cadastrador-only').forEach(function(element) {
        element.setAttribute('style', styleToApply);
    });
    
    // Esconder elementos de veículos
    document.querySelectorAll('.veiculos-access').forEach(function(element) {
        element.setAttribute('style', styleToApply);
    });
}

/**
 * Aplica o controle de acesso baseado no papel do usuário
 */
function applyMenuAccess(role) {
    console.log('🔒 Aplicando controle de acesso para papel:', role);
    
    // Primeiro, esconder todos os menus restritos
    hideAllMenus();
    
    // Depois, mostrar apenas os menus permitidos para o papel
    if (role === 'admin') {
        console.log('🔒 Usuário é admin - mostrando todos os menus');
        showMenusForAdmin();
    } 
    else if (role === 'cadastrador') {
        console.log('🔒 Usuário é cadastrador - mostrando menus específicos');
        showMenusForCadastrador();
    }
    else {
        console.log('🔒 Usuário comum - mantendo menus restritos ocultos');
        // Não fazer nada, pois os menus já estão ocultos
    }
}

/**
 * Mostra os menus para administradores
 */
function showMenusForAdmin() {
    // Usar display: block !important para garantir que os menus fiquem visíveis
    const styleToApply = 'display: block !important';
    
    // Mostrar elementos de admin
    document.querySelectorAll('.admin-only').forEach(function(element) {
        element.setAttribute('style', styleToApply);
    });
    
    // Mostrar elementos de cadastrador
    document.querySelectorAll('.cadastrador-only').forEach(function(element) {
        element.setAttribute('style', styleToApply);
    });
    
    // Mostrar elementos de veículos
    document.querySelectorAll('.veiculos-access').forEach(function(element) {
        element.setAttribute('style', styleToApply);
    });
}

/**
 * Mostra os menus para cadastradores
 */
function showMenusForCadastrador() {
    // Usar display: block !important para garantir que os menus fiquem visíveis
    const styleToApply = 'display: block !important';
    
    // Mostrar elementos de cadastrador
    document.querySelectorAll('.cadastrador-only').forEach(function(element) {
        element.setAttribute('style', styleToApply);
    });
    
    // Mostrar elementos de veículos
    document.querySelectorAll('.veiculos-access').forEach(function(element) {
        element.setAttribute('style', styleToApply);
    });
}
