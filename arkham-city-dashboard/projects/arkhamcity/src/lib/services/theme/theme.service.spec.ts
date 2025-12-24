import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { arkDarkTokens, arkLightTokens } from '../../theme/tokens';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [ThemeService],
    });
    service = TestBed.inject(ThemeService);
  });

  it('applies light tokens to CSS variables', () => {
    service.applyTheme('light');
    const root = document.documentElement.style;
    expect(root.getPropertyValue('--ark-color-primary')).toBe(
      arkLightTokens.semantic.primary,
    );
    expect(root.getPropertyValue('--ark-control-outline')).toBe(
      arkLightTokens.elevation.controlOutline,
    );
    expect(service.currentTheme).toBe('light');
  });

  it('switches to dark mode', () => {
    service.applyTheme('dark');
    expect(service.currentTheme).toBe('dark');
    const rootElement = document.documentElement;
    expect(rootElement.classList.contains('dark')).toBeTrue();
    expect(
      rootElement.style.getPropertyValue('--ark-color-primary'),
    ).toBe(arkDarkTokens.semantic.primary);
    expect(
      rootElement.style.getPropertyValue('--ark-control-outline'),
    ).toBe(arkDarkTokens.elevation.controlOutline);
  });
});
