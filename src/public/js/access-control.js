// Controle de acesso baseado em papéis
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando controle de acesso...');
    
    // Esconder todos os menus restritos imediatamente
    hideAllRestrictedMenus();
    
    // Verificar se o usuário está autenticado
    const userJson = localStorage.getItem('user');
    if (!userJson) {
        console.log('Usuário não autenticado, redirecionando para login...');
        window.location.href = '/login.html';
        return;
    }
    
    // Obter informações do usuário
    const user = JSON.parse(userJson);
    console.log('Usuário autenticado:', user);
    console.log('Papel do usuário:', user.role);
    
    // Aplicar controle de acesso baseado no papel
    applyRoleBasedAccess(user.role);
});

// Função para esconder todos os menus restritos
function hideAllRestrictedMenus() {
    console.log('Escondendo todos os menus restritos...');
    
    // Esconder menus de administrador
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = 'none';
    });
    
    // Esconder menus de cadastrador
    document.querySelectorAll('.cadastrador-only').forEach(el => {
        el.style.display = 'none';
    });
    
    // Esconder menu VEÍCULOS
    document.querySelectorAll('.veiculos-access').forEach(el => {
        el.style.display = 'none';
    });
    
    console.log('Todos os menus restritos foram escondidos');
}

// Função para aplicar controle de acesso baseado no papel
function applyRoleBasedAccess(role) {
    console.log('Aplicando controle de acesso para papel:', role);
    
    if (role === 'admin') {
        // Administradores têm acesso a tudo
        console.log('Usuário é admin - mostrando todos os menus');
        
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = '';
        });
        
        document.querySelectorAll('.cadastrador-only').forEach(el => {
            el.style.display = '';
        });
        
        document.querySelectorAll('.veiculos-access').forEach(el => {
            el.style.display = '';
        });
        
        console.log('Todos os menus foram exibidos para admin');
    }
    else if (role === 'cadastrador') {
        // Cadastradores têm acesso a menus específicos
        console.log('Usuário é cadastrador - mostrando menus específicos');
        
        document.querySelectorAll('.cadastrador-only').forEach(el => {
            el.style.display = '';
        });
        
        document.querySelectorAll('.veiculos-access').forEach(el => {
            el.style.display = '';
        });
        
        console.log('Menus de cadastrador foram exibidos');
    }
    else {
        // Usuários comuns não têm acesso a menus restritos
        console.log('Usuário comum - mantendo todos os menus restritos ocultos');
        // Não precisa fazer nada, pois os menus já estão ocultos
    }
}
