import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Registra una impresion o un clic de un anuncio.
 *
 * Es publico a proposito: lo llama el navegador del visitante. Solo incrementa
 * un contador, no acepta ningun valor del cliente ni devuelve datos, asi que
 * lo peor que puede hacer alguien es inflar sus propias cifras.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = request.nextUrl.searchParams.get("event");

    if (event !== "click" && event !== "impression") {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    await db.ad.update({
      where: { id },
      data:
        event === "click"
          ? { clicks: { increment: 1 } }
          : { impressions: { increment: 1 } },
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Si el anuncio ya no existe, no es un error que merezca ruido.
    return NextResponse.json({ ok: false }, { status: 204 });
  }
}
