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
import { LuCopy, LuCopyCheck } from "react-icons/lu";

dayjs.extend(duration);

// Page
const AuctionPage = () => {
  const { contract } = useParams();
  const { isConnected } = useAccount();
  const contractAddress = contract as `0x${string}`;
  const { data: hash, writeContract, isPending } = useWriteContract();
  const {
    data: withdraw,
    writeContract: withdrawWrite,
    isPending: withdrawPending,
  } = useWriteContract();
  const notifyTransactionPending = () => toast("Your transaction is pending!");
  const notifyTransactionSuccess = () => toast("Transaction success!");
  const notifyWithdrawPending = () => toast("Your withdraw is pending!");
  const notifyWithdrawSuccess = () => toast("Withdraw success!");
  const [auctionEnd, setAuctionEnd] = useState<dayjs.Dayjs | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [timeCreationContract, setTimeCreationContract] = useState<string>("");
  const [isCopied1, setIsCopied1] = useState<boolean>(false);
  const [isCopied2, setIsCopied2] = useState<boolean>(false);
  const [isCopied3, setIsCopied3] = useState<boolean>(false);
  const [idAuction, setIdAuction] = useState<string>("");

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
      if (auctionEnd && dayjs().isAfter(auctionEnd)) {
        alert("Auction has ended");
        setTimeCreationContract("");
        return;
      }
      const formData = new FormData(e.target as HTMLFormElement);
      const bid = formData.get("bid") as string;
      if (Number(bid) <= Number(highestBid?.result)) {
        alert("Bid must be higher than the highest bid");
      }
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

  // Withdraw function
  const handleWithdraw = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (auctionEnd && dayjs().isAfter(auctionEnd)) {
        alert("Auction has ended");
        return;
      }
      if (pendingReturn?.result === undefined) {
        alert("Nothing to withdraw");
        return;
      }
      withdrawWrite({
        address: contractAddress,
        abi: contractABISimpleAuction,
        functionName: "withdraw",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Transaction bid confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Transaction withdraw confirmation
  const { isLoading: isLoadingWithdraw, isSuccess: isSuccessWithdraw } =
    useWaitForTransactionReceipt({
      hash: withdraw,
    });

  // Copy to clipboard
  const copyToClipboard = (text: string, no: number) => {
    navigator.clipboard.writeText(text);
    if (no === 1) {
      setIsCopied1(true);
      setTimeout(() => {
        setIsCopied1(false);
      }, 2000);
    } else if (no === 2) {
      setIsCopied2(true);
      setTimeout(() => {
        setIsCopied2(false);
      }, 2000);
    } else {
      setIsCopied3(true);
      setTimeout(() => {
        setIsCopied3(false);
      }, 2000);
    }
  };

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

  // Handle bid transaction confirmation
  useEffect(() => {
    if (isConfirming) {
      notifyTransactionPending();
    }
  }, [isConfirming]);

  // Handle bid successful transaction
  useEffect(() => {
    if (isConfirmed) {
      setTimeCreationContract("");
      refetch();
      notifyTransactionSuccess();
    }
  }, [isConfirmed]);

  // Handle withdraw transaction confirmation
  useEffect(() => {
    if (isLoadingWithdraw) {
      notifyWithdrawPending();
    }
  }, [isLoadingWithdraw]);

  // Handle withdraw successful transaction
  useEffect(() => {
    if (isSuccessWithdraw) {
      setTimeCreationContract("");
      refetch();
      notifyWithdrawSuccess();
    }
  }, [isSuccessWithdraw]);

  useEffect(() => {
    setIdAuction(String(localStorage.getItem("idAuction")));
  }, []);

  return (
    <>
      {isConnected ? (
        <main className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
          <ToastContainer />
          <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
              >
                Back
              </Link>
              <h1 className="text-3xl font-bold text-gray-800">
                Auction #{idAuction}
              </h1>
            </div>
            <div className="space-y-2 text-gray-700">
              <p className="text-lg font-semibold flex items-center gap-2">
                Contract:{" "}
                <Link
                  href={`https://sepolia.etherscan.io/address/${contract}`}
                  target="_blank"
                  className="text-gray-900 font-normal hover:text-blue-500 hover:underline"
                >
                  {contract}
                </Link>{" "}
                {isCopied1 ? (
                  <LuCopyCheck className="text-green-500" />
                ) : (
                  <LuCopy
                    className="hover:text-blue-500 cursor-pointer"
                    onClick={() => copyToClipboard(contract as string, 1)}
                  />
                )}
              </p>
              <p className="text-lg font-semibold">
                Auction End Time:{" "}
                <span className="font-normal">
                  {auctionEnd
                    ? auctionEnd.format("DD/MM/YYYY HH:mm:ss")
                    : "Not Set or Invalid"}
                </span>
              </p>
              <p className="text-lg font-semibold">
                Remaining Time:{" "}
                <span className="font-normal">
                  {remainingTime || "0 days 0 hours 0 minutes 0 seconds"}
                </span>
              </p>
              <p className="text-lg flex items-center gap-2 font-semibold">
                Beneficiary:{" "}
                <span className="font-normal flex items-center gap-2">
                  <Link
                    href={`https://sepolia.etherscan.io/address/${beneficiary?.result}`}
                    target="_blank"
                    className="text-gray-900 font-normal hover:text-blue-500 hover:underline"
                  >
                    {beneficiary?.result}
                  </Link>{" "}
                  {isCopied2 ? (
                    <LuCopyCheck className="text-green-500" />
                  ) : (
                    <LuCopy
                      className="hover:text-blue-500 cursor-pointer"
                      onClick={() => copyToClipboard(beneficiary?.result, 2)}
                    />
                  )}
                </span>
              </p>
              <p className="text-lg font-semibold">
                Highest Bid:{" "}
                <span className="font-normal">{highestBid?.result} ETH</span>
              </p>
              <p className="text-lg font-semibold flex items-center gap-2">
                Highest Bidder:{" "}
                <span className="font-normal flex items-center gap-2">
                  {highestBidder?.result ===
                  "0x0000000000000000000000000000000000000000" ? (
                    "-"
                  ) : (
                    <Link
                      href={`https://sepolia.etherscan.io/address/${highestBidder?.result}`}
                      target="_blank"
                      className="text-gray-900 font-normal hover:text-blue-500 hover:underline"
                    >
                      {highestBidder?.result}
                    </Link>
                  )}
                  {isCopied3 ? (
                    <LuCopyCheck className="text-green-500" />
                  ) : (
                    highestBidder?.result !==
                      "0x0000000000000000000000000000000000000000" && (
                      <LuCopy
                        className="hover:text-blue-500 cursor-pointer"
                        onClick={() =>
                          copyToClipboard(highestBidder?.result, 3)
                        }
                      />
                    )
                  )}
                </span>
              </p>
              <p className="text-lg font-semibold">
                Pending Return:{" "}
                <span className="font-normal">
                  {pendingReturn?.result || "0"} ETH
                </span>
              </p>
            </div>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <input
                type="number"
                name="bid"
                placeholder="10 ETH"
                value={timeCreationContract}
                onChange={(e) => setTimeCreationContract(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              />
              <button
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                type="submit"
              >
                {isPending ? "Bidding..." : "Place Bid"}
              </button>
            </form>
            <button
              className="w-full mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              onClick={handleWithdraw}
            >
              {withdrawPending ? "Withdrawing..." : "Withdraw"}
            </button>
          </div>
        </main>
      ) : (
        <p className="text-center text-lg font-semibold text-red-600 mt-10">
          Please connect your wallet to participate in the auction.
        </p>
      )}
    </>
  );
};

export default AuctionPage;
