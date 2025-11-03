import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Morris Lane — Command Center",
  description: "A veteran-owned workshop of AI and craft.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-zinc-900">
        {children}
      </body>
    </html>
  );
}
