document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado e é admin
    const auth = new Auth();
    auth.checkAuthAndRedirect();
    
    const user = auth.getUser();
    if (user.role !== 'admin') {
        window.location.href = '/index.html';
        return;
    }

    // Elementos do DOM
    const userForm = document.getElementById('userForm');
    const userModal = new bootstrap.Modal(document.getElementById('userModal'));
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    const saveUserButton = document.getElementById('saveUserButton');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    
    let currentPage = 1;
    let selectedUserId = null;

    // Carregar lista de usuários
    async function loadUsers(page = 1) {
        try {
            const response = await fetch(`/users?page=${page}&limit=10`, {
                headers: auth.getAuthHeaders()
            });
            
            if (!response.ok) throw new Error('Failed to load users');
            
            const data = await response.json();
            displayUsers(data.users);
            updatePagination(data);
            
        } catch (error) {
            console.error('Error loading users:', error);
            alert('Erro ao carregar usuários');
        }
    }

    // Exibir usuários na tabela
    function displayUsers(users) {
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';
        
        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${user.nome}</td>
                <td>${user.email}</td>
                <td>${user.role === 'admin' ? 'Administrador' : 'Usuário'}</td>
                <td>
                    <span class="badge ${user.isActive ? 'bg-success' : 'bg-danger'}">
                        ${user.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>${user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Nunca'}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-user" data-id="${user.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Atualizar paginação
    function updatePagination(data) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';
        
        // Botão Previous
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${data.page === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `
            <a class="page-link" href="#" data-page="${data.page - 1}">Anterior</a>
        `;
        pagination.appendChild(prevLi);
        
        // Páginas
        for (let i = 1; i <= data.lastPage; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === data.page ? 'active' : ''}`;
            li.innerHTML = `
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            `;
            pagination.appendChild(li);
        }
        
        // Botão Next
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${data.page === data.lastPage ? 'disabled' : ''}`;
        nextLi.innerHTML = `
            <a class="page-link" href="#" data-page="${data.page + 1}">Próximo</a>
        `;
        pagination.appendChild(nextLi);
    }

    // Limpar formulário
    function clearForm() {
        userForm.reset();
        document.getElementById('userId').value = '';
        document.getElementById('password').required = true;
    }

    // Carregar dados do usuário no formulário
    async function loadUserData(id) {
        try {
            const response = await fetch(`/users/${id}`, {
                headers: auth.getAuthHeaders()
            });
            
            if (!response.ok) throw new Error('Failed to load user');
            
            const user = await response.json();
            
            document.getElementById('userId').value = user.id;
            document.getElementById('nome').value = user.nome;
            document.getElementById('email').value = user.email;
            document.getElementById('role').value = user.role;
            
            // Verificar se isActive existe antes de usar
            if (document.getElementById('isActive')) {
                document.getElementById('isActive').value = user.isActive !== undefined 
                    ? user.isActive.toString() 
                    : 'true'; // Valor padrão se não existir
            }
            
            document.getElementById('password').required = false;
            
            document.getElementById('userModalTitle').textContent = 'EDITAR USUÁRIO';
            userModal.show();
            
        } catch (error) {
            console.error('Error loading user:', error);
            alert('Erro ao carregar dados do usuário');
        }
    }

    // Salvar usuário
    async function saveUser(e) {
        e.preventDefault();
        
        if (!userForm.checkValidity()) {
            userForm.classList.add('was-validated');
            return;
        }

        const userId = document.getElementById('userId').value;
        const userData = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            role: document.getElementById('role').value,
            isActive: document.getElementById('isActive').value === 'true'
        };

        const password = document.getElementById('password').value;
        if (password) {
            userData.password = password;
        } else if (!userId) {
            alert('A senha é obrigatória para novos usuários');
            return;
        }

        try {
            const url = userId ? `/users/${userId}` : '/users';
            const method = userId ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: auth.getAuthHeaders(),
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to save user');
            }
            
            userModal.hide();
            loadUsers(currentPage);
            clearForm();
            
        } catch (error) {
            console.error('Error saving user:', error);
            alert(error.message || 'Erro ao salvar usuário');
        }
    }

    // Excluir usuário
    async function deleteUser(id) {
        try {
            const response = await fetch(`/users/${id}`, {
                method: 'DELETE',
                headers: auth.getAuthHeaders()
            });
            
            if (!response.ok) throw new Error('Failed to delete user');
            
            loadUsers(currentPage);
            
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Erro ao excluir usuário');
        }
    }

    // Event Listeners
    document.getElementById('userModal').addEventListener('show.bs.modal', function(event) {
        if (!event.relatedTarget) return; // Modal being shown programmatically
        clearForm();
        document.getElementById('userModalTitle').textContent = 'Novo Usuário';
    });

    document.getElementById('pagination').addEventListener('click', function(e) {
        e.preventDefault();
        if (e.target.hasAttribute('data-page')) {
            currentPage = parseInt(e.target.getAttribute('data-page'));
            loadUsers(currentPage);
        }
    });

    document.getElementById('usersTableBody').addEventListener('click', function(e) {
        const target = e.target.closest('button');
        if (!target) return;

        const userId = target.getAttribute('data-id');
        
        if (target.classList.contains('edit-user')) {
            loadUserData(userId);
        } else if (target.classList.contains('delete-user')) {
            selectedUserId = userId;
            confirmModal.show();
        }
    });

    // Adicionar evento de submit ao formulário
    userForm.addEventListener('submit', saveUser);
    
    // Atualizar o evento do botão salvar para submeter o formulário
    saveUserButton.addEventListener('click', function() {
        userForm.dispatchEvent(new Event('submit'));
    });

    confirmDeleteButton.addEventListener('click', function() {
        if (selectedUserId) {
            deleteUser(selectedUserId);
            confirmModal.hide();
        }
    });

    // Carregar usuários inicialmente
    loadUsers();
});
