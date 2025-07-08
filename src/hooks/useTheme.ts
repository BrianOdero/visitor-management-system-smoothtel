import { useEffect } from 'react';
import { companyConfig } from '../config/company';

export const useTheme = () => {
  useEffect(() => {
    const root = document.documentElement;
    const { colors } = companyConfig;
    
    // Set CSS custom properties for dynamic theming
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    
    // Generate lighter and darker variants
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };
    
    const rgbToHsl = (r: number, g: number, b: number) => {
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      
      return { h: h * 360, s: s * 100, l: l * 100 };
    };
    
    // Generate color variants for primary color
    const primaryRgb = hexToRgb(colors.primary);
    if (primaryRgb) {
      const primaryHsl = rgbToHsl(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      
      // Generate lighter variants
      root.style.setProperty('--color-primary-50', `hsl(${primaryHsl.h}, ${primaryHsl.s}%, 95%)`);
      root.style.setProperty('--color-primary-100', `hsl(${primaryHsl.h}, ${primaryHsl.s}%, 90%)`);
      root.style.setProperty('--color-primary-200', `hsl(${primaryHsl.h}, ${primaryHsl.s}%, 80%)`);
      root.style.setProperty('--color-primary-300', `hsl(${primaryHsl.h}, ${primaryHsl.s}%, 70%)`);
      root.style.setProperty('--color-primary-400', `hsl(${primaryHsl.h}, ${primaryHsl.s}%, 60%)`);
      root.style.setProperty('--color-primary-500', colors.primary);
      root.style.setProperty('--color-primary-600', `hsl(${primaryHsl.h}, ${primaryHsl.s}%, ${Math.max(primaryHsl.l - 10, 10)}%)`);
      root.style.setProperty('--color-primary-700', `hsl(${primaryHsl.h}, ${primaryHsl.s}%, ${Math.max(primaryHsl.l - 20, 5)}%)`);
      root.style.setProperty('--color-primary-800', `hsl(${primaryHsl.h}, ${primaryHsl.s}%, ${Math.max(primaryHsl.l - 30, 5)}%)`);
      root.style.setProperty('--color-primary-900', `hsl(${primaryHsl.h}, ${primaryHsl.s}%, ${Math.max(primaryHsl.l - 40, 5)}%)`);
    }
    
    // Generate color variants for secondary color
    const secondaryRgb = hexToRgb(colors.secondary);
    if (secondaryRgb) {
      const secondaryHsl = rgbToHsl(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
      
      root.style.setProperty('--color-secondary-50', `hsl(${secondaryHsl.h}, ${secondaryHsl.s}%, 95%)`);
      root.style.setProperty('--color-secondary-100', `hsl(${secondaryHsl.h}, ${secondaryHsl.s}%, 90%)`);
      root.style.setProperty('--color-secondary-200', `hsl(${secondaryHsl.h}, ${secondaryHsl.s}%, 80%)`);
      root.style.setProperty('--color-secondary-300', `hsl(${secondaryHsl.h}, ${secondaryHsl.s}%, 70%)`);
      root.style.setProperty('--color-secondary-400', `hsl(${secondaryHsl.h}, ${secondaryHsl.s}%, 60%)`);
      root.style.setProperty('--color-secondary-500', colors.secondary);
      root.style.setProperty('--color-secondary-600', `hsl(${secondaryHsl.h}, ${secondaryHsl.s}%, ${Math.max(secondaryHsl.l - 10, 10)}%)`);
      root.style.setProperty('--color-secondary-700', `hsl(${secondaryHsl.h}, ${secondaryHsl.s}%, ${Math.max(secondaryHsl.l - 20, 5)}%)`);
    }
  }, []);

  return companyConfig;
};