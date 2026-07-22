"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Pencil, RotateCcw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Ad {
  id: string;
  name: string;
  enabled: boolean;
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
  startsAt: string | null;
  endsAt: string | null;
  impressions: number;
  clicks: number;
}

const VACIO = {
  name: "", enabled: true, eyebrow: "", title: "", body: "",
  ctaLabel: "", ctaUrl: "", imageUrl: "", accentColor: "#22d3ee",
  position: 4, repeatEvery: 40, maxCount: 3, startsAt: "", endsAt: "",
};

function ctr(ad: Ad): string {
  if (!ad.impressions) return "n/d";
  return `${((ad.clicks / ad.impressions) * 100).toFixed(1)}%`;
}

function paraInput(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "";
}

export function AdsTable() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState<Ad | null>(null);
  const [form, setForm] = useState({ ...VACIO });
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/ads");
      if (!r.ok) throw new Error();
      setAds(await r.json());
    } catch {
      toast.error("No se pudieron cargar los anuncios");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  function abrirNuevo() {
    setEditando(null);
    setForm({ ...VACIO });
    setAbierto(true);
  }

  function abrirEdicion(ad: Ad) {
    setEditando(ad);
    setForm({
      name: ad.name, enabled: ad.enabled, eyebrow: ad.eyebrow ?? "",
      title: ad.title, body: ad.body ?? "", ctaLabel: ad.ctaLabel,
      ctaUrl: ad.ctaUrl, imageUrl: ad.imageUrl ?? "", accentColor: ad.accentColor,
      position: ad.position, repeatEvery: ad.repeatEvery, maxCount: ad.maxCount,
      startsAt: paraInput(ad.startsAt), endsAt: paraInput(ad.endsAt),
    });
    setAbierto(true);
  }

  async function guardar() {
    if (!form.name || !form.title || !form.ctaLabel || !form.ctaUrl) {
      toast.error("Nombre, titular, texto del boton y enlace son obligatorios");
      return;
    }
    setGuardando(true);
    try {
      const r = await fetch(
        editando ? `/api/admin/ads/${editando.id}` : "/api/admin/ads",
        {
          method: editando ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!r.ok) throw new Error();
      toast.success(editando ? "Anuncio actualizado" : "Anuncio creado");
      setAbierto(false);
      cargar();
    } catch {
      toast.error("No se pudo guardar");
    } finally {
      setGuardando(false);
    }
  }

  async function parchear(id: string, data: Record<string, unknown>, msg: string) {
    try {
      const r = await fetch(`/api/admin/ads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!r.ok) throw new Error();
      toast.success(msg);
      cargar();
    } catch {
      toast.error("No se pudo actualizar");
    }
  }

  async function borrar(ad: Ad) {
    if (!confirm(`Borrar el anuncio "${ad.name}"? Se pierden sus metricas.`)) return;
    try {
      const r = await fetch(`/api/admin/ads/${ad.id}`, { method: "DELETE" });
      if (!r.ok) throw new Error();
      toast.success("Anuncio borrado");
      cargar();
    } catch {
      toast.error("No se pudo borrar");
    }
  }

  const totalImpresiones = ads.reduce((s, a) => s + a.impressions, 0);
  const totalClics = ads.reduce((s, a) => s + a.clicks, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Anuncios</h2>
          <p className="text-sm text-muted-foreground">
            {ads.length} en total. {totalImpresiones.toLocaleString()} impresiones
            y {totalClics.toLocaleString()} clics acumulados.
          </p>
        </div>
        <Button onClick={abrirNuevo} size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Nuevo anuncio
        </Button>
      </div>

      <div className="rounded-[var(--radius)] border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Posicion</TableHead>
              <TableHead>Campana</TableHead>
              <TableHead className="text-right">Impresiones</TableHead>
              <TableHead className="text-right">Clics</TableHead>
              <TableHead className="text-right">CTR</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cargando && (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                  Cargando...
                </TableCell>
              </TableRow>
            )}
            {!cargando && ads.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                  Todavia no hay anuncios. Crea el primero para ocupar el espacio
                  del listado de prompts.
                </TableCell>
              </TableRow>
            )}
            {ads.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full border"
                      style={{ backgroundColor: ad.accentColor }}
                    />
                    <div>
                      <div className="font-medium">{ad.name}</div>
                      <div className="text-xs text-muted-foreground">{ad.title}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={ad.enabled}
                      onCheckedChange={(v) =>
                        parchear(ad.id, { enabled: v }, v ? "Anuncio activado" : "Anuncio pausado")
                      }
                    />
                    <Badge variant={ad.enabled ? "default" : "secondary"}>
                      {ad.enabled ? "Activo" : "Pausado"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  desde {ad.position}, cada {ad.repeatEvery}, max {ad.maxCount}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {ad.startsAt || ad.endsAt
                    ? `${paraInput(ad.startsAt) || "sin inicio"} a ${paraInput(ad.endsAt) || "sin fin"}`
                    : "permanente"}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {ad.impressions.toLocaleString()}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {ad.clicks.toLocaleString()}
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium">
                  {ctr(ad)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" title="Abrir destino" asChild>
                      <a href={ad.ctaUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost" size="icon" title="Poner metricas a cero"
                      onClick={() => parchear(ad.id, { resetMetrics: true }, "Metricas reiniciadas")}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Editar" onClick={() => abrirEdicion(ad)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon" title="Borrar"
                      onClick={() => borrar(ad)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={abierto} onOpenChange={setAbierto}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>{editando ? "Editar anuncio" : "Nuevo anuncio"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Nombre interno</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Campana Infoplay verano"
              />
              <p className="text-xs text-muted-foreground">Solo se ve aqui, no en el sitio.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Etiqueta superior</Label>
                <Input
                  value={form.eyebrow}
                  onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
                  placeholder="Quien construye esto"
                />
              </div>
              <div className="grid gap-2">
                <Label>Color de acento</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={form.accentColor}
                    onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                    className="h-9 w-14 p-1"
                  />
                  <Input
                    value={form.accentColor}
                    onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Titular</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label>Texto</Label>
              <Textarea
                rows={3}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label>Imagen o logo (URL)</Label>
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="/infoplay-technologies-plate.png"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Texto del boton</Label>
                <Input
                  value={form.ctaLabel}
                  onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Enlace del boton</Label>
                <Input
                  value={form.ctaUrl}
                  onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })}
                  placeholder="https://"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label>Primera posicion</Label>
                <Input
                  type="number" min={0}
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Cada N prompts</Label>
                <Input
                  type="number" min={1}
                  value={form.repeatEvery}
                  onChange={(e) => setForm({ ...form, repeatEvery: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Maximo</Label>
                <Input
                  type="number" min={0}
                  value={form.maxCount}
                  onChange={(e) => setForm({ ...form, maxCount: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Empieza</Label>
                <Input
                  type="date"
                  value={form.startsAt}
                  onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Termina</Label>
                <Input
                  type="date"
                  value={form.endsAt}
                  onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Deja las fechas vacias para que el anuncio sea permanente.
            </p>

            <div className="flex items-center gap-2">
              <Switch
                checked={form.enabled}
                onCheckedChange={(v) => setForm({ ...form, enabled: v })}
              />
              <Label>Activo</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAbierto(false)}>
              Cancelar
            </Button>
            <Button onClick={guardar} disabled={guardando}>
              {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear anuncio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
