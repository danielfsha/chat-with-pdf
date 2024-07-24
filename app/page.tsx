import FeatureList from "@/components/FeatureList";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="wrapper">
      <Header />
      <Hero />
      <FeatureList />
      <Footer />
    </main>
  );
}
