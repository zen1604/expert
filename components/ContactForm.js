// components/ContactForm.js
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { sendContactMessage } from '../app/contact/actions'; // Correct relative path
import { useEffect, useRef } from 'react';

const initialState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="cta-button" disabled={pending}>
      {pending ? 'Sending...' : 'Send Message'}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useFormState(sendContactMessage, initialState);
  const formRef = useRef(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <>
      {state.success && (
        <p className="success-message" style={{ color: 'var(--success-green)', marginBottom: '15px', fontWeight: '500' }}>
          {state.message}
        </p>
      )}

      <form ref={formRef} action={formAction} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" required />
        </div>
        
        {/* Buyer/Seller field has been removed */}

        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input type="text" id="subject" name="subject" required />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="6" required></textarea>
        </div>
        
        <SubmitButton />

        {!state.success && state.message && (
          <p style={{ color: 'var(--banner-red)', marginTop: '15px', fontWeight: '500' }}>
            {state.message}
          </p>
        )}
      </form>
    </>
  );
}
