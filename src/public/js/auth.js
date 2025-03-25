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
        
        // Atualizar informações do usuário no navbar
        const userInfo = document.getElementById('userInfo');
        if (userInfo && this.user) {
            const lastLogin = localStorage.getItem('lastLogin') || new Date().toLocaleString();
            userInfo.textContent = `${this.user.nome} (${this.user.id}) - Último acesso: ${lastLogin}`;
            console.log('Updated user info in navbar');
        }

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

    getAuthHeaders() {
        console.log('Getting auth headers...');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
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
