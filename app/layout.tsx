import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "APEX // Personal Gym Trainer Management System",
  description:
    "Midnight Performance - A world-class SaaS management system for personal gym trainers to coach, track, and manage members.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${manrope.variable} font-sans bg-background text-text-primary min-h-screen antialiased selection:bg-primary selection:text-background`}
      >
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#1C242D",
              border: "1px solid #303A45",
              color: "#F5F7FA",
            },
          }}
        />
      </body>
    </html>
  );
}
