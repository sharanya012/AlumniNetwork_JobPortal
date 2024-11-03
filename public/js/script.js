// public/js/script.js
function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    loginForm.classList.toggle('hidden');
    signupForm.classList.toggle('hidden');
}

document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Basic validation
        const password = form.querySelector('input[name="password"]');
        const confirmPassword = form.querySelector('input[name="confirm_password"]');
        
        if (confirmPassword && password.value !== confirmPassword.value) {
            alert("Passwords don't match!");
            return;
        }
        
        // Prepare form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        try {
            // Determine if this is login or signup
            const endpoint = form.closest('.form-container').id === 'loginForm' ? '/api/login' : '/api/signup';
            
            console.log('Sending request to:', endpoint);
            console.log('With data:', data);

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            console.log('Server response:', result);
            
            if (result.success) {
                alert(result.message); // Add this to see success message
                window.location.href = result.redirect;
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Detailed error:', error);
            alert('An error occurred. Please try again.');
        }
    });
});