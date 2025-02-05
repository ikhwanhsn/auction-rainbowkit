"use client";

import {
  useAccount,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { contractABIAuctionFactory } from "../services/abi";
import { contractAddressAuctionFactory } from "@/services/contractAddress";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";

// Home Component
const Home = () => {
  const { isConnected } = useAccount();
  const notifyTransactionPending = () => toast("Your transaction is pending!");
  const notifyTransactionSuccess = () => toast("Transaction success!");
  const [timeCreationContract, setTimeCreationContract] = useState<string>("");
  const [dataAuction, setDataAuction] = useState([]);

  const {
    data,
    isPending: isFetching,
    refetch,
  }: { data: any; isPending: boolean; refetch: () => void } = useReadContracts({
    contracts: [
      {
        address: contractAddressAuctionFactory,
        abi: contractABIAuctionFactory,
        functionName: "getAuctions",
      },
    ],
  });

  // Create Auction
  const { data: hash, isPending, writeContract } = useWriteContract();

  // Transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Submit form create auction
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      writeContract({
        address: contractAddressAuctionFactory,
        abi: contractABIAuctionFactory,
        functionName: "createAuction",
        args: [BigInt(timeCreationContract)],
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Handle balance updates
  useEffect(() => {
    if (data) {
      setDataAuction(data[0].result);
    }
  }, [data]);

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirming) {
      setTimeCreationContract("");
      const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
      modal?.close();
      notifyTransactionPending();
    }
  }, [isConfirming]);

  // Handle successful transaction
  useEffect(() => {
    if (isConfirmed) {
      refetch();
      notifyTransactionSuccess();
    }
  }, [isConfirmed]);

  return (
    <>
      {isConnected && (
        <main className="px-5 py-7">
          <ToastContainer />
          <section className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">List of Auctions</h1>
            <aside className="space-x-2">
              {/* Button Create Auction */}
              <button
                className="btn btn-sm btn-primary text-white"
                onClick={() => {
                  const modal = document.getElementById(
                    "my_modal_2"
                  ) as HTMLDialogElement;
                  modal?.showModal();
                }}
              >
                Create Auction
              </button>
              {/* Open modal button create auction */}
              <dialog id="my_modal_2" className="modal ">
                <div className="modal-box bg-white text-black">
                  <h3 className="font-bold text-lg">Hello!</h3>

                  <p className="py-4">
                    Press ESC key or click outside to close
                  </p>
                  <form onSubmit={submit}>
                    <input
                      type="number"
                      name="tokenId"
                      className="input input-bordered w-full bg-white input-primary"
                      placeholder="Time in seconds"
                      value={timeCreationContract}
                      onChange={(e) => setTimeCreationContract(e.target.value)}
                      required
                    />
                    <section className="space-x-1 mt-2">
                      <button
                        className="btn btn-primary text-white"
                        type="submit"
                        disabled={isPending}
                      >
                        {isPending ? "Creating..." : "Create"}
                      </button>
                      <button
                        className="btn btn-error text-white"
                        type="button"
                        onClick={() => {
                          const modal = document.getElementById(
                            "my_modal_2"
                          ) as HTMLDialogElement;
                          modal?.close();
                        }}
                      >
                        Cancel
                      </button>
                    </section>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
              <button className="btn btn-sm btn-success text-white">
                My Auction
              </button>
            </aside>
          </section>
          <p>{isFetching && "Loading..."}</p>
          {/* List of auctions */}
          <section className="mt-3 gap-1 grid grid-cols-3">
            {dataAuction?.map((auction, index) => (
              <Link
                href={`/auction/${auction}`}
                key={index}
                className="card w-full border px-5 py-3 shadow-sm hover:bg-gray-50 hover:shadow-md"
              >
                {auction}
              </Link>
            ))}
          </section>
        </main>
      )}
      {!isConnected && <p>Please connect wallet!</p>}
    </>
  );
};

export default Home;
