// app/admin/actions.js
'use server';

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sessionOptions } from '../../lib/session';

export async function logout() {
  const session = await getIronSession(cookies(), sessionOptions);
  session.destroy(); // Destroy the session
  redirect('/login'); // Redirect to the login page
}
