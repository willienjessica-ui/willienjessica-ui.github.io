// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Morris Lane LLC",
  description: "Custom manufacturing, engraving, and creative builds by Morris Lane LLC.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="site-wrapper">
          <header className="site-header">
            <div className="brand-block">
              <img
                src="/crest.png"
                alt="Morris Lane Crest"
                className="brand-crest"
              />
              <div>
                <h1 className="brand-name">Morris Lane LLC</h1>
                <p className="brand-tagline">Craft. Precision. Legacy.</p>
              </div>
            </div>
            <nav className="main-nav">
              <a href="#services">Services</a>
              <a href="#shop">Products</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </nav>
          </header>

          <main className="site-main">{children}</main>

          <footer className="site-footer">
            <div>Morris Lane LLC &copy; {new Date().getFullYear()}</div>
            <div className="footer-contact">
              <span>Glenn Edwin Morris Jr.</span>
              <span>Phone: 1+ (417) 991-6154</span>
              <span>Email: Glennedwinmorrisjr@gmail.com</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
