import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";

import { ClerkProvider } from "@clerk/nextjs";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PDF Chat",
  description: "Making working with PDFs easier with PDF Chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "h-screen w-screen bg-background font-sans antialiased flex flex-col overflow-hidden",
            fontSans.variable,
          )}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
