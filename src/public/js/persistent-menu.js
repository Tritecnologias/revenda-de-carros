/**
 * Script para garantir que o menu VEÍCULOS permaneça visível em todas as páginas
 * e que todos os seus submenus sejam preservados
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Persistent Menu: Inicializando...');
    
    // Verificar se o usuário é admin ou cadastrador
    const userJson = localStorage.getItem('user');
    if (!userJson) {
        console.log('Persistent Menu: Nenhum usuário encontrado');
        return;
    }
    
    try {
        const user = JSON.parse(userJson);
        
        // Se o usuário for admin ou cadastrador, garantir que o menu VEÍCULOS esteja visível
        if (user.role === 'admin' || user.role === 'cadastrador') {
            console.log('Persistent Menu: Usuário é admin ou cadastrador, garantindo visibilidade do menu VEÍCULOS');
            
            // Função para garantir que o menu VEÍCULOS esteja visível
            function ensureVeiculosMenuVisible() {
                const veiculosMenu = document.getElementById('veiculosMenuContainer');
                if (veiculosMenu) {
                    console.log('Persistent Menu: Menu VEÍCULOS encontrado, tornando-o visível');
                    veiculosMenu.style.display = '';
                    veiculosMenu.style.visibility = 'visible';
                    
                    // Verificar se o menu tem todos os submenus
                    ensureAllSubmenus();
                } else {
                    console.log('Persistent Menu: Menu VEÍCULOS não encontrado, tentando novamente em 500ms');
                    setTimeout(ensureVeiculosMenuVisible, 500);
                }
            }
            
            // Função para garantir que todos os submenus estejam presentes
            function ensureAllSubmenus() {
                const dropdown = document.querySelector('#veiculosDropdown + .dropdown-menu');
                if (!dropdown) {
                    console.log('Persistent Menu: Dropdown do menu VEÍCULOS não encontrado');
                    return;
                }
                
                // Lista de todos os submenus que devem estar presentes
                const requiredSubmenus = [
                    { href: '/veiculos/marca.html', text: 'MARCA' },
                    { href: '/veiculos/modelo.html', text: 'MODELO' },
                    { href: '/veiculos/veiculo.html', text: 'VEÍCULO' },
                    { href: '/veiculos/opcional.html', text: 'OPCIONAIS' },
                    { href: '/pinturas.html', text: 'PINTURAS' },
                    { href: '/veiculos/venda-direta.html', text: 'VENDA DIRETA' }
                ];
                
                // Verificar se todos os submenus estão presentes
                const existingLinks = Array.from(dropdown.querySelectorAll('a.dropdown-item')).map(a => a.getAttribute('href'));
                
                // Adicionar submenus faltantes
                for (const submenu of requiredSubmenus) {
                    if (!existingLinks.includes(submenu.href)) {
                        console.log(`Persistent Menu: Adicionando submenu ${submenu.text}`);
                        
                        const li = document.createElement('li');
                        const a = document.createElement('a');
                        a.className = 'dropdown-item';
                        a.href = submenu.href;
                        a.textContent = submenu.text;
                        
                        li.appendChild(a);
                        dropdown.appendChild(li);
                    }
                }
            }
            
            // Iniciar a verificação do menu
            ensureVeiculosMenuVisible();
            
            // Verificar periodicamente para garantir que o menu permaneça visível
            // (útil para páginas que podem modificar o DOM após o carregamento)
            setInterval(ensureVeiculosMenuVisible, 2000);
            
            // Observar mudanças no DOM que possam afetar o menu
            const observer = new MutationObserver(function(mutations) {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' || mutation.type === 'attributes') {
                        ensureVeiculosMenuVisible();
                    }
                }
            });
            
            // Observar o corpo do documento para quaisquer mudanças
            observer.observe(document.body, { 
                childList: true, 
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }
    } catch (error) {
        console.error('Persistent Menu: Erro ao processar usuário', error);
    }
});
