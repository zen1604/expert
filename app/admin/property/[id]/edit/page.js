// app/admin/property/[id]/edit/page.js

import PropertyForm from '../../PropertyForm';
import { upsertProperty } from '../../actions';
import prisma from '../../../../lib/prisma';
import styles from '../../admin.module.css';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditPropertyPage({ params }) {
  const { id } = params;
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    notFound();
  }
  
  return (
    <div className={styles.adminContainer}>
      <div className={styles.pageHeader}>
        <h1>Edit Property: {property.address}</h1>
        <Link href="/admin" className={styles.backLink}>&larr; Back to Dashboard</Link>
      </div>
      <PropertyForm property={property} formAction={upsertProperty} />
    </div>
  );
}
