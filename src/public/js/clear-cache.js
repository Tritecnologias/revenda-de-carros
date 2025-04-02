// Script para limpar o cache do navegador
// Este script deve ser incluído na página de login para garantir que o cache seja limpo antes do login

document.addEventListener('DOMContentLoaded', function() {
    console.log('Verificando necessidade de limpar cache...');
    
    // Verificar se o cache já foi limpo nesta sessão
    const cacheCleared = sessionStorage.getItem('cacheCleared');
    
    if (!cacheCleared) {
        console.log('Limpando cache do navegador...');
        
        // Limpar localStorage, exceto token se necessário
        const token = localStorage.getItem('token');
        localStorage.clear();
        
        // Restaurar token se necessário para manter sessão
        if (token) {
            localStorage.setItem('token', token);
        }
        
        // Marcar que o cache foi limpo nesta sessão
        sessionStorage.setItem('cacheCleared', 'true');
        
        console.log('Cache limpo com sucesso!');
        
        // Recarregar a página para aplicar as alterações
        if (window.location.pathname !== '/login.html') {
            console.log('Redirecionando para login para aplicar alterações...');
            window.location.href = '/login.html';
        }
    } else {
        console.log('Cache já foi limpo nesta sessão.');
    }
});
