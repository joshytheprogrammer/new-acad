import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Toaster } from "sonner";
import HotjarInit from "@/components/HotjarInit";
import "./globals.css";

export const metadata: Metadata = {
  title: "Walls & Gates Academy",
  description: "Transform your skills. Elevate your future.",
};

const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/fonts/Satoshi-Light.woff2",
      // path: "./Satoshi-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/fonts/Satoshi-Medium.woff2",
      weight: "500 600",
      style: "normal",
    },
    {
      path: "../../public/fonts/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/fonts/Satoshi-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5LE0PQWG3F"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5LE0PQWG3F');
          `}
        </Script>
      </head>
      <body className={`antialiased ${satoshi.className}`}>
        <HotjarInit />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
