import { ImageResponse } from "next/og";
import { db } from "@/lib/db";
import { getConfig } from "@/lib/config";

/**
 * Tarjeta social de la portada.
 *
 * Sustituye al PNG estatico que traia el proyecto original, que mostraba el
 * logo, el lema y el dominio de prompts.chat. Al compartir el enlace aparecia
 * la marca de otro sitio.
 *
 * Se genera con la misma maquinaria que las tarjetas de cada prompt, asi que
 * respeta la configuracion de marca y las cifras salen de la base de datos:
 * la tarjeta no se queda obsoleta cuando crece el catalogo.
 */

export const alt = "PromptsAI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

const INK = "#0B1014";
const PAPER = "#EDEFEE";
const CYAN = "#22d3ee";
const SLATE = "#9AA7B4";

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 64 64" fill="none"><path d="M15 15 L32 32 L15 49" stroke="${PAPER}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><rect x="37" y="39" width="20" height="10" rx="5" fill="${CYAN}"/></svg>`;
const LOGO = `data:image/svg+xml;base64,${Buffer.from(LOGO_SVG).toString("base64")}`;

export default async function OGImage() {
  const config = await getConfig();

  // Si la base de datos no responde, la tarjeta se genera igual sin cifras.
  let prompts = 0;
  let categories = 0;
  try {
    [prompts, categories] = await Promise.all([
      db.prompt.count({ where: { isPrivate: false, isUnlisted: false, deletedAt: null } }),
      db.category.count(),
    ]);
  } catch {
    // sin cifras
  }

  const stats = [
    prompts ? `${prompts.toLocaleString("en-US")} prompts` : null,
    categories ? `${categories} categories` : null,
    "Free to copy",
  ].filter(Boolean) as string[];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: INK,
          padding: "72px 80px",
        }}
      >
        {/* Marca */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} width={72} height={72} alt="" />
          <div
            style={{
              display: "flex",
              fontSize: 44,
              fontWeight: 700,
              color: PAPER,
              letterSpacing: "-0.02em",
            }}
          >
            {config.branding.name}
          </div>
        </div>

        {/* Mensaje */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 800,
              color: PAPER,
              lineHeight: 1.08,
              letterSpacing: "-0.035em",
              maxWidth: 900,
            }}
          >
            Two thousand prompts, already tested by someone else.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 28,
              color: SLATE,
              maxWidth: 820,
            }}
          >
            {config.branding.description}
          </div>
        </div>

        {/* Cifras y firma */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `2px solid #1E2932`,
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {stats.map((s) => (
              <div
                key={s}
                style={{
                  display: "flex",
                  fontSize: 24,
                  color: CYAN,
                  letterSpacing: "0.02em",
                }}
              >
                {s}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#5C6875" }}>
            Infoplay Technologies
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
