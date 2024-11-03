document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch profile data
        const response = await fetch('/api/profile-data');
        const result = await response.json();

        if (result.success) {
            // Update profile elements with user data
            document.querySelector('.profile-name').textContent = 
                `${result.data.firstName} ${result.data.lastName}`;
            
            // Update other profile elements
            document.querySelector('.branch').textContent = 
                `Branch: ${result.data.branch}`;
            document.querySelector('.batch').textContent = 
                `Batch: ${result.data.graduationYear}`;
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
});

// Add logout functionality
document.querySelector('.logout-btn')?.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST'
        });
        const result = await response.json();
        
        if (result.success) {
            window.location.href = result.redirect;
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
});