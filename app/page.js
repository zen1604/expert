// app/page.js
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">l'eXpert Commercial Real Estate</h1>
          <p className="hero-subtitle">Your trusted partner in finding premium industrial and commercial properties.</p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="page-section">
        <div className="container text-center">
            <h2 className="section-title">Experience That Delivers Results</h2>
            <p className="section-intro">
                With decades of experience in the Montreal commercial real estate market, we provide unparalleled expertise and a commitment to achieving your business goals. Whether you are looking to buy, sell, or lease, we are the experts you need.
            </p>
            <Link href="/properties" className="cta-button">View Our Properties</Link>
        </div>
      </section>
    </>
  );
}
