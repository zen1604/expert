// app/admin/actions.js
'use server';

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob';
import prisma from '../../lib/prisma';
import { sessionOptions } from '../../lib/session';

// --- LOGOUT ACTION (No changes) ---
export async function logout() {
  const session = await getIronSession(cookies(), sessionOptions);
  session.destroy();
  redirect('/login');
}

// --- CREATE / UPDATE ACTION ---
export async function upsertProperty(formData) {
  const id = formData.get('id');
  const oldImgUrl = formData.get('oldImgUrl');
  const mainImageFile = formData.get('image');
  const mediaFiles = formData.getAll('media'); // Get all extra media files

  const data = {
    address: formData.get('address'),
    city: formData.get('city'),
    price: formData.get('price'),
    category: formData.get('category'),
    listingType: formData.get('listingType'),
    status: formData.get('status'),
    details: formData.get('details'),
    isVisible: formData.get('isVisible') === 'on', // Handle checkbox
  };

  // --- 1. Handle Main Featured Image ---
  let mainImageUrl = oldImgUrl;
  if (mainImageFile && mainImageFile.size > 0) {
    const blob = await put(mainImageFile.name, mainImageFile, { access: 'public' });
    mainImageUrl = blob.url;
    if (oldImgUrl) {
      await del(oldImgUrl).catch(err => console.error("Failed to delete old image:", err));
    }
  }
  data.imgUrl = mainImageUrl;

  // --- 2. Handle Property Record (Create or Update) ---
  let propertyId = id;
  if (id) {
    await prisma.property.update({ where: { id }, data });
  } else {
    const newProperty = await prisma.property.create({ data });
    propertyId = newProperty.id;
  }

  // --- 3. Handle Multiple Media Files Upload ---
  if (mediaFiles && mediaFiles.length > 0 && mediaFiles[0].size > 0) {
    const mediaUploadPromises = mediaFiles.map(file => put(file.name, file, { access: 'public' }));
    const blobs = await Promise.all(mediaUploadPromises);
    
    const mediaCreateData = blobs.map(blob => ({
      url: blob.url,
      propertyId: propertyId,
    }));

    await prisma.media.createMany({ data: mediaCreateData });
  }

  // Revalidate all relevant paths
  revalidatePath('/properties');
  revalidatePath(`/properties/${propertyId}`);
  revalidatePath('/admin');
  redirect('/admin');
}

// --- NEW ACTION: DELETE A SINGLE MEDIA ITEM ---
export async function deleteMedia(mediaId, mediaUrl) {
    if (!mediaId || !mediaUrl) return;
    try {
        await del(mediaUrl); // Delete from Vercel Blob
        await prisma.media.delete({ where: { id: mediaId } }); // Delete from DB
        revalidatePath('/admin'); // Revalidate admin pages
    } catch (error) {
        console.error("Failed to delete media:", error);
    }
}

// --- UPDATED DELETE PROPERTY ACTION ---
export async function deleteProperty(id) {
    if (!id) throw new Error('ID is required to delete a property.');

    const property = await prisma.property.findUnique({
        where: { id },
        include: { media: true },
    });

    if (!property) throw new Error('Property not found.');

    const urlsToDelete = [property.imgUrl, ...property.media.map(m => m.url)].filter(Boolean);
    
    if (urlsToDelete.length > 0) {
        await del(urlsToDelete).catch(err => console.error("Failed to delete blob images:", err));
    }

    // Because of `onDelete: Cascade` in the schema, deleting the property
    // will automatically delete all associated media records from the database.
    await prisma.property.delete({ where: { id } });

    revalidatePath('/properties');
    revalidatePath('/admin');
}
