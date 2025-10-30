import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Morris Lane Command Center",
  description: "Built with NeoDOS spirit",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
