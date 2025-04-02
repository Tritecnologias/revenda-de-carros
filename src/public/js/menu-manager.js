/**
 * Menu Manager - Sistema centralizado de gerenciamento de menus
 * Este arquivo gerencia todos os menus do sistema, permitindo que sejam carregados
 * dinamicamente em qualquer página, com base no papel do usuário.
 */

class MenuManager {
    constructor() {
        this.currentUser = null;
        this.menuContainer = null;
    }

    /**
     * Inicializa o gerenciador de menu
     * @param {Object} user - Objeto do usuário atual
     * @param {String} containerId - ID do container onde o menu será renderizado
     */
    init(user, containerId = 'navbarNavBlue') {
        console.log('Inicializando MenuManager com usuário:', user);
        // Usar a propriedade role que é definida no auth.js
        console.log('Papel do usuário:', user.role);
        this.currentUser = user;
        this.menuContainer = document.getElementById(containerId);
        
        if (!this.menuContainer) {
            console.error(`Container de menu com ID ${containerId} não encontrado`);
            return false;
        }
        
        // Renderiza o menu apropriado com base no papel do usuário
        this.renderMenu();
        return true;
    }
    
    /**
     * Renderiza o menu apropriado com base no papel do usuário
     */
    renderMenu() {
        if (!this.currentUser || !this.menuContainer) {
            console.error('Usuário ou container de menu não definidos');
            return;
        }
        
        // Limpa o container de menu
        const navbarUl = this.menuContainer.querySelector('ul.navbar-nav');
        if (navbarUl) {
            navbarUl.innerHTML = '';
            
            // Usar apenas a propriedade 'role' que é definida no auth.js
            const papel = this.currentUser.role || 'usuario';
            console.log('Renderizando menu para usuário com papel:', papel);
            
            // Adiciona os itens de menu com base no papel do usuário
            if (papel === 'admin') {
                this.renderAdminMenu(navbarUl);
            } else if (papel === 'cadastrador') {
                this.renderCadastradorMenu(navbarUl);
            } else {
                this.renderUsuarioMenu(navbarUl);
            }
        } else {
            console.error('Elemento ul.navbar-nav não encontrado no container de menu');
        }
    }
    
    /**
     * Renderiza o menu para administradores
     * @param {HTMLElement} navbarUl - Elemento UL onde os itens de menu serão adicionados
     */
    renderAdminMenu(navbarUl) {
        console.log('Renderizando menu de administrador');
        
        // Menu de Usuários (apenas para administradores)
        navbarUl.appendChild(this.createMenuItem('USUÁRIOS', '/admin/users.html'));
        
        // Menu de Configurador
        navbarUl.appendChild(this.createMenuItem('CONFIGURADOR', '/index.html'));
        
        // Menu dropdown de Veículos
        navbarUl.appendChild(this.createVeiculosDropdown());
    }
    
    /**
     * Renderiza o menu para cadastradores
     * @param {HTMLElement} navbarUl - Elemento UL onde os itens de menu serão adicionados
     */
    renderCadastradorMenu(navbarUl) {
        console.log('Renderizando menu de cadastrador');
        
        // Menu de Configurador
        navbarUl.appendChild(this.createMenuItem('CONFIGURADOR', '/index.html'));
        
        // Menu dropdown de Veículos
        navbarUl.appendChild(this.createVeiculosDropdown());
    }
    
    /**
     * Renderiza o menu para usuários comuns
     * @param {HTMLElement} navbarUl - Elemento UL onde os itens de menu serão adicionados
     */
    renderUsuarioMenu(navbarUl) {
        console.log('Renderizando menu de usuário comum');
        
        // Apenas o menu de configurador para usuários comuns
        navbarUl.appendChild(this.createMenuItem('CONFIGURADOR', '/usuario.html'));
    }
    
    /**
     * Cria um item de menu
     * @param {String} text - Texto do item de menu
     * @param {String} href - URL do link
     * @param {Boolean} active - Se o item está ativo
     * @returns {HTMLElement} - Elemento LI do item de menu
     */
    createMenuItem(text, href, active = false) {
        const li = document.createElement('li');
        li.className = 'nav-item';
        
        const a = document.createElement('a');
        a.className = `nav-link text-white${active ? ' active' : ''}`;
        a.href = href;
        a.textContent = text;
        
        li.appendChild(a);
        return li;
    }
    
    /**
     * Cria o dropdown de Veículos
     * @returns {HTMLElement} - Elemento LI do dropdown
     */
    createVeiculosDropdown() {
        const li = document.createElement('li');
        li.className = 'nav-item dropdown';
        
        const a = document.createElement('a');
        a.className = 'nav-link text-white dropdown-toggle';
        a.href = '#';
        a.id = 'veiculosDropdown';
        a.role = 'button';
        a.dataset.bsToggle = 'dropdown';
        a.setAttribute('aria-expanded', 'false');
        a.textContent = 'VEÍCULOS';
        
        const ul = document.createElement('ul');
        ul.className = 'dropdown-menu';
        ul.setAttribute('aria-labelledby', 'veiculosDropdown');
        
        // Adiciona os itens do dropdown
        const items = [
            { text: 'MARCA', href: '/veiculos/marca.html' },
            { text: 'MODELO', href: '/veiculos/modelo.html' },
            { text: 'VEÍCULO', href: '/veiculos/veiculo.html' },
            { text: 'OPCIONAIS', href: '/veiculos/opcional.html' },
            { text: 'PINTURAS', href: '/pinturas.html' },
            { text: 'VENDA DIRETA', href: '/veiculos/venda-direta.html' }
        ];
        
        items.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.className = 'dropdown-item';
            a.href = item.href;
            a.textContent = item.text;
            
            // Verifica se este item está ativo (corresponde à URL atual)
            if (window.location.pathname === item.href) {
                a.classList.add('active');
            }
            
            li.appendChild(a);
            ul.appendChild(li);
        });
        
        li.appendChild(a);
        li.appendChild(ul);
        
        return li;
    }
}

// Cria uma instância global do gerenciador de menu
window.menuManager = new MenuManager();

/**
 * Função para inicializar o menu após a autenticação
 * @param {Object} user - Objeto do usuário autenticado
 */
function initializeMenu(user) {
    if (user) {
        window.menuManager.init(user);
    } else {
        console.error('Usuário não fornecido para inicialização do menu');
    }
}
