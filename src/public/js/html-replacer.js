/**
 * Script para substituir completamente o HTML da navegação baseado no papel do usuário
 * Esta é uma abordagem radical que substitui todo o HTML da navegação
 */

// Executar imediatamente quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 HTML Replacer: Script iniciado');
    
    // Verificar o papel do usuário
    const userJson = localStorage.getItem('user');
    if (!userJson) {
        console.log('🔄 HTML Replacer: Nenhum usuário encontrado, redirecionando para login');
        window.location.href = '/login.html';
        return;
    }
    
    try {
        const user = JSON.parse(userJson);
        console.log('🔄 HTML Replacer: Usuário encontrado', user);
        console.log('🔄 HTML Replacer: Papel do usuário:', user.role);
        
        // Substituir o HTML da navegação baseado no papel do usuário
        if (user.role === 'admin') {
            // Admin vê todos os menus
            console.log('🔄 HTML Replacer: Usuário é admin, mostrando todos os menus');
            replaceNavigationForAdmin();
        } else if (user.role === 'cadastrador') {
            // Cadastrador vê menus específicos
            console.log('🔄 HTML Replacer: Usuário é cadastrador, mostrando menus específicos');
            replaceNavigationForCadastrador();
        } else {
            // Usuário comum não vê menus restritos
            console.log('🔄 HTML Replacer: Usuário comum, ocultando menus restritos');
            replaceNavigationForUser();
        }
    } catch (error) {
        console.error('🔄 HTML Replacer: Erro ao processar usuário', error);
    }
});

/**
 * Substitui a navegação para administradores
 */
function replaceNavigationForAdmin() {
    // HTML para navegação mobile
    const mobileNavHTML = `
    <div class="container">
        <a class="navbar-brand" href="#">Revenda de Carros</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mobileNav" aria-controls="mobileNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mobileNav">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item admin-only">
                    <a class="nav-link" href="/admin/users.html">USUÁRIOS</a>
                </li>
                <li class="nav-item cadastrador-only">
                    <a class="nav-link" href="#">CONFIGURADOR</a>
                </li>
                <li class="nav-item cadastrador-only">
                    <a class="nav-link" href="#">ISENÇÕES</a>
                </li>
                <li class="nav-item cadastrador-only">
                    <a class="nav-link" href="#">COTAÇÕES</a>
                </li>
                <li class="nav-item cadastrador-only">
                    <a class="nav-link" href="#">CLIENTES</a>
                </li>
                <li class="nav-item dropdown veiculos-access">
                    <a class="nav-link dropdown-toggle" href="#" id="mobileVeiculosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        VEÍCULOS
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="mobileVeiculosDropdown">
                        <li><a class="dropdown-item" href="/veiculos/marca.html">MARCA</a></li>
                        <li><a class="dropdown-item" href="/veiculos/modelo.html">MODELO</a></li>
                        <li><a class="dropdown-item" href="/veiculos/veiculo.html">VEÍCULO</a></li>
                        <li><a class="dropdown-item" href="/veiculos/opcional.html">OPCIONAIS</a></li>
                        <li><a class="dropdown-item" href="/pinturas.html">PINTURAS</a></li>
                        <li><a class="dropdown-item" href="/veiculos/venda-direta.html">VENDA DIRETA</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">SUPORTE</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" id="mobileLogoutButton">SAIR</a>
                </li>
            </ul>
        </div>
    </div>
    `;
    
    // HTML para navegação desktop
    const desktopNavHTML = `
    <div class="container">
        <ul class="nav nav-pills">
            <li class="nav-item admin-only">
                <a class="nav-link text-white" href="/admin/users.html">USUÁRIOS</a>
            </li>
            <li class="nav-item cadastrador-only">
                <a class="nav-link text-white active" href="#">CONFIGURADOR</a>
            </li>
            <li class="nav-item cadastrador-only">
                <a class="nav-link text-white" href="#">ISENÇÕES</a>
            </li>
            <li class="nav-item cadastrador-only">
                <a class="nav-link text-white" href="#">COTAÇÕES</a>
            </li>
            <li class="nav-item cadastrador-only">
                <a class="nav-link text-white" href="#">CLIENTES</a>
            </li>
            <li class="nav-item dropdown veiculos-access">
                <a class="nav-link text-white dropdown-toggle" href="#" id="veiculosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    VEÍCULOS
                </a>
                <ul class="dropdown-menu" aria-labelledby="veiculosDropdown">
                    <li><a class="dropdown-item" href="/veiculos/marca.html">MARCA</a></li>
                    <li><a class="dropdown-item" href="/veiculos/modelo.html">MODELO</a></li>
                    <li><a class="dropdown-item" href="/veiculos/veiculo.html">VEÍCULO</a></li>
                    <li><a class="dropdown-item" href="/veiculos/opcional.html">OPCIONAIS</a></li>
                    <li><a class="dropdown-item" href="/pinturas.html">PINTURAS</a></li>
                    <li><a class="dropdown-item" href="/veiculos/venda-direta.html">VENDA DIRETA</a></li>
                </ul>
            </li>
            <li class="nav-item">
                <a class="nav-link text-white" href="#">SUPORTE</a>
            </li>
        </ul>
    </div>
    `;
    
    // Substituir o HTML das navegações
    replaceNavigation(mobileNavHTML, desktopNavHTML);
}

/**
 * Substitui a navegação para cadastradores
 */
