/**
 * Script para gerenciar a funcionalidade de logout em todas as páginas
 * Este script garante que o botão SAIR funcione corretamente em qualquer página do sistema
 */

(function() {
    console.log('Logout Handler: Inicializando...');
    
    // Função para configurar o botão de logout
    function setupLogoutButton() {
        console.log('Logout Handler: Procurando botão de logout...');
        
        // Usar MutationObserver para detectar quando o botão de logout é adicionado ao DOM
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    // Verificar se o botão de logout foi adicionado
                    const logoutButton = document.querySelector('#logoutButton');
                    if (logoutButton && !logoutButton.hasAttribute('data-logout-initialized')) {
                        console.log('Logout Handler: Botão de logout encontrado, configurando evento de clique');
                        
                        // Marcar o botão como inicializado para evitar duplicação de eventos
                        logoutButton.setAttribute('data-logout-initialized', 'true');
                        
                        // Adicionar evento de clique
                        logoutButton.addEventListener('click', handleLogout);
                        
                        // Podemos parar de observar após encontrar o botão
                        observer.disconnect();
                    }
                }
            });
        });
        
        // Iniciar observação do DOM
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Verificar se o botão já existe no DOM
        const existingButton = document.querySelector('#logoutButton');
        if (existingButton && !existingButton.hasAttribute('data-logout-initialized')) {
            console.log('Logout Handler: Botão de logout já existe no DOM, configurando evento de clique');
            
            // Marcar o botão como inicializado para evitar duplicação de eventos
            existingButton.setAttribute('data-logout-initialized', 'true');
            
            // Adicionar evento de clique
            existingButton.addEventListener('click', handleLogout);
            
            // Podemos parar de observar após encontrar o botão
            observer.disconnect();
        }
    }
    
    // Função para lidar com o clique no botão de logout
    function handleLogout() {
        console.log('Logout Handler: Botão de logout clicado');
        
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
                                // Remover dados de autenticação
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                
                                // Redirecionar para a página de logoff
                                window.location.href = '/logoff.html';
                            }, 1000);
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    }
    
    // Configurar o botão de logout quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupLogoutButton);
    } else {
        setupLogoutButton();
    }
})();
