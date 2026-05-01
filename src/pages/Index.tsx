import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProductsSection from "@/components/ProductsSection";
import ProgramSection from "@/components/ProgramSection";
import TestimonialSection from "@/components/TestimonialSection";
import AgrowisataSection from "@/components/AgrowisataSection";
import ArticlesSection from "@/components/ArticlesSection";

import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import SEOStructuredData from "@/components/SEOStructuredData";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Index = () => {
  return (
    <>
      <SEOStructuredData />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProductsSection />
        <ProgramSection />
        <TestimonialSection />
        <AgrowisataSection />
        <ArticlesSection />

        <ContactSection />
        <FAQSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export default Index;
