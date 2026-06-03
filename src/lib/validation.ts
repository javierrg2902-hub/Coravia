// Prototype-pollution guard shared across all external-JSON fetch paths.
// DANGEROUS_KEYS y hasNoDangerousKeys deben mantenerse en un único lugar;
// actualizar aquí protege automáticamente todos los consumidores.
export const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

export function hasNoDangerousKeys(obj: unknown): boolean {
  if (typeof obj !== "object" || obj === null) return true;
  for (const key of Object.keys(obj as object)) {
    if (DANGEROUS_KEYS.has(key)) return false;
    if (!hasNoDangerousKeys((obj as Record<string, unknown>)[key])) return false;
  }
  return true;
}
