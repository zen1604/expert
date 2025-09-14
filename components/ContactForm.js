// components/ContactForm.js
'use client';
import { useState } from 'react';

export default function ContactForm() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you'd handle form submission here (e.g., send data to an API)
        // For now, we'll just show a success message.
        setSubmitted(true);
    };

    if (submitted) {
        return <p className="success-message">Thank you for your message! We will get back to you shortly.</p>;
    }

    return (
        <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" required />
            </div>
            <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="6" required></textarea>
            </div>
            <button type="submit" className="cta-button">Send Message</button>
        </form>
    );
}
