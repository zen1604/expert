// app/properties/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import styles from './property-page.module.css';
import Link from 'next/link';
import ImageLightbox from '../../../../components/ImageLightbox'; // Adjust path if needed

// Helper component for specification items
const SpecItem = ({ label, value }) => {
    if (!value && typeof value !== 'boolean') return null;
    return (
        <div className={styles.specItem}>
            <span className={styles.specLabel}>{label}</span>
            <span className={styles.specValue}>{typeof value === 'boolean' ? (value ? '✓' : '✗') : value}</span>
        </div>
    );
};

export default function PropertyDetailsPage({ params }) {
    const [property, setProperty] = useState(null);
    const [lightboxIndex, setLightboxIndex] = useState(null);
    
    // Fetch data on the client side
    useEffect(() => {
        const fetchProperty = async () => {
            const res = await fetch(`/api/properties/${params.id}`); // We will need to create this API route
            if (res.ok) {
                const data = await res.json();
                setProperty(data);
            }
        };
        fetchProperty();
    }, [params.id]);

    if (!property) {
        return <div className="container">Loading...</div>; // Or a proper loading skeleton
    }
    
    const allImages = [property.imgUrl, ...property.media.map(m => m.url)].filter(Boolean);
    const openLightbox = (index) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    return (
        <>
            <section className={styles.pageHeaderCustom} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${property.imgUrl})` }}>
                <div className="container"><h1>{property.address}</h1><p>{property.city}</p></div>
            </section>
            <main className="main-content">
                <div className="container">
                    <Link href="/properties" className={styles.backLink}>&larr; Back to All Properties</Link>
                    
                    <div className={styles.mainDescription}>
                        <p>{property.details}</p>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Property Specifications</h2>
                        <div className={styles.specGrid}>
                            <SpecItem label="Min. Size (sq ft)" value={property.minSizeSqFt} />
                            <SpecItem label="Max. Size (sq ft)" value={property.maxSizeSqFt} />
                            <SpecItem label="Clear Height (feet)" value={property.clearHeightFeet} />
                            <SpecItem label="Truck Level Doors" value={property.truckLevelDoors} />
                            <SpecItem label="Drive-In Doors" value={property.driveInDoors} />
                            <SpecItem label="Parking" value={property.parking} />
                            <SpecItem label="Year of Construction" value={property.yearOfConstruction} />
                            <SpecItem label="Zoning" value={property.zoning} />
                            <SpecItem label="Electrical Entry" value={property.electricalEntry} />
                            <SpecItem label="Office AC" value={property.officeAC} />
                            <SpecItem label="Sprinklers" value={property.sprinklers} />
                            <SpecItem label="Warehouse Heating" value={property.warehouseHeating} />
                            <SpecItem label="Office Heating" value={property.officeHeating} />
                            <SpecItem label="Building Type" value={property.buildingType} />
                            <SpecItem label="Premises Type" value={property.premisesType} />
                            <SpecItem label="Dimensions (feet)" value={property.dimensionsFeet} />
                            <SpecItem label="Column Spans (feet)" value={property.columnSpansFeet} />
                            <SpecItem label="Land Area (sq ft)" value={property.landAreaSqFt} />
                        </div>
                    </div>
                    
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Area Breakdown</h2>
                        <div className={styles.financialGrid}>
                           <div className={styles.financialCard}>
                                <h4>Area (sq ft)</h4>
                                <SpecItem label="Office" value={property.areaOfficeSqFt} />
                                <SpecItem label="Warehouse" value={property.areaWarehouseSqFt} />
                                <SpecItem label="Mezzanine" value={property.areaMezzanineSqFt} />
                                <hr/>
                                <SpecItem label="TOTAL" value={property.areaTotalSqFt} />
                           </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Financial Information</h2>
                        <div className={styles.financialGrid}>
                           <div className={styles.financialCard}>
                                <h4>Sale</h4>
                                <SpecItem label="Asking Price" value={property.price} />
                                <SpecItem label="Price per sq ft" value={property.pricePerSqFt} />
                           </div>
                           <div className={styles.financialCard}>
                                <h4>Assessment - {property.assessmentYear || 'N/A'}</h4>
                                <SpecItem label="Land" value={property.assessmentLand} />
                                <SpecItem label="Building" value={property.assessmentBuilding} />
                                <hr/>
                                <SpecItem label="TOTAL" value={property.assessmentTotal} />
                           </div>
                           <div className={styles.financialCard}>
                                <h4>Property Taxes</h4>
                                <SpecItem label="Municipal" value={property.taxMunicipal} />
                                <SpecItem label="School" value={property.taxSchool} />
                                <hr/>
                                <SpecItem label="TOTAL" value={property.taxTotal} />
                           </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Gallery</h2>
                        <div className={styles.galleryGrid}>
                            {allImages.map((url, index) => (
                                <img key={index} src={url} alt={`Property image ${index + 1}`} loading="lazy" onClick={() => openLightbox(index)} />
                            ))}
                        </div>
                    </div>

                </div>
            </main>
            {lightboxIndex !== null && <ImageLightbox images={allImages} startIndex={lightboxIndex} onClose={closeLightbox} />}
        </>
    );
}```

**IMPORTANT:** The page above now fetches data from an API route. You need to create this route.

**File: `app/api/properties/[id]/route.js` (New File)**

```javascript
// app/api/properties/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Adjust path if needed

export async function GET(request, { params }) {
    const { id } = params;
    try {
        const property = await prisma.property.findUnique({
            where: { id: id, isVisible: true },
            include: {
                media: { orderBy: { createdAt: 'asc' } },
            },
        });

        if (!property) {
            return new NextResponse('Property not found', { status: 404 });
        }
        return NextResponse.json(property);
    } catch (error) {
        console.error("API Error fetching property:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
