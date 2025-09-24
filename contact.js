// MultipleFiles/contact.js
import { supabase } from './supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form-container form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullName = document.getElementById('full-name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            try {
                const { error } = await supabase
                    .from('contact_messages') // Assuming you have a 'contact_messages' table
                    .insert([
                        {
                            full_name: fullName,
                            email: email,
                            message: message,
                            submitted_at: new Date().toISOString()
                        }
                    ]);

                if (error) throw error;

                alert('Your message has been sent successfully!');
                contactForm.reset(); // Clear the form
            } catch (error) {
                console.error('Error submitting contact form:', error.message);
                alert('Failed to send your message: ' + error.message);
            }
        });
    }
});