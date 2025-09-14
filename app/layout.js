// app/layout.js
import { Montserrat } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/globals.css'; // Import global styles

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata = {
  title: "l'eXpert - Commercial Real Estate",
  description: "Premium industrial and commercial properties in prime locations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossOrigin="anonymous" />
      </head>
      <body className={montserrat.className}>
        <Header />
        <main>{children}</main>
        <Footer /> {/* Add the Footer here */}
      </body>
    </html>
  );
}

