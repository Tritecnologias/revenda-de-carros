/**
 * Script para verificar o papel do usuário no momento do login
 * e garantir que o controle de acesso seja aplicado corretamente
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Login Role Check: Script iniciado');
    
    // Obter o formulário de login
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        console.log('🔐 Login Role Check: Formulário de login encontrado');
        
        // Adicionar listener para o evento de submit do formulário
        loginForm.addEventListener('submit', function(event) {
            // Não prevenir o comportamento padrão do formulário
            // Apenas adicionar um listener para verificar o papel após o login
            
            console.log('🔐 Login Role Check: Formulário de login submetido');
            
            // Verificar o papel do usuário após um pequeno delay
            setTimeout(function() {
                const userJson = localStorage.getItem('user');
                if (userJson) {
                    try {
                        const user = JSON.parse(userJson);
                        console.log('🔐 Login Role Check: Usuário logado:', user);
                        console.log('🔐 Login Role Check: Papel do usuário:', user.role);
                        
                        // Armazenar o papel do usuário em um cookie para garantir que seja acessível
                        document.cookie = `userRole=${user.role}; path=/; max-age=86400`;
                        
                        // Armazenar o papel do usuário em sessionStorage também
                        sessionStorage.setItem('userRole', user.role);
                        
                        console.log('🔐 Login Role Check: Papel do usuário armazenado em cookie e sessionStorage');
                    } catch (error) {
                        console.error('🔐 Login Role Check: Erro ao processar dados do usuário:', error);
                    }
                }
            }, 1000);
        });
    } else {
        console.log('🔐 Login Role Check: Formulário de login não encontrado');
    }
});
