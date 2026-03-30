import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Morris Lane Global Marketplace",
  description: "American luxury, veteran-owned. Sourcing and custom builds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        
        {/* Floating Debbie Concierge */}
        <div className="debbie-concierge">
          <div className="debbie-bubble">
            Ready to expand the empire today, Willie?
          </div>
          <img 
            src="/debbie_avatar.png" 
            alt="Debbie AI" 
            className="debbie-avatar"
          />
        </div>
      </body>
    </html>
  );
}
