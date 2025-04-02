/**
 * Controle de acesso aos menus baseado no papel do usuário
 * Este script é responsável por controlar a visibilidade dos menus
 * com base no papel do usuário autenticado.
 */

// Executar imediatamente quando o script for carregado
(function() {
    console.log('Script de controle de menus carregado');
    
    // Esconder todos os menus restritos imediatamente
    hideAllRestrictedMenus();
    
    // Adicionar listener para quando o DOM estiver completamente carregado
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM carregado - iniciando controle de menus');
        applyRoleBasedMenuAccess();
    });
    
    // Também verificar após um pequeno delay (para garantir que outros scripts foram carregados)
    setTimeout(function() {
        console.log('Verificação com delay - garantindo controle de menus');
        applyRoleBasedMenuAccess();
    }, 500);
})();

/**
 * Esconde todos os menus restritos
 */
function hideAllRestrictedMenus() {
    console.log('Escondendo todos os menus restritos');
    
    // Selecionar todos os elementos com classes específicas
    const adminElements = document.querySelectorAll('.admin-only');
    const cadastradorElements = document.querySelectorAll('.cadastrador-only');
    const veiculosElements = document.querySelectorAll('.veiculos-access');
    
    // Esconder elementos de admin
    adminElements.forEach(function(element) {
        element.style.display = 'none';
    });
    
    // Esconder elementos de cadastrador
    cadastradorElements.forEach(function(element) {
        element.style.display = 'none';
    });
    
    // Esconder elementos de veículos
    veiculosElements.forEach(function(element) {
        element.style.display = 'none';
    });
    
    console.log(`Elementos ocultados: ${adminElements.length} admin, ${cadastradorElements.length} cadastrador, ${veiculosElements.length} veículos`);
}

/**
 * Aplica o controle de acesso baseado no papel do usuário
 */
function applyRoleBasedMenuAccess() {
    console.log('Aplicando controle de acesso baseado no papel');
    
    // Obter dados do usuário do localStorage
    const userJson = localStorage.getItem('user');
    
    if (!userJson) {
        console.log('Nenhum usuário encontrado no localStorage');
        return;
    }
    
    try {
        // Converter string JSON para objeto
        const user = JSON.parse(userJson);
        console.log('Usuário encontrado:', user);
        console.log('Papel do usuário:', user.role);
        
        // Aplicar regras baseadas no papel
        if (user.role === 'admin') {
            console.log('Usuário é admin - mostrando todos os menus');
            showMenusForRole('admin');
        } 
        else if (user.role === 'cadastrador') {
            console.log('Usuário é cadastrador - mostrando menus específicos');
            showMenusForRole('cadastrador');
        }
        else {
            console.log('Usuário comum - mantendo menus restritos ocultos');
            // Não fazer nada, pois os menus já estão ocultos
        }
    } catch (error) {
        console.error('Erro ao processar dados do usuário:', error);
    }
}

/**
 * Mostra os menus apropriados para o papel especificado
 */
function showMenusForRole(role) {
    if (role === 'admin') {
        // Administradores veem todos os menus
        document.querySelectorAll('.admin-only').forEach(function(element) {
            element.style.display = '';
        });
        
        document.querySelectorAll('.cadastrador-only').forEach(function(element) {
            element.style.display = '';
        });
        
        document.querySelectorAll('.veiculos-access').forEach(function(element) {
            element.style.display = '';
        });
        
        console.log('Todos os menus exibidos para admin');
    } 
    else if (role === 'cadastrador') {
        // Cadastradores veem apenas seus menus específicos
        document.querySelectorAll('.cadastrador-only').forEach(function(element) {
            element.style.display = '';
        });
        
        document.querySelectorAll('.veiculos-access').forEach(function(element) {
            element.style.display = '';
        });
        
        console.log('Menus de cadastrador exibidos');
    }
}
