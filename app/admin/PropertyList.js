// app/admin/PropertyList.js
'use client';

import Link from 'next/link';
import { deleteProperty } from './actions';
import styles from './admin.module.css';

export default function PropertyList({ properties }) {

    // --- UPDATED DELETE HANDLER ---
    // It now only needs the property ID. The server action will find all associated image URLs.
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this property? This will also delete all associated images.')) {
            await deleteProperty(id);
        }
    };
    
    if (properties.length === 0) {
        return <p>No properties found. Add one to get started.</p>;
    }

    return (
        <table className={styles.propertyTable}>
            <thead>
                <tr>
                    <th>Address</th>
                    <th>City</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {properties.map((prop) => (
                    <tr key={prop.id}>
                        <td>{prop.address}</td>
                        <td>{prop.city}</td>
                        <td>{prop.price}</td>
                        <td><span className={`${styles.statusBadge} ${styles[prop.status.toLowerCase()]}`}>{prop.status}</span></td>
                        <td className={styles.actionsCell}>
                            <Link href={`/admin/property/${prop.id}/edit`} className={styles.editButton}>Edit</Link>
                            {/* The onClick now calls the simplified handler */}
                            <button onClick={() => handleDelete(prop.id)} className={styles.deleteButton}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
