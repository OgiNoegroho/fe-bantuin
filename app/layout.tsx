import type { Metadata } from "next";
import { Geologica, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import localFont from "next/font/local";

const mattone = localFont({
  src: [
    {
      path: "../public/fonts/mattone/Mattone-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/mattone/Mattone-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/mattone/Mattone-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-mattone",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bantuin: Marketplace Jasa Mahasiswa UIN Suska Riau",
  description:
    "Platform marketplace jasa yang menghubungkan mahasiswa UIN Suska Riau dengan peluang kerja freelance dan proyek akademik.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mattone.variable} ${outfit.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
