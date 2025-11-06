import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TravailLog - Work Time Tracker",
  description: "Track your work hours with zero server-side storage",
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
