// app/contact/page.js
import ContactForm from "../../components/ContactForm";

export default function ContactPage() {
    return (
        <>
            <section className="page-header">
                <div className="container">
                    <h1>Contact Us</h1>
                </div>
            </section>
            <section className="page-section">
                <div className="container">
                    <h2 className="section-title">Get in Touch</h2>
                    <p className="section-intro">Have a question or need to discuss a property? Fill out the form below or contact us directly.</p>
                    <ContactForm />
                </div>
            </section>
        </>
    );
}
