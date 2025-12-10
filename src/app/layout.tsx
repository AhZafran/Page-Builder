import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page Builder",
  description: "Web-based landing page builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
