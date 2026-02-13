import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: { default: "Yorksell", template: "%s | Yorksell" },
  description: "Yorksell Real Estate Group — Toronto & GTA. Advice You Can Trust. Buying, selling, and investing.",
  openGraph: {
    title: "Yorksell Real Estate Group",
    description: "Toronto & GTA. Advice You Can Trust. Buying, selling, and investing.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yorksell Real Estate Group",
    description: "Toronto & GTA. Advice You Can Trust.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="overflow-x-hidden">
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}