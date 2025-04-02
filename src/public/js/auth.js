class Auth {
    constructor() {
        console.log('Auth class initialized');
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        console.log('Token:', this.token);
        console.log('User:', this.user);
    }

    isAuthenticated() {
        console.log('Checking authentication...');
        return !!this.token;
    }

    getToken() {
        console.log('Getting token...');
        return this.token;
    }

    getUser() {
        console.log('Getting user...');
        return this.user;
    }

    setAuth(token, user) {
        console.log('Setting auth...');
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('lastLogin', new Date().toLocaleString());
        console.log('Auth set successfully');
    }

    clearAuth() {
        console.log('Clearing auth...');
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('Auth cleared successfully');
    }

    checkAuthAndRedirect() {
        console.log('Checking auth and redirecting...');
        if (!this.isAuthenticated()) {
            console.log('Not authenticated, redirecting to login page...');
            window.location.href = '/login.html';
            return;
        }
        
        // Redirecionar usuários com base em seus papéis
        if (this.user && this.user.role) {
            console.log('User role:', this.user.role);
            
            // Verificar se estamos na página correta para o papel do usuário
            const currentPath = window.location.pathname;
            
            if (this.user.role === 'usuario' && (currentPath === '/index.html' || currentPath === '/')) {
                // Usuários comuns devem ser redirecionados para usuario.html
                console.log('Regular user accessing index.html, redirecting to usuario.html');
                window.location.href = '/usuario.html';
                return;
            } else if ((this.user.role === 'admin' || this.user.role === 'cadastrador') && currentPath === '/usuario.html') {
                // Admins e cadastradores devem ser redirecionados para index.html
                console.log('Admin or cadastrador accessing usuario.html, redirecting to index.html');
                window.location.href = '/index.html';
                return;
            }
        }
        
        // Atualizar informações do usuário no navbar
        const userInfo = document.getElementById('userInfo');
        if (userInfo && this.user) {
            const lastLogin = localStorage.getItem('lastLogin') || new Date().toLocaleString();
            userInfo.textContent = `${this.user.nome} (${this.user.id}) - Último acesso: ${lastLogin}`;
            console.log('Updated user info in navbar');
        }
        
        // Aplicar controle de acesso baseado no papel do usuário
        this.applyRoleBasedAccess();

        // Configurar botão de logout
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                console.log('Logout button clicked, clearing auth...');
                this.clearAuth();
                console.log('Redirecting to login page...');
                window.location.href = '/login.html';
            });
        }
    }

    // Método para aplicar controle de acesso baseado no papel do usuário
    applyRoleBasedAccess() {
        console.log('Applying role-based access control...');
        if (!this.user || !this.user.role) {
            console.log('User or role not found, hiding all restricted menus');
            this.hideAllRestrictedMenus();
            return;
        }

        console.log('User role:', this.user.role);
        
        // Esconder todos os menus restritos primeiro
        this.hideAllRestrictedMenus();
        
        // Mostrar menus com base no papel do usuário
        if (this.user.role === 'admin') {
            console.log('User is admin, showing all menus');
            this.showAdminMenus();
        } else if (this.user.role === 'cadastrador') {
            console.log('User is cadastrador, showing cadastrador menus');
            this.showCadastradorMenus();
        } else {
            console.log('User is regular user, keeping restricted menus hidden');
            // Menus já estão escondidos, não precisa fazer nada
        }
    }
    
    // Método para esconder todos os menus restritos
    hideAllRestrictedMenus() {
        console.log('Hiding all restricted menus');
        
        // Esconder menus de admin
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'none';
        });
        
        // Esconder menus de cadastrador
        document.querySelectorAll('.cadastrador-only').forEach(el => {
            el.style.display = 'none';
        });
        
        // Remover completamente o menu VEÍCULOS para garantir que não apareça
        document.querySelectorAll('.veiculos-access, .cadastrador-only').forEach(el => {
            if (el.classList.contains('dropdown') || 
                (el.parentNode && el.parentNode.classList.contains('dropdown-menu'))) {
                console.log('Removing VEÍCULOS menu element completely');
                if (el.parentNode) {
                    // Remover completamente o elemento do DOM
                    el.parentNode.removeChild(el);
                }
            } else {
                // Esconder outros elementos
                el.style.display = 'none';
            }
        });
    }
    
    // Método para mostrar menus de admin
    showAdminMenus() {
        console.log('Showing admin menus');
        
        // Mostrar menus de admin
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = '';
        });
        
        // Mostrar menus de cadastrador
        document.querySelectorAll('.cadastrador-only').forEach(el => {
            el.style.display = '';
        });
        
        // Mostrar menu VEÍCULOS
        document.querySelectorAll('.veiculos-access').forEach(el => {
            el.style.display = '';
        });
    }
    
    // Método para mostrar menus de cadastrador
    showCadastradorMenus() {
        console.log('Showing cadastrador menus');
        
        // Mostrar menus de cadastrador
        document.querySelectorAll('.cadastrador-only').forEach(el => {
            el.style.display = '';
        });
        
        // Mostrar menu VEÍCULOS
        document.querySelectorAll('.veiculos-access').forEach(el => {
            el.style.display = '';
        });
    }

    getAuthHeaders() {
        console.log('Getting auth headers...');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }
    
    login(email, password) {
        console.log('Attempting to login...');
        
        const loginData = {
            email: email,
            password: password
        };
        
        // Mostrar spinner e desabilitar botão
        const loginButton = document.getElementById('loginButton');
        const loginSpinner = document.getElementById('loginSpinner');
        
        if (loginButton) loginButton.disabled = true;
        if (loginSpinner) loginSpinner.classList.remove('d-none');
        
        // Usar config.apiBaseUrl em vez de API_URL
        const apiUrl = config && config.apiBaseUrl ? config.apiBaseUrl : '';
        
        return fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            console.log('Login successful:', data);
            
            // Armazenar token e dados do usuário
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('lastLogin', new Date().toLocaleString());
            
            this.token = data.access_token;
            this.user = data.user;
            
            // Redirecionar com base no papel do usuário
            if (data.user && data.user.role) {
                console.log('User role:', data.user.role);
                
                // Redirecionar para a página apropriada
                if (data.user.role === 'admin' || data.user.role === 'cadastrador') {
                    console.log('Redirecting to index.html (admin/cadastrador)');
                    window.location.href = '/index.html';
                } else {
                    console.log('Redirecting to usuario.html (regular user)');
                    window.location.href = '/usuario.html';
                }
            } else {
                // Papel não definido, redirecionar para página padrão
                console.log('Role not defined, redirecting to default page');
                window.location.href = '/index.html';
            }
            
            return data;
        })
        .catch(error => {
            console.error('Login error:', error);
            
            // Esconder spinner e habilitar botão
            if (loginButton) loginButton.disabled = false;
            if (loginSpinner) loginSpinner.classList.add('d-none');
            
            // Mostrar mensagem de erro
            const loginError = document.getElementById('loginError');
            if (loginError) {
                loginError.classList.remove('d-none');
                setTimeout(() => {
                    loginError.classList.add('d-none');
                }, 3000);
            }
            
            throw error;
        });
    }

    logout() {
        console.log('Logout method called, clearing auth...');
        this.clearAuth();
        console.log('Redirecting to login page...');
        window.location.href = '/login.html';
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing auth on page load...');
    window.auth = new Auth();
});

// Exportar a classe Auth para o escopo global
window.Auth = Auth;

// Função auxiliar para verificar autenticação
function checkAuthentication() {
    console.log('Checking authentication status...');
    return new Promise((resolve, reject) => {
        if (!window.auth) {
            console.error('Auth instance not available');
            window.auth = new Auth();
        }
        
        const user = window.auth.getUser();
        if (user) {
            console.log('User is authenticated:', user);
            resolve(user);
        } else {
            console.log('User is not authenticated, redirecting to login page');
            window.location.href = '/login.html';
            resolve(null);
        }
    });
}

// Função auxiliar para logout
function logout() {
    console.log('Logout helper function called');
    return new Promise((resolve) => {
        if (window.auth) {
            window.auth.clearAuth();
        }
        resolve();
    });
}