function replaceNavigationForCadastrador() {
    // HTML para navegação mobile
    const mobileNavHTML = `
    <div class="container">
        <a class="navbar-brand" href="#">Revenda de Carros</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mobileNav" aria-controls="mobileNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mobileNav">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item cadastrador-only">
                    <a class="nav-link" href="#">CONFIGURADOR</a>
                </li>
                <li class="nav-item cadastrador-only">
                    <a class="nav-link" href="#">ISENÇÕES</a>
                </li>
                <li class="nav-item cadastrador-only">
                    <a class="nav-link" href="#">COTAÇÕES</a>
                </li>
                <li class="nav-item cadastrador-only">
                    <a class="nav-link" href="#">CLIENTES</a>
                </li>
                <li class="nav-item dropdown veiculos-access">
                    <a class="nav-link dropdown-toggle" href="#" id="mobileVeiculosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        VEÍCULOS
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="mobileVeiculosDropdown">
                        <li><a class="dropdown-item" href="/veiculos/marca.html">MARCA</a></li>
                        <li><a class="dropdown-item" href="/veiculos/modelo.html">MODELO</a></li>
                        <li><a class="dropdown-item" href="/veiculos/veiculo.html">VEÍCULO</a></li>
                        <li><a class="dropdown-item" href="/veiculos/opcional.html">OPCIONAIS</a></li>
                        <li><a class="dropdown-item" href="/pinturas.html">PINTURAS</a></li>
                        <li><a class="dropdown-item" href="/veiculos/venda-direta.html">VENDA DIRETA</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">SUPORTE</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" id="mobileLogoutButton">SAIR</a>
                </li>
            </ul>
        </div>
    </div>
    `;
    
    // HTML para navegação desktop
    const desktopNavHTML = `
    <div class="container">
        <ul class="nav nav-pills">
            <li class="nav-item cadastrador-only">
                <a class="nav-link text-white active" href="#">CONFIGURADOR</a>
            </li>
            <li class="nav-item cadastrador-only">
                <a class="nav-link text-white" href="#">ISENÇÕES</a>
            </li>
            <li class="nav-item cadastrador-only">
                <a class="nav-link text-white" href="#">COTAÇÕES</a>
            </li>
            <li class="nav-item cadastrador-only">
                <a class="nav-link text-white" href="#">CLIENTES</a>
            </li>
            <li class="nav-item dropdown veiculos-access">
                <a class="nav-link text-white dropdown-toggle" href="#" id="veiculosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    VEÍCULOS
                </a>
                <ul class="dropdown-menu" aria-labelledby="veiculosDropdown">
                    <li><a class="dropdown-item" href="/veiculos/marca.html">MARCA</a></li>
                    <li><a class="dropdown-item" href="/veiculos/modelo.html">MODELO</a></li>
                    <li><a class="dropdown-item" href="/veiculos/veiculo.html">VEÍCULO</a></li>
                    <li><a class="dropdown-item" href="/veiculos/opcional.html">OPCIONAIS</a></li>
                    <li><a class="dropdown-item" href="/pinturas.html">PINTURAS</a></li>
                    <li><a class="dropdown-item" href="/veiculos/venda-direta.html">VENDA DIRETA</a></li>
                </ul>
            </li>
            <li class="nav-item">
                <a class="nav-link text-white" href="#">SUPORTE</a>
            </li>
        </ul>
    </div>
    `;
    
    // Substituir o HTML das navegações
    replaceNavigation(mobileNavHTML, desktopNavHTML);
}

/**
 * Substitui a navegação para usuários comuns
 */
function replaceNavigationForUser() {
    // HTML para navegação mobile
    const mobileNavHTML = `
    <div class="container">
        <a class="navbar-brand" href="#">Revenda de Carros</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mobileNav" aria-controls="mobileNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mobileNav">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <!-- Menu VEÍCULOS removido para usuários comuns -->
                <li class="nav-item">
                    <a class="nav-link" href="#">SUPORTE</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" id="mobileLogoutButton">SAIR</a>
                </li>
            </ul>
        </div>
    </div>
    `;
    
    // HTML para navegação desktop
    const desktopNavHTML = `
    <div class="container">
        <ul class="nav nav-pills">
            <!-- Menu VEÍCULOS removido para usuários comuns -->
            <li class="nav-item">
                <a class="nav-link text-white" href="#">SUPORTE</a>
            </li>
        </ul>
    </div>
    `;
    
    // Substituir o HTML das navegações
    replaceNavigation(mobileNavHTML, desktopNavHTML);
}

/**
 * Substitui o HTML das navegações
 */
function replaceNavigation(mobileNavHTML, desktopNavHTML) {
    // Substituir a navegação mobile
    const mobileNav = document.querySelector('.navbar-dark.bg-primary.d-lg-none');
    if (mobileNav) {
        mobileNav.innerHTML = mobileNavHTML;
        console.log('🔄 HTML Replacer: Navegação mobile substituída');
    } else {
        console.error('🔄 HTML Replacer: Navegação mobile não encontrada');
    }
    
    // Substituir a navegação desktop
    const desktopNav = document.querySelector('.bg-primary.d-none.d-lg-block');
    if (desktopNav) {
        desktopNav.innerHTML = desktopNavHTML;
        console.log('🔄 HTML Replacer: Navegação desktop substituída');
    } else {
        console.error('🔄 HTML Replacer: Navegação desktop não encontrada');
    }
    
    // Reconfigurar eventos de logout
    const mobileLogoutButton = document.getElementById('mobileLogoutButton');
    if (mobileLogoutButton) {
        mobileLogoutButton.addEventListener('click', function() {
            console.log('🔄 HTML Replacer: Botão de logout mobile clicado');
            if (window.auth) {
                window.auth.logout();
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login.html';
            }
        });
    }
    
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            console.log('🔄 HTML Replacer: Botão de logout desktop clicado');
            if (window.auth) {
                window.auth.logout();
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login.html';
            }
        });
    }
}
