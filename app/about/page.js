// app/about/page.js
export default function AboutPage() {
    return (
        <>
            <section className="page-header">
                <div className="container">
                    <h1>About Us</h1>
                </div>
            </section>
            <section className="page-section">
                <div className="container">
                    <h2 className="section-title">Our Mission</h2>
                    <p>Our mission is to provide exceptional commercial real estate services with integrity, professionalism, and a deep understanding of the local market. We strive to build long-lasting relationships with our clients by putting their needs first and exceeding their expectations at every turn. We are not just brokers; we are strategic partners in your success.</p>
                    
                    <h2 className="section-title" style={{ marginTop: '50px' }}>Meet the Expert</h2>
                    <p>With a career spanning over 25 years, our lead broker has a proven track record of successful transactions and a reputation for expert negotiation and market analysis. [More placeholder text about the expert's qualifications, history, and a personal touch can go here.]</p>
                </div>
            </section>
        </>
    );
}
