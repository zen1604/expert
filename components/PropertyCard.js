// components/PropertyCard.js
export default function PropertyCard({ property, onCardClick }) {
    const { id, type, category, address, city, status, price, imgUrl } = property;
    const isLeasedOrSold = status !== 'AVAILABLE';
    const statusClass = status === 'LEASED' ? 'leased' : status === 'SOLD' ? 'sold' : '';

    return (
        <div 
            className="property-card" 
            onClick={() => onCardClick(property)}
        >
            <div className="image-container">
                <img src={imgUrl} alt={`${address} property`} />
                {isLeasedOrSold && (
                    <div className={`status-banner ${statusClass}`}>{status}</div>
                )}
            </div>
            <div className="property-card-content">
                <div className="property-details-main">
                    <h3 className="listing-type">{type}</h3>
                    <p className="property-category">{category}</p>
                    <p className="property-address">{address}</p>
                    <p className="property-city">{city}</p>
                </div>
                <p className="property-price">{price}</p>
            </div>
        </div>
    );
}