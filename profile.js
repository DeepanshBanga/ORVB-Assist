// MultipleFiles/profile.js
import { getCurrentUser, getUserProfile, updateProfile, updatePassword, signOut } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    const user = await getCurrentUser();
    if (!user) {
        alert('You need to be logged in to view your profile.');
        window.location.href = 'login.html';
        return;
    }

    const profileData = await getUserProfile(user.id);
    if (profileData) {
        document.getElementById('user-name').textContent = profileData.full_name || 'N/A';
        document.getElementById('user-email').textContent = profileData.email || 'N/A';
        document.getElementById('user-contact').textContent = profileData.phone_number || 'N/A';
        document.getElementById('user-address').textContent = profileData.address || 'N/A';
        document.getElementById('user-vehicle').textContent = profileData.vehicle_model || 'N/A';
    } else {
        alert('Could not load profile data.');
    }

    const editProfileBtn = document.getElementById('edit-profile-btn');
    const editProfileModal = document.getElementById('edit-profile-modal');
    const closeModal = document.querySelector('.modal-content .close');
    const editProfileForm = document.getElementById('edit-profile-form');

    editProfileBtn.addEventListener('click', () => {
        // Populate modal with current data
        document.getElementById('edit-name').value = profileData.full_name || '';
        document.getElementById('edit-email').value = profileData.email || '';
        document.getElementById('edit-contact').value = profileData.phone_number || '';
        document.getElementById('edit-address').value = profileData.address || '';
        document.getElementById('edit-vehicle').value = profileData.vehicle_model || '';
        document.getElementById('edit-password').value = ''; // Clear password field for security

        editProfileModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        editProfileModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === editProfileModal) {
            editProfileModal.style.display = 'none';
        }
    });

    editProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedName = document.getElementById('edit-name').value;
        const updatedEmail = document.getElementById('edit-email').value;
        const updatedContact = document.getElementById('edit-contact').value;
        const updatedAddress = document.getElementById('edit-address').value;
        const updatedVehicle = document.getElementById('edit-vehicle').value;
        const newPassword = document.getElementById('edit-password').value;

        const updates = {
            full_name: updatedName,
            phone_number: updatedContact,
            address: updatedAddress,
            vehicle_model: updatedVehicle,
            email: updatedEmail // Update email in profile table
        };

        const { success: profileUpdateSuccess, error: profileUpdateError } = await updateProfile(user.id, updates);

        let passwordUpdateSuccess = true;
        if (newPassword) {
            const { success, error } = await updatePassword(newPassword);
            passwordUpdateSuccess = success;
            if (!success) {
                alert('Failed to update password: ' + error);
            }
        }

        if (profileUpdateSuccess && passwordUpdateSuccess) {
            alert('Profile updated successfully!');
            editProfileModal.style.display = 'none';
            // Re-fetch and display updated data
            const updatedProfileData = await getUserProfile(user.id);
            if (updatedProfileData) {
                document.getElementById('user-name').textContent = updatedProfileData.full_name;
                document.getElementById('user-email').textContent = updatedProfileData.email;
                document.getElementById('user-contact').textContent = updatedProfileData.phone_number;
                document.getElementById('user-address').textContent = updatedProfileData.address;
                document.getElementById('user-vehicle').textContent = updatedProfileData.vehicle_model;
            }
        } else {
            alert('Failed to update profile: ' + profileUpdateError);
        }
    });

    // Handle Logout
    const logoutButton = document.querySelector('.auth-buttons .btn-outline');
    if (logoutButton && logoutButton.textContent === 'Logout') {
        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();
            const { success, error } = await signOut();
            if (success) {
                alert('Logged out successfully!');
                window.location.href = 'index.html';
            } else {
                alert('Logout failed: ' + error);
            }
        });
    }
});