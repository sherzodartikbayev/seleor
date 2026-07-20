import { ChildProps } from "@/types";
import "./globals.css";

import type { Metadata } from "next";
import { Montserrat } from "next/font/google"
import { FC } from "react";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/shared/navbar";

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Seleor e-commerce",
  description: "Seleor e-commerce website built with Next.js",
  icons: { icon: "/favicon.png" }
};

const RootLayout: FC<ChildProps> = ({ children }) => {
  return (
    <html
      lang="en"
      className={`${montserrat.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Navbar */}
        <Navbar />
        <main className="container max-w-6xl mt-24">
          {children}
        </main>
        {/* Toaster */}
        <Toaster />
      </body>
    </html>
  );
}

export default RootLayout