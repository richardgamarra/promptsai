"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

export interface AdData {
  id: string;
  eyebrow: string | null;
  title: string;
  body: string | null;
  ctaLabel: string;
  ctaUrl: string;
  imageUrl: string | null;
  accentColor: string;
  position: number;
  repeatEvery: number;
  maxCount: number;
}

function track(id: string, event: "impression" | "click") {
  const url = `/api/ads/${id}/track?event=${event}`;
  // keepalive para que el clic se registre aunque la pestana se vaya al destino
  fetch(url, { method: "POST", keepalive: true }).catch(() => {});
}

/**
 * Tarjeta de anuncio. Una sola plantilla para todos: cambia el contenido y el
 * color de acento, nunca la estructura. Asi ningun anuncio puede romper el
 * diseno del listado ni inyectar marcado arbitrario.
 */
export function AdCard({ ad }: { ad: AdData }) {
  const ref = useRef<HTMLDivElement>(null);
  const yaContado = useRef(false);

  // La impresion se cuenta cuando el anuncio entra de verdad en pantalla, no
  // cuando se monta: si nadie lo llego a ver, no es una impresion.
  useEffect(() => {
    const el = ref.current;
    if (!el || yaContado.current) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !yaContado.current) {
            yaContado.current = true;
            track(ad.id, "impression");
            obs.disconnect();
          }
        }
      },
      { threshold: 0.5 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [ad.id]);

  return (
    <div
      ref={ref}
      className="group overflow-hidden rounded-[var(--radius)] border bg-[#0B1014] transition-colors hover:border-foreground/20"
    >
      <div className="flex flex-col items-center px-5 pb-5 pt-6 text-center">
        {ad.imageUrl && (
          // <img> a proposito y no next/image: la URL puede apuntar a cualquier
          // dominio que ponga el anunciante, y next/image exige declarar cada
          // dominio en la configuracion y falla si no esta.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ad.imageUrl}
            alt=""
            loading="lazy"
            className="mb-5 h-9 w-auto max-w-[220px] rounded-[3px] object-contain"
          />
        )}

        {ad.eyebrow && (
          <p
            className="font-mono text-[10px] uppercase tracking-[0.16em]"
            style={{ color: ad.accentColor }}
          >
            {ad.eyebrow}
          </p>
        )}

        <h3 className="mt-2 font-display text-base font-bold text-[#EDEFEE]">
          {ad.title}
        </h3>

        {ad.body && (
          <p className="mt-2 text-xs leading-relaxed text-[#9AA7B4]">{ad.body}</p>
        )}

        <a
          href={ad.ctaUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => track(ad.id, "click")}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius)] px-4 py-2 text-sm font-medium text-[#04222a] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ backgroundColor: ad.accentColor }}
        >
          {ad.ctaLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </a>

        <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#5C6875]">
          Sponsored
        </p>
      </div>
    </div>
  );
}
