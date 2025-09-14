// lib/session.js

export const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'lexpert-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true, // Prevent client-side JS from accessing the cookie
    sameSite: 'lax',
  },
};
