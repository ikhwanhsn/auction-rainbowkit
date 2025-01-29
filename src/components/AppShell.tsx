import Navbar from "./Navbar";

const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="h-16 w-full"></section>
      {children}
    </main>
  );
};

export default AppShell;
