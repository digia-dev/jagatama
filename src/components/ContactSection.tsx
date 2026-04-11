import { MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { whatsappContacts } from "@/data/whatsappContacts";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const waMessage = encodeURIComponent(`Halo, saya ${form.name} (${form.email}). ${form.message}`);
    window.open(`https://wa.me/${whatsappContacts[0].waId}?text=${waMessage}`, "_blank");
  };

  return (
    <section id="kontak" className="section-padding bg-cream-gradient">
      <div className="max-w-7xl mx-auto">
        <p className="text-harvest font-body text-sm tracking-[0.25em] uppercase mb-3">Kontak</p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground leading-tight mb-16">
          Bergabung Bersama Kami
        </h2>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={20} className="text-harvest" />
                <h3 className="font-heading text-lg font-semibold text-foreground">Lokasi</h3>
              </div>
              <p className="font-body text-muted-foreground leading-relaxed">
                Jalan Gili Turi, Dukuhwaru, Tegal,<br />
                Jawa Tengah, Indonesia
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <Phone size={20} className="text-harvest" />
                <h3 className="font-heading text-lg font-semibold text-foreground">WhatsApp</h3>
              </div>
              <div className="space-y-3">
                {whatsappContacts.map((c) => (
                  <a
                    key={c.waId}
                    href={`https://wa.me/${c.waId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-card border border-border rounded-sm hover:border-harvest/30 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-canopy/10 flex items-center justify-center group-hover:bg-harvest/10 transition-colors">
                      <Phone size={14} className="text-canopy group-hover:text-harvest transition-colors" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">{c.name}</p>
                      <p className="font-body text-xs text-muted-foreground">{c.phone}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Map embed */}
            <div className="rounded-sm overflow-hidden border border-border h-[250px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15844.5!2d109.1!3d-6.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTQnMDAuMCJTIDEwOcKwMDYnMDAuMCJF!5e0!3m2!1sen!2sid!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Jagasura Farm"
              />
            </div>
          </div>

          {/* Contact form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">Nama</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-harvest transition-colors"
                  placeholder="Nama lengkap Anda"
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-harvest transition-colors"
                  placeholder="email@contoh.com"
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">Pesan</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-harvest transition-colors resize-none"
                  placeholder="Tuliskan pesan Anda..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-harvest text-harvest-foreground font-body font-semibold px-8 py-4 rounded-sm text-base tracking-wide hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Kirim Pesan via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
