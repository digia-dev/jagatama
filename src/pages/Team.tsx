import Navbar from "@/components/Navbar";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Team = () => {
  return (
    <>
      <Navbar />
      <main>
        <TeamSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export default Team;
