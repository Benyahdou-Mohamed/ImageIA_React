import type { Metadata } from "next";
import { IBM_Plex_Sans, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

export const IbmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight:['400','500','600','700'],
  variable:'--font-nbm-plex'
})
export const metadata: Metadata = {
  title: "ImageIA",
  description: "IA image manipulaltion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('--font-nbm-plex antialiased',IbmPlex.variable)}>{children}</body>
    </html>
  );
}
