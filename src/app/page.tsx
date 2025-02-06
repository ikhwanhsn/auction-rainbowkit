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
    // <>
    //   {isConnected && (
    //     <main className="px-5 py-7">
    //       <ToastContainer />
    //       <section className="flex justify-between items-center">
    //         <h1 className="text-2xl font-semibold">List of Auctions</h1>
    //         <aside className="space-x-2">
    //           {/* Button Create Auction */}
    //           <button
    //             className="btn btn-sm btn-primary text-white"
    //             onClick={() => {
    //               const modal = document.getElementById(
    //                 "my_modal_2"
    //               ) as HTMLDialogElement;
    //               modal?.showModal();
    //             }}
    //           >
    //             Create Auction
    //           </button>
    //           {/* Open modal button create auction */}
    //           <dialog id="my_modal_2" className="modal ">
    //             <div className="modal-box bg-white text-black">
    //               <h3 className="font-bold text-lg">Hello!</h3>

    //               <p className="py-4">
    //                 Press ESC key or click outside to close
    //               </p>
    //               <form onSubmit={submit}>
    //                 <input
    //                   type="number"
    //                   name="tokenId"
    //                   className="input input-bordered w-full bg-white input-primary"
    //                   placeholder="Time in seconds"
    //                   value={timeCreationContract}
    //                   onChange={(e) => setTimeCreationContract(e.target.value)}
    //                   required
    //                 />
    //                 <section className="space-x-1 mt-2">
    //                   <button
    //                     className="btn btn-primary text-white"
    //                     type="submit"
    //                     disabled={isPending}
    //                   >
    //                     {isPending ? "Creating..." : "Create"}
    //                   </button>
    //                   <button
    //                     className="btn btn-error text-white"
    //                     type="button"
    //                     onClick={() => {
    //                       const modal = document.getElementById(
    //                         "my_modal_2"
    //                       ) as HTMLDialogElement;
    //                       modal?.close();
    //                     }}
    //                   >
    //                     Cancel
    //                   </button>
    //                 </section>
    //               </form>
    //             </div>
    //             <form method="dialog" className="modal-backdrop">
    //               <button>close</button>
    //             </form>
    //           </dialog>
    //           <button className="btn btn-sm btn-success text-white">
    //             My Auction
    //           </button>
    //         </aside>
    //       </section>
    //       <p>{isFetching && "Loading..."}</p>
    //       {/* List of auctions */}
    //       <section className="mt-3 gap-1 grid grid-cols-3">
    //         {dataAuction?.map((auction, index) => (
    //           <Link
    //             href={`/auction/${auction}`}
    //             key={index}
    //             className="card w-full border px-5 py-3 shadow-sm hover:bg-gray-50 hover:shadow-md"
    //           >
    //             {auction}
    //           </Link>
    //         ))}
    //       </section>
    //     </main>
    //   )}
    //   {!isConnected && <p>Please connect wallet!</p>}
    // </>
    <>
      {isConnected ? (
        <main className="px-6 py-8 bg-gray-100 min-h-screen">
          <ToastContainer />
          <section className="flex justify-between items-center bg-white p-5 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800">
              List of Auctions
            </h1>
            <aside className="flex space-x-3">
              {/* Button Create Auction */}
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                onClick={() => {
                  const modal = document.getElementById(
                    "my_modal_2"
                  ) as HTMLDialogElement;
                  modal?.showModal();
                }}
              >
                + Create Auction
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700">
                My Auctions
              </button>
            </aside>
          </section>

          {/* Modal */}
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box bg-white p-6 rounded-lg shadow-lg text-gray-800">
              <h3 className="text-xl font-bold">Create New Auction</h3>
              <p className="text-sm text-gray-500 mt-1">
                Set the duration for the auction in seconds.
              </p>
              <form onSubmit={submit} className="mt-4 space-y-3">
                <input
                  type="number"
                  name="tokenId"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  placeholder="Enter time in seconds"
                  value={timeCreationContract}
                  onChange={(e) => setTimeCreationContract(e.target.value)}
                  required
                />
                <div className="flex justify-end space-x-2">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    type="submit"
                    disabled={isPending}
                  >
                    {isPending ? "Creating..." : "Create"}
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
                </div>
              </form>
            </div>
          </dialog>

          <p className="text-center text-gray-600 mt-4">
            {isFetching && "Loading..."}
          </p>

          {/* List of auctions */}
          <section className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...(dataAuction || [])].reverse().map((auction, index, arr) => {
              const auctionNumber = (arr.length - index)
                .toString()
                .padStart(5, "0");

              return (
                <Link
                  href={`/auction/${auction}`}
                  key={index}
                  className="p-5 bg-white rounded-lg shadow-md border hover:shadow-lg transition-all"
                  onClick={() => {
                    localStorage.setItem("idAuction", auctionNumber);
                  }}
                >
                  <section className="text-lg font-semibold text-gray-800 tracking-tight">
                    <p>Auction #{auctionNumber}</p>
                    <span className="text-base font-normal">{auction}</span>
                  </section>
                </Link>
              );
            })}
          </section>
        </main>
      ) : (
        <p className="text-center text-lg font-semibold text-red-600 mt-10">
          Please connect your wallet to view auctions!
        </p>
      )}
    </>
  );
};

export default Home;
