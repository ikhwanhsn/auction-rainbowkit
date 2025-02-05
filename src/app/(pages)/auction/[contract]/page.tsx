"use client";

// Import
import { contractABISimpleAuction } from "@/services/abi";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useAccount,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { ToastContainer, toast } from "react-toastify";

dayjs.extend(duration);

// Page
const AuctionPage = () => {
  const { contract } = useParams();
  const { isConnected } = useAccount();
  const contractAddress = contract as `0x${string}`;
  const { data: hash, writeContract } = useWriteContract();
  const notifyTransactionPending = () => toast("Your transaction is pending!");
  const notifyTransactionSuccess = () => toast("Transaction success!");
  const [auctionEnd, setAuctionEnd] = useState<dayjs.Dayjs | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [timeCreationContract, setTimeCreationContract] = useState<string>("");

  // Read data from smart contract
  const {
    data,
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

  // Bid function
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const bid = formData.get("bid") as string;
      writeContract({
        address: contractAddress,
        abi: contractABISimpleAuction,
        functionName: "bid",
        value: BigInt(bid),
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Set auction end time
  useEffect(() => {
    if (data && auctionEndTime?.result) {
      const endTimeInSeconds = Number(auctionEndTime.result);

      if (endTimeInSeconds > 0) {
        const endTime = dayjs.unix(endTimeInSeconds);
        setAuctionEnd(endTime);
      } else {
        setAuctionEnd(null);
      }
    }
  }, [data]);

  // Refetch when contract changes
  useEffect(() => {
    refetch();
  }, [contract]);

  // Set remaining time
  useEffect(() => {
    if (auctionEnd) {
      const interval = setInterval(() => {
        const now = dayjs();
        const diff = auctionEnd.diff(now);

        const duration = dayjs.duration(diff);
        const formattedTime = `${duration.days()} days ${duration.hours()} hours ${duration.minutes()} minutes ${duration.seconds()} seconds`;

        setRemainingTime(formattedTime);

        if (duration.asMilliseconds() <= 0) {
          clearInterval(interval);
          setRemainingTime("Auction has ended");
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [auctionEnd]);

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirming) {
      notifyTransactionPending();
    }
  }, [isConfirming]);

  // Handle successful transaction
  useEffect(() => {
    if (isConfirmed) {
      setTimeCreationContract("");
      refetch();
      notifyTransactionSuccess();
    }
  }, [isConfirmed]);

  return (
    <>
      {isConnected && (
        <main className="min-h-screen p-5">
          <ToastContainer />
          <Link href="/" className="btn btn-primary text-white btn-sm">
            Back
          </Link>
          <h1 className="text-3xl mt-3">Auction</h1>
          <p>{contract}</p>
          <p>
            Auction End Time:{" "}
            {auctionEnd
              ? auctionEnd.format("DD/MM/YYYY HH:mm:ss")
              : "Not Set or Invalid"}
          </p>
          <p>
            Remaining Time:{" "}
            {remainingTime || "0 days 0 hours 0 minutes 0 seconds"}
          </p>
          <p>Beneficiary: {beneficiary?.result}</p>
          <p>Highest bid: {highestBid?.result} ETH</p>
          <p>
            Highest bidder:{" "}
            {highestBidder?.result ===
            "0x0000000000000000000000000000000000000000"
              ? "-"
              : highestBidder?.result}
          </p>
          <p>Pending return: {pendingReturn?.result || "0"} ETH</p>
          <form onSubmit={submit}>
            <input
              type="number"
              name="bid"
              placeholder="10 ETH"
              value={timeCreationContract}
              onChange={(e) => setTimeCreationContract(e.target.value)}
              required
              className="input input-primary bg-white"
            />
            <button className="btn btn-primary text-white" type="submit">
              Bid
            </button>
          </form>
          <button className="btn btn-primary text-white">Withdraw</button>
        </main>
      )}
      {!isConnected && <p>Please connect wallet!</p>}
    </>
  );
};

export default AuctionPage;
