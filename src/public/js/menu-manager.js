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
        
        // Garantir que o usuário tenha a propriedade 'role' para compatibilidade
        if (user) {
            if (user.papel && !user.role) {
                user.role = user.papel;
                // Atualizar no localStorage para manter a consistência
                const userString = localStorage.getItem('user');
                if (userString) {
                    const storedUser = JSON.parse(userString);
                    storedUser.role = storedUser.papel;
                    localStorage.setItem('user', JSON.stringify(storedUser));
                }
            }
            console.log('Papel do usuário:', user.role || user.papel);
        }
        
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
        // Verificar se já existe uma ul dentro do container
        let navbarUl = this.menuContainer.querySelector('ul.navbar-nav');
        
        if (!navbarUl) {
            // Se não existir, criar uma nova ul
            navbarUl = document.createElement('ul');
            navbarUl.className = 'navbar-nav';
            this.menuContainer.appendChild(navbarUl);
        } else {
            // Se existir, limpar o conteúdo
            navbarUl.innerHTML = '';
        }
        
        // Determinar qual menu renderizar com base no papel do usuário
        const userRole = this.currentUser.role || this.currentUser.papel;
        console.log('Renderizando menu para papel:', userRole);
        
        if (userRole === 'admin') {
            this.renderAdminMenu(navbarUl);
        } else if (userRole === 'cadastrador') {
            this.renderCadastradorMenu(navbarUl);
        } else {
            this.renderUsuarioMenu(navbarUl);
        }
    }
    
    /**
     * Renderiza o menu para administradores
     * @param {HTMLElement} navbarUl - Elemento UL onde os itens de menu serão adicionados
     */
    renderAdminMenu(navbarUl) {
        console.log('Renderizando menu de administrador');
        
        // Itens do menu do administrador conforme a imagem
        const menuItems = [
            { text: 'USUÁRIOS', href: '/admin/users.html' },
            { text: 'CONFIGURADOR', href: '/index.html' },
            { text: 'OPÇÕES', href: '/opcoes.html' },
            { text: 'COTAÇÕES', href: '/cotacoes.html' },
            { text: 'CLIENTES', href: '/clientes.html' }
        ];
        
        // Adicionar itens de menu simples
        menuItems.forEach(item => {
            navbarUl.appendChild(this.createMenuItem(item.text, item.href));
        });
        
        // Menu dropdown de VEÍCULOS
        const veiculosLi = document.createElement('li');
        veiculosLi.className = 'nav-item dropdown';
        
        const dropdownToggle = document.createElement('a');
        dropdownToggle.className = 'nav-link dropdown-toggle';
        dropdownToggle.href = '#';
        dropdownToggle.id = 'veiculosDropdown';
        dropdownToggle.role = 'button';
        dropdownToggle.setAttribute('data-bs-toggle', 'dropdown');
        dropdownToggle.setAttribute('aria-expanded', 'false');
        dropdownToggle.textContent = 'VEÍCULOS';
        
        const dropdownMenu = document.createElement('ul');
        dropdownMenu.className = 'dropdown-menu';
        dropdownMenu.setAttribute('aria-labelledby', 'veiculosDropdown');
        
        // Itens do dropdown de VEÍCULOS
        const veiculosItems = [
            { text: 'MARCAS', href: '/veiculos/marca.html' },
            { text: 'MODELOS', href: '/veiculos/modelo.html' },
            { text: 'VERSÕES', href: '/admin/versoes.html' },
            { text: 'VEÍCULOS', href: '/veiculos/veiculo.html' },
            { text: 'OPCIONAIS', href: '/veiculos/opcional.html' },
            { text: 'PINTURAS', href: '/pinturas.html' },
            { text: 'VENDA DIRETA', href: '/veiculos/venda-direta.html' }
        ];
        
        veiculosItems.forEach(item => {
            const dropdownItem = document.createElement('li');
            const itemLink = document.createElement('a');
            itemLink.className = 'dropdown-item';
            itemLink.href = item.href;
            itemLink.textContent = item.text;
            
            // Verificar se este item corresponde à URL atual
            if (window.location.pathname === item.href) {
                itemLink.classList.add('active');
                dropdownToggle.classList.add('active');
            }
            
            dropdownItem.appendChild(itemLink);
            dropdownMenu.appendChild(dropdownItem);
        });
        
        veiculosLi.appendChild(dropdownToggle);
        veiculosLi.appendChild(dropdownMenu);
        navbarUl.appendChild(veiculosLi);
        
        // Item SUPORTE
        navbarUl.appendChild(this.createMenuItem('SUPORTE', '/suporte.html'));
    }
    
    /**
     * Renderiza o menu para cadastradores
     * @param {HTMLElement} navbarUl - Elemento UL onde os itens de menu serão adicionados
     */
    renderCadastradorMenu(navbarUl) {
        console.log('Renderizando menu de cadastrador');
        
        // Menu de Configurador
        navbarUl.appendChild(this.createMenuItem('CONFIGURADOR', '/index.html'));
        
        // Menu dropdown de VEÍCULOS
        const veiculosLi = document.createElement('li');
        veiculosLi.className = 'nav-item dropdown';
        
        const dropdownToggle = document.createElement('a');
        dropdownToggle.className = 'nav-link dropdown-toggle';
        dropdownToggle.href = '#';
        dropdownToggle.id = 'veiculosDropdown';
        dropdownToggle.role = 'button';
        dropdownToggle.setAttribute('data-bs-toggle', 'dropdown');
        dropdownToggle.setAttribute('aria-expanded', 'false');
        dropdownToggle.textContent = 'VEÍCULOS';
        
        const dropdownMenu = document.createElement('ul');
        dropdownMenu.className = 'dropdown-menu';
        dropdownMenu.setAttribute('aria-labelledby', 'veiculosDropdown');
        
        // Itens do dropdown de VEÍCULOS
        const veiculosItems = [
            { text: 'MARCAS', href: '/veiculos/marca.html' },
            { text: 'MODELOS', href: '/veiculos/modelo.html' },
            { text: 'VERSÕES', href: '/admin/versoes.html' },
            { text: 'VEÍCULOS', href: '/veiculos/veiculo.html' },
            { text: 'OPCIONAIS', href: '/veiculos/opcional.html' },
            { text: 'PINTURAS', href: '/pinturas.html' },
            { text: 'VENDA DIRETA', href: '/veiculos/venda-direta.html' }
        ];
        
        veiculosItems.forEach(item => {
            const dropdownItem = document.createElement('li');
            const itemLink = document.createElement('a');
            itemLink.className = 'dropdown-item';
            itemLink.href = item.href;
            itemLink.textContent = item.text;
            
            // Verificar se este item corresponde à URL atual
            if (window.location.pathname === item.href) {
                itemLink.classList.add('active');
                dropdownToggle.classList.add('active');
            }
            
            dropdownItem.appendChild(itemLink);
            dropdownMenu.appendChild(dropdownItem);
        });
        
        veiculosLi.appendChild(dropdownToggle);
        veiculosLi.appendChild(dropdownMenu);
        navbarUl.appendChild(veiculosLi);
        
        // Item SUPORTE
        navbarUl.appendChild(this.createMenuItem('SUPORTE', '/suporte.html'));
    }
    
    /**
     * Renderiza o menu para usuários comuns
     * @param {HTMLElement} navbarUl - Elemento UL onde os itens de menu serão adicionados
     */
    renderUsuarioMenu(navbarUl) {
        console.log('Renderizando menu de usuário comum');
        
        // Menu de Configurador
        navbarUl.appendChild(this.createMenuItem('CONFIGURADOR', '/index.html'));
        
        // Item SUPORTE
        navbarUl.appendChild(this.createMenuItem('SUPORTE', '/suporte.html'));
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
        a.className = `nav-link${active ? ' active' : ''}`;
        a.href = href;
        
        // Verificar se este item corresponde à URL atual
        if (window.location.pathname === href) {
            a.classList.add('active');
        }
        
        a.textContent = text;
        
        li.appendChild(a);
        return li;
    }
}

// Cria uma instância global do gerenciador de menu
window.menuManager = new MenuManager();

// Função para inicializar o menu após a autenticação
function initMenu() {
    console.log('Inicializando menu...');
    const userString = localStorage.getItem('user');
    if (userString) {
        try {
            const user = JSON.parse(userString);
            console.log('Usuário encontrado no localStorage:', user);
            
            // Garantir que o usuário tenha a propriedade 'role' para compatibilidade
            if (user.papel && !user.role) {
                user.role = user.papel;
                // Atualizar no localStorage para manter a consistência
                localStorage.setItem('user', JSON.stringify(user));
                console.log('Propriedade role adicionada ao usuário:', user);
            }
            
            window.menuManager.init(user);
        } catch (error) {
            console.error('Erro ao inicializar menu:', error);
        }
    } else {
        console.warn('Usuário não encontrado no localStorage');
    }
}

// Inicializar o menu quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando menu...');
    initMenu();
});
