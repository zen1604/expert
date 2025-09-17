// app/admin/PropertyForm.js
'use client';

import React, { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import styles from './admin.module.css';
import { deleteMedia } from './actions';

function SubmitButton({ isEditing }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={styles.saveButton}>
      {pending ? 'Saving...' : (isEditing ? 'Update Property' : 'Create Property')}
    </button>
  );
}

function MediaItem({ media }) {
    const [isDeleting, setIsDeleting] = useState(false);
    
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            setIsDeleting(true);
            await deleteMedia(media.id, media.url);
            // The component will disappear on re-render, no need to set isDeleting back to false
        }
    };

    return (
        <div className={styles.mediaItem}>
            <a href={media.url} target="_blank" rel="noopener noreferrer">
                <img src={media.url} alt="Property media" />
            </a>
            <button type="button" onClick={handleDelete} disabled={isDeleting} className={styles.deleteMediaButton}>
                {isDeleting ? '...' : '×'}
            </button>
        </div>
    );
}

export default function PropertyForm({ property, formAction }) {
  const isEditing = !!property;
  const [listingType, setListingType] = useState(property?.listingType || 'FOR SALE');

  useEffect(() => {
    if (property?.listingType) setListingType(property.listingType);
  }, [property]);

  return (
    <form action={formAction} className={styles.propertyForm}>
      {isEditing && <input type="hidden" name="id" value={property.id} />}
      {isEditing && <input type="hidden" name="oldImgUrl" value={property.imgUrl} />}

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="address" defaultValue={property?.address} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="city">City</label>
          <input type="text" id="city" name="city" defaultValue={property?.city} required />
        </div>
      </div>
      
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="price">Price</label>
          <input type="text" id="price" name="price" defaultValue={property?.price} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="category">Category</label>
          <input type="text" id="category" name="category" defaultValue={property?.category} required />
        </div>
      </div>
      
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="listingType">Listing Type</label>
          <select id="listingType" name="listingType" value={listingType} onChange={(e) => setListingType(e.target.value)} required>
            <option value="FOR SALE">For Sale</option>
            <option value="FOR LEASE">For Lease</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={property?.status} required>
            <option value="AVAILABLE">Available</option>
            {listingType === 'FOR SALE' && <option value="SOLD">Sold</option>}
            {listingType === 'FOR LEASE' && <option value="LEASED">Leased</option>}
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="details">Property Details</label>
        <textarea id="details" name="details" rows="8" placeholder="Enter property details. Line breaks will be preserved." defaultValue={property?.details || ''}></textarea>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="image">Main (Featured) Image</label>
        <input type="file" id="image" name="image" accept="image/*" required={!isEditing} />
        {isEditing && property.imgUrl && <p className={styles.formHint}>Current: <a href={property.imgUrl} target="_blank" rel="noopener noreferrer">View Image</a>. Upload a new file to replace it.</p>}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="media">Additional Gallery Images</label>
        <input type="file" id="media" name="media" accept="image/*" multiple />
        {isEditing && property.media?.length > 0 && (
          <>
            <p className={styles.formHint} style={{marginTop: '15px'}}>Existing Gallery Images:</p>
            <div className={styles.mediaGrid}>
              {property.media.map(item => <MediaItem key={item.id} media={item} />)}
            </div>
          </>
        )}
      </div>

      <div className={styles.formGroup}>
          <label>Visibility</label>
          <label className={styles.switch}>
              <input type="checkbox" name="isVisible" defaultChecked={property ? property.isVisible : true} />
              <span className={styles.slider}></span>
          </label>
          <p className={styles.formHint}>When checked, this property will appear on the public website.</p>
      </div>

      <div className={styles.formActions}>
        <SubmitButton isEditing={isEditing} />
      </div>
    </form>
  );
}
