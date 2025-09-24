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

            if (success) {
                alert('Registration successful! Please check your email to verify your account.');
                window.location.href = 'login.html';
            } else {
                alert('Registration failed: ' + error);
            }
        });
    }
});