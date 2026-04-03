import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "SoleMate — Running Shoe Decision Engine",
  description: "Data-driven running shoe recommendations powered by lab data and machine learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <NavBar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
