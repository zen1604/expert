// app/login/page.js
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from './actions';
import styles from './login.module.css';

// A simple component for the submit button to show a pending state
function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" aria-disabled={pending}>
      {pending ? 'Logging in...' : 'Log In'}
    </button>
  );
}

export default function LoginPage() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginBox}>
        <div className="logo">l<span>e</span>Xpert</div>
        <h2 className={styles.loginTitle}>Admin Panel</h2>
        
        <form action={dispatch} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              name="password" 
              placeholder="Enter password"
              required 
            />
          </div>
          <LoginButton />
          
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}
