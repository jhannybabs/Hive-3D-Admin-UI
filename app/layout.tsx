import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import Footer from "@/components/Footer";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "HiveCo Admin Dashboard",
  description: "Admin dashboard for CLO 3D AR garment designer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Sidebar>{children}</Sidebar>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
