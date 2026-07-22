import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  return session?.user && session.user.role === "ADMIN";
}

// Listado completo, con metricas, para el panel
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ads = await db.ad.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(ads);
}

// Crear anuncio
export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const b = await request.json();

    if (!b.name || !b.title || !b.ctaLabel || !b.ctaUrl) {
      return NextResponse.json(
        { error: "Name, title, CTA label and CTA URL are required" },
        { status: 400 }
      );
    }

    const ad = await db.ad.create({
      data: {
        name: b.name,
        enabled: b.enabled ?? true,
        eyebrow: b.eyebrow || null,
        title: b.title,
        body: b.body || null,
        ctaLabel: b.ctaLabel,
        ctaUrl: b.ctaUrl,
        imageUrl: b.imageUrl || null,
        accentColor: b.accentColor || "#22d3ee",
        position: Number(b.position) || 4,
        repeatEvery: Number(b.repeatEvery) || 40,
        maxCount: Number(b.maxCount) || 3,
        startsAt: b.startsAt ? new Date(b.startsAt) : null,
        endsAt: b.endsAt ? new Date(b.endsAt) : null,
      },
    });

    return NextResponse.json(ad);
  } catch (error) {
    console.error("Error creating ad:", error);
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 });
  }
}
