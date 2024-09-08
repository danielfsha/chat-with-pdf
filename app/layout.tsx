import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import "./globals.css";

import { cn } from "@/lib/utils";

import { ClerkProvider } from "@clerk/nextjs";

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
            "h-screen w-screen bg-background antialiased flex flex-col",
            GeistSans.className,
          )}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
