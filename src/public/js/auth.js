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
        
        // Garantir que o usuário tenha a propriedade 'role' para compatibilidade
        if (user && user.papel && !user.role) {
            user.role = user.papel;
        }
        
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

    logout() {
        console.log('Auth: Logout method called');
        
        // Criar overlay para animação de logout
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.color = 'white';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '9999';
        overlay.style.fontFamily = 'monospace';
        overlay.style.fontSize = '16px';
        overlay.style.transition = 'opacity 0.5s';
        overlay.style.opacity = '0';
        
        document.body.appendChild(overlay);
        
        // Forçar reflow para que a transição funcione
        overlay.offsetHeight;
        overlay.style.opacity = '1';
        
        // Função para adicionar uma linha de texto à animação
        const addLine = (text) => {
            const line = document.createElement('div');
            line.textContent = text;
            line.style.margin = '5px';
            overlay.appendChild(line);
        };
        
        // Iniciar animação
        setTimeout(() => {
            addLine('Iniciando processo de logout...');
            
            setTimeout(() => {
                addLine('Removendo token de autenticação...');
                
                setTimeout(() => {
                    addLine('Removendo dados do usuário...');
                    
                    setTimeout(() => {
                        addLine('Limpando localStorage...');
                        
                        setTimeout(() => {
                            addLine('Logout concluído! Redirecionando...');
                            
                            // Limpar autenticação e redirecionar
                            setTimeout(() => {
                                this.clearAuth();
                                window.location.href = '/logoff.html';
                            }, 1000);
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    }

    checkAuthAndRedirect() {
        console.log('Checking auth and redirecting...');
        
        // Verificar se estamos na página de login ou logoff
        const currentPath = window.location.pathname.toLowerCase();
        const excludedPages = ['/login.html', '/logoff.html'];
        
        if (excludedPages.some(page => currentPath.endsWith(page))) {
            console.log('Auth: Página de login ou logoff, não verificando autenticação');
            return;
        }
        
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
        console.log('Logging in...');
        
        const loginData = {
            email: email,
            password: password
        };
        
        console.log('Login data:', loginData);
        console.log('API URL:', `${config.apiBaseUrl}/auth/login`);
        
        return fetch(`${config.apiBaseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            console.log('Login response status:', response.status);
            
            if (!response.ok) {
                console.error('Login failed with status:', response.status);
                throw new Error(`Login failed with status: ${response.status}`);
            }
            
            return response.json();
        })
        .then(data => {
            console.log('Login response:', data);
            
            if (data.access_token) {
                const token = data.access_token;
                const user = data.user;
                
                this.setAuth(token, user);
                console.log('Auth set with token and user');
                
                // Redirecionar com base no papel do usuário
                if (user.role === 'admin' || user.role === 'cadastrador') {
                    console.log('Redirecting to admin page...');
                    window.location.href = '/index.html';
                } else {
                    console.log('Redirecting to user page...');
                    window.location.href = '/usuario.html';
                }
                
                return data;
            } else {
                console.error('No token received in login response');
                throw new Error('No token received');
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            
            // Mostrar mensagem de erro
            const loginError = document.getElementById('loginError');
            if (loginError) {
                loginError.classList.remove('d-none');
            }
            
            // Esconder spinner e habilitar botão
            const loginSpinner = document.getElementById('loginSpinner');
            const loginButton = document.getElementById('loginButton');
            
            if (loginSpinner) {
                loginSpinner.classList.add('d-none');
            }
            
            if (loginButton) {
                loginButton.disabled = false;
            }
            
            throw error;
        });
    }

}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing auth on page load...');
    window.auth = new Auth();
    
    // Verificar se já existe um objeto auth global
    if (!window.auth) {
        console.error('Auth: Falha ao inicializar objeto auth global');
    } else {
        console.log('Auth: Objeto auth global inicializado com sucesso');
    }
    
    // Verificar autenticação
    checkAuthentication();
});

// Garantir que o objeto auth esteja disponível globalmente
window.auth = window.auth || new Auth();

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
            window.auth.logout();
        }
        resolve();
    });
}
