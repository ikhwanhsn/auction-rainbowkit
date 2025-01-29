import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import Provider from "./Provider";

export const metadata: Metadata = {
  title: "Solidity Auction",
  description: "A simple auction contract written in Solidity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` bg-white text-black`}>
        <Provider>
          <AppShell>{children}</AppShell>
        </Provider>
      </body>
    </html>
  );
}
