// app/properties/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import styles from './property-page.module.css';
import Link from 'next/link';
import ImageLightbox from '../../../components/ImageLightbox.js'; // Adjust path if your components folder is elsewhere

// Helper component for rendering specification items conditionally
const SpecItem = ({ label, value }) => {
    // Return null if the value is null, undefined, or an empty string.
    // Allow boolean `false` to be rendered (as '✗').
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
    const [isLoading, setIsLoading] = useState(true);
    
    // Fetch data on the client side using the API route
    useEffect(() => {
        const fetchProperty = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/properties/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProperty(data);
                } else {
                    setProperty(null); // Handle not found case
                }
            } catch (error) {
                console.error("Failed to fetch property:", error);
                setProperty(null);
            }
            setIsLoading(false);
        };
        fetchProperty();
    }, [params.id]);

    if (isLoading) {
        return <div className="container" style={{padding: '50px 0', textAlign: 'center'}}>Loading Property Details...</div>;
    }

    if (!property) {
        return <div className="container" style={{padding: '50px 0', textAlign: 'center'}}>Property not found. It may have been removed or is not currently visible.</div>;
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
                    
                    {property.details && (
                        <div className={styles.mainDescription}>
                            <p>{property.details}</p>
                        </div>
                    )}

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

                    {allImages.length > 0 && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Gallery</h2>
                            <div className={styles.galleryGrid}>
                                {allImages.map((url, index) => (
                                    <img key={index} src={url} alt={`Property image ${index + 1}`} loading="lazy" onClick={() => openLightbox(index)} />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </main>
            {lightboxIndex !== null && <ImageLightbox images={allImages} startIndex={lightboxIndex} onClose={closeLightbox} />}
        </>
    );
}
