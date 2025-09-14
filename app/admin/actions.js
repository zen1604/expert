// app/admin/actions.js
'use server';

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob';
import prisma from '../../lib/prisma';
import { sessionOptions } from '../../lib/session';

// --- LOGOUT ACTION (from before) ---
export async function logout() {
  const session = await getIronSession(cookies(), sessionOptions);
  session.destroy();
  redirect('/login');
}

// --- CREATE / UPDATE ACTION ---
export async function upsertProperty(formData) {
  const id = formData.get('id');
  const oldImgUrl = formData.get('oldImgUrl');
  const imageFile = formData.get('image');

  const data = {
    address: formData.get('address'),
    city: formData.get('city'),
    price: formData.get('price'),
    category: formData.get('category'),
    listingType: formData.get('listingType'),
    status: formData.get('status'),
    details: formData.get('details'),
  };

  let imageUrl = oldImgUrl; // Default to old image URL

  // If a new image file is uploaded
  if (imageFile && imageFile.size > 0) {
    // 1. Upload the new image to Vercel Blob
    const blob = await put(imageFile.name, imageFile, {
      access: 'public',
    });
    imageUrl = blob.url; // Get the URL of the new image

    // 2. If this was an edit, delete the old image
    if (oldImgUrl) {
      await del(oldImgUrl);
    }
  }

  // Add the final image URL to our data object
  data.imgUrl = imageUrl;

  if (id) {
    // Update existing property
    await prisma.property.update({
      where: { id },
      data,
    });
  } else {
    // Create new property
    await prisma.property.create({
      data,
    });
  }

  // Clear the cache for the public properties page to show the update instantly
  revalidatePath('/properties');
  // Redirect back to the admin dashboard
  redirect('/admin');
}


// --- DELETE ACTION ---
export async function deleteProperty(id, imgUrl) {
    if (!id || !imgUrl) {
        throw new Error('ID and Image URL are required to delete a property.');
    }

    // 1. Delete the image from Vercel Blob
    await del(imgUrl);

    // 2. Delete the property record from the database
    await prisma.property.delete({
        where: { id },
    });

    // 3. Revalidate the public properties page cache
    revalidatePath('/properties');
    revalidatePath('/admin'); // Also revalidate the admin page
}
