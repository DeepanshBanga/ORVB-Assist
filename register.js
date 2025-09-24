// MultipleFiles/register.js
import { signUp } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const registerAs = document.getElementById('registerAs').value;
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const phoneNumber = document.getElementById('phonenumber').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            const { success, error } = await signUp(email, password, fullname, phoneNumber, registerAs);

            // After successful sign-up
            if (success) {
              alert('Registration successful! Check email to verify.');
              // Optional: Listen for auth state change
              supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN') window.location.href = 'dashboard.html';
              });
            } else {
                alert('Registration failed: ' + error);
            }
        });
    }
});