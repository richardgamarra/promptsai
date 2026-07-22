import type { WidgetPlugin, WidgetPrompt, WidgetContext, InjectedWidget } from "./types";

export * from "./types";

// Registro VACIO a proposito.
//
// El proyecto original registraba aqui cuatro anuncios suyos (coderabbit, su
// libro, textream y commandcode), escritos a mano en codigo. Ahora los anuncios
// se gestionan desde el panel de admin y viven en la tabla `ads`: se crean, se
// programan y se miden sin desplegar. Ver src/lib/ads.ts y
// src/components/prompts/ad-card.tsx.
//
// Esta maquinaria se conserva porque sigue soportando widgets con logica propia
// en React, algo que una fila de base de datos no puede expresar. Si alguna vez
// hace falta uno, se registra aqui.
const widgetPlugins: WidgetPlugin[] = [];

/**
 * Get all registered widget plugins
 */
export function getWidgetPlugins(): WidgetPlugin[] {
  return widgetPlugins;
}

/**
 * Get all widget prompts
 */
export function getWidgetPrompts(): WidgetPrompt[] {
  return widgetPlugins.flatMap((plugin) => plugin.prompts);
}

/**
 * Get a specific widget plugin by ID
 */
export function getWidgetPlugin(id: string): WidgetPlugin | undefined {
  return widgetPlugins.find((plugin) => plugin.id === id);
}

/**
 * Get a specific prompt from a widget plugin
 */
export function getWidgetPrompt(pluginId: string, promptId: string): WidgetPrompt | undefined {
  const plugin = getWidgetPlugin(pluginId);
  return plugin?.prompts.find((prompt) => prompt.id === promptId);
}

/**
 * Calculate all insertion positions for a widget based on its positioning config
 */
function getWidgetInsertionPositions(
  widget: WidgetPrompt,
  totalItems: number
): number[] {
  const config = widget.positioning;
  const mode = config?.mode ?? "once";
  // Support legacy `position` field, fallback to positioning.position, then default to 2
  const startPosition = config?.position ?? widget.position ?? 2;
  
  if (mode === "once") {
    const maxCount = config?.maxCount ?? 1;
    return maxCount > 0 ? [startPosition] : [];
  }
  
  // Repeat mode
  const repeatEvery = config?.repeatEvery ?? 30;
  const maxCount = config?.maxCount; // undefined = unlimited
  const positions: number[] = [];
  
  let currentPosition = startPosition;
  let count = 0;
  
  // Generate positions until we exceed the total items or hit maxCount
  while (currentPosition <= totalItems + positions.length) {
    if (maxCount !== undefined && count >= maxCount) break;
    positions.push(currentPosition);
    currentPosition += repeatEvery;
    count++;
  }
  
  return positions;
}

/**
 * Inject widget prompts into a list of items.
 * Each widget defines its own shouldInject logic and positioning strategy.
 * 
 * Positioning modes:
 * - "once": Insert widget once at the specified position (default)
 * - "repeat": Insert widget every N items (configured via repeatEvery)
 * 
 * @param items - The original list of items
 * @param context - Context passed to each widget's shouldInject function
 * @returns A new array with widget prompts injected, marked with { isWidget: true }
 */
export function injectWidgets<T>(
  items: T[],
  context: WidgetContext = {}
): (T | InjectedWidget)[] {
  const widgetPrompts = getWidgetPrompts();
  
  if (widgetPrompts.length === 0 || items.length === 0) {
    return items;
  }

  // Filter widgets that should be injected based on their own logic
  const widgetsToInject = widgetPrompts.filter((widget) => {
    if (widget.shouldInject) {
      return widget.shouldInject({ ...context, itemCount: items.length });
    }
    // Default: inject if no filters are active
    return !context.filters?.q && !context.filters?.category && !context.filters?.tag;
  });

  if (widgetsToInject.length === 0) {
    return items;
  }

  // Collect all insertions: { position, widget, instanceIndex }
  const insertions: { position: number; widget: WidgetPrompt; instanceIndex: number }[] = [];
  
  for (const widget of widgetsToInject) {
    const positions = getWidgetInsertionPositions(widget, items.length);
    for (let i = 0; i < positions.length; i++) {
      insertions.push({ position: positions[i], widget, instanceIndex: i });
    }
  }
  
  // Sort insertions by position (ascending) for correct offset calculation
  insertions.sort((a, b) => a.position - b.position);

  const result: (T | InjectedWidget)[] = [...items];
  
  // Inject widgets at their calculated positions
  let offset = 0;
  for (const insertion of insertions) {
    const insertAt = Math.min(insertion.position + offset, result.length);
    const instanceId = insertion.instanceIndex > 0
      ? `${insertion.widget.id}-${insertion.instanceIndex}`
      : insertion.widget.id;
    result.splice(insertAt, 0, { ...insertion.widget, id: instanceId, instanceIndex: insertion.instanceIndex, isWidget: true as const });
    offset++;
  }

  return result;
}
