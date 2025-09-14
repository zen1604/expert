// app/admin/PropertyForm.js
'use client';

import { useFormStatus } from 'react-dom';
import styles from './admin.module.css';

// A submit button that shows a "pending" state while the form is submitting
function SubmitButton({ isEditing }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={styles.saveButton}>
      {pending ? 'Saving...' : (isEditing ? 'Update Property' : 'Create Property')}
    </button>
  );
}

export default function PropertyForm({ property, formAction }) {
  const isEditing = !!property; // True if a property object is passed, false otherwise

  return (
    <form action={formAction} className={styles.propertyForm}>
      {/* Hidden input to hold the property ID when editing */}
      {isEditing && <input type="hidden" name="id" value={property.id} />}
      
      {/* Hidden input to hold the old image URL for deletion on update */}
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
          <input type="text" id="price" name="price" placeholder="$3,200,000 or $22 / sq ft" defaultValue={property?.price} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="category">Category</label>
          <input type="text" id="category" name="category" placeholder="Industrial" defaultValue={property?.category} required />
        </div>
      </div>
      
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="listingType">Listing Type</label>
          <select id="listingType" name="listingType" defaultValue={property?.listingType} required>
            <option value="FOR SALE">For Sale</option>
            <option value="FOR LEASE">For Lease</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={property?.status} required>
            <option value="AVAILABLE">Available</option>
            <option value="SOLD">Sold</option>
            <option value="LEASED">Leased</option>
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="details">Property Details</label>
        <textarea id="details" name="details" rows="5" placeholder="High-ceiling industrial warehouse..." defaultValue={property?.details || ''}></textarea>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="image">Property Image</label>
        <input type="file" id="image" name="image" accept="image/*" required={!isEditing} />
        {isEditing && <p className={styles.formHint}>Current Image: {property.imgUrl.split('/').pop()}. Upload a new file to replace it.</p>}
      </div>

      <div className={styles.formActions}>
        <SubmitButton isEditing={isEditing} />
      </div>
    </form>
  );
}
