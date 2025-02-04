"use client";

import { contractABISimpleAuction } from "@/services/abi";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useReadContracts } from "wagmi";

const AuctionPage = () => {
  const params = useParams();
  const contract = Array.isArray(params.contract)
    ? params.contract[0]
    : params.contract;
  if (!contract || !contract.startsWith("0x")) {
    return <p>Invalid contract address.</p>;
  }
  const contractAddress = contract as `0x${string}` | undefined;
  const {
    data,
    isPending,
    refetch,
  }: { data: any; isPending: boolean; refetch: () => void } = useReadContracts({
    contracts: [
      {
        address: contractAddress,
        abi: contractABISimpleAuction,
        functionName: "highestBid",
      },
      {
        address: contractAddress,
        abi: contractABISimpleAuction,
        functionName: "highestBidder",
      },
      {
        address: contractAddress,
        abi: contractABISimpleAuction,
        functionName: "pendingReturn",
      },
      {
        address: contractAddress,
        abi: contractABISimpleAuction,
        functionName: "beneficiary",
      },
      {
        address: contractAddress,
        abi: contractABISimpleAuction,
        functionName: "auctionEndTime",
      },
    ],
  });

  const [
    highestBid,
    highestBidder,
    pendingReturn,
    beneficiary,
    auctionEndTime,
  ] = data || [];

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  return (
    <main className="min-h-screen p-5">
      <Link href="/" className="btn btn-primary text-white btn-sm">
        Back
      </Link>
      <h1 className="text-3xl mt-3">Auction</h1>
      <p>{contract}</p>
      <p>
        Autcion end time:{" "}
        {auctionEndTime && !isPending && auctionEndTime.result}
      </p>
      <p>Beneficiary: {beneficiary && !isPending && beneficiary.result}</p>
      <p>Highest bid: {highestBid && !isPending && highestBid.result} ETH</p>
      <p>
        Highest bidder:{" "}
        {highestBidder &&
        !isPending &&
        highestBidder.result === "0x0000000000000000000000000000000000000000"
          ? "-"
          : highestBidder.result}
      </p>
      <p>
        Pending return:{" "}
        {(pendingReturn && !isPending && pendingReturn.result) || "0"} ETH
      </p>
      <input
        type="number"
        placeholder="10 ETH"
        className="input input-primary bg-white"
      />
      <button className="btn btn-primary text-white">Bid</button>
      <button className="btn btn-primary text-white">Withdraw</button>
    </main>
  );
};

export default AuctionPage;
