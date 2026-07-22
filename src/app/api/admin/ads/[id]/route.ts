import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  return session?.user && session.user.role === "ADMIN";
}

// Editar anuncio. Tambien sirve para activar y desactivar, y para poner los
// contadores a cero al empezar una campana nueva.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const b = await request.json();
    const data: Record<string, unknown> = {};

    for (const k of ["name", "title", "ctaLabel", "ctaUrl", "accentColor"] as const) {
      if (b[k] !== undefined) data[k] = b[k];
    }
    for (const k of ["eyebrow", "body", "imageUrl"] as const) {
      if (b[k] !== undefined) data[k] = b[k] || null;
    }
    for (const k of ["position", "repeatEvery", "maxCount"] as const) {
      if (b[k] !== undefined) data[k] = Number(b[k]);
    }
    for (const k of ["startsAt", "endsAt"] as const) {
      if (b[k] !== undefined) data[k] = b[k] ? new Date(b[k]) : null;
    }
    if (b.enabled !== undefined) data.enabled = Boolean(b.enabled);
    if (b.resetMetrics) {
      data.impressions = 0;
      data.clicks = 0;
    }

    const ad = await db.ad.update({ where: { id }, data });
    return NextResponse.json(ad);
  } catch (error) {
    console.error("Error updating ad:", error);
    return NextResponse.json({ error: "Failed to update ad" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await db.ad.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting ad:", error);
    return NextResponse.json({ error: "Failed to delete ad" }, { status: 500 });
  }
}
