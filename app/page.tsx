import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import Pillars from "@/components/Pillars/Pillars";
import Services from "@/components/Services/Services";
import About from "@/components/About/About";
import HowIWork from "@/components/HowIWork/HowIWork";
import Qualifications from "@/components/Qualifications/Qualifications";
import NewsEvents from "@/components/NewsEvents/NewsEvents";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import ScrollToTop from "@/components/motion/ScrollToTop";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Pillars />
        <About />
        <HowIWork />
        <Qualifications />
        <Services />
        <NewsEvents />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
