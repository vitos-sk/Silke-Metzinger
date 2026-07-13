import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Pillars from "@/components/Pillars";
import Services from "@/components/Services";
import About from "@/components/About";
import HowIWork from "@/components/HowIWork";
import NewsEvents from "@/components/NewsEvents";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Pillars />
        <Services />
        <About />
        <HowIWork />
        <NewsEvents />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
