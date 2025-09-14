// app/login/actions.js
'use server';

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sessionOptions } from '../../lib/session';
import bcrypt from 'bcrypt';

export async function authenticate(prevState, formData) {
  const password = formData.get('password');
  const adminPassword = process.env.ADMIN_PASSWORD;

  // For added security, hash the stored password on the fly to compare.
  // This prevents timing attacks. In a real multi-user system, you'd store hashed passwords.
  const passwordMatches = await bcrypt.compare(password, await bcrypt.hash(adminPassword, 10));

  if (!passwordMatches) {
    return 'The password is incorrect.';
  }

  // If the password is correct, create a session
  const session = await getIronSession(cookies(), sessionOptions);
  session.isLoggedIn = true;
  await session.save();

  // Redirect to the admin dashboard
  redirect('/admin');
}
