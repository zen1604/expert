// app/properties/PropertyListings.js
'use client';

import { useState } from 'react';
// Correctly reference the components from this new file location
import PropertyCard from '../../components/PropertyCard';
import ListingModal from '../../components/ListingModal';

export default function PropertyListings({ properties }) {
    const [selectedProperty, setSelectedProperty] = useState(null);

    return (
        <>
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

            <ListingModal 
                property={selectedProperty} 
                onClose={() => setSelectedProperty(null)} 
            />
        </>
    );
}
