import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const KebijakanPrivasi = () => {
  return (
    <>
      <Navbar />
      <main className="bg-cream/20 pb-20 pt-24 md:pt-32">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 font-body text-sm font-medium text-muted-foreground transition-colors hover:text-harvest"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Kembali ke Beranda
          </Link>

          <div className="rounded-3xl border border-border bg-white p-8 md:p-12 shadow-sm">
            <p className="mb-4 font-body text-xs font-bold uppercase tracking-[0.25em] text-harvest">Legal</p>
            <h1 className="mb-10 font-heading text-3xl font-bold text-foreground md:text-4xl">
              Kebijakan Privasi
            </h1>

            <div className="prose prose-slate max-w-none font-body text-base leading-relaxed text-muted-foreground space-y-8">
              <section>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">1. Pendahuluan</h2>
                <p>
                  PT Jagasura Agrotama Indonesia ("kami", "Jagasura") berkomitmen untuk melindungi dan menghormati privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda saat menggunakan website kami sesuai dengan UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">2. Data yang Kami Kumpulkan</h2>
                <p>Kami mengumpulkan informasi yang Anda berikan secara sukarela saat menggunakan fitur keranjang belanja atau formulir kontak, termasuk:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Nama Lengkap</li>
                  <li>Alamat Pengiriman</li>
                  <li>Nomor Telepon (WhatsApp)</li>
                  <li>Detail Pesanan Produk</li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">3. Penggunaan Informasi</h2>
                <p>Informasi yang kami kumpulkan digunakan semata-mata untuk:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Memproses pesanan dan pengiriman produk Anda.</li>
                  <li>Menghubungi Anda terkait transaksi atau pertanyaan yang Anda ajukan.</li>
                  <li>Meningkatkan layanan dan pengalaman pengguna di website kami.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">4. Penyimpanan dan Keamanan</h2>
                <p>
                  Data pesanan yang Anda masukkan di keranjang belanja hanya disimpan secara lokal di perangkat Anda (localStorage) hingga Anda mengirimkannya via WhatsApp atau mengosongkan keranjang. Kami tidak menyimpan data sensitif di server publik kami kecuali diperlukan untuk pemrosesan transaksi yang sah.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">5. Hak Anda</h2>
                <p>
                  Berdasarkan UU PDP, Anda memiliki hak untuk mengakses, memperbarui, atau meminta penghapusan data pribadi Anda yang ada pada kami. Jika Anda ingin menggunakan hak ini, silakan hubungi kami melalui saluran resmi yang tersedia.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">6. Kontak Kami</h2>
                <p>
                  Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi kami di:
                  <br />
                  <strong>PT Jagasura Agrotama Indonesia</strong>
                  <br />
                  Dukuhwaru, Tegal, Jawa Tengah
                  <br />
                  Email: admin@jagatama.id
                </p>
              </section>
            </div>

            <div className="mt-16 pt-8 border-t border-border">
              <p className="text-xs text-muted-foreground italic">
                Terakhir diperbarui: April 2026
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export default KebijakanPrivasi;
