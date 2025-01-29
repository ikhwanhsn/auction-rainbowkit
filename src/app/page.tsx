const Home = () => {
  return (
    <main className="px-5 py-7">
      <section className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">List of Auctions</h1>
        <aside className="space-x-2">
          <button className="btn btn-sm btn-primary text-white">
            Create Auction
          </button>
          <button className="btn btn-sm btn-success text-white">
            My Auction
          </button>
        </aside>
      </section>
      <section className="mt-3 space-y-1">
        <section className="card w-full border px-5 py-3 shadow-sm">
          First Auction
        </section>
        <section className="card w-full border px-5 py-3 shadow-sm">
          First Auction
        </section>
        <section className="card w-full border px-5 py-3 shadow-sm">
          First Auction
        </section>
      </section>
    </main>
  );
};

export default Home;
