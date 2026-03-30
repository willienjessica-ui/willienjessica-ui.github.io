"use client";

import React, { useState, useEffect } from 'react';

// --- Types ---
interface Product {
  id: string;
  name: string;
  category: string;
  price: number | "Custom Mission";
  description: string;
  madeInUSA?: boolean;
  image?: string;
}

// --- Mock Data: The American Collection ---
const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'The Heritage Paddle',
    category: 'HARDWARE & GRIT',
    price: 45.00,
    madeInUSA: true,
    description: 'Select White Pine. Branded with American precision. Built here.',
  },
  {
    id: '2',
    name: 'Tactical Mill Bit Set',
    category: 'INDUSTRIAL IRON',
    price: 129.00,
    madeInUSA: true,
    description: 'Professional-grade hardened steel for the workshop. No bullshit gear.',
  },
  {
    id: '3',
    name: 'The Sourcing Post',
    category: 'CUSTOM MISSIONS',
    price: "Custom Mission",
    description: 'If you need it, we find it. Our network is your leverage.',
  },
  {
    id: '4',
    name: 'Premium Leather Journal',
    category: 'HARDWARE & GRIT',
    price: 65.00,
    madeInUSA: true,
    description: 'Hand-stitched American leather. For the thinkers and the builders.',
  },
  {
    id: '5',
    name: 'Patriot Field Watch',
    category: 'THE ARMOURY',
    price: 850.00,
    madeInUSA: true,
    description: 'Automatic movement. Veteran-assembled. Keeps time when everything else fails.',
  },
  {
    id: '6',
    name: 'American Direct Sourcing',
    category: 'CUSTOM MISSIONS',
    price: "Custom Mission",
    description: 'Tell us the target. We deliver the goods. Professional grade.',
  }
];

