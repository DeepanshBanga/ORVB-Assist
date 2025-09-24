// MultipleFiles/login.js
import { signIn } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const { success, user, error } = await signIn(email, password);

            if (success) {
                alert('Login successful!');
                // Redirect to dashboard or profile based on user role if needed
                window.location.href = 'dashboard.html'; // Or profile.html
            } else {
                alert('Login failed: ' + error);
            }
        });
    }
});