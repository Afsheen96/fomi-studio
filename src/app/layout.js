import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });

export const metadata = {
  title: "Fomi Studio — Image Generator",
  description: "A responsive AI image generation workspace built with Next.js for the FOMI frontend assessment.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0b0e",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
