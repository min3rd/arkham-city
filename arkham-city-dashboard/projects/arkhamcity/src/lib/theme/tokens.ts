export type ArkThemeMode = 'light' | 'dark';

export interface ArkColorPalette {
  neutral100: string;
  neutral200: string;
  neutral300: string;
  neutral500: string;
  neutral700: string;
  neutral900: string;
  primary100: string;
  primary200: string;
  primary300: string;
  primary500: string;
  primary600: string;
  success500: string;
  warning500: string;
  danger500: string;
}

export interface ArkSemanticTokens {
  background: string;
  surface: string;
  elevated: string;
  border: string;
  textPrimary: string;
  textMuted: string;
  focus: string;
  primary: string;
  primaryStrong: string;
  success: string;
  warning: string;
  danger: string;
}

export interface ArkSpacingScale {
  '2xs': string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  compactY: string;
  compactX: string;
}

export interface ArkTypeScale {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  weightRegular: string;
  weightMedium: string;
  weightSemibold: string;
}

export interface ArkRadii {
  sm: string;
  md: string;
  lg: string;
  full: string;
}

export interface ArkElevation {
  low: string;
  medium: string;
}

export interface ArkDesignTokens {
  palette: ArkColorPalette;
  semantic: ArkSemanticTokens;
  spacing: ArkSpacingScale;
  typography: ArkTypeScale;
  radii: ArkRadii;
  elevation: ArkElevation;
}

const basePalette: ArkColorPalette = {
  neutral100: '#f8fafc',
  neutral200: '#e2e8f0',
  neutral300: '#cbd5e1',
  neutral500: '#64748b',
  neutral700: '#334155',
  neutral900: '#0f172a',
  primary100: '#e0e7ff',
  primary200: '#c7d2fe',
  primary300: '#a5b4fc',
  primary500: '#4f46e5',
  primary600: '#4338ca',
  success500: '#22c55e',
  warning500: '#fbbf24',
  danger500: '#ef4444',
};

export const arkLightTokens: ArkDesignTokens = {
  palette: basePalette,
  semantic: {
    background: '#f5f6fb',
    surface: '#ffffff',
    elevated: '#ffffff',
    border: '#e2e8f0',
    textPrimary: '#0f172a',
    textMuted: '#475569',
    focus: '#4338ca',
    primary: basePalette.primary500,
    primaryStrong: basePalette.primary600,
    success: basePalette.success500,
    warning: basePalette.warning500,
    danger: basePalette.danger500,
  },
  spacing: {
    '2xs': '4px',
    xs: '6px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    compactY: '6px',
    compactX: '10px',
  },
  typography: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    weightRegular: '400',
    weightMedium: '500',
    weightSemibold: '600',
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    full: '9999px',
  },
  elevation: {
    low: '0 1px 2px rgba(15, 23, 42, 0.08)',
    medium: '0 8px 18px rgba(15, 23, 42, 0.12)',
  },
};

export const arkDarkTokens: ArkDesignTokens = {
  palette: basePalette,
  semantic: {
    background: '#0b1021',
    surface: '#0f172a',
    elevated: '#111827',
    border: '#1f2937',
    textPrimary: '#e2e8f0',
    textMuted: '#cbd5e1',
    focus: '#a5b4fc',
    primary: '#818cf8',
    primaryStrong: '#6366f1',
    success: '#34d399',
    warning: '#facc15',
    danger: '#f87171',
  },
  spacing: {
    '2xs': '4px',
    xs: '6px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    compactY: '6px',
    compactX: '10px',
  },
  typography: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    weightRegular: '400',
    weightMedium: '500',
    weightSemibold: '600',
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    full: '9999px',
  },
  elevation: {
    low: '0 1px 2px rgba(0, 0, 0, 0.45)',
    medium: '0 10px 22px rgba(0, 0, 0, 0.65)',
  },
};

export const arkSemanticVarMap: Record<string, keyof ArkSemanticTokens> = {
  'ark-color-background': 'background',
  'ark-color-surface': 'surface',
  'ark-color-elevated': 'elevated',
  'ark-color-border': 'border',
  'ark-color-text': 'textPrimary',
  'ark-color-text-muted': 'textMuted',
  'ark-color-focus': 'focus',
  'ark-color-primary': 'primary',
  'ark-color-primary-strong': 'primaryStrong',
  'ark-color-success': 'success',
  'ark-color-warning': 'warning',
  'ark-color-danger': 'danger',
};

export const arkSpacingVarMap: Record<string, keyof ArkSpacingScale> = {
  'ark-space-2xs': '2xs',
  'ark-space-xs': 'xs',
  'ark-space-sm': 'sm',
  'ark-space-md': 'md',
  'ark-space-lg': 'lg',
  'ark-space-xl': 'xl',
  'ark-space-compact-y': 'compactY',
  'ark-space-compact-x': 'compactX',
};

export const arkRadiiVarMap: Record<string, keyof ArkRadii> = {
  'ark-radius-sm': 'sm',
  'ark-radius-md': 'md',
  'ark-radius-lg': 'lg',
  'ark-radius-full': 'full',
};

export const arkTypographyVarMap: Record<string, keyof ArkTypeScale> = {
  'ark-font-size-xs': 'xs',
  'ark-font-size-sm': 'sm',
  'ark-font-size-md': 'md',
  'ark-font-size-lg': 'lg',
  'ark-font-weight-regular': 'weightRegular',
  'ark-font-weight-medium': 'weightMedium',
  'ark-font-weight-semibold': 'weightSemibold',
};

export const arkElevationVarMap: Record<string, keyof ArkElevation> = {
  'ark-elevation-low': 'low',
  'ark-elevation-medium': 'medium',
};
