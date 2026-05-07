import { useTeamCms } from "@/hooks/useCmsQueries";

type TeamMemberApi = {
  id: number;
  name: string;
  position: string;
  department: string;
  bio: string;
  avatar_url: string;
  sort_order: number;
  is_active: number;
};

function initialsFromName(name: string): string {
  const main = name.split(",")[0].trim();
  const tokens = main.split(/\s+/).filter(Boolean);
  const significant = tokens.filter((t) => t.length > 2 || /^[A-Za-z]{2,}\.?$/.test(t));
  const use = significant.length >= 2 ? significant : tokens;
  const a = use[0]?.replace(/[^A-Za-z]/g, "") ?? "";
  const b = use[1]?.replace(/[^A-Za-z]/g, "") ?? "";
  if (a.length && b.length) return (a[0] + b[0]).toUpperCase();
  const compact = main.replace(/[^A-Za-z]/g, "");
  return compact.length >= 2 ? compact.slice(0, 2).toUpperCase() : "LR";
}

// Card for CMS-based member
const ApiTeamCard = ({ member, index }: { member: TeamMemberApi; index: number }) => {
  const initials = initialsFromName(member.name);
  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.06] backdrop-blur-sm shadow-lg shadow-black/10 transition-all duration-300 hover:border-harvest/45 hover:bg-primary-foreground/[0.1] hover:shadow-xl hover:shadow-harvest/5 hover:-translate-y-1"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-harvest via-harvest/80 to-canopy-light/60 opacity-90" aria-hidden />
      <div className="relative pl-7 pr-5 py-5 md:py-6 flex flex-col sm:flex-row sm:items-center gap-4">
        {member.avatar_url ? (
          <img src={member.avatar_url} alt={member.name} className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-primary-foreground/10" />
        ) : (
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-canopy/35 via-canopy/25 to-harvest/25 text-sm font-heading font-bold tracking-tight text-primary-foreground shadow-inner ring-1 ring-primary-foreground/10"
            aria-hidden
          >
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          {member.department && (
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-harvest/70">{member.department}</p>
          )}
          <p className="mb-2 inline-flex max-w-full items-center rounded-full border border-harvest/25 bg-harvest/10 px-2.5 py-0.5 font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-harvest">
            {member.position}
          </p>
          <h3 className="font-heading text-base font-semibold leading-snug text-primary-foreground md:text-lg">{member.name}</h3>
          {member.bio && <p className="mt-1 text-xs text-primary-foreground/60 line-clamp-2">{member.bio}</p>}
        </div>
      </div>
    </article>
  );
};

const TeamSection = () => {
  const { data: cmsMembers } = useTeamCms();

  const useCmsData = cmsMembers && cmsMembers.length > 0;

  // Group CMS members by department
  const departments = useCmsData
    ? [...new Set(cmsMembers!.map(m => m.department || "Umum"))]
    : [];

  return (
    <section id="tim" className="bg-canopy-gradient px-6 pb-20 pt-28 md:px-12 md:pb-28 md:pt-36 lg:px-20 xl:px-32">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 font-body text-sm uppercase tracking-[0.25em] text-harvest">Tim Kami</p>
        <h1 className="mb-4 font-heading text-3xl font-bold leading-tight text-primary-foreground md:text-5xl">
          Tim Penggerak <br className="hidden md:block" />
          <em className="font-medium italic text-harvest">Jagasura Agrotama</em>
        </h1>
        <p className="mb-14 max-w-2xl font-body text-base text-primary-foreground/70 md:text-lg">
          Struktur kepemimpinan dan operasional.
        </p>

        {useCmsData ? (
          // CMS mode: group by department
          departments.length > 1 ? (
            <div className="grid gap-14 md:grid-cols-2 md:gap-16 lg:gap-20">
              {departments.map((dept) => (
                <div key={dept}>
                  <div className="mb-8 flex items-center gap-3 border-b border-primary-foreground/10 pb-4">
                    <span className="h-px w-12 bg-harvest" />
                    <h2 className="font-heading text-xl font-semibold text-primary-foreground md:text-2xl">{dept}</h2>
                  </div>
                  <div className="grid gap-4">
                    {cmsMembers!.filter(m => (m.department || "Umum") === dept).map((m, i) => (
                      <ApiTeamCard key={m.id} member={m} index={i} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {cmsMembers!.map((m, i) => (
                <ApiTeamCard key={m.id} member={m} index={i} />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-primary-foreground/40 italic">Data tim belum tersedia di database.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;
