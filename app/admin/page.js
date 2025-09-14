// app/admin/page.js

import { logout } from './actions';
import prisma from '../../lib/prisma';
import PropertyList from './PropertyList';
import styles from './admin.module.css';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <h1>Admin Dashboard</h1>
        <div className={styles.headerActions}>
            <Link href="/admin/property/new" className={styles.addButton}>+ Add New Property</Link>
            <form action={logout}>
              <button type="submit" className={styles.logoutButton}>Log Out</button>
            </form>
        </div>
      </header>

      <div className={styles.dashboardContent}>
        <h2>Manage Properties</h2>
        <PropertyList properties={properties} />
      </div>
    </div>
  );
}
