async function fetchUserProfile() {
    const userId = window.location.pathname.split('/')[2]; // Extract user ID from the URL
    console.log('Extracted userId:', userId); // Log extracted userId

    try {
        const response = await fetch(`/api/profile/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Response status:', response.status); // Log response status

        if (response.ok) {
            const userData = await response.json();
            console.log('User Data:', userData); // Log the user data
            displayUserProfile(userData);
        } else {
            console.error('Failed to fetch user profile, status code:', response.status);
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

// Function to display the user profile on the page
function displayUserProfile(userData) {
    console.log('User Data in displayUserProfile:', userData); // Log user data to check what's received
    
    const profileName = document.querySelector('.profile-name');
    const profileBranch = document.querySelector('.profile-branch');
    const profileBatch=document.querySelector('.profile-batch');
    const profilePic = document.querySelector('.profile-pic img');

    if (userData) {
        // Display full name by combining first, middle, and last name
        const fullName = `${userData.data.firstName || ''} ${userData.data.middleName || ''} ${userData.data.lastName || ''}`.trim();
        profileName.innerText = fullName || 'Name not available';

        // Display branch name
        profileBranch.innerText = userData.data.branchName || 'Branch not available';
        profileBatch.innerText=userData.data.yearOfGraduation || 'x'
        // Display profile picture (if available)
        if (userData.data.profilePicture) {
            profilePic.src = userData.data.profilePicture;
        } else {
            profilePic.src = 'default-profile-picture.jpg'; // default image if none available
        }
    } else {
        profileName.innerText = 'Profile not found';
        profileBranch.innerText = 'Branch not available';
        profilePic.src = 'default-profile-picture.jpg'; // default image if no user data
    }
}

// Initialize the profile page
document.addEventListener('DOMContentLoaded', () => {
    fetchUserProfile();
});
