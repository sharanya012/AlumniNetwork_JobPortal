async function fetchUserProfile() {
    const userId = window.location.pathname.split('/')[2]; // Extract user ID from the URL
    try {
        const response = await fetch(`/api/profile/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const userData = await response.json();
            displayUserProfile(userData);
        } else {
            console.error('Failed to fetch user profile');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

// Function to display the user profile on the page
function displayUserProfile(userData) {
    const profileName = document.querySelector('.profile-name');
    const profileBranch = document.querySelector('.profile-branch');
    const profilePic = document.querySelector('.profile-pic img');

    if (userData) {
        profileName.innerText = userData.name || 'Name not available';
        //profileBranch.innerText = `Branch: ${userData.branch || 'Not specified'} | Batch: ${userData.batch || 'Not specified'}`;
        //profilePic.src = userData.profilePic || 'placeholder-profile.jpg'; // Use placeholder if no profile pic available
    } else {
        profileName.innerText = 'Profile not found';
    }
}


// Initialize the profile page
document.addEventListener('DOMContentLoaded', () => {
    fetchUserProfile();

});







