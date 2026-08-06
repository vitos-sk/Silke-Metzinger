import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import LeadMagnetSection from "@/components/LeadMagnet/LeadMagnetSection";
import Pillars from "@/components/Pillars/Pillars";
import Services from "@/components/Services/Services";
import About from "@/components/About/About";
import HowIWork from "@/components/HowIWork/HowIWork";
import Qualifications from "@/components/Qualifications/Qualifications";
import NewsEvents from "@/components/NewsEvents/NewsEvents";
import CallToAction from "@/components/CallToAction/CallToAction";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import ScrollToTop from "@/components/motion/ScrollToTop";
import { buildHomeJsonLd } from "@/lib/structuredData";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHomeJsonLd()) }}
      />
      <Navbar />
      <main className="pt-(--navbar-h)">
        <Hero />
        <Pillars />
        <About />
        <HowIWork />
        <Services />
        <LeadMagnetSection />
        <CallToAction />
        <Qualifications />
        <NewsEvents />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
