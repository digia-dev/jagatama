import { Users } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
}

const timPertanian: TeamMember[] = [
  { name: "Nurhadi Kamaluddin, S.E., M.Ak.", role: "Komisaris" },
  { name: "M. Abdullah Azzam, S.H", role: "Komisaris" },
  { name: "Akhmad Otong Turmudi, S.M.", role: "Direktur" },
  { name: "Sely Maulidia, Amd. Ak", role: "Finance" },
  { name: "Fiqih Puji Winarsih, S.Si., M.M.", role: "General Affair" },
  { name: "M. Helmi Maulana", role: "On Farm Manager" },
  { name: "Bina Zidan M", role: "On Farm Manager" },
];

const timPeternakan: TeamMember[] = [
  { name: "Mohamad Tarmuji", role: "Komisaris" },
  { name: "M. Fadhmi Amirullah", role: "Direktur" },
  { name: "Siti Khasanah", role: "Manager Finance" },
  { name: "Samrotul Jannah", role: "Manager Operasional" },
  { name: "Nurhadi Kamaluddin, S.E., M.Ak.", role: "Manager Investasi" },
];

const TeamCard = ({ member, index }: { member: TeamMember; index: number }) => (
  <div
    className="group relative bg-card border border-border rounded-sm p-5 hover:border-harvest/40 transition-all duration-300 hover:-translate-y-1"
    style={{ animationDelay: `${index * 0.05}s` }}
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-canopy/10 flex items-center justify-center shrink-0 group-hover:bg-harvest/10 transition-colors">
        <Users size={18} className="text-canopy group-hover:text-harvest transition-colors" />
      </div>
      <div>
        <p className="font-heading font-semibold text-foreground text-sm">{member.name}</p>
        <p className="font-body text-xs text-muted-foreground mt-0.5">{member.role}</p>
      </div>
    </div>
  </div>
);

const TeamSection = () => {
  return (
    <section id="tim" className="section-padding bg-canopy-gradient">
      <div className="max-w-7xl mx-auto">
        <p className="text-harvest font-body text-sm tracking-[0.25em] uppercase mb-3">Tim Kami</p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground leading-tight mb-16">
          Orang-Orang di Balik <br className="hidden md:block" />
          <em className="italic text-harvest font-medium">Living Root</em>
        </h2>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Jagasura Farm */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-harvest" />
              <h3 className="font-heading text-lg font-semibold text-primary-foreground">
                Tim Pertanian — Jagasura Farm
              </h3>
            </div>
            <div className="grid gap-3">
              {timPertanian.map((m, i) => (
                <TeamCard key={m.name} member={m} index={i} />
              ))}
            </div>
          </div>

          {/* MJ Farm */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-harvest" />
              <h3 className="font-heading text-lg font-semibold text-primary-foreground">
                Tim Peternakan — MJ Farm
              </h3>
            </div>
            <div className="grid gap-3">
              {timPeternakan.map((m, i) => (
                <TeamCard key={m.name} member={m} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
