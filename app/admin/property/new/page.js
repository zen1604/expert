// app/admin/property/new/page.js

// Corrected Paths: We are 2 levels deep, so we need to go up 2 times.
import PropertyForm from '../../PropertyForm';
import { upsertProperty } from '../../actions';
import styles from '../../admin.module.css';

import Link from 'next/link';

export default function NewPropertyPage() {
  return (
    <div className={styles.adminContainer}>
        <div className={styles.pageHeader}>
            <h1>Add New Property</h1>
            <Link href="/admin" className={styles.backLink}>&larr; Back to Dashboard</Link>
        </div>
        <PropertyForm formAction={upsertProperty} />
    </div>
  );
}