export default function HomePage() {
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const addToCart = (product: Product) => {
    if (product.price === "Custom Mission") {
      window.location.href = "#sourcing";
      return;
    }
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (typeof item.price === 'number' ? item.price : 0), 0);

  const handleCheckout = () => {
    // High-Performance American Paygate.
    const stripePaymentUrl = "https://buy.stripe.com/test_placeholder";
    window.open(stripePaymentUrl, '_blank');
  };

  if (!isMounted) return null;

  return (
    <div className="site-wrapper" style={{ overflowX: 'hidden' }}>
      {/* --- GLOBAL HEADER (Grit Wrapper) --- */}
      <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <div className="brand-block">
          <img 
            src="/crest.png" 
            className="brand-crest"
            alt="Morris Lane Seal" 
          />
          <div className="hidden md:block">
            <h1 className="brand-name">Morris Lane</h1>
            <p className="brand-tagline">American Grit</p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="search-container" style={{ flex: 1, margin: '0 2rem', display: 'flex' }}>
          <input 
            type="text" 
            placeholder="Search the marketplace or request a mission..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '4px 0 0 4px', fontSize: '1rem' }}
          />
          <button style={{ padding: '0 1.5rem', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}>
            \ud83d\udd0d
          </button>
        </div>

        {/* NAV & ACCOUNT */}
        <nav className="main-nav" style={{ alignItems: 'center', gap: '2rem' }}>
          <div onClick={() => setIsLoginOpen(true)} style={{ cursor: 'pointer', textAlign: 'left' }}>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--brass)', fontWeight: 'bold' }}>JOIN THE CREW</p>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900', color: 'white' }}>ACCOUNT</p>
          </div>

          <div 
            className="cart-icon" 
            onClick={() => setIsCartOpen(true)}
            style={{ cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
             <span style={{ fontSize: '2rem' }}>\ud83d\uded2</span>
             <span style={{
               position: 'absolute',
               top: '-5px',
               right: '15px',
               background: 'var(--crimson)',
               color: 'white',
               borderRadius: '50%',
               width: '20px',
               height: '20px',
               fontSize: '0.8rem',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               fontWeight: '900',
               border: '2px solid white'
             }}>{cart.length}</span>
             <span style={{ fontWeight: '900', fontSize: '0.9rem', marginTop: '10px', color: 'var(--brass)' }}>CART</span>
          </div>
        </nav>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="hero-section">
        <h2 className="hero-title">American Made.<br/>Grit & Precision.</h2>
        <p className="hero-subtitle">
          The Direct Marketplace for those who build, source, and secure the future. 
          No-bullshit gear for real Americans.
        </p>
        <div className="hero-cta-row" style={{ justifyContent: 'center', marginTop: '3rem' }}>
          <a href="#products" className="btn-primary">Shop the Collection</a>
          <a href="#sourcing" className="btn-secondary">Request Sourcing</a>
        </div>
      </section>

      {/* --- MAIN MARKETPLACE GRID --- */}
      <main className="site-main" id="products">
        <h3 className="section-title">The Collection</h3>
        <div className="card-grid">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="product-card">
              {product.madeInUSA && <div className="usa-badge">MADE IN USA</div>}
              <p className="price-tag">
                {typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price}
              </p>
              <h4>{product.name}</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', opacity: 0.8 }}>{product.description}</p>
              <button 
                onClick={() => addToCart(product)}
                className={product.price === "Custom Mission" ? "btn-secondary" : "btn-primary"}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px' }}
              >
                {product.price === "Custom Mission" ? "START MISSION" : "ADD TO CART"}
              </button>
            </div>
          ))}
        </div>

        {/* --- THE MISSION PORTAL --- */}
        <section id="sourcing" className="section-block" style={{ background: 'var(--navy)', padding: '4rem', borderRadius: '8px', border: '3px solid var(--brass)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', fontFamily: 'Impact', textTransform: 'uppercase', color: 'white' }}>The Sourcing Post</h3>
            <p style={{ fontSize: '1.2rem', color: 'var(--parchment)', marginBottom: '2rem' }}>
              If it exists, we find it. If it doesn't, we build it. 
              Tell us what you need, and the Morris Lane network handles the rest.
            </p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <input type="text" placeholder="Item or Service Requested..." style={{ padding: '1rem', borderRadius: '4px', border: 'none' }} />
              <input type="email" placeholder="Your Contact Email..." style={{ padding: '1rem', borderRadius: '4px', border: 'none' }} />
              <button className="btn-primary" style={{ padding: '1.2rem' }}>DEPLOY MISSION</button>
            </div>
          </div>
        </section>
      </main>

      {/* --- CART SIDEBAR --- */}
      {isCartOpen && (
        <div className="cart-sidebar" style={{
          position: 'fixed', top: 0, right: 0, height: '100vh', width: '350px',
          background: 'var(--parchment)', color: '#1a1a1a', zIndex: 1001,
          padding: '2rem', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column', borderLeft: '5px solid var(--crimson)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ margin: 0, fontFamily: 'Impact', textTransform: 'uppercase' }}>Your Gear</h3>
            <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', fontWeight: '900' }}>X</button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {cart.length === 0 ? <p>Your cart is empty, Boss.</p> : cart.map((item, idx) => (
              <div key={idx} style={{ padding: '1rem 0', borderBottom: '1px solid #ccc' }}>
                <p style={{ fontWeight: 'bold', margin: 0 }}>{item.name}</p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--crimson)', fontWeight: '900' }}>${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', borderTop: '2px solid #1a1a1a', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
              <span>Total:</span>
              <span style={{ color: 'var(--crimson)' }}>${cartTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="btn-primary" 
              style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem' }}
            >
              PROCEED TO TREASURY
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.7rem', marginTop: '1rem', fontWeight: 'bold', opacity: 0.6 }}>
              SECURED BY THE MORRIS LANE NETWORK
            </p>
          </div>
        </div>
      )}

      {/* --- LOGIN MODAL --- */}
      {isLoginOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="login-modal" style={{
            background: 'var(--parchment)', padding: '3rem', borderRadius: '8px',
            width: '100%', maxWidth: '450px', textAlign: 'center',
            border: '4px solid var(--brass)', color: '#1a1a1a'
          }}>
            <h2 style={{ fontFamily: 'Impact', textTransform: 'uppercase', marginBottom: '1rem' }}>The Executive Registry</h2>
            <p style={{ marginBottom: '2rem', fontWeight: '600' }}>Access your orders and mission logs.</p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <input type="email" placeholder="Email Address" style={{ padding: '1rem', border: '2px solid #ccc', borderRadius: '4px' }} />
              <input type="password" placeholder="Password" style={{ padding: '1rem', border: '2px solid #ccc', borderRadius: '4px' }} />
              <button className="btn-primary" style={{ padding: '1rem' }}>SIGN IN</button>
            </div>
            <button 
              onClick={() => setIsLoginOpen(false)}
              style={{ background: 'none', border: 'none', marginTop: '1rem', cursor: 'pointer', fontWeight: 'bold' }}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* --- AI DEBBIE (Country Partner) --- */}
      <div className="debbie-concierge">
        <div className="debbie-bubble">
          READY FOR ORDERS, BOSS.
        </div>
        <img 
          src="https://www.morrislane.store/assets/debbie-avatar.png" 
          className="debbie-avatar"
          alt="Debbie" 
        />
      </div>

      <footer className="site-footer" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <img src="/crest.png" style={{ width: '80px', marginBottom: '1rem', opacity: 0.8 }} alt="Footer Seal" />
        <p style={{ fontWeight: '900', letterSpacing: '0.1em' }}>MORRIS LANE FLAGSHIP \u2014 EST. 2024</p>
        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>American Direct. Veteran Owned. Hardworking Gear.</p>
      </footer>
    </div>
  );
}
