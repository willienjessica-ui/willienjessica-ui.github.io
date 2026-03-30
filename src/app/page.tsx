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
  usa_made: boolean;
}

// --- Mock Data: Priority on American Made ---
const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'The Heritage Paddle',
    category: 'USA MADE FIRST',
    price: 45.00,
    description: 'Select American White Pine. Veteran-crafted and fully customizable.',
    usa_made: true
  },
  {
    id: '2',
    name: 'Tactical Mill Bit Set',
    category: 'EXECUTIVE GEAR',
    price: 129.00,
    description: 'Industrial-grade hardened steel. American precision shop work.',
    usa_made: true
  },
  {
    id: '3',
    name: 'American Watch Sourcing',
    category: 'CURATED SOURCE',
    price: "Sourced",
    description: 'Direct access to rare, American-made or veteran-assembled timepieces.',
    usa_made: true
  },
  {
    id: '4',
    name: 'Signature Leather Journal',
    category: 'USA MADE FIRST',
    price: 65.00,
    description: 'Hand-stitched American leather. The Global Standard in quality.',
    usa_made: true
  },
  {
    id: '5',
    name: 'Executive Field Watch',
    category: 'USA MADE FIRST',
    price: 850.00,
    description: 'Automatic movement, sapphire crystal, 100% veteran-assembled in the USA.',
    usa_made: true
  },
  {
    id: '6',
    name: 'USA Sourcing Mission',
    category: 'EXECUTIVE CONCIERGE',
    price: "Sourced",
    description: 'Request any American-made product. We find the source and deliver the best.',
    usa_made: true
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

  const handleCheckout = () => {
    // High-Performance Paygate: Replace with real Stripe URL
    const stripePaymentUrl = "https://buy.stripe.com/test_placeholder"; 
    window.open(stripePaymentUrl, '_blank');
  };

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
            <p className="brand-tagline" style={{ fontSize: '0.7rem' }}>American Made First</p>
          </div>
        </div>

        {/* SEARCH BAR: EMPHASIZING AMERICAN SOURCING */}
        <div className="search-container" style={{ flex: 1, margin: '0 1rem', position: 'relative', display: 'flex' }}>
          <input 
            type="text" 
            placeholder="Search American-made goods or request a custom USA source..." 
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
            \ud83d\udd0d
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
             <span style={{ fontSize: '1.8rem' }}>\ud83d\uded2</span>
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

      {/* --- HERO SECTION --- */}
      <section className="hero-section" style={{
        padding: '100px 20px',
        textAlign: 'center',
        background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("/hero-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        borderBottom: '5px solid var(--crimson)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: '900', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '2px' }}>
            The Global Standard
          </h2>
          <p style={{ fontSize: '1.5rem', fontWeight: '300', color: 'var(--gold)', marginBottom: '2rem' }}>
             Built for Sovereignty. Prioritizing American-Made First.
          </p>
          <a href="#marketplace" style={{
            background: 'var(--gold)',
            color: 'var(--navy)',
            padding: '1rem 2.5rem',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: '900',
            borderRadius: '4px',
            textTransform: 'uppercase',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}>
            Explore the Collection
          </a>
        </div>
      </section>

      {/* --- PRODUCT GRID --- */}
      <main id="marketplace" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--navy)', borderLeft: '10px solid var(--crimson)', paddingLeft: '1.5rem' }}>
            Featured Collections
          </h3>
          <p style={{ color: '#666', fontWeight: 'bold' }}>Sort by: <span style={{ color: 'var(--gold)' }}>American Made First</span></p>
        </div>

        <div className="product-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '2.5rem' 
        }}>
          {PRODUCTS.map(product => (
            <div key={product.id} className="product-card" style={{
              background: 'white',
              border: '1px solid #eee',
              borderRadius: '8px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
              position: 'relative'
            }}>
              {product.usa_made && (
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'var(--crimson)',
                  color: 'white',
                  fontSize: '0.6rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: 'bold'
                }}>MADE IN USA</span>
              )}
              <div style={{ height: '200px', background: '#f5f5f5', marginBottom: '1.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#ccc', fontSize: '0.8rem' }}>Image Placeholder</span>
              </div>
              <p style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{product.category}</p>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--navy)' }}>{product.name}</h4>
              <p style={{ fontSize: '0.85rem', color: '#666', flex: 1, marginBottom: '1.5rem' }}>{product.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--navy)' }}>
                  {typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price}
                </span>
                <button 
                  onClick={() => addToCart(product)}
                  style={{
                    background: 'var(--navy)',
                    color: 'white',
                    border: 'none',
                    padding: '0.6rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}
                >
                  {product.price === "Sourced" ? "Request Sourcing" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- SOURCING SECTION --- */}
      <section id="sourcing" style={{ padding: '80px 20px', background: 'var(--navy)', color: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--gold)' }}>American Sourcing Concierge</h3>
          <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem', opacity: 0.9 }}>
            Our mission is simple: If you need an American-made asset, we will find it. 
            From custom machinery to rare heritage goods, our sourcing network specializes in USA manufacturers first.
          </p>
          <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             <input type="text" placeholder="Your Name" style={{ padding: '1rem', borderRadius: '4px', border: 'none' }} />
             <input type="email" placeholder="Your Email" style={{ padding: '1rem', borderRadius: '4px', border: 'none' }} />
             <textarea placeholder="Describe the American asset you need sourced..." style={{ gridColumn: 'span 2', padding: '1rem', borderRadius: '4px', border: 'none', height: '120px' }}></textarea>
             <button style={{
               gridColumn: 'span 2',
               background: 'var(--gold)',
               color: 'var(--navy)',
               padding: '1.2rem',
               borderRadius: '4px',
               border: 'none',
               fontWeight: 'bold',
               fontSize: '1rem',
               textTransform: 'uppercase',
               cursor: 'pointer'
             }}>
               Initiate Sourcing Mission
             </button>
          </form>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ padding: '40px 20px', background: '#0a0e14', color: 'white', textAlign: 'center', borderTop: '1px solid #333' }}>
        <div style={{ marginBottom: '2rem' }}>
          <img src="/crest.png" alt="Crest" style={{ width: '40px', filter: 'grayscale(1)' }} />
        </div>
        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>&copy; {new Date().getFullYear()} Morris Lane. American Made First. All Rights Reserved.</p>
      </footer>

      {/* --- CART SLIDE-OUT --- */}
      {isCartOpen && (
        <div className="cart-drawer" style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '350px',
          height: '100%',
          background: 'white',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
          zIndex: 2000,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h4 style={{ margin: 0, color: 'var(--navy)' }}>Your Mission Cart</h4>
            <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>\u00d7</button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {cart.length === 0 ? (
              <p style={{ textAlign: 'center', marginTop: '3rem', color: '#999' }}>The cart is empty. Begin your mission.</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>{item.name}</p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--gold)' }}>USA Made</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}</p>
                    <button onClick={() => removeFromCart(index)} style={{ background: 'none', border: 'none', color: 'var(--crimson)', fontSize: '0.7rem', cursor: 'pointer' }}>Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ borderTop: '2px solid #eee', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ fontWeight: 'bold' }}>Mission Subtotal:</span>
              <span style={{ fontWeight: '900', fontSize: '1.2rem', color: 'var(--navy)' }}>${cartTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              style={{
                width: '100%',
                background: cart.length === 0 ? '#ccc' : 'var(--navy)',
                color: 'white',
                padding: '1.2rem',
                borderRadius: '4px',
                border: 'none',
                fontWeight: 'bold',
                cursor: cart.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              PROCEED TO SECURE TREASURY
            </button>
            <p style={{ fontSize: '0.65rem', textAlign: 'center', marginTop: '1rem', opacity: 0.6 }}>
              \ud83d\udee1\ufe0f Securely processed by the Morris Lane Sourcing Network.
            </p>
          </div>
        </div>
      )}

      {/* --- LOGIN MODAL --- */}
      {isLoginOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.8)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ background: 'white', padding: '3rem', borderRadius: '8px', width: '400px', textAlign: 'center', position: 'relative' }}>
             <button onClick={() => setIsLoginOpen(false)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>\u00d7</button>
             <h3 style={{ marginBottom: '1rem', color: 'var(--navy)' }}>Executive Registry</h3>
             <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '2rem' }}>Access your secure orders and sourcing missions.</p>
             <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="email" placeholder="Email" style={{ padding: '1rem', borderRadius: '4px', border: '1px solid #ddd' }} />
                <input type="password" placeholder="Password" style={{ padding: '1rem', borderRadius: '4px', border: '1px solid #ddd' }} />
                <button style={{ background: 'var(--gold)', color: 'var(--navy)', padding: '1rem', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Sign In</button>
             </form>
             <p style={{ marginTop: '1.5rem', fontSize: '0.75rem' }}>Don't have a login? <span style={{ color: 'var(--gold)', fontWeight: 'bold', cursor: 'pointer' }}>Apply for Membership</span></p>
          </div>
        </div>
      )}

      {/* --- DEBBIE AI CHAT BUBBLE --- */}
      <div className="debbie-bubble" style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        background: 'var(--navy)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        border: '2px solid var(--gold)',
        zIndex: 4000
      }}>
         <span style={{ fontSize: '1.5rem' }}>\ud83d\udcbb</span>
         <div style={{
           position: 'absolute',
           top: '-5px',
           right: '-5px',
           width: '15px',
           height: '15px',
           background: '#4CAF50',
           borderRadius: '50%',
           border: '2px solid white'
         }}></div>
      </div>
    </div>
  );
}
