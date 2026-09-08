import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import BookingCTA from "@/components/BookingCTA";
import CourseContent from "@/components/CourseContent";
import Accreditation from "@/components/Accreditation";
import About from "@/components/About";
import Councils from "@/components/Councils";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { JsonLd } from "@/components/JsonLd";

export default async function Home() {
  return (
    <>
      <JsonLd />
      <Navbar />
      <Hero />
      <TrustStrip />
      <BookingCTA />
      <CourseContent />
      <Accreditation />
      <About />
      <Councils />
      <FAQ />
      <Contact />
      <Footer />
      <ScrollToTop />
    </>
  );
}
