// MultipleFiles/main.js
import { getCurrentUser, signOut } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    const authButtons = document.querySelector('.auth-buttons');
    const mainNavProfileLink = document.querySelector('.main-nav ul li a[href="profile.html"]');

    const user = await getCurrentUser();

    if (user) {
        // User is logged in
        authButtons.innerHTML = `
            <a href="#" class="btn btn-outline" id="logout-btn">Logout</a>
        `;
        // Ensure profile link is visible/active if needed
        if (mainNavProfileLink) {
            mainNavProfileLink.classList.add('active');
        }

        document.getElementById('logout-btn').addEventListener('click', async (e) => {
            e.preventDefault();
            const { success, error } = await signOut();
            if (success) {
                alert('Logged out successfully!');
                window.location.href = 'index.html';
            } else {
                alert('Logout failed: ' + error);
            }
        });

    } else {
        // User is not logged in
        authButtons.innerHTML = `
            <a href="login.html" class="btn btn-outline">Login</a>
            <a href="register.html" class="btn btn-primary">Register</a>
        `;
        // Ensure profile link is not active or hidden if needed
        if (mainNavProfileLink) {
            mainNavProfileLink.classList.remove('active');
        }
    }

    // Mobile menu toggle (if applicable, ensure it's still functional)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            mobileMenuToggle.classList.toggle('active');
        });
    }
});