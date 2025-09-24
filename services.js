// MultipleFiles/services.js
import { supabase } from './supabase-config.js';
import { getCurrentUser } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links (if any)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Handle "Request Service" buttons
    document.querySelectorAll('.service-item .btn-primary').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const user = await getCurrentUser();
            if (!user) {
                alert('Please log in to request a service.');
                window.location.href = 'login.html';
                return;
            }

            const serviceType = e.target.closest('.service-item').querySelector('h2').textContent;
            // For a real application, you'd likely open a modal or redirect to a form
            // For now, a simple alert and redirection to contact page
            alert(`You are requesting: ${serviceType}. Please provide details on the contact page.`);
            window.location.href = 'contact.html?service=' + encodeURIComponent(serviceType);
        });
    });
});