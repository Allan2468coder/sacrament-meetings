import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Cedar Ridge Ward | Sunday Meetings",
    template: "%s | Cedar Ridge Ward",
  },
  description:
    "Sunday sacrament meeting programs and recent gatherings for the Cedar Ridge Ward.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
