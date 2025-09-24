// MultipleFiles/dashboard.js
import { supabase } from './supabase-config.js';
import { getCurrentUser, getUserProfile, updateProfile, updatePassword, signOut } from './auth.js';

let currentUser = null;
let userProfile = null;
let serviceRequestSubscription = null;

document.addEventListener('DOMContentLoaded', async () => {
    currentUser = await getCurrentUser();
    if (!currentUser) {
        alert('You need to be logged in to view your dashboard.');
        window.location.href = 'login.html';
        return;
    }

    userProfile = await getUserProfile(currentUser.id);
    if (userProfile) {
        document.getElementById('user-name').textContent = userProfile.full_name || 'N/A';
        document.getElementById('user-email').textContent = userProfile.email || 'N/A';
        document.getElementById('user-contact').textContent = userProfile.phone_number || 'N/A';
        document.getElementById('user-address').textContent = userProfile.address || 'N/A';
        document.getElementById('user-vehicle-model').textContent = userProfile.vehicle_model || 'N/A';
    } else {
        alert('Could not load user profile data.');
    }

    // Load existing service requests
    await loadServiceRequests();

    // Subscribe to real-time updates for service requests
    subscribeToServiceRequests(currentUser.id, (payload) => {
        console.log('Realtime update received for service requests:', payload);
        loadServiceRequests(); // Reload requests on any change
    });

    // Modal and form handling for profile editing (similar to profile.js)
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const editProfileModal = document.getElementById('edit-profile-modal');
    const closeModal = document.getElementById('close-modal');
    const editProfileForm = document.getElementById('edit-profile-form');

    editProfileBtn.addEventListener('click', () => {
        if (userProfile) {
            document.getElementById('edit-name').value = userProfile.full_name || '';
            document.getElementById('edit-email').value = userProfile.email || '';
            document.getElementById('edit-contact').value = userProfile.phone_number || '';
            document.getElementById('edit-address').value = userProfile.address || '';
            document.getElementById('edit-vehicle-model').value = userProfile.vehicle_model || '';
            document.getElementById('edit-password').value = '';
        }
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
        const updatedVehicleModel = document.getElementById('edit-vehicle-model').value;
        const newPassword = document.getElementById('edit-password').value;

        const updates = {
            full_name: updatedName,
            phone_number: updatedContact,
            address: updatedAddress,
            vehicle_model: updatedVehicleModel,
            email: updatedEmail
        };

        const { success: profileUpdateSuccess, error: profileUpdateError } = await updateProfile(currentUser.id, updates);

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
            userProfile = await getUserProfile(currentUser.id);
            if (userProfile) {
                document.getElementById('user-name').textContent = userProfile.full_name;
                document.getElementById('user-email').textContent = userProfile.email;
                document.getElementById('user-contact').textContent = userProfile.phone_number;
                document.getElementById('user-address').textContent = userProfile.address;
                document.getElementById('user-vehicle-model').textContent = userProfile.vehicle_model;
            }
        } else {
            alert('Failed to update profile: ' + profileUpdateError);
        }
    });

    // Handle Logout
    const logoutButton = document.querySelector('.auth-buttons .btn-outline');
    if (logoutButton && logoutButton.textContent === 'Login') { // Assuming it changes to Logout after login
        logoutButton.textContent = 'Logout';
        logoutButton.href = '#'; // Prevent default navigation
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

async function loadServiceRequests() {
    const requestsListDiv = document.getElementById('requestsList');
    requestsListDiv.innerHTML = '<h3>Loading Service Requests...</h3>';

    try {
        const { data: requests, error } = await supabase
            .from('service_requests')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (requests.length === 0) {
            requestsListDiv.innerHTML = '<p>No service requests found.</p>';
            return;
        }

        requestsListDiv.innerHTML = ''; // Clear loading message
        requests.forEach(request => {
            const requestCard = document.createElement('div');
            requestCard.className = 'service-request-card';
            requestCard.innerHTML = `
                <h4>Request ID: ${request.id}</h4>
                <p><strong>Service Type:</strong> ${request.service_type}</p>
                <p><strong>Location:</strong> ${request.location}</p>
                <p><strong>Description:</strong> ${request.description}</p>
                <p><strong>Status:</strong> <span class="status-${request.status.toLowerCase()}">${request.status}</span></p>
                <p><strong>Requested At:</strong> ${new Date(request.created_at).toLocaleString()}</p>
                ${request.provider_id ? `<p><strong>Assigned Provider:</strong> ${request.provider_id}</p>` : ''}
                ${request.resolution_details ? `<p><strong>Resolution:</strong> ${request.resolution_details}</p>` : ''}
            `;
            requestsListDiv.appendChild(requestCard);
        });

    } catch (error) {
        console.error('Error loading service requests:', error.message);
        requestsListDiv.innerHTML = `<p>Error loading service requests: ${error.message}</p>`;
    }
}

// Function to create a new service request form (can be a modal or a new page)
function createServiceRequestForm() {
    const requestsListDiv = document.getElementById('requestsList');
    requestsListDiv.innerHTML = `
        <h3>Submit New Service Request</h3>
        <form id="newServiceRequestForm">
            <div class="form-group">
                <label for="serviceType">Service Type:</label>
                <select id="serviceType" name="serviceType" required>
                    <option value="">Select a service</option>
                    <option value="Battery Jump Start">Battery Jump Start</option>
                    <option value="Fuel Delivery">Fuel Delivery</option>
                    <option value="Lockout Service">Lockout Service</option>
                    <option value="Towing Service">Towing Service</option>
                    <option value="Tire Change">Tire Change</option>
                    <option value="Winching">Winching</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="location">Location:</label>
                <input type="text" id="location" name="location" placeholder="Your current location" required>
            </div>
            <div class="form-group">
                <label for="description">Description:</label>
                <textarea id="description" name="description" rows="4" placeholder="Describe your issue" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Submit Request</button>
            <button type="button" class="btn btn-outline" onclick="loadServiceRequests()">Cancel</button>
        </form>
    `;

    document.getElementById('newServiceRequestForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const serviceType = document.getElementById('serviceType').value;
        const location = document.getElementById('location').value;
        const description = document.getElementById('description').value;

        try {
            const { error } = await supabase
                .from('service_requests')
                .insert([
                    {
                        user_id: currentUser.id,
                        service_type: serviceType,
                        location: location,
                        description: description,
                        status: 'Pending' // Default status
                    }
                ]);

            if (error) throw error;

            alert('Service request submitted successfully!');
            loadServiceRequests(); // Reload requests
        } catch (error) {
            console.error('Error submitting service request:', error.message);
            alert('Failed to submit service request: ' + error.message);
        }
    });
}

// Supabase Realtime Subscription for service requests
function subscribeToServiceRequests(userId, callback) {
    if (serviceRequestSubscription) {
        supabase.removeChannel(serviceRequestSubscription);
    }

    serviceRequestSubscription = supabase
        .channel('service_requests_channel')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'service_requests', filter: `user_id=eq.${userId}` },
            (payload) => {
                console.log('Realtime update for service requests:', payload);
                callback(payload);
            }
        )
        .subscribe();
}

// Unsubscribe function (can be called on page unload if needed)
function unsubscribeRealtime() {
    if (serviceRequestSubscription) {
        supabase.removeChannel(serviceRequestSubscription);
        serviceRequestSubscription = null;
        console.log('Unsubscribed from service requests realtime channel.');
    }
}

// Optional: Call unsubscribe when the user navigates away or logs out
window.addEventListener('beforeunload', unsubscribeRealtime);