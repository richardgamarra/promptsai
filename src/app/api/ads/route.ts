import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Anuncios activos para el listado publico.
 *
 * Devuelve solo lo que necesita pintar la tarjeta: ni metricas ni nombre
 * interno, que son cosa del panel.
 */
export async function GET() {
  try {
    const now = new Date();

    const ads = await db.ad.findMany({
      where: {
        enabled: true,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        ],
      },
      orderBy: { position: "asc" },
      select: {
        id: true,
        eyebrow: true,
        title: true,
        body: true,
        ctaLabel: true,
        ctaUrl: true,
        imageUrl: true,
        accentColor: true,
        position: true,
        repeatEvery: true,
        maxCount: true,
      },
    });

    return NextResponse.json(ads, {
      // Un minuto de cache: los anuncios no cambian cada segundo, y asi una
      // portada con trafico no dispara una consulta por visita.
      headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error("Error fetching ads:", error);
    // Un fallo aqui no debe romper el listado de prompts: se devuelve vacio.
    return NextResponse.json([]);
  }
}
