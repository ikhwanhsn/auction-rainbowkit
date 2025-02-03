"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const AuctionPage = () => {
  const { contract } = useParams();
  return (
    <main className="min-h-screen p-5">
      <Link href="/" className="btn btn-primary text-white btn-sm">
        Back
      </Link>
      <h1 className="text-3xl mt-3">Auction</h1>
      <p>{contract}</p>
    </main>
  );
};

export default AuctionPage;
