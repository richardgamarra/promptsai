import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WidgetPlugin } from "./types";

/**
 * Tarjeta de Infoplay dentro del listado de prompts.
 *
 * Sustituye a los cuatro anuncios de terceros que traia el proyecto original
 * (coderabbit, el libro del autor, textream y commandcode). Este sitio existe
 * para captar clientes de Infoplay, asi que el espacio publicitario es nuestro.
 *
 * Para editar el texto o el enlace, basta con tocar este archivo. Para quitarla
 * del todo, sacar `infoplayWidget` del registro en ./index.ts.
 */
function InfoplayWidget() {
  return (
    <div className="group border rounded-[var(--radius)] overflow-hidden transition-colors hover:border-foreground/20 bg-[#0B1014]">
      <div className="flex flex-col items-center px-5 pb-5 pt-6 text-center">
        <Link href="https://infoplay.com" target="_blank" rel="noopener noreferrer">
          <Image
            src="/infoplay-technologies-plate.png"
            alt="Infoplay Technologies"
            width={640}
            height={183}
            sizes="220px"
            className="h-9 w-auto rounded-[3px]"
          />
        </Link>

        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#22d3ee]">
          Who builds this
        </p>

        <h3 className="mt-2 font-display text-base font-bold text-[#EDEFEE]">
          Need something like this for your business?
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-[#9AA7B4]">
          Infoplay designs and ships AI powered web products for real companies.
          This library is one of them.
        </p>

        <Button
          asChild
          size="sm"
          className="mt-4 w-full bg-[#22d3ee] text-[#04222a] hover:bg-[#67e8f9]"
        >
          <Link href="https://infoplay.com/start/" target="_blank" rel="noopener noreferrer">
            Tell us about your project
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export const infoplayWidget: WidgetPlugin = {
  id: "infoplay",
  name: "Infoplay Technologies",
  prompts: [
    {
      id: "infoplay-promo",
      slug: "infoplay-technologies",
      title: "Infoplay Technologies",
      description:
        "Infoplay designs and ships AI powered web products for real companies.",
      content: "",
      type: "TEXT",
      tags: ["Infoplay"],
      actionUrl: "https://infoplay.com/start/",
      actionLabel: "Tell us about your project",
      positioning: {
        position: 4,
        mode: "repeat",
        repeatEvery: 40,
        // Tres apariciones como mucho: un anuncio propio repetido sin freno
        // molesta igual que uno ajeno.
        maxCount: 3,
      },
      // Solo en el listado general. Si alguien esta filtrando o buscando algo
      // concreto, se le deja en paz.
      shouldInject: (context) => {
        const { filters } = context;
        if (filters?.type === "SKILL" || filters?.type === "TASTE") return false;
        return !filters?.q && !filters?.category && !filters?.tag;
      },
      render: () => <InfoplayWidget />,
    },
  ],
};
