// Script temporário para testar diferentes papéis de usuário
document.addEventListener('DOMContentLoaded', function() {
    // Função para simular login com diferentes papéis
    function simulateLogin(role) {
        const mockUser = {
            id: 1,
            nome: `Usuário de Teste (${role})`,
            email: `teste@exemplo.com`,
            role: role,
            isActive: true,
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
        
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjE2MTYyMjIwLCJleHAiOjE2MTYyNDg2MjB9.mock-token';
        
        // Salvar no localStorage
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('lastLogin', new Date().toLocaleString());
        
        // Recarregar a página para aplicar as alterações
        window.location.reload();
    }
    
    // Criar botões de teste na parte superior da página
    const testPanel = document.createElement('div');
    testPanel.style.position = 'fixed';
    testPanel.style.top = '0';
    testPanel.style.left = '0';
    testPanel.style.right = '0';
    testPanel.style.backgroundColor = '#f8d7da';
    testPanel.style.padding = '10px';
    testPanel.style.zIndex = '9999';
    testPanel.style.textAlign = 'center';
    testPanel.innerHTML = `
        <h4>PAINEL DE TESTE DE PAPÉIS (AMBIENTE DE DESENVOLVIMENTO)</h4>
        <button id="admin-role-btn" class="btn btn-danger">Testar como Admin</button>
        <button id="cadastrador-role-btn" class="btn btn-warning">Testar como Cadastrador</button>
        <button id="user-role-btn" class="btn btn-info">Testar como Usuário</button>
        <button id="logout-test-btn" class="btn btn-secondary">Simular Logout</button>
    `;
    
    document.body.prepend(testPanel);
    
    // Adicionar event listeners aos botões
    document.getElementById('admin-role-btn').addEventListener('click', () => simulateLogin('admin'));
    document.getElementById('cadastrador-role-btn').addEventListener('click', () => simulateLogin('cadastrador'));
    document.getElementById('user-role-btn').addEventListener('click', () => simulateLogin('user'));
    document.getElementById('logout-test-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    });
    
    // Ajustar o body para não ficar escondido pelo painel
    document.body.style.marginTop = '70px';
});
