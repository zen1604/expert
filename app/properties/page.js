// app/properties/page.js

import prisma from '../../lib/prisma';
import PropertyListings from './PropertyListings';

// This is an async Server Component
export default async function PropertiesPage() {
    // 1. Fetch live data directly from the database
    const properties = await prisma.property.findMany({
        orderBy: {
            createdAt: 'desc', // Show newest properties first
        },
    });

    // We must rename 'listingType' from the DB to 'type' for the component
    // And convert the date to a string to pass to the client component
    const formattedProperties = properties.map(p => ({
        ...p,
        type: p.listingType, // Rename field
        createdAt: p.createdAt.toISOString(), // Convert Date to string
        updatedAt: p.updatedAt.toISOString(), // Convert Date to string
    }));

    return (
        <>
            <section className="page-header">
                <div className="container">
                    <h1>Our Properties</h1>
                </div>
            </section>

            <main className="main-content">
                <div className="container">
                    {/* 2. Pass the fetched data to the interactive client component */}
                    <PropertyListings properties={formattedProperties} />
                </div>
            </main>
        </>
    );
}
