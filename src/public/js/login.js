document.addEventListener('DOMContentLoaded', function() {
    const auth = window.auth || new Auth();
    
    // Se já estiver logado, redireciona para a página principal
    if (auth.isAuthenticated()) {
        window.location.href = '/index.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const loginSpinner = document.getElementById('loginSpinner');
    const loginError = document.getElementById('loginError');
    
    // Verificar se o usuário foi redirecionado por causa de token expirado
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('expired') === 'true') {
        loginError.textContent = 'Sua sessão expirou. Por favor, faça login novamente.';
        loginError.classList.remove('d-none');
    }

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Reset validation state
        loginForm.classList.remove('was-validated');
        loginError.classList.add('d-none');
        
        // Get form data
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Validate form
        if (!email || !password) {
            loginForm.classList.add('was-validated');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            loginError.textContent = 'Por favor, informe um e-mail válido';
            loginError.classList.remove('d-none');
            return;
        }
        
        // Show loading state
        loginButton.disabled = true;
        loginSpinner.classList.remove('d-none');
        
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            
            if (!response.ok) {
                throw new Error('Login failed');
            }
            
            const data = await response.json();
            
            // Store token and user data
            auth.setAuth(data.access_token, data.user);
            
            // Redirect to main page
            window.location.href = '/index.html';
            
        } catch (error) {
            loginError.textContent = 'E-mail ou senha inválidos';
            loginError.classList.remove('d-none');
            console.error('Login error:', error);
        } finally {
            // Reset loading state
            loginButton.disabled = false;
            loginSpinner.classList.add('d-none');
        }
    });
});
