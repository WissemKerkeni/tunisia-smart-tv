/**
 * Design tokens. Source of truth: docs/design-system.md (Stitch project
 * 5871788052375837613, design system assets/1286005704018735157).
 */

export const colors = {
  bg: '#131316',
  bgDeep: '#0E0E11',
  surface1: '#1B1B1E',
  surface2: '#1F1F22',
  surface3: '#2A2A2D',
  surface4: '#353438',
  textPrimary: '#E5E1E6',
  textSecondary: '#A9A6AD',
  textMuted: '#7D7A82',
  accent: '#E70013',
  onAccent: '#FFFFFF',
  accentSoft: '#FFB4AA',
  gold: '#E4C285',
  goldContainer: '#5D4514',
  info: '#81CFFF',
  success: '#34D399',
  warning: '#F5B544',
  error: '#FFB4AB',
  errorContainer: '#93000A',
  focusRing: '#FFFFFF',
  divider: 'rgba(255,255,255,0.10)',
  dividerStrong: 'rgba(255,255,255,0.15)',
  scrim: 'rgba(0,0,0,0.6)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
} as const;

export const fonts = {
  headline: 'Sora_700Bold',
  headlineHeavy: 'Sora_800ExtraBold',
  headlineSemi: 'Sora_600SemiBold',
  body: 'Manrope_400Regular',
  bodyMedium: 'Manrope_500Medium',
  bodySemi: 'Manrope_600SemiBold',
  bodyBold: 'Manrope_700Bold',
} as const;

export type TypeVariant = 'display' | 'section' | 'cardTitle' | 'body' | 'meta' | 'badge';

/** dp sizes. TV values are converted from Stitch CSS px at ×0.75 (960×540 dp canvas). */
export const typeScale: Record<'tv' | 'phone', Record<TypeVariant, number>> = {
  tv: { display: 54, section: 20, cardTitle: 16, body: 14, meta: 12, badge: 10 },
  phone: { display: 28, section: 20, cardTitle: 17, body: 14, meta: 12, badge: 11 },
};

/** TV focus treatment from the Stitch screens (scale + 4px white ring + red glow, 200 ms). */
export const focus = {
  cardScale: 1.08,
  buttonScale: 1.05,
  ringWidth: 4,
  durationMs: 200,
  glow: 'rgba(231,0,19,0.55)',
} as const;

/** Android TV overscan-safe margins (5%) on a 960×540 dp canvas. */
export const tvSafeArea = { horizontal: 48, vertical: 27 } as const;

/** Minimum touch target on phones. */
export const minTouchTarget = 48;
