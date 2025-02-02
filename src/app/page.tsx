"use client";

import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { contractABIAuctionFactory } from "../services/abi";
import { contractAddressAuctionFactory } from "@/services/contractAddress";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const [timeCreationContract, setTimeCreationContract] = useState<string>("");
  const [dataAuction, setDataAuction] = useState([]);
  const { data: balance }: { data: [] | undefined } = useReadContract({
    address: contractAddressAuctionFactory,
    abi: contractABIAuctionFactory,
    functionName: "getAuctions",
    args: [],
  });
  // Create Auction
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      writeContract({
        address: contractAddressAuctionFactory,
        abi: contractABIAuctionFactory,
        functionName: "createAuction",
        args: [BigInt(timeCreationContract)],
      });
      if (isPending) {
        alert("Contract successfully created!");
        setTimeCreationContract("");
        const modal = document.getElementById(
          "my_modal_2"
        ) as HTMLDialogElement;
        modal?.close();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (balance) {
      setDataAuction(balance);
      console.log(dataAuction);
    }
  }, [balance, hash]);

  return (
    <main className="px-5 py-7">
      <section className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">List of Auctions</h1>
        <p>{isConfirming ? "Transaction in progress..." : ""}</p>
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

              <p className="py-4">Press ESC key or click outside to close</p>
              <form onSubmit={submit}>
                <input
                  type="number"
                  name="tokenId"
                  className="input input-bordered w-full bg-white input-primary"
                  placeholder="Time in seconds"
                  value={timeCreationContract}
                  onChange={(e) => setTimeCreationContract(e.target.value)}
                />
                <section className="space-x-1 mt-2">
                  <button className="btn btn-primary text-white" type="submit">
                    Create
                  </button>
                  <button
                    className="btn btn-error text-white"
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
      {/* List of auctions */}
      <section className="mt-3 space-y-1">
        {dataAuction.length > 0 &&
          dataAuction.map((auction, index) => (
            <section
              key={index}
              className="card w-full border px-5 py-3 shadow-sm"
            >
              {auction}
            </section>
          ))}
      </section>
    </main>
  );
};

export default Home;
