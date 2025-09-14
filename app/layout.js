// app/layout.js
import { Montserrat } from 'next/font/google';
import Header from '../components/Header';
import '../styles/globals.css'; // Import global styles

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata = {
  title: "l'eXpert - Commercial Real Estate",
  description: "Premium industrial and commercial properties in prime locations.",
};

export default function RootLayout({ children }) {
  // Note: We include the Header here, but the dark mode logic must be in the client component itself (Header.js)
  return (
    <html lang="en">
      <head>
        {/* Font Awesome CDN - Required for icons */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossOrigin="anonymous" />
      </head>
      <body className={montserrat.className}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );

}
