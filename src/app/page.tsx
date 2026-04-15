import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import CourseDates from "@/components/CourseDates";
import Pricing from "@/components/Pricing";
import CourseContent from "@/components/CourseContent";
import Accreditation from "@/components/Accreditation";
import About from "@/components/About";
import Councils from "@/components/Councils";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { JsonLd } from "@/components/JsonLd";
import BookingReturnToast from "@/components/BookingReturnToast";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <JsonLd />
      <Suspense fallback={null}>
        <BookingReturnToast />
      </Suspense>
      <Navbar />
      <Hero />
      <TrustStrip />
      <CourseDates />
      <Pricing />
      <CourseContent />
      <Accreditation />
      <About />
      <Councils />
      <Reviews />
      <FAQ />
      <Contact />
      <Footer />
      <ScrollToTop />
    </>
  );
}
