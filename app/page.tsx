import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="wrapper min-h-screen overflow-y-scroll">
      <Header />
      <Hero />
      <Footer />
    </main>
  );
}
