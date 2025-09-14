// app/page.js
'use client'; // We need client-side code for the modal interaction

import { useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import ListingModal from '../components/ListingModal';
import { getProperties } from '../lib/data';

// Fetch the data on the client side for Phase 1 simulation
const properties = getProperties(); 

export default function HomePage() {
    const [selectedProperty, setSelectedProperty] = useState(null);

    return (
        <>
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <h1 className="hero-title">Find Your Next Commercial Space</h1>
                    <p className="hero-subtitle">Premium industrial and commercial properties in prime locations</p>
                </div>
            </section>

            {/* Property Listings */}
            <section className="main-content">
                <div className="container">
                    <div className="results-header">
                        <span className="results-count">{properties.length} Results Found</span>
                    </div>

                    <div className="property-listings">
                        {properties.map((property) => (
                            <PropertyCard 
                                key={property.id} 
                                property={property} 
                                onCardClick={setSelectedProperty} 
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal for Details */}
            <ListingModal 
                property={selectedProperty} 
                onClose={() => setSelectedProperty(null)} 
            />
        </>
    );

}
