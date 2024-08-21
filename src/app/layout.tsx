import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Carent",
  description: "A car rental application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full h-full">
      {/* <head>
        <link rel="stylesheet" href="/path/to/leaflet.css" />
        <script src="/path/to/leaflet.js"></script>
      </head> */}
      <body className={inter.className + "w-full h-full"}>
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
