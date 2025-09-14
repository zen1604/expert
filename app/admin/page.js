// app/admin/page.js

import { logout } from './actions';
import styles from './admin.module.css';

export default function AdminDashboardPage() {
  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <h1>Admin Dashboard</h1>
        <form action={logout}>
          <button type="submit" className={styles.logoutButton}>Log Out</button>
        </form>
      </header>

      <div className={styles.dashboardContent}>
        <h2>Welcome, Admin!</h2>
        <p>This is your secure dashboard. The property management tools will be built here.</p>
        
        {/* We will add the "Add New" button and property list here in the next step */}
      </div>
    </div>
  );
}
