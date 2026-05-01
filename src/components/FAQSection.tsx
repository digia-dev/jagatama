import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqData } from "@/data/faq";

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 bg-cream/30">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-body text-sm font-bold uppercase tracking-[0.25em] text-harvest mb-3">
              Tanya Jawab
            </p>
            <h2 className="font-hero text-3xl md:text-4xl font-bold text-foreground">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((item, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`}
                className="border border-border/60 bg-white rounded-xl px-6 py-1 shadow-sm transition-all hover:shadow-md hover:border-harvest/20"
              >
                <AccordionTrigger className="font-heading text-left text-base font-semibold text-foreground hover:text-harvest hover:no-underline py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="font-body text-sm leading-relaxed text-muted-foreground pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-16 p-8 bg-harvest/5 rounded-2xl border border-harvest/10 text-center">
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">
              Masih punya pertanyaan lain?
            </h3>
            <p className="font-body text-sm text-muted-foreground mb-6">
              Tim admin kami siap membantu menjelaskan lebih detail mengenai produk dan layanan kami.
            </p>
            <a 
              href="https://wa.me/6285743855637" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-sm font-bold text-harvest hover:underline"
            >
              Hubungi via WhatsApp →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
