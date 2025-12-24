import { DOCUMENT } from '@angular/common';
import {
  Inject,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import {
  ArkDesignTokens,
  ArkThemeMode,
  arkDarkTokens,
  arkElevationVarMap,
  arkLightTokens,
  arkRadiiVarMap,
  arkSemanticVarMap,
  arkSpacingVarMap,
  arkTypographyVarMap,
} from '../../theme/tokens';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private theme: ArkThemeMode = 'light';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    const cached = this.readStoredTheme();
    if (cached) {
      this.theme = cached;
    }
  }

  get currentTheme(): ArkThemeMode {
    return this.theme;
  }

  initTheme(): void {
    this.applyTheme(this.theme);
  }

  toggleTheme(): void {
    this.applyTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  applyTheme(mode: ArkThemeMode): void {
    this.theme = mode;
    this.persistTheme(mode);
    const tokens = mode === 'dark' ? arkDarkTokens : arkLightTokens;
    const root = this.document.documentElement;
    if (mode === 'dark') {
      this.renderer.addClass(root, 'dark');
    } else {
      this.renderer.removeClass(root, 'dark');
    }
    this.applyTokens(tokens);
  }

  getTokens(mode: ArkThemeMode = this.theme): ArkDesignTokens {
    return mode === 'dark' ? arkDarkTokens : arkLightTokens;
  }

  private applyTokens(tokens: ArkDesignTokens): void {
    const style = this.document.documentElement.style;
    this.writeMap(style, arkSemanticVarMap, tokens.semantic);
    this.writeMap(style, arkSpacingVarMap, tokens.spacing);
    this.writeMap(style, arkRadiiVarMap, tokens.radii);
    this.writeMap(style, arkTypographyVarMap, tokens.typography);
    this.writeMap(style, arkElevationVarMap, tokens.elevation);
  }

  private writeMap<T extends Record<string, string | number>>(
    style: CSSStyleDeclaration,
    map: Record<string, keyof T>,
    values: T,
  ) {
    Object.entries(map).forEach(([cssVar, tokenKey]) => {
      const value = values[tokenKey];
      if (value) {
        style.setProperty(`--${cssVar}`, String(value));
      }
    });
  }

  private readStoredTheme(): ArkThemeMode | null {
    try {
      const cached = localStorage.getItem('theme');
      if (cached === 'dark' || cached === 'light') {
        return cached;
      }
    } catch {
      // ignore
    }
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
    return null;
  }

  private persistTheme(mode: ArkThemeMode): void {
    try {
      localStorage.setItem('theme', mode);
    } catch {
      // Ignore storage failures (SSR/incognito)
    }
  }
}
