import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/** Cuenta de sistema que hereda la autoria del contenido importado. */
const BIBLIOTECA = "sys_promptsai_library";
/** Patron de email que usa el importador para los autores del conjunto de datos. */
const SUFIJO_IMPORTADO = "@unclaimed.prompts.chat";

/**
 * Limpia las cuentas que crea el importador de prompts.
 *
 * Por que existe esto: el importador da de alta un usuario por cada autor del
 * conjunto de datos, y muchos de esos nombres SON CORREOS REALES de personas,
 * que quedan publicados en el sitio.
 *
 * Por que no se borran y ya: `prompts.authorId` referencia a `users` con
 * ON DELETE CASCADE, asi que borrar las cuentas se llevaria los prompts por
 * delante. Hay que transferir la autoria primero, y en la misma transaccion.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const biblioteca = await db.user.findUnique({
      where: { id: BIBLIOTECA },
      select: { id: true },
    });

    if (!biblioteca) {
      return NextResponse.json(
        { error: "No existe la cuenta de sistema que debe heredar la autoria" },
        { status: 500 }
      );
    }

    const importados = await db.user.findMany({
      where: { email: { endsWith: SUFIJO_IMPORTADO } },
      select: { id: true },
    });

    if (importados.length === 0) {
      return NextResponse.json({ users: 0, prompts: 0, versions: 0 });
    }

    const ids = importados.map((u) => u.id);

    // Todo o nada: si algo falla, no se borra ninguna cuenta.
    const [prompts, versions, borrados] = await db.$transaction([
      db.prompt.updateMany({
        where: { authorId: { in: ids } },
        data: { authorId: BIBLIOTECA },
      }),
      db.promptVersion.updateMany({
        where: { createdBy: { in: ids } },
        data: { createdBy: BIBLIOTECA },
      }),
      db.user.deleteMany({ where: { id: { in: ids } } }),
    ]);

    // Sin esto el sitio seguiria sirviendo los correos ya borrados: la cache de
    // ruta de Next no se entera de los cambios hechos por SQL.
    revalidatePath("/", "layout");

    return NextResponse.json({
      users: borrados.count,
      prompts: prompts.count,
      versions: versions.count,
    });
  } catch (error) {
    console.error("Error cleaning imported users:", error);
    return NextResponse.json(
      { error: "Failed to clean imported users" },
      { status: 500 }
    );
  }
}

/** Cuantas cuentas importadas hay pendientes de limpiar. */
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pending = await db.user.count({
    where: { email: { endsWith: SUFIJO_IMPORTADO } },
  });

  return NextResponse.json({ pending });
}
