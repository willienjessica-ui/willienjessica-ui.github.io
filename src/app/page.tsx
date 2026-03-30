// src/app/page.tsx
import React from 'react';

export default function HomePage() {
  return (
    <div className="site-wrapper">
      {/* GLOBAL NAVIGATION / SEARCH (Amazon Style) */}
      <header className="site-header">
        <div className="brand-block">
          <img 
            src="/crest.png" 
            alt="Morris Lane Crest" 
            className="brand-crest" 
          />
          <div className="hidden md:block">
            <h1 className="brand-name">Morris Lane</h1>
            <p className="brand-tagline">Sovereign American Marketplace</p>
          </div>
        </div>

        {/* SEARCH BAR (The Amazon Engine) */}
        <div className="search-container" style={{ flex: 1, margin: '0 2rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search the Sovereign Market (Tools, Luxury, Sourcing...)" 
            style={{
              width: '100%',
              padding: '0.8rem 1.5rem',
              borderRadius: '4px',
              border: '2px solid var(--gold)',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--white)',
              fontSize: '1rem'
            }}
          />
          <button style={{
            position: 'absolute',
            right: '5px',
            top: '5px',
            bottom: '5px',
            background: 'var(--gold)',
            border: 'none',
            padding: '0 1.5rem',
            borderRadius: '2px',
            fontWeight: '900',
            cursor: 'pointer',
            color: 'var(--navy)'
          }}>
            SEARCH
          </button>
        </div>

        <nav className="main-nav">
          <a href="#shop" className="hidden lg:block">Market</a>
          <a href="#sourcing">Sourcing</a>
          <a href="#orders">Account</a>
          <div className="cart-icon" style={{ cursor: 'pointer', position: 'relative' }}>
             <span style={{ fontSize: '1.5rem' }}>🛒</span>
             <span style={{
               position: 'absolute',
               top: '-10px',
               right: '-10px',
               background: 'var(--crimson)',
               color: 'white',
               borderRadius: '50%',
               width: '20px',
               height: '20px',
               fontSize: '0.7rem',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               border: '1px solid var(--gold)'
             }}>0</span>
          </div>
        </nav>
      </header>

      <main className="site-main">
        {/* HERO BANNER (Cinematic) */}
        <section className="hero-section" style={{ 
          background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '4rem 2rem',
          borderRadius: '8px',
          border: '1px solid var(--gold)',
          marginBottom: '3rem'
        }}>
          <div className="hero-content">
            <h2 className="hero-title" style={{ fontSize: '4rem', color: 'var(--white)' }}>
              OWN YOUR <span style={{ color: 'var(--gold)' }}>LEGACY.</span>
            </h2>
            <p className="hero-subtitle" style={{ fontSize: '1.4rem', color: '#eee', maxWidth: '600px' }}>
              The premier American marketplace for the sovereign individual. 
              Veteran-owned. Precision-engineered. Expertly sourced.
            </p>
            <div className="hero-cta-row" style={{ marginTop: '2rem' }}>
              <a href="#shop" className="btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1rem' }}>
                Shop The Collection
              </a>
              <a href="#sourcing" className="btn-secondary" style={{ padding: '1.2rem 2.5rem', fontSize: '1rem' }}>
                Custom Sourcing
              </a>
            </div>
          </div>
        </section>

        {/* CATEGORY GRID (Amazon-Style Blocks) */}
        <section className="section-block">
          <h3 className="section-title">Browse the Market</h3>
          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <div className="product-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ height: '200px', background: '#111', borderBottom: '1px solid var(--gold)' }}></div>
              <div style={{ padding: '1.5rem' }}>
                <h4>Signature Crafts</h4>
                <p>Heirloom-grade wood and metal work.</p>
                <a href="#" style={{ color: 'var(--gold)', fontWeight: '700', textDecoration: 'none' }}>Shop Now →</a>
              </div>
            </div>
            <div className="product-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ height: '200px', background: '#111', borderBottom: '1px solid var(--gold)' }}></div>
              <div style={{ padding: '1.5rem' }}>
                <h4>Luxury Timepieces</h4>
                <p>Sourced and vetted executive watches.</p>
                <a href="#" style={{ color: 'var(--gold)', fontWeight: '700', textDecoration: 'none' }}>Shop Now →</a>
              </div>
            </div>
            <div className="product-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ height: '200px', background: '#111', borderBottom: '1px solid var(--gold)' }}></div>
              <div style={{ padding: '1.5rem' }}>
                <h4>Veteran Gear</h4>
                <p>Tactical precision for everyday use.</p>
                <a href="#" style={{ color: 'var(--gold)', fontWeight: '700', textDecoration: 'none' }}>Shop Now →</a>
              </div>
            </div>
            <div className="product-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ height: '200px', background: '#111', borderBottom: '1px solid var(--gold)' }}></div>
              <div style={{ padding: '1.5rem' }}>
                <h4>Sovereign Sourcing</h4>
                <p>Tell us what you need, we get it.</p>
                <a href="#sourcing" style={{ color: 'var(--gold)', fontWeight: '700', textDecoration: 'none' }}>Request Now →</a>
              </div>
            </div>
          </div>
        </section>

        {/* SOURCING SECTION (The Fixer Engine) */}
        <section id="sourcing" className="section-block" style={{ background: 'var(--navy)', padding: '4rem 2rem', borderRadius: '8px', border: '1px solid var(--gold)' }}>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h3 className="section-title" style={{ border: 'none', padding: '0', marginBottom: '1rem' }}>The Morris Lane "Fixer" Engine</h3>
            <p style={{ fontSize: '1.2rem', color: '#ccc' }}>
              If it exists on this planet, we can find it, vet it, and get it to your door. 
              Skip the corporate bots. Talk to a real partner.
            </p>
            <div style={{ marginTop: '2rem' }}>
               <a href="mailto:Glennedwinmorrisjr@gmail.com" className="btn-primary" style={{ padding: '1rem 3rem' }}>
                 Start Your Executive Request
               </a>
            </div>
          </div>
        </section>

        {/* FEATURED ITEMS (Amazon Grid) */}
        <section id="shop" className="section-block">
          <h3 className="section-title">Trending in the Sovereign Market</h3>
          <div className="card-grid">
            {/* ITEM 1 */}
            <div className="product-card">
              <div style={{ height: '250px', background: '#111', marginBottom: '1rem', borderRadius: '4px' }}></div>
              <p style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold' }}>BEST SELLER</p>
              <h4>Custom Heritage Paddle</h4>
              <p>4" x 20" Select White Pine. Fully customizable engraving.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--white)' }}>$45.00</span>
                <button className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Add to Cart</button>
              </div>
            </div>
            {/* ITEM 2 */}
            <div className="product-card">
              <div style={{ height: '250px', background: '#111', marginBottom: '1rem', borderRadius: '4px' }}></div>
              <p style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold' }}>NEW ARRIVAL</p>
              <h4>Tactical CNC Mill Bit Set</h4>
              <p>Hardened steel precision bits for shop masters.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--white)' }}>$129.00</span>
                <button className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Add to Cart</button>
              </div>
            </div>
            {/* ITEM 3 */}
            <div className="product-card">
              <div style={{ height: '250px', background: '#111', marginBottom: '1rem', borderRadius: '4px' }}></div>
              <p style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold' }}>SOVEREIGN EXCLUSIVE</p>
              <h4>Vetted Luxury Watch Source</h4>
              <p>Access our network for a specific timepiece request.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--white)' }}>CONTACT</span>
                <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Request</button>
              </div>
            </div>
          </div>
        </section>

        {/* AI DEBBIE CONCIERGE WIDGET */}
        <div className="debbie-concierge">
          <div className="debbie-bubble">
            "I'm here, Willie. Ready to find whatever you need for the empire. Just ask."
          </div>
          <img 
            src="/debbie-avatar.png" 
            alt="Debbie AI" 
            className="debbie-avatar" 
          />
        </div>
      </main>

      <footer className="site-footer" style={{ textAlign: 'center' }}>
        <p>&copy; 2026 Morris Lane LLC. All Rights Reserved. | Sovereign & Strong.</p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.8rem', opacity: 0.7 }}>
          <a href="#" style={{ color: 'white' }}>Shipping Policy</a>
          <a href="#" style={{ color: 'white' }}>Terms of Sovereignty</a>
          <a href="#" style={{ color: 'white' }}>Returns</a>
        </div>
      </footer>
    </div>
  );
}
