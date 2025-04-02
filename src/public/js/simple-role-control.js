/**
 * Controle de acesso simples baseado em papel do usuário
 * Esta abordagem é simples e direta, sem complexidades
 */

// Executar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple Role Control: Iniciando...');
    
    // Obter o usuário do localStorage
    try {
        const userJson = localStorage.getItem('user');
        if (!userJson) {
            console.log('Simple Role Control: Nenhum usuário encontrado');
            return;
        }
        
        const user = JSON.parse(userJson);
        console.log('Simple Role Control: Usuário encontrado', user);
        
        if (!user.role) {
            console.log('Simple Role Control: Usuário sem papel definido');
            return;
        }
        
        console.log('Simple Role Control: Papel do usuário:', user.role);
        
        // Remover menu VEÍCULOS para usuários comuns
        if (user.role !== 'admin' && user.role !== 'cadastrador') {
            console.log('Simple Role Control: Removendo menu VEÍCULOS para usuário comum');
            
            // Selecionar todos os elementos do menu VEÍCULOS
            const veiculosMenuItems = document.querySelectorAll('.dropdown:has(a:contains("VEÍCULOS"))');
            
            // Se o seletor avançado não funcionar, tentar abordagem mais simples
            if (veiculosMenuItems.length === 0) {
                document.querySelectorAll('.dropdown').forEach(function(dropdown) {
                    const link = dropdown.querySelector('a');
                    if (link && link.textContent && link.textContent.trim() === 'VEÍCULOS') {
                        console.log('Simple Role Control: Menu VEÍCULOS encontrado, removendo...');
                        dropdown.remove();
                    }
                });
            } else {
                veiculosMenuItems.forEach(function(item) {
                    item.remove();
                });
            }
            
            // Remover qualquer outro elemento relacionado a VEÍCULOS
            document.querySelectorAll('a').forEach(function(link) {
                if (link.textContent && link.textContent.trim() === 'VEÍCULOS') {
                    const parent = link.closest('li') || link.parentNode;
                    if (parent) {
                        console.log('Simple Role Control: Link VEÍCULOS encontrado, removendo...');
                        parent.remove();
                    }
                }
            });
        }
    } catch (error) {
        console.error('Simple Role Control: Erro ao processar usuário', error);
    }
});
