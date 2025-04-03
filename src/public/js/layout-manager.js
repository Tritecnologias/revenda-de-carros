/**
 * Script para gerenciar o layout padrão da aplicação
 * Este script carrega o cabeçalho padrão em todas as páginas
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Layout Manager: Inicializando...');
    
    // Verificar se estamos em uma página que não deve ter o cabeçalho padrão
    const currentPath = window.location.pathname.toLowerCase();
    const excludedPages = ['/login.html', '/logoff.html'];
    
    if (excludedPages.some(page => currentPath.endsWith(page))) {
        console.log('Layout Manager: Página excluída do carregamento do cabeçalho padrão:', currentPath);
        return;
    }
    
    // Carregar o cabeçalho padrão
    loadStandardHeader();
});

/**
 * Carrega o cabeçalho padrão da aplicação
 */
function loadStandardHeader() {
    // Verificar se já existe um cabeçalho na página
    const existingHeader = document.querySelector('.navbar.navbar-dark.bg-dark');
    if (existingHeader) {
        console.log('Layout Manager: Cabeçalho já existe, substituindo...');
        
        // Remover todos os cabeçalhos existentes
        document.querySelectorAll('.navbar').forEach(function(navbar) {
            navbar.parentNode.removeChild(navbar);
        });
    }
    
    // Criar um elemento para conter o cabeçalho
    const headerContainer = document.createElement('div');
    headerContainer.id = 'standardHeader';
    
    // Carregar o cabeçalho padrão via AJAX
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // Inserir o cabeçalho no início do body
                headerContainer.innerHTML = xhr.responseText;
                document.body.insertBefore(headerContainer, document.body.firstChild);
                
                // Atualizar informações do usuário
                updateUserInfo();
                
                // Configurar botão de logout APÓS o cabeçalho ser carregado
                setupLogoutButton();
                
                // Configurar controle de acesso baseado no papel do usuário
                setupRoleBasedAccess();
                
                // Inicializar o menu centralizado
                initializeMenuSystem();
            } else {
                console.error('Layout Manager: Erro ao carregar cabeçalho:', xhr.status);
            }
        }
    };
    xhr.open('GET', '/templates/header-template.html', true);
    xhr.send();
}

/**
 * Atualiza as informações do usuário no cabeçalho
 */
function updateUserInfo() {
    const userInfoElement = document.getElementById('userInfo');
    if (!userInfoElement) {
        console.warn('Layout Manager: Elemento userInfo não encontrado');
        return;
    }
    
    // Obter informações do usuário do localStorage
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        console.warn('Layout Manager: Usuário não encontrado no localStorage');
        return;
    }
    
    // Formatar a data do último acesso
    const lastLogin = localStorage.getItem('lastLogin');
    const formattedDate = lastLogin || new Date().toLocaleString();
    
    // Atualizar o texto do elemento
    userInfoElement.textContent = `${user.nome} (${user.id}) - Último acesso: ${formattedDate}`;
}

/**
 * Configura o controle de acesso baseado no papel do usuário
 */
function setupRoleBasedAccess() {
    // Obter informações do usuário do localStorage
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        console.warn('Layout Manager: Usuário não encontrado no localStorage');
        return;
    }
    
    // Verificar o papel do usuário (role ou papel)
    const role = user.role || user.papel || 'usuario';
    
    // Adicionar classe ao body baseada no papel do usuário
    if (role === 'admin') {
        document.body.classList.add('role-admin');
    } else if (role === 'cadastrador') {
        document.body.classList.add('role-cadastrador');
    } else {
        document.body.classList.add('role-usuario');
    }
    
    // Verificar se o usuário tem permissão para acessar a página atual
    const currentPage = window.location.pathname;
    
    // Páginas administrativas que requerem permissão de admin ou cadastrador
    const adminPages = ['/admin/', '/veiculos/'];
    
    // Se for uma página administrativa e o usuário não for admin ou cadastrador, redirecionar
    if (adminPages.some(page => currentPage.includes(page)) && 
        role !== 'admin' && role !== 'cadastrador') {
        console.warn('Layout Manager: Usuário sem permissão para acessar esta página');
        window.location.href = '/usuario.html?redirected=true';
    }
}

/**
 * Configura o botão de logout
 */
function setupLogoutButton() {
    console.log('Layout Manager: Configurando botão de logout...');
    
    // Usar querySelector para garantir que o botão seja encontrado mesmo em subcontainers
    const logoutButton = document.querySelector('#logoutButton');
    if (!logoutButton) {
        console.warn('Layout Manager: Botão de logout não encontrado');
        return;
    }
    
    console.log('Layout Manager: Botão de logout encontrado, configurando evento de clique');
    
    // Remover eventos anteriores para evitar duplicação
    logoutButton.removeEventListener('click', handleLogout);
    
    // Adicionar novo evento de clique
    logoutButton.addEventListener('click', handleLogout);
}

/**
 * Função para lidar com o clique no botão de logout
 */
function handleLogout() {
    console.log('Layout Manager: Botão de logout clicado');
    
    if (window.auth) {
        console.log('Layout Manager: Chamando método de logout da classe Auth');
        window.auth.logout();
    } else {
        console.warn('Layout Manager: Objeto auth não encontrado, usando fallback');
        // Fallback se auth não estiver disponível
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/logoff.html';
    }
}

/**
 * Inicializa o sistema de menu centralizado
 */
function initializeMenuSystem() {
    console.log('Layout Manager: Inicializando sistema de menu centralizado');
    
    // Verificar se o script menu-manager.js já foi carregado
    if (!window.menuManager) {
        console.log('Layout Manager: Carregando menu-manager.js...');
        
        // Carregar o script menu-manager.js dinamicamente
        const script = document.createElement('script');
        script.src = '/js/menu-manager.js';
        script.onload = function() {
            console.log('Layout Manager: menu-manager.js carregado com sucesso');
            
            // Inicializar o menu após carregar o script
            initializeMenuAfterLoad();
        };
        script.onerror = function() {
            console.error('Layout Manager: Erro ao carregar menu-manager.js');
        };
        document.head.appendChild(script);
    } else {
        // O script já está carregado, inicializar o menu diretamente
        initializeMenuAfterLoad();
    }
}

/**
 * Inicializa o menu após o carregamento do script
 */
function initializeMenuAfterLoad() {
    console.log('Layout Manager: Inicializando menu após carregamento do script');
    
    // Obter informações do usuário do localStorage
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        console.warn('Layout Manager: Usuário não encontrado no localStorage');
        return;
    }
    
    // Inicializar o menu com o usuário atual
    if (window.menuManager && typeof window.menuManager.init === 'function') {
        console.log('Layout Manager: Chamando menuManager.init()');
        window.menuManager.init(user);
    } else if (typeof initializeMenu === 'function') {
        console.log('Layout Manager: Chamando initializeMenu()');
        initializeMenu(user);
    } else {
        console.error('Layout Manager: Função de inicialização do menu não encontrada');
    }
}
