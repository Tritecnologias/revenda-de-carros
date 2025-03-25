document.addEventListener('DOMContentLoaded', function() {
    const auth = window.auth || new Auth();
    auth.checkAuthAndRedirect();

    const changePasswordForm = document.getElementById('changePasswordForm');
    const saveButton = document.getElementById('saveButton');
    const saveSpinner = document.getElementById('saveSpinner');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    changePasswordForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Reset messages
        successMessage.classList.add('d-none');
        errorMessage.classList.add('d-none');
        
        // Get form data
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate form
        if (!currentPassword || !newPassword || !confirmPassword) {
            changePasswordForm.classList.add('was-validated');
            return;
        }

        // Validate password match
        if (newPassword !== confirmPassword) {
            errorMessage.textContent = 'As senhas não conferem';
            errorMessage.classList.remove('d-none');
            return;
        }

        // Validate password strength
        if (newPassword.length < 6) {
            errorMessage.textContent = 'A nova senha deve ter pelo menos 6 caracteres';
            errorMessage.classList.remove('d-none');
            return;
        }
        
        // Show loading state
        saveButton.disabled = true;
        saveSpinner.classList.remove('d-none');
        
        try {
            const response = await fetch('/users/change-password', {
                method: 'POST',
                headers: auth.getAuthHeaders(),
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to change password');
            }
            
            // Show success message
            successMessage.classList.remove('d-none');
            
            // Clear form
            changePasswordForm.reset();
            
        } catch (error) {
            errorMessage.textContent = error.message === 'Invalid current password' 
                ? 'Senha atual incorreta'
                : 'Erro ao alterar senha. Por favor, tente novamente.';
            errorMessage.classList.remove('d-none');
            console.error('Change password error:', error);
        } finally {
            // Reset loading state
            saveButton.disabled = false;
            saveSpinner.classList.add('d-none');
        }
    });
});
