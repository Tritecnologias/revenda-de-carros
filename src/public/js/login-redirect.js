/**
 * Script para redirecionar usuários após o login com base em seu papel
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Login Redirect: Inicializando...');
    
    // Função para processar o formulário de login
    function setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        
        if (!loginForm) {
            console.error('Login Redirect: Formulário de login não encontrado');
            return;
        }
        
        loginForm.addEventListener('submit', function(event) {
            // Não previne o envio padrão, apenas adiciona um listener para capturar o sucesso
            console.log('Login Redirect: Formulário enviado');
            
            // Armazenar o timestamp para verificar se o login foi bem-sucedido
            localStorage.setItem('loginAttemptTime', Date.now().toString());
        });
    }
    
    // Configurar o formulário de login
    setupLoginForm();
    
    // Verificar se acabamos de fazer login com sucesso
    function checkLoginSuccess() {
        const loginAttemptTime = localStorage.getItem('loginAttemptTime');
        const user = localStorage.getItem('user');
        
        if (loginAttemptTime && user) {
            // Verificar se o login foi recente (nos últimos 5 segundos)
            const now = Date.now();
            const loginTime = parseInt(loginAttemptTime);
            
            if (now - loginTime < 5000) {
                console.log('Login Redirect: Login recente detectado');
                
                try {
                    const userData = JSON.parse(user);
                    
                    if (userData.role) {
                        console.log('Login Redirect: Papel do usuário:', userData.role);
                        
                        // Redirecionar com base no papel
                        if (userData.role === 'admin' || userData.role === 'cadastrador') {
                            console.log('Login Redirect: Redirecionando para admin/cadastrador');
                            window.location.href = '/admin-index.html';
                        } else {
                            console.log('Login Redirect: Redirecionando para usuário comum');
                            window.location.href = '/usuario.html';
                        }
                        
                        // Limpar o timestamp de tentativa de login
                        localStorage.removeItem('loginAttemptTime');
                    }
                } catch (error) {
                    console.error('Login Redirect: Erro ao processar dados do usuário', error);
                }
            }
        }
    }
    
    // Verificar o sucesso do login
    checkLoginSuccess();
});
