/**
 * Script para redirecionar usuários para páginas específicas com base em seus papéis
 * Esta abordagem evita problemas de visibilidade de menu ao separar completamente as interfaces
 */

// Executar imediatamente
(function() {
    console.log('🚀 Role Redirect: Iniciando verificação de papel do usuário');
    
    // Verificar se estamos na página principal
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        redirectBasedOnRole();
    }
    
    // Adicionar listener para quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Role Redirect: DOM carregado');
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            redirectBasedOnRole();
        }
    });
})();

/**
 * Redireciona o usuário com base em seu papel
 */
function redirectBasedOnRole() {
    // Obter dados do usuário do localStorage
    const userJson = localStorage.getItem('user');
    
    if (!userJson) {
        console.log('🚀 Role Redirect: Nenhum usuário encontrado, redirecionando para login');
        window.location.href = '/login.html';
        return;
    }
    
    try {
        // Converter string JSON para objeto
        const user = JSON.parse(userJson);
        console.log('🚀 Role Redirect: Usuário encontrado:', user);
        console.log('🚀 Role Redirect: Papel do usuário:', user.role);
        
        // Redirecionar com base no papel
        if (user.role === 'admin') {
            console.log('🚀 Role Redirect: Usuário é admin, redirecionando para página de admin');
            window.location.href = '/admin.html';
        } 
        else if (user.role === 'cadastrador') {
            console.log('🚀 Role Redirect: Usuário é cadastrador, redirecionando para página de cadastrador');
            window.location.href = '/cadastrador.html';
        }
        else {
            console.log('🚀 Role Redirect: Usuário comum, redirecionando para página de usuário');
            window.location.href = '/usuario.html';
        }
    } catch (error) {
        console.error('🚀 Role Redirect: Erro ao processar dados do usuário:', error);
    }
}
