// src/app/page.tsx

export default function HomePage() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">
            Hand-built gear with a 24K attitude.
          </h2>
          <p className="hero-subtitle">
            From laser-engraved novelties to serious custom builds, Morris Lane LLC
            turns raw lumber, leather, and metal into products with a story.
          </p>
          <div className="hero-cta-row">
            <a href="#shop" className="btn-primary">
              View Signature Products
            </a>
            <a href="#contact" className="btn-secondary">
              Request Custom Work
            </a>
          </div>
        </div>
        <div className="hero-panel">
          <div className="gold-frame">
            <div className="gold-inner">
              <p className="gold-text">
                Veteran-owned. Small-batch. Built to leave a mark.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="section-block">
        <h3 className="section-title">What We Do</h3>
        <div className="card-grid">
          <div className="info-card">
            <h4>Custom Woodwork & Paddles</h4>
            <p>
              Precision-milled paddles and novelty pieces using white pine and
              other select lumber. Designed for engraving, laser work, and CNC.
            </p>
          </div>
          <div className="info-card">
            <h4>Laser Engraving & CNC</h4>
            <p>
              Logos, crests, quotes, serial numbers, and more. Dialed-in templates
              so every run is consistent, scalable, and shop-ready.
            </p>
          </div>
          <div className="info-card">
            <h4>Prototyping & 3D Printed Jigs</h4>
            <p>
              3D printed jigs, fixtures, and templates that hold your workpieces
              rock-solid on the router or laser for fast repeat jobs.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS / SHOP */}
      <section id="shop" className="section-block">
        <h3 className="section-title">Signature Pieces</h3>
        <div className="card-grid">
          <div className="product-card">
            <h4>“Boomer Stick” Paddle</h4>
            <p>4&quot; x 20&quot; novelty paddle, engraved text, ready for display or gifting.</p>
            <p className="product-meta">Material: White Pine · Finish: Raw or sealed</p>
          </div>
          <div className="product-card">
            <h4>“Ass Cracker – Millennial Edition”</h4>
            <p>Laser-engraved gag-gift paddle, designed for laughs and wall-mounting.</p>
            <p className="product-meta">Perfect for man caves, shops, and bars.</p>
          </div>
          <div className="product-card">
            <h4>Custom Quote Paddle</h4>
            <p>
              Your text, your font, your joke. Built to spec with jigs that keep every cut identical.
            </p>
            <p className="product-meta">Bulk orders available.</p>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="section-block">
        <h3 className="section-title">About Morris Lane LLC</h3>
        <div className="two-column">
          <p>
            Morris Lane LLC is a veteran-owned workshop and creative lab, built on
            precision, prepper-grade practicality, and a sense of humor. We run
            CNC, laser, and 3D printing gear to turn raw materials into products
            that feel premium, heavy in the hand, and ready to last.
          </p>
          <p>
            The long game is simple: build an American family brand with products
            that outlive trends, and document the craft so the next generation can
            pick up where we leave off.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="section-block">
        <h3 className="section-title">Contact & Orders</h3>
        <div className="two-column">
          <div>
            <p>
              Ready to order or talk custom work? Reach out directly and include:
            </p>
            <ul className="bullet-list">
              <li>Product name or idea</li>
              <li>Quantity and deadline</li>
              <li>Any logos, quotes, or artwork to engrave</li>
            </ul>
          </div>
          <div className="contact-box">
            <p><strong>Owner:</strong> Glenn Edwin Morris Jr.</p>
            <p><strong>Phone:</strong> 1+ (417) 991-6154</p>
            <p><strong>Email:</strong> Glennedwinmorrisjr@gmail.com</p>
            <p><strong>Business:</strong> Morris Lane LLC</p>
          </div>
        </div>
      </section>
    </>
  );
}
