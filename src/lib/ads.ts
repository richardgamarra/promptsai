import type { AdData } from "@/components/prompts/ad-card";

export type InjectedAd = AdData & { isAd: true; key: string };

export function isAd(item: unknown): item is InjectedAd {
  return typeof item === "object" && item !== null && "isAd" in item;
}

/**
 * Calcula en que posiciones del listado entra un anuncio.
 * Misma mecanica que tenia el registro de widgets en codigo, pero leyendo la
 * configuracion de la base de datos en vez de un archivo.
 */
function positionsFor(ad: AdData, totalItems: number): number[] {
  const positions: number[] = [];
  const every = Math.max(1, ad.repeatEvery);
  const max = Math.max(0, ad.maxCount);

  let at = Math.max(0, ad.position);
  while (positions.length < max && at <= totalItems + positions.length) {
    positions.push(at);
    at += every;
  }

  return positions;
}

/**
 * Intercala los anuncios en la lista de prompts.
 * Devuelve una lista nueva; no toca la original.
 */
export function injectAds<T>(items: T[], ads: AdData[]): (T | InjectedAd)[] {
  if (!ads.length || !items.length) return items;

  const insertions: { position: number; ad: AdData; instance: number }[] = [];
  for (const ad of ads) {
    positionsFor(ad, items.length).forEach((position, instance) =>
      insertions.push({ position, ad, instance })
    );
  }

  // Orden ascendente para que el desplazamiento acumulado sea correcto
  insertions.sort((a, b) => a.position - b.position);

  const result: (T | InjectedAd)[] = [...items];
  let offset = 0;

  for (const { position, ad, instance } of insertions) {
    const at = Math.min(position + offset, result.length);
    result.splice(at, 0, { ...ad, isAd: true, key: `${ad.id}-${instance}` });
    offset++;
  }

  return result;
}
