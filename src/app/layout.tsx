import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Bug Bounty University | Complete Cybersecurity Training Platform",
  description: "The complete bug bounty training platform. 100+ labs, 25-chapter bootcamp, 365 daily challenges, automation pipelines, CVSS calculator, career tracking, and everything you need to become an elite bug bounty hunter.",
  keywords: ["bug bounty", "cybersecurity", "ethical hacking", "penetration testing", "web security", "bug bounty university", "hacking courses"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-950 text-gray-200 antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#0f1520",
              color: "#e0e6ed",
              border: "1px solid rgba(0,255,65,0.2)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "13px",
            },
            success: {
              iconTheme: { primary: "#00ff41", secondary: "#0f1520" },
            },
            error: {
              iconTheme: { primary: "#ff0040", secondary: "#0f1520" },
            },
          }}
        />
        <Navbar />
        <main className="pt-16 min-h-screen grid-bg">
          {children}
        </main>
      </body>
    </html>
  );
}
