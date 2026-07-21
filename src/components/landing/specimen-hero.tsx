import Image from "next/image";
import { db } from "@/lib/db";

/**
 * Heroe de PromptsAI.
 *
 * La idea: la portada se lee como la hoja de especimen de una coleccion, no
 * como una landing de SaaS. El panel oscuro es el unico sitio de la pagina
 * donde nos permitimos espectaculo; todo lo demas se mantiene callado.
 *
 * El prompt que se muestra es real y sale de la base de datos, con su
 * categoria y su recuento. Nada de texto de relleno.
 */

const EXCERPT_LENGTH = 340;

function excerpt(content: string): string {
  const clean = content.replace(/\s+/g, " ").trim();
  if (clean.length <= EXCERPT_LENGTH) return clean;
  // Cortamos en el ultimo espacio para no partir una palabra por la mitad.
  const cut = clean.slice(0, EXCERPT_LENGTH);
  return cut.slice(0, cut.lastIndexOf(" ")) + "...";
}

function countWords(content: string): number {
  return content.trim().split(/\s+/).length;
}

async function getSpecimen() {
  const [prompt, promptCount, categoryCount, tagCount] = await Promise.all([
    db.prompt.findFirst({
      where: {
        isPrivate: false,
        isUnlisted: false,
        deletedAt: null,
        // El especimen es el escaparate, asi que exigimos que se lea bien:
        // categoria de verdad, texto plano, y nada que empiece por "{" (hay
        // prompts guardados como JSON crudo que quedan horribles en grande).
        type: "TEXT",
        categoryId: { not: null },
        NOT: { content: { startsWith: "{" } },
      },
      orderBy: [{ isFeatured: "desc" }, { viewCount: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        category: { select: { name: true, slug: true } },
      },
    }),
    db.prompt.count({ where: { isPrivate: false, isUnlisted: false, deletedAt: null } }),
    db.category.count(),
    db.tag.count(),
  ]);

  return { prompt, promptCount, categoryCount, tagCount };
}

export async function SpecimenHero({
  description,
  children,
}: {
  description: string;
  children?: React.ReactNode;
}) {
  const { prompt, promptCount, categoryCount, tagCount } = await getSpecimen();

  const readout: Array<[string, string]> = [
    ["prompts", promptCount.toLocaleString("en-US")],
    ["categories", categoryCount.toLocaleString("en-US")],
    ["tags", tagCount.toLocaleString("en-US")],
  ];

  return (
    <section className="border-b">
      <div className="container py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:items-center">
          {/* Columna de texto */}
          <div className="max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Open prompt library
            </p>

            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
              Two thousand prompts,
              <br />
              already tested by
              <br />
              someone else.
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>

            {children && <div className="mt-9">{children}</div>}
          </div>

          {/* El especimen: el unico elemento con espectaculo de la pagina */}
          {prompt && (
            <figure className="specimen-panel relative m-0 overflow-hidden rounded-xl bg-[#0B1014] p-6 shadow-[0_1px_0_rgba(34,211,238,0.35)] ring-1 ring-[#22d3ee]/25 sm:p-8">
              <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#9AA7B4]">
                <span className="text-[#22d3ee]">Specimen</span>
                <span aria-hidden="true" className="text-[#3A4753]">
                  /
                </span>
                <span>{prompt.category?.name ?? "Uncategorised"}</span>
                <span aria-hidden="true" className="text-[#3A4753]">
                  /
                </span>
                <span>{countWords(prompt.content).toLocaleString("en-US")} words</span>
              </figcaption>

              {/* Firma de Infoplay sobre el especimen. El PNG lleva el fondo
                  azul del original recortado por luminancia, asi que apoya
                  sobre el panel sin dejar rectangulo. */}
              <Image
                src="/infoplay-technologies.png"
                alt="Infoplay Technologies"
                width={900}
                height={243}
                priority
                className="mt-6 h-auto w-[180px] sm:w-[200px]"
              />

              <h2 className="mt-4 font-display text-2xl font-bold leading-tight tracking-[-0.02em] text-[#EDEFEE] sm:text-3xl">
                {prompt.title}
                <span aria-hidden="true" className="specimen-caret ms-2 inline-block h-[0.72em] w-[0.5em] translate-y-[0.06em] rounded-[3px] bg-[#22d3ee] align-baseline" />
              </h2>

              <blockquote className="mt-5 border-s-2 border-[#22d3ee]/45 ps-4">
                <p className="font-mono text-[13px] leading-[1.75] text-[#9AA7B4] break-words">
                  {excerpt(prompt.content)}
                </p>
              </blockquote>

              <dl className="mt-7 grid grid-cols-3 gap-4 border-t border-[#1E2932] pt-5">
                {readout.map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#7C8A97]">
                      {label}
                    </dt>
                    <dd className="mt-1 font-display text-xl font-bold text-[#EDEFEE]">{value}</dd>
                  </div>
                ))}
              </dl>
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}
