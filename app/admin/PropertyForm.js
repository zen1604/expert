// app/admin/PropertyForm.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import styles from './admin.module.css';
import { uploadImagesAction } from './actions';

function SubmitButton({ isEditing }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className={styles.saveButton}>{pending ? 'Saving...' : (isEditing ? 'Update Property' : 'Create Property')}</button>;
}

export default function PropertyForm({ property, formAction }) {
  const isEditing = !!property;
  const [listingType, setListingType] = useState(property?.listingType || 'FOR SALE');
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Initialize images state on load
  useEffect(() => {
    if (property) {
      const allImages = [
        ...(property.imgUrl ? [{ url: property.imgUrl, id: 'main' }] : []),
        ...(property.media?.map(m => ({ url: m.url, id: m.id })) || [])
      ];
      setImages(allImages);
    }
  }, [property]);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const result = await uploadImagesAction(formData);
    
    if (result.success) {
      const newImageObjects = result.urls.map(url => ({ url, id: url }));
      setImages(prev => [...prev, ...newImageObjects]);
    } else {
      alert(result.error);
    }
    setIsUploading(false);
    if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("imageIndex", index);
  };

  const handleDrop = (e, dropIndex) => {
    const dragIndex = e.dataTransfer.getData("imageIndex");
    const draggedImage = images[dragIndex];
    const newImages = [...images];
    newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    setImages(newImages);
  };
  
  const handleDragOver = (e) => e.preventDefault();
  
  return (
    <form action={formAction} className={styles.propertyForm}>
      {isEditing && <input type="hidden" name="id" value={property.id} />}
      <input type="hidden" name="imageUrls" value={images.map(img => img.url).join(',')} />

      {/* --- IMAGE UPLOADER & MANAGEMENT --- */}
      <div className={styles.formSection}>
        <h2>Property Images</h2>
        <p className={styles.formHint}>Drag and drop images to reorder them. The first image will be the main featured image.</p>
        <div className={styles.imageUploader}>
          <div className={styles.imagePreviewGrid} onDragOver={handleDragOver}>
            {images.map((image, index) => (
              <div 
                key={image.id || image.url} 
                className={styles.imagePreviewItem}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                <img src={image.url} alt={`Preview ${index + 1}`} />
                <button type="button" className={styles.removeImageBtn} onClick={() => handleRemoveImage(index)}>&times;</button>
                <span className={styles.imageOrderBadge}>{index + 1}</span>
                {index === 0 && <span className={styles.imageMainBadge}>Main</span>}
              </div>
            ))}
            <div className={styles.uploadBox}>
              <input type="file" multiple onChange={handleFileChange} ref={fileInputRef} id="imageUpload" className={styles.fileInput} />
              <label htmlFor="imageUpload" className={styles.uploadLabel}>{isUploading ? "Uploading..." : "+ Add Images"}</label>
            </div>
          </div>
        </div>
      </div>
      
      {/* --- PROPERTY DETAILS --- */}
      <div className={styles.formSection}>
        <h2>Property Details</h2>
        <div className={styles.formRow}><div className={styles.formGroup}><label>Address</label><input name="address" defaultValue={property?.address}/></div><div className={styles.formGroup}><label>City</label><input name="city" defaultValue={property?.city}/></div></div>
        <div className={styles.formRow}><div className={styles.formGroup}><label>Category</label><input name="category" defaultValue={property?.category}/></div></div>
        <div className={styles.formGroup}><label>Description</label><textarea name="details" defaultValue={property?.details} rows="6"/></div>
      </div>

      {/* --- LISTING DETAILS --- */}
      <div className={styles.formSection}>
        <h2>Listing Details</h2>
        <div className={styles.formRow}>
          <div className={styles.formGroup}><label>Listing Type</label><select name="listingType" value={listingType} onChange={(e) => setListingType(e.target.value)}><option value="FOR SALE">For Sale</option><option value="FOR LEASE">For Lease</option></select></div>
          <div className={styles.formGroup}><label>Status</label><select name="status" defaultValue={property?.status}><option value="AVAILABLE">Available</option>{listingType === 'FOR SALE' && <option value="SOLD">Sold</option>}{listingType === 'FOR LEASE' && <option value="LEASED">Leased</option>}</select></div>
        </div>
      </div>

      {/* --- PROPERTY SPECIFICATIONS --- */}
      <div className={styles.formSection}>
        <h2>Property Specifications</h2>
        <div className={styles.formGrid}>
            <div className={styles.formGroup}><label>Min. Size (sq ft)</label><input name="minSizeSqFt" defaultValue={property?.minSizeSqFt} /></div>
            <div className={styles.formGroup}><label>Max. Size (sq ft)</label><input name="maxSizeSqFt" defaultValue={property?.maxSizeSqFt} /></div>
            <div className={styles.formGroup}><label>Clear Height (feet)</label><input name="clearHeightFeet" defaultValue={property?.clearHeightFeet} /></div>
            <div className={styles.formGroup}><label>Truck Level Doors</label><input name="truckLevelDoors" defaultValue={property?.truckLevelDoors} /></div>
            <div className={styles.formGroup}><label>Drive-In Doors</label><input name="driveInDoors" defaultValue={property?.driveInDoors} /></div>
            <div className={styles.formGroup}><label>Parking</label><input name="parking" defaultValue={property?.parking} /></div>
            <div className={styles.formGroup}><label>Year of Construction</label><input name="yearOfConstruction" defaultValue={property?.yearOfConstruction} /></div>
            <div className={styles.formGroup}><label>Zoning</label><input name="zoning" defaultValue={property?.zoning} /></div>
            <div className={styles.formGroup}><label>Electrical Entry</label><input name="electricalEntry" defaultValue={property?.electricalEntry} /></div>
            <div className={styles.formGroup}><label>Warehouse Heating</label><input name="warehouseHeating" defaultValue={property?.warehouseHeating} /></div>
            <div className={styles.formGroup}><label>Office Heating</label><input name="officeHeating" defaultValue={property?.officeHeating} /></div>
            <div className={styles.formGroup}><label>Building Type</label><input name="buildingType" defaultValue={property?.buildingType} /></div>
            <div className={styles.formGroup}><label>Premises Type</label><input name="premisesType" defaultValue={property?.premisesType} /></div>
            <div className={styles.formGroup}><label>Dimensions (feet)</label><input name="dimensionsFeet" defaultValue={property?.dimensionsFeet} /></div>
            <div className={styles.formGroup}><label>Column Spans (feet)</label><input name="columnSpansFeet" defaultValue={property?.columnSpansFeet} /></div>
            <div className={styles.formGroup}><label>Land Area (sq ft)</label><input name="landAreaSqFt" defaultValue={property?.landAreaSqFt} /></div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}><label className={styles.checkboxLabel}><input type="checkbox" name="officeAC" defaultChecked={property?.officeAC} /> Office AC</label></div>
          <div className={styles.formGroup}><label className={styles.checkboxLabel}><input type="checkbox" name="sprinklers" defaultChecked={property?.sprinklers} /> Sprinklers</label></div>
        </div>
      </div>
      
      {/* --- AREA BREAKDOWN --- */}
      <div className={styles.formSection}>
          <h2>Area Breakdown (sq ft)</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}><label>Office</label><input name="areaOfficeSqFt" defaultValue={property?.areaOfficeSqFt}/></div>
            <div className={styles.formGroup}><label>Warehouse</label><input name="areaWarehouseSqFt" defaultValue={property?.areaWarehouseSqFt}/></div>
            <div className={styles.formGroup}><label>Mezzanine</label><input name="areaMezzanineSqFt" defaultValue={property?.areaMezzanineSqFt}/></div>
            <div className={styles.formGroup}><label>TOTAL</label><input name="areaTotalSqFt" defaultValue={property?.areaTotalSqFt}/></div>
          </div>
      </div>

      {/* --- FINANCIAL INFORMATION --- */}
      <div className={styles.formSection}>
          <h2>Financial Information</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}><label>Asking Price</label><input name="price" defaultValue={property?.price}/></div>
            <div className={styles.formGroup}><label>Price per sq ft</label><input name="pricePerSqFt" defaultValue={property?.pricePerSqFt}/></div>
            <div className={styles.formGroup}><label>Assessment Year</label><input name="assessmentYear" defaultValue={property?.assessmentYear}/></div>
            <div className={styles.formGroup}><label>Assessment Land</label><input name="assessmentLand" defaultValue={property?.assessmentLand}/></div>
            <div className={styles.formGroup}><label>Assessment Building</label><input name="assessmentBuilding" defaultValue={property?.assessmentBuilding}/></div>
            <div className={styles.formGroup}><label>Assessment TOTAL</label><input name="assessmentTotal" defaultValue={property?.assessmentTotal}/></div>
            <div className={styles.formGroup}><label>Municipal Taxes</label><input name="taxMunicipal" defaultValue={property?.taxMunicipal}/></div>
            <div className={styles.formGroup}><label>School Taxes</label><input name="taxSchool" defaultValue={property?.taxSchool}/></div>
            <div className={styles.formGroup}><label>Taxes TOTAL</label><input name="taxTotal" defaultValue={property?.taxTotal}/></div>
          </div>
      </div>
      
      {/* --- VISIBILITY & SUBMIT --- */}
      <div className={styles.formSection}>
        <div className={styles.formGroup}>
          <label>Visibility</label><label className={styles.switch}><input type="checkbox" name="isVisible" defaultChecked={property ? property.isVisible : true} /><span className={styles.slider}></span></label>
          <p className={styles.formHint}>When checked, this property will appear on the public website.</p>
        </div>
        <div className={styles.formActions}><SubmitButton isEditing={isEditing} /></div>
      </div>
    </form>
  );
}
