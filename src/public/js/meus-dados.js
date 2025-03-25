document.addEventListener('DOMContentLoaded', function() {
    const auth = window.auth || new Auth();
    auth.checkAuthAndRedirect();

    const userDataForm = document.getElementById('userDataForm');
    const saveButton = document.getElementById('saveButton');
    const saveSpinner = document.getElementById('saveSpinner');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Carregar dados do usuário
    const user = auth.getUser();
    if (user) {
        document.getElementById('nome').value = user.nome || '';
        document.getElementById('email').value = user.email || '';
    }

    userDataForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Reset messages
        successMessage.classList.add('d-none');
        errorMessage.classList.add('d-none');
        
        // Get form data
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        
        // Validate form
        if (!nome || !email) {
            userDataForm.classList.add('was-validated');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errorMessage.textContent = 'Por favor, informe um e-mail válido';
            errorMessage.classList.remove('d-none');
            return;
        }
        
        // Show loading state
        saveButton.disabled = true;
        saveSpinner.classList.remove('d-none');
        
        try {
            const response = await fetch('/users/profile', {
                method: 'PUT',
                headers: auth.getAuthHeaders(),
                body: JSON.stringify({ nome, email }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update profile');
            }
            
            const data = await response.json();
            
            // Update stored user data
            const currentUser = auth.getUser();
            auth.setAuth(auth.getToken(), { ...currentUser, ...data });
            
            // Show success message
            successMessage.classList.remove('d-none');
            
        } catch (error) {
            errorMessage.textContent = 'Erro ao atualizar dados. Por favor, tente novamente.';
            errorMessage.classList.remove('d-none');
            console.error('Update profile error:', error);
        } finally {
            // Reset loading state
            saveButton.disabled = false;
            saveSpinner.classList.add('d-none');
        }
    });
});
