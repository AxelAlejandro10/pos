/**
 * Public guest-page branding tokens (#370).
 * Primary CTA default is blue (go/confirm), not terracotta/stop.
 */
export const PUBLIC_PRIMARY_COLOR_DEFAULT = '#2563EB';

/** Resolve tenant primary CTA hex, or the OOBE blue default. */
export function resolvePublicPrimaryColor(
  hex: string | null | undefined,
): string {
  const v = (hex || '').trim();
  if (!v) return PUBLIC_PRIMARY_COLOR_DEFAULT;
  return v.startsWith('#') ? v : `#${v}`;
}
