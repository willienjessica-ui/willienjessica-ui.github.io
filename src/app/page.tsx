"use client";

import React, { useState, useEffect } from 'react';

// --- Types ---
interface Product {
  id: string;
  name: string;
  category: string;
  price: number | "Sourced";
  description: string;
  image?: string;
}

// --- Mock Data ---
const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'The Heritage Paddle',
    category: 'SIGNATURE COLLECTION',
    price: 45.00,
    description: 'Select White Pine. Fully customizable precision engraving.',
  },
  {
    id: '2',
    name: 'Tactical Mill Bit Set',
    category: 'EXECUTIVE GEAR',
    price: 129.00,
    description: 'Professional-grade hardened steel for precision shop work.',
  },
  {
    id: '3',
    name: 'Luxury Timepiece Access',
    category: 'CURATED SOURCE',
    price: "Sourced",
    description: 'Direct access to our executive network for rare watch sourcing.',
  },
  {
    id: '4',
    name: 'Sovereign Leather Journal',
    category: 'SIGNATURE COLLECTION',
    price: 65.00,
    description: 'Hand-stitched American leather with gold leaf detailing.',
  },
  {
    id: '5',
    name: 'Executive Field Watch',
    category: 'CURATED SOURCE',
    price: 850.00,
    description: 'Automatic movement, sapphire crystal, veteran-assembled.',
  },
  {
    id: '6',
    name: 'Global Sourcing Mission',
    category: 'EXECUTIVE CONCIERGE',
    price: "Sourced",
    description: 'Tell us what you need. We find it, vet it, and deliver it.',
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
    if (product.price === "Sourced") {
      window.location.href = "#sourcing";
      return;
    }
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (typeof item.price === 'number' ? item.price : 0), 0);

  if (!isMounted) return null;

  return (
    <div className="site-wrapper" style={{ overflowX: 'hidden' }}>
      {/* --- GLOBAL HEADER (Amazon-Killer Wrapper) --- */}
      <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <div className="brand-block">
          <img 
            src="/crest.png" 
            alt="Morris Lane Crest" 
            style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--gold)' }} 
          />
          <div className="hidden md:block">
            <h1 className="brand-name" style={{ fontSize: '1.2rem' }}>Morris Lane</h1>
            <p className="brand-tagline" style={{ fontSize: '0.7rem' }}>Sovereign Standard</p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="search-container" style={{ flex: 1, margin: '0 1rem', position: 'relative', display: 'flex' }}>
          <input 
            type="text" 
            placeholder="Search our curated collections or request a custom source..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.7rem 1.2rem',
              borderRadius: '4px 0 0 4px',
              border: '1px solid var(--gold)',
              background: 'white',
              color: '#333',
              fontSize: '0.9rem'
            }}
          />
          <button style={{
            background: 'var(--gold)',
            border: 'none',
            padding: '0 1.2rem',
            borderRadius: '0 4px 4px 0',
            fontWeight: '900',
            cursor: 'pointer',
            color: 'var(--navy)'
          }}>
            🔍
          </button>
        </div>

        {/* NAV & ACCOUNT */}
        <nav className="main-nav" style={{ alignItems: 'center', gap: '1.5rem' }}>
          <div 
            onClick={() => setIsLoginOpen(true)}
            style={{ cursor: 'pointer', textAlign: 'left' }}
          >
            <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.8 }}>Hello, Sign in</p>
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--gold)' }}>Account & Lists</p>
          </div>

          <div className="hidden lg:block" style={{ textAlign: 'left', cursor: 'pointer' }}>
            <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.8 }}>Returns</p>
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold' }}>& Orders</p>
          </div>

          <div 
            className="cart-icon" 
            onClick={() => setIsCartOpen(true)}
            style={{ cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
             <span style={{ fontSize: '1.8rem' }}>🛒</span>
             <span style={{
               position: 'absolute',
               top: '-5px',
               right: '15px',
               background: 'var(--gold)',
               color: 'var(--navy)',
               borderRadius: '50%',
               width: '18px',
               height: '18px',
               fontSize: '0.7rem',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               fontWeight: 'bold'
             }}>{cart.length}</span>
             <span style={{ fontWeight: 'bold', fontSize: '0.85rem', marginTop: '10px' }}>Cart</span>
          </div>
        </nav>
      </header>

      {/* --- SUB-NAV BAR --- */}
      <div style={{ background: '#232f3e', padding: '0.5rem 1.5rem', display: 'flex', gap: '1.5rem', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid #37475a' }}>
        <a href="#shop" style={{ color: 'white', textDecoration: 'none' }}>All Collections</a>
        <a href="#sourcing" style={{ color: 'white', textDecoration: 'none' }}>Executive Sourcing</a>
        <a href="#about" style={{ color: 'white', textDecoration: 'none' }}>Legacy</a>
        <a href="#" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Sovereign Registry</a>
      </div>

      <main className="site-main">
        {/* --- HERO SECTION --- */}
        <section className="hero-section" style={{ 
          background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url("/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '4rem 2rem',
          borderRadius: '4px',
          borderBottom: '4px solid var(--gold)',
          marginBottom: '2rem',
          textAlign: 'left',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div className="hero-content" style={{ maxWidth: '700px' }}>
            <p style={{ color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '1rem' }}>MORRIS LANE FLAGSHIP</p>
            <h2 className="hero-title" style={{ fontSize: '3.5rem', color: 'var(--white)', lineHeight: '1.1', fontWeight: '900', textTransform: 'uppercase' }}>
              The Sovereign <br/>Marketplace.
            </h2>
            <p className="hero-subtitle" style={{ fontSize: '1.2rem', color: '#eee', margin: '1.5rem 0' }}>
              American luxury, veteran precision, and global executive sourcing. 
              We don't just sell products; we secure legacies.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#shop" className="btn-primary" style={{ padding: '0.8rem 2.5rem' }}>Shop The Market</a>
              <a href="#sourcing" className="btn-secondary" style={{ padding: '0.8rem 2.5rem' }}>Request Sourcing</a>
            </div>
          </div>
        </section>

        {/* --- PRODUCT GRID --- */}
        <section id="shop" className="section-block">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--white)' }}>Featured Collections</h3>
            <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Showing {PRODUCTS.length} Items</span>
          </div>
          
          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {PRODUCTS.map(product => (
              <div key={product.id} className="product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem', background: 'white', color: '#111', borderRadius: '4px' }}>
                <div style={{ height: '200px', background: '#f5f5f5', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                  <img src="/crest.png" style={{ width: '80px', opacity: 0.1 }} alt="placeholder" />
                </div>
                <p style={{ color: '#666', fontSize: '0.75rem', fontWeight: 'bold', margin: 0 }}>{product.category}</p>
                <h4 style={{ fontSize: '1.2rem', margin: '0.5rem 0', color: 'var(--navy)' }}>{product.name}</h4>
                <p style={{ fontSize: '0.85rem', color: '#444', flex: 1 }}>{product.description}</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--navy)' }}>
                    {typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price}
                  </span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="btn-primary" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'var(--gold)', color: 'var(--navy)', border: 'none' }}
                  >
                    {product.price === "Sourced" ? "Request Info" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SOURCING PORTAL --- */}
        <section id="sourcing" style={{ marginTop: '4rem', padding: '4rem 2rem', background: 'var(--navy)', borderRadius: '8px', border: '2px solid var(--gold)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--white)', marginBottom: '1rem' }}>EXECUTIVE SOURCING CONCIERGE</h3>
          <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 2rem', opacity: 0.9 }}>
            Our "Amazon Clone" utility meets custom high-end sourcing. If it exists, we find it. 
            If it doesn't, we build it. No corporate middleman—just results.
          </p>
          <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--gold)' }}>What are you looking for?</label>
            <textarea 
              placeholder="Describe the item, specifications, or mission requirements..."
              style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid var(--gold)', background: 'rgba(255,255,255,0.05)', color: 'white', minHeight: '120px' }}
            ></textarea>
            <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>Initiate Sourcing Mission</button>
          </div>
        </section>

      </main>

      {/* --- CART SIDEBAR --- */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', background: 'white', color: '#111', zIndex: 2000, boxShadow: '-10px 0 30px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Your Market Cart</h3>
            <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
            {cart.length === 0 ? (
              <p style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>Your cart is empty.</p>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #eee' }}>
                  <div style={{ width: '60px', height: '60px', background: '#f5f5f5', borderRadius: '4px' }}></div>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: '0 0 0.2rem 0' }}>{item.name}</h5>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>${(item.price as number).toFixed(2)}</p>
                    <button onClick={() => removeFromCart(idx)} style={{ background: 'none', border: 'none', color: 'var(--crimson)', fontSize: '0.75rem', padding: 0, cursor: 'pointer', marginTop: '0.5rem' }}>Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div style={{ padding: '2rem', background: '#f9f9f9', borderTop: '1px solid #ddd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button className="btn-primary" style={{ width: '100%', padding: '1rem', background: '#f3d078', color: '#111', border: '1px solid #a88734' }}>
                Proceed to Checkout
              </button>
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>Secure payment processed via</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#6772e5', margin: 0 }}>Stripe</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- LOGIN MODAL --- */}
      {isLoginOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', color: '#111', padding: '3rem', borderRadius: '4px', width: '400px', textAlign: 'center' }}>
            <img src="/crest.png" style={{ width: '80px', marginBottom: '1.5rem' }} alt="Crest" />
            <h3 style={{ margin: '0 0 0.5rem 0' }}>Sign-In</h3>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '2rem' }}>Access your Sovereign Registry & Missions</p>
            <input type="email" placeholder="Email" style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }} />
            <input type="password" placeholder="Password" style={{ width: '100%', padding: '0.8rem', marginBottom: '2rem', border: '1px solid #ddd', borderRadius: '4px' }} />
            <button className="btn-primary" style={{ width: '100%', background: 'var(--gold)', color: 'var(--navy)', border: 'none', padding: '0.8rem' }}>Continue</button>
            <p style={{ fontSize: '0.7rem', marginTop: '1.5rem' }}>By continuing, you agree to the Morris Lane Sovereign Terms.</p>
            <button onClick={() => setIsLoginOpen(false)} style={{ background: 'none', border: 'none', color: '#0066c0', cursor: 'pointer', marginTop: '1rem' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="site-footer" style={{ borderTop: '2px solid var(--gold)', marginTop: '5rem', background: '#131921', color: 'white', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div>
            <h4 style={{ color: 'var(--gold)', marginBottom: '1rem' }}>Get to Know Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', opacity: 0.8, lineHeight: '2' }}>
              <li><a href="#about" style={{ color: 'white', textDecoration: 'none' }}>Our Legacy</a></li>
              <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Veteran Owned</a></li>
              <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Sovereign Values</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--gold)', marginBottom: '1rem' }}>Market Services</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', opacity: 0.8, lineHeight: '2' }}>
              <li><a href="#sourcing" style={{ color: 'white', textDecoration: 'none' }}>Executive Sourcing</a></li>
              <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Registry Access</a></li>
              <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Bulk Procurement</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--gold)', marginBottom: '1rem' }}>Let Us Help You</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', opacity: 0.8, lineHeight: '2' }}>
              <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Your Account</a></li>
              <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Shipping Rates</a></li>
              <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Help Center</a></li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '4rem', borderTop: '1px solid #3a4553', paddingTop: '2rem' }}>
          <img src="/crest.png" style={{ width: '40px', marginBottom: '1rem', opacity: 0.5 }} alt="Crest" />
          <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>&copy; 2026 Morris Lane LLC. | American Excellence | Veteran Owned</p>
        </div>
      </footer>
    </div>
  );
}
