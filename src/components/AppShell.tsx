"use client";

import { useAccount } from "wagmi";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useAccount();
  const pathname = usePathname();
  return (
    <main className="min-h-screen relative">
      <Navbar />
      <section className="h-16 w-full"></section>
      {children}
      <footer
        className={`bg-white text-black text-center p-4 text-sm ${
          isConnected && pathname !== "/about" ? "" : "fixed"
        } bottom-0 w-full`}
      >
        Copyright &copy; 2025 Solidity Auction Factory by SmartWeb3 ID
      </footer>
    </main>
  );
};

export default AppShell;
