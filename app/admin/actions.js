// app/admin/actions.js
'use server';

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob';
import prisma from '../../lib/prisma';
import { sessionOptions } from '../../lib/session';

export async function logout() {
  const session = await getIronSession(cookies(), sessionOptions);
  session.destroy();
  redirect('/login');
}

// NEW ACTION: Handles uploading files on-the-fly from the admin form
export async function uploadImagesAction(formData) {
    const files = formData.getAll('files');
    if (!files || files.length === 0) {
        return { success: false, error: 'No files provided.' };
    }

    try {
        const blobs = await Promise.all(
            files.map(file => put(file.name, file, { access: 'public' }))
        );
        const urls = blobs.map(blob => blob.url);
        return { success: true, urls };
    } catch (error) {
        console.error('Image upload failed:', error);
        return { success: false, error: 'Image upload failed.' };
    }
}

// HEAVILY MODIFIED: Now accepts image URLs and all new fields
export async function upsertProperty(formData) {
    const id = formData.get('id');
    
    // Image URLs are now passed as a comma-separated string
    const imageUrls = formData.get('imageUrls')?.split(',').filter(Boolean) || [];
    const mainImageUrl = imageUrls[0] || ''; // The first image is the main one
    const mediaImageUrls = imageUrls.slice(1); // The rest are for the gallery

    const data = {
        address: formData.get('address'), city: formData.get('city'), price: formData.get('price'), category: formData.get('category'),
        listingType: formData.get('listingType'), status: formData.get('status'), details: formData.get('details'),
        isVisible: formData.get('isVisible') === 'on', imgUrl: mainImageUrl,

        minSizeSqFt: formData.get('minSizeSqFt'), maxSizeSqFt: formData.get('maxSizeSqFt'), clearHeightFeet: formData.get('clearHeightFeet'),
        truckLevelDoors: formData.get('truckLevelDoors'), driveInDoors: formData.get('driveInDoors'), parking: formData.get('parking'),
        yearOfConstruction: formData.get('yearOfConstruction'), zoning: formData.get('zoning'), electricalEntry: formData.get('electricalEntry'),
        warehouseHeating: formData.get('warehouseHeating'), officeHeating: formData.get('officeHeating'), buildingType: formData.get('buildingType'),
        premisesType: formData.get('premisesType'), dimensionsFeet: formData.get('dimensionsFeet'), columnSpansFeet: formData.get('columnSpansFeet'),
        landAreaSqFt: formData.get('landAreaSqFt'), feetSqFt: formData.get('feetSqFt'),

        officeAC: formData.get('officeAC') === 'on', sprinklers: formData.get('sprinklers') === 'on',

        areaOfficeSqFt: formData.get('areaOfficeSqFt'), areaWarehouseSqFt: formData.get('areaWarehouseSqFt'),
        areaMezzanineSqFt: formData.get('areaMezzanineSqFt'), areaTotalSqFt: formData.get('areaTotalSqFt'),
        
        pricePerSqFt: formData.get('pricePerSqFt'), assessmentYear: formData.get('assessmentYear'), assessmentLand: formData.get('assessmentLand'),
        assessmentBuilding: formData.get('assessmentBuilding'), assessmentTotal: formData.get('assessmentTotal'),
        taxYear: formData.get('taxYear'), taxMunicipal: formData.get('taxMunicipal'), taxSchool: formData.get('taxSchool'), taxTotal: formData.get('taxTotal'),
    };

    let propertyId = id;
    if (id) {
        // UPDATE
        const existingProperty = await prisma.property.findUnique({ where: { id }, include: { media: true } });
        const existingMediaUrls = existingProperty.media.map(m => m.url);
        
        // Delete media that are no longer in the list
        const mediaToDelete = existingProperty.media.filter(m => !mediaImageUrls.includes(m.url));
        if (mediaToDelete.length > 0) {
            await prisma.media.deleteMany({ where: { id: { in: mediaToDelete.map(m => m.id) } } });
        }
        
        // Create media for new URLs
        const newMediaUrls = mediaImageUrls.filter(url => !existingMediaUrls.includes(url));
        if (newMediaUrls.length > 0) {
            await prisma.media.createMany({ data: newMediaUrls.map(url => ({ url, propertyId: id })) });
        }

        await prisma.property.update({ where: { id }, data });
    } else {
        // CREATE
        const newProperty = await prisma.property.create({ data });
        propertyId = newProperty.id;
        if (mediaImageUrls.length > 0) {
            await prisma.media.createMany({ data: mediaImageUrls.map(url => ({ url, propertyId })) });
        }
    }

    revalidatePath('/properties');
    revalidatePath(`/properties/${propertyId}`);
    revalidatePath('/admin');
    redirect('/admin');
}

export async function deleteProperty(id) {
    if (!id) throw new Error('ID is required.');
    const property = await prisma.property.findUnique({ where: { id }, include: { media: true } });
    if (!property) throw new Error('Property not found.');
    const urlsToDelete = [property.imgUrl, ...property.media.map(m => m.url)].filter(Boolean);
    if (urlsToDelete.length > 0) {
        await del(urlsToDelete).catch(err => console.error("Blob deletion failed:", err));
    }
    await prisma.property.delete({ where: { id } });
    revalidatePath('/properties');
    revalidatePath('/admin');
}
