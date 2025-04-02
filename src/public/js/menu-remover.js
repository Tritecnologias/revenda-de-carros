/**
 * Script para remover completamente o menu VEÍCULOS do DOM para usuários comuns
 */

// Executar imediatamente quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 Menu Remover: Script iniciado');
    
    // Verificar o papel do usuário
    const userJson = localStorage.getItem('user');
    if (!userJson) {
        console.log('🔥 Menu Remover: Nenhum usuário encontrado, redirecionando para login');
        window.location.href = '/login.html';
        return;
    }
    
    try {
        const user = JSON.parse(userJson);
        console.log('🔥 Menu Remover: Usuário encontrado', user);
        console.log('🔥 Menu Remover: Papel do usuário:', user.role);
        
        // Se o usuário não for admin ou cadastrador, remover o menu VEÍCULOS
        if (user.role !== 'admin' && user.role !== 'cadastrador') {
            console.log('🔥 Menu Remover: Usuário comum, removendo menu VEÍCULOS');
            
            // Remover todos os elementos com a classe veiculos-access
            const veiculosElements = document.querySelectorAll('.veiculos-access');
            console.log('🔥 Menu Remover: Encontrados', veiculosElements.length, 'elementos para remover');
            
            veiculosElements.forEach(function(element) {
                // Remover completamente o elemento do DOM
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                    console.log('🔥 Menu Remover: Elemento removido do DOM');
                }
            });
            
            console.log('🔥 Menu Remover: Todos os elementos do menu VEÍCULOS foram removidos');
        } else {
            console.log('🔥 Menu Remover: Usuário é admin ou cadastrador, mantendo menu VEÍCULOS');
            
            // Mostrar o menu VEÍCULOS para admin e cadastrador
            const veiculosElements = document.querySelectorAll('.veiculos-access');
            veiculosElements.forEach(function(element) {
                element.style.display = '';
                console.log('🔥 Menu Remover: Menu VEÍCULOS exibido');
            });
        }
    } catch (error) {
        console.error('🔥 Menu Remover: Erro ao processar usuário', error);
    }
});
