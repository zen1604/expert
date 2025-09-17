// app/properties/[id]/page.js
import prisma from '../../../../lib/prisma';
import { notFound } from 'next/navigation';
import styles from './property-page.module.css';
import Link from 'next/link';

export default async function PropertyDetailsPage({ params }) {
    const { id } = params;
    const property = await prisma.property.findUnique({
        // Only find the property if its ID matches AND it's visible
        where: {
            id: id,
            isVisible: true
        },
        include: {
            media: {
                orderBy: { createdAt: 'asc' }
            }
        },
    });

    // If no property is found (either doesn't exist or is not visible), show a 404 page.
    if (!property) {
        notFound();
    }

    // Combine the main image and gallery images into one array for easier mapping
    const allImages = [property.imgUrl, ...property.media.map(m => m.url)];

    return (
        <>
            {/* The hero header uses the main image as a background */}
            <section className={styles.pageHeaderCustom} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${property.imgUrl})` }}>
                <div className="container">
                    <h1>{property.address}</h1>
                    <p>{property.city}</p>
                </div>
            </section>

            <main className="main-content">
                <div className="container">
                    <Link href="/properties" className={styles.backLink}>&larr; Back to All Properties</Link>
                    <div className={styles.propertyLayout}>
                        {/* Left Column: Details */}
                        <div className={styles.propertyDetails}>
                            <h2>Property Overview</h2>
                            <div className={styles.detailItem}><strong>Price:</strong> {property.price}</div>
                            <div className={styles.detailItem}><strong>Category:</strong> {property.category}</div>
                            <div className={styles.detailItem}><strong>Listing Type:</strong> {property.listingType}</div>
                            <div className={styles.detailItem}><strong>Status:</strong> {property.status}</div>
                            
                            <h3>Description</h3>
                            {/* The CSS class handles preserving line breaks */}
                            <p className={styles.descriptionText}>{property.details}</p>
                        </div>

                        {/* Right Column: Gallery */}
                        <aside className={styles.propertyMedia}>
                            <h2>Gallery</h2>
                            <div className={styles.galleryGrid}>
                                {allImages.map((url, index) => (
                                    <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                                        <img src={url} alt={`Property image ${index + 1}`} loading="lazy" />
                                    </a>
                                ))}
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </>
    );
}

// Optional: Generate static pages for better performance
export async function generateStaticParams() {
    const properties = await prisma.property.findMany({
        where: { isVisible: true },
        select: { id: true }
    });
   
    return properties.map((property) => ({
      id: property.id,
    }));
}
