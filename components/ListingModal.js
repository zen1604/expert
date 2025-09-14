// components/ListingModal.js
import { useEffect } from 'react';

export default function ListingModal({ property, onClose }) {
    if (!property) return null;

    // Use effect to handle closing the modal with the ESC key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div className="modal active" onClick={(e) => e.target.classList.contains('modal') && onClose()}>
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <img className="modal-image" src={property.imgUrl} alt={`Image of ${property.address}`} />
                <div className="modal-details">
                    <h3 className="listing-type">{property.type}</h3>
                    <p className="property-category">{property.category}</p>
                    <p className="property-address" style={{ fontSize: '24px' }}>{property.address}</p>
                    <p className="property-city" style={{ marginBottom: '20px' }}>{property.city}</p>
                    <p className="property-price" style={{ fontSize: '28px', marginBottom: '20px', color: 'var(--price-red)' }}>{property.price}</p>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {property.details || "Further details about the property, including square footage, amenities, and contact information would be displayed here."}
                    </p>
                    <p style={{ marginTop: '20px', fontWeight: '600' }}>Status: {property.status}</p>
                </div>
            </div>
        </div>
    );
}