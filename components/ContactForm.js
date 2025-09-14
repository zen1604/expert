// components/ContactForm.js
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { sendContactMessage } from '../app/contact/actions'; // Correct relative path
import { useEffect, useRef } from 'react';

// The initial state for our form
const initialState = {
  success: false,
  message: '',
};

// A submit button that shows a "pending" state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="cta-button" disabled={pending}>
      {pending ? 'Sending...' : 'Send Message'}
    </button>
  );
}

export default function ContactForm() {
  // useFormState handles the return value from our Server Action
  const [state, formAction] = useFormState(sendContactMessage, initialState);
  const formRef = useRef(null); // Create a ref to access the form element

  // Effect to reset the form fields on successful submission
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);


  // If the submission was successful, we show the success message instead of the form.
  if (state.success) {
    return <p className="success-message">{state.message}</p>;
  }

  return (
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
        <label htmlFor="subject">Subject</label>
        <input type="text" id="subject" name="subject" required />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows="6" required></textarea>
      </div>
      
      <SubmitButton />

      {/* Display error messages from the server, if any */}
      {!state.success && state.message && (
        <p style={{ color: 'var(--banner-red)', marginTop: '15px', fontWeight: '500' }}>
          {state.message}
        </p>
      )}
    </form>
  );
}
