/**
 * Script para forçar a exibição do menu VEÍCULOS para administradores
 * Este script adiciona o menu VEÍCULOS diretamente ao HTML
 */

// Executar imediatamente
(function() {
    console.log('Force Veículos Menu: Inicializando...');
    
    // Desativar outros scripts que podem estar interferindo
    disableOtherScripts();
    
    // Adicionar o menu VEÍCULOS imediatamente
    setTimeout(addVeiculosMenu, 100);
    
    // Executar quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Force Veículos Menu: DOM carregado');
        addVeiculosMenu();
        
        // Continuar verificando e adicionando o menu periodicamente
        setInterval(addVeiculosMenu, 500);
    });
    
    // Executar após delays para garantir que outros scripts já foram executados
    setTimeout(addVeiculosMenu, 500);
    setTimeout(addVeiculosMenu, 1000);
    setTimeout(addVeiculosMenu, 2000);
})();

/**
 * Desativa outros scripts que podem estar interferindo
 */
function disableOtherScripts() {
    // Sobrescrever funções que podem estar removendo o menu
    try {
        // Sobrescrever qualquer função que possa estar removendo elementos
        if (window.removeVeiculosMenu) window.removeVeiculosMenu = function() { console.log('Função removeVeiculosMenu desativada'); };
        if (window.hideMenus) window.hideMenus = function() { console.log('Função hideMenus desativada'); };
        if (window.applyRoleBasedAccess) window.applyRoleBasedAccess = function() { console.log('Função applyRoleBasedAccess desativada'); addVeiculosMenu(); };
        
        console.log('Force Veículos Menu: Funções de remoção de menu desativadas');
    } catch (error) {
        console.error('Force Veículos Menu: Erro ao desativar funções', error);
    }
}

/**
 * Adiciona o menu VEÍCULOS diretamente ao HTML
 */
function addVeiculosMenu() {
    try {
        // Verificar se o usuário é administrador
        const userJson = localStorage.getItem('user');
        if (!userJson) {
            console.log('Force Veículos Menu: Nenhum usuário encontrado');
            return;
        }
        
        const user = JSON.parse(userJson);
        if (user.role !== 'admin') {
            console.log('Force Veículos Menu: Usuário não é administrador');
            return;
        }
        
        console.log('Force Veículos Menu: Usuário é administrador, adicionando menu VEÍCULOS');
        
        // Verificar se o menu VEÍCULOS já existe
        const existingMenu = document.getElementById('veiculosDropdown');
        if (existingMenu) {
            console.log('Force Veículos Menu: Menu VEÍCULOS já existe, tornando-o visível');
            const veiculosItem = existingMenu.closest('.nav-item');
            if (veiculosItem) {
                veiculosItem.style.display = '';
                veiculosItem.style.visibility = 'visible';
                veiculosItem.classList.remove('d-none');
                return;
            }
        }
        
        // Encontrar o menu azul
        const blueMenu = document.querySelector('.bg-primary.d-none.d-lg-block .navbar-nav');
        if (!blueMenu) {
            console.log('Force Veículos Menu: Menu azul não encontrado');
            return;
        }
        
        // Criar o menu VEÍCULOS
        const veiculosMenu = document.createElement('li');
        veiculosMenu.className = 'nav-item dropdown';
        veiculosMenu.innerHTML = `
            <a class="nav-link text-white dropdown-toggle" href="#" id="veiculosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                VEÍCULOS
            </a>
            <ul class="dropdown-menu" aria-labelledby="veiculosDropdown">
                <li><a class="dropdown-item" href="/cadastrar-veiculo.html">Cadastrar Veículo</a></li>
                <li><a class="dropdown-item" href="/listar-veiculos.html">Listar Veículos</a></li>
            </ul>
        `;
        
        // Adicionar o menu VEÍCULOS ao menu azul (antes do último item)
        blueMenu.insertBefore(veiculosMenu, blueMenu.lastElementChild);
        console.log('Force Veículos Menu: Menu VEÍCULOS adicionado com sucesso');
        
        // Inicializar o dropdown do Bootstrap
        if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
            new bootstrap.Dropdown(document.getElementById('veiculosDropdown'));
            console.log('Force Veículos Menu: Dropdown inicializado');
        }
    } catch (error) {
        console.error('Force Veículos Menu: Erro ao adicionar menu VEÍCULOS', error);
    }
}
