// src/app/page.tsx
import React from 'react';

export default function HomePage() {
  return (
    <div className="site-wrapper">
      {/* GLOBAL NAVIGATION / SEARCH */}
      <header className="site-header">
        <div className="brand-block">
          <img 
            src="/crest.png" 
            alt="Morris Lane Crest" 
            className="brand-crest" 
          />
          <div className="hidden md:block">
            <h1 className="brand-name">Morris Lane</h1>
            <p className="brand-tagline">The Sovereign Standard</p>
          </div>
        </div>

        {/* SEARCH BAR (The Executive Engine) */}
        <div className="search-container" style={{ flex: 1, margin: '0 2rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search our curated collections or request a custom source..." 
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
            color: 'var(--navy)',
            minWidth: '100px'
          }}>
            SEARCH
          </button>
        </div>

        <nav className="main-nav">
          <a href="#shop" className="hidden lg:block">Market</a>
          <a href="#sourcing">Sourcing</a>
          <a href="#about">Our Legacy</a>
          <div className="account-menu" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="#" style={{ color: 'var(--gold)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 'bold' }}>SIGN IN</a>
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
          </div>
        </nav>
      </header>

      <main className="site-main">
        {/* HERO BANNER */}
        <section className="hero-section" style={{ 
          background: 'linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url("/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '8rem 2rem',
          borderRadius: '8px',
          border: '1px solid var(--gold)',
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          <div className="hero-content">
            <h2 className="hero-title" style={{ fontSize: '4.5rem', color: 'var(--white)', lineHeight: '1', fontWeight: '900' }}>
              AMERICAN <span style={{ color: 'var(--gold)' }}>EXCELLENCE.</span>
            </h2>
            <p className="hero-subtitle" style={{ fontSize: '1.5rem', color: '#eee', maxWidth: '800px', margin: '1.5rem auto' }}>
              Premium goods and executive sourcing for the modern sovereign. 
              Veteran-owned. Integrity-driven. Globally connected.
            </p>
            <div className="hero-cta-row" style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
              <a href="#shop" className="btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>
                Browse The Market
              </a>
              <a href="#sourcing" className="btn-secondary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>
                Executive Sourcing
              </a>
            </div>
          </div>
        </section>

        {/* CATEGORY GRID */}
        <section className="section-block">
          <h3 className="section-title">The Morris Lane Collections</h3>
          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <div className="product-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ height: '220px', background: '#111', borderBottom: '1px solid var(--gold)' }}></div>
              <div style={{ padding: '2rem' }}>
                <h4 style={{ fontSize: '1.5rem', color: 'var(--gold)' }}>Signature Heritage</h4>
                <p>Custom craftsmanship designed to last generations.</p>
                <a href="#shop" style={{ color: 'var(--gold)', fontWeight: '700', textDecoration: 'none', marginTop: '1rem', display: 'inline-block' }}>Explore →</a>
              </div>
            </div>
            <div className="product-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ height: '220px', background: '#111', borderBottom: '1px solid var(--gold)' }}></div>
              <div style={{ padding: '2rem' }}>
                <h4 style={{ fontSize: '1.5rem', color: 'var(--gold)' }}>Curated Luxury</h4>
                <p>High-end timepieces and executive accessories.</p>
                <a href="#shop" style={{ color: 'var(--gold)', fontWeight: '700', textDecoration: 'none', marginTop: '1rem', display: 'inline-block' }}>Explore →</a>
              </div>
            </div>
            <div className="product-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ height: '220px', background: '#111', borderBottom: '1px solid var(--gold)' }}></div>
              <div style={{ padding: '2rem' }}>
                <h4 style={{ fontSize: '1.5rem', color: 'var(--gold)' }}>Sovereign Goods</h4>
                <p>Precision gear for those who lead from the front.</p>
                <a href="#shop" style={{ color: 'var(--gold)', fontWeight: '700', textDecoration: 'none', marginTop: '1rem', display: 'inline-block' }}>Explore →</a>
              </div>
            </div>
          </div>
        </section>

        {/* LEGACY SECTION */}
        <section id="about" className="section-block" style={{ marginTop: '5rem', padding: '4rem', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <h3 className="section-title" style={{ border: 'none', padding: '0', fontSize: '2.5rem', textAlign: 'left', margin: '0' }}>Our Legacy</h3>
              <p style={{ fontSize: '1.2rem', color: '#ccc', lineHeight: '1.8', marginTop: '2rem' }}>
                Heritage and Innovation. Founded on the values of the American spirit, Morris Lane is more than a marketplace. It is a commitment to quality, integrity, and the pursuit of sovereignty.
              </p>
              <p style={{ fontSize: '1.2rem', color: '#ccc', lineHeight: '1.8', marginTop: '1rem' }}>
                From our signature collections to our executive sourcing network, we serve those who lead with precision and purpose. Veteran-owned and globally connected, we are the standard for modern luxury.
              </p>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100%', height: '100%', border: '2px solid var(--gold)', zIndex: 0 }}></div>
              <img src="/hero-bg.jpg" alt="Legacy" style={{ width: '100%', height: 'auto', display: 'block', position: 'relative', zIndex: 1 }} />
            </div>
          </div>
        </section>

        {/* SOURCING SECTION */}
        <section id="sourcing" className="section-block" style={{ background: 'var(--navy)', padding: '5rem 2rem', borderRadius: '8px', border: '1px solid var(--gold)', marginTop: '4rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto' }}>
            <h3 className="section-title" style={{ border: 'none', padding: '0', marginBottom: '1.5rem', fontSize: '2.5rem' }}>Executive Sourcing Concierge</h3>
            <p style={{ fontSize: '1.3rem', color: '#ccc', lineHeight: '1.6' }}>
              If a product exists, we can source it. If it doesn't, we can build it. 
              Our global network of artisans and suppliers is at your disposal. 
              Skip the middleman and secure exactly what you require.
            </p>
            <div style={{ marginTop: '3rem' }}>
               <a href="mailto:support@morrislane.store" className="btn-primary" style={{ padding: '1.2rem 4rem', fontSize: '1.1rem' }}>
                 Initiate Sourcing Request
               </a>
            </div>
          </div>
        </section>

        {/* FEATURED ITEMS */}
        <section id="shop" className="section-block" style={{ marginTop: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <h3 className="section-title" style={{ margin: 0 }}>Featured Flagship Products</h3>
            <a href="#" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 'bold' }}>View All Products →</a>
          </div>
          <div className="card-grid">
            {/* ITEM 1 */}
            <div className="product-card">
              <div style={{ height: '300px', background: '#111', marginBottom: '1.5rem', borderRadius: '4px', border: '1px solid #222' }}></div>
              <p style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>SIGNATURE COLLECTION</p>
              <h4 style={{ fontSize: '1.4rem' }}>The Heritage Paddle</h4>
              <p style={{ opacity: 0.8 }}>Select White Pine. Fully customizable precision engraving.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--white)' }}>$45.00</span>
                <button className="btn-primary" style={{ padding: '0.7rem 1.5rem' }}>Add to Cart</button>
              </div>
            </div>
            {/* ITEM 2 */}
            <div className="product-card">
              <div style={{ height: '300px', background: '#111', marginBottom: '1.5rem', borderRadius: '4px', border: '1px solid #222' }}></div>
              <p style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>EXECUTIVE GEAR</p>
              <h4 style={{ fontSize: '1.4rem' }}>Tactical Mill Bit Set</h4>
              <p style={{ opacity: 0.8 }}>Professional-grade hardened steel for precision shop work.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--white)' }}>$129.00</span>
                <button className="btn-primary" style={{ padding: '0.7rem 1.5rem' }}>Add to Cart</button>
              </div>
            </div>
            {/* ITEM 3 */}
            <div className="product-card">
              <div style={{ height: '300px', background: '#111', marginBottom: '1.5rem', borderRadius: '4px', border: '1px solid #222' }}></div>
              <p style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>CURATED SOURCE</p>
              <h4 style={{ fontSize: '1.4rem' }}>Luxury Timepiece Access</h4>
              <p style={{ opacity: 0.8 }}>Direct access to our executive network for rare watch sourcing.</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--white)' }}>CONTACT</span>
                <button className="btn-secondary" style={{ padding: '0.7rem 1.5rem' }}>Request Source</button>
              </div>
            </div>
          </div>
        </section>

        {/* AI DEBBIE CONCIERGE WIDGET */}
        <div className="debbie-concierge" style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }}>
          <div className="debbie-bubble" style={{ fontSize: '0.9rem', padding: '1rem 1.5rem', maxWidth: '250px' }}>
            "Welcome to Morris Lane. I'm Debbie, your personal sourcing strategist. How can I assist you today?"
          </div>
          <img 
            src="/debbie-avatar.png" 
            alt="Debbie AI" 
            className="debbie-avatar" 
            style={{ border: '2px solid var(--gold)', width: '70px', height: '70px' }}
          />
        </div>
      </main>

      <footer className="site-footer" style={{ borderTop: '1px solid rgba(212, 175, 55, 0.2)', paddingTop: '4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <img src="/crest.png" alt="Crest" style={{ width: '40px', opacity: 0.5 }} />
          <h2 style={{ fontSize: '1.2rem', color: 'var(--gold)', marginTop: '1rem' }}>MORRIS LANE</h2>
          <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>The Sovereign Standard for American Luxury & Sourcing.</p>
        </div>
        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>&copy; 2026 Morris Lane LLC. All Rights Reserved. | Veteran Owned & Operated.</p>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.8rem', opacity: 0.7 }}>
          <a href="#" style={{ color: 'white' }}>Shipping</a>
          <a href="#" style={{ color: 'white' }}>Terms of Service</a>
          <a href="#" style={{ color: 'white' }}>Privacy</a>
          <a href="#" style={{ color: 'white' }}>Contact</a>
        </div>
      </footer>
    </div>
  );
}
