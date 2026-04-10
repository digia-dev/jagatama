import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TeamSection from "@/components/TeamSection";
import ServicesSection from "@/components/ServicesSection";
import ProductsSection from "@/components/ProductsSection";
import ArticlesSection from "@/components/ArticlesSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <TeamSection />
        <ServicesSection />
        <ProductsSection />
        <ArticlesSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export default Index;
