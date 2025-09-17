// app/admin/property/[id]/edit/page.js

import PropertyForm from '../../../PropertyForm';
import { upsertProperty } from '../../../actions';
import styles from '../../../admin.module.css';
import prisma from '../../../../../lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditPropertyPage({ params }) {
  const { id } = params;

  // --- UPDATED PRISMA QUERY ---
  // We now `include` the related media files so we can pass them to the form.
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      media: {
        orderBy: {
          createdAt: 'asc' // Optional: order the media files
        }
      }
    },
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
