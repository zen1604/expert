// components/ImageLightbox.js
'use client';

import { useState, useEffect } from 'react';

export default function ImageLightbox({ images, startIndex, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(startIndex);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const showNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const showPrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    if (startIndex === null) return null;

    return (
        <div className="lightbox-overlay" onClick={onClose}>
            <button className="lightbox-close" onClick={onClose}>&times;</button>
            <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); showPrev(); }}>&#10094;</button>
            <img src={images[currentIndex]} alt={`Property image ${currentIndex + 1}`} onClick={(e) => e.stopPropagation()} />
            <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); showNext(); }}>&#10095;</button>
            <div className="lightbox-counter" onClick={(e) => e.stopPropagation()}>{currentIndex + 1} / {images.length}</div>
        </div>
    );
}
