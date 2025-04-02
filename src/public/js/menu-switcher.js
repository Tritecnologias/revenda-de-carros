/**
 * Script para alternar entre os menus com base no papel do usuário
 * Esta é uma solução simples e direta
 */

// Executar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('Menu Switcher: Iniciando...');
    
    // Obter os elementos do menu
    const adminCadastradorMenu = document.getElementById('admin-cadastrador-menu');
    const userMenu = document.getElementById('user-menu');
    
    if (!adminCadastradorMenu || !userMenu) {
        console.error('Menu Switcher: Elementos de menu não encontrados');
        return;
    }
    
    // Obter o usuário do localStorage
    try {
        const userJson = localStorage.getItem('user');
        if (!userJson) {
            console.log('Menu Switcher: Nenhum usuário encontrado');
            return;
        }
        
        const user = JSON.parse(userJson);
        console.log('Menu Switcher: Usuário encontrado', user);
        
        if (!user.role) {
            console.log('Menu Switcher: Usuário sem papel definido');
            return;
        }
        
        console.log('Menu Switcher: Papel do usuário:', user.role);
        
        // Mostrar o menu apropriado com base no papel do usuário
        if (user.role === 'admin' || user.role === 'cadastrador') {
            console.log('Menu Switcher: Mostrando menu para admin/cadastrador');
            adminCadastradorMenu.style.display = 'block';
            userMenu.style.display = 'none';
        } else {
            console.log('Menu Switcher: Mostrando menu para usuário comum');
            adminCadastradorMenu.style.display = 'none';
            userMenu.style.display = 'block';
        }
        
        // Adicionar classe ao body para controle via CSS
        document.body.classList.add('role-' + user.role);
    } catch (error) {
        console.error('Menu Switcher: Erro ao processar usuário', error);
    }
});
