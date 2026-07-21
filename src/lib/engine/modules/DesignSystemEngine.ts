import { BusinessRequirements, DesignTokens } from '../types';
import * as prompts from '../prompts';
import { aiEngine } from '@/ai/core/engine';

/**
 * IDENTITY: Antigravity Studio Design System Engine v1.0
 * 
 * GOAL: Compile global design tokens, spacing parameters, typography styles,
 * rounded corners, shadow values, and responsive layout constraints matching the project theme context.
 * 
 * RESPONSIBILITIES:
 * - Generate HSL/Hex values for primary, background, surface, text, and accent colors.
 * - Map fonts (headers and body) using standard system stacks or Google Fonts configurations.
 * - Establish layout grids, columns count, gutter gaps, and animation speeds.
 * 
 * RULES:
 * - Do not compile any React code, styles.css files, or layout code.
 * - Return JSON matching DesignTokens interface.
 */
export class DesignSystemEngine {
  /**
   * INPUT: BusinessRequirements details.
   * OUTPUT: Compiled DesignTokens object.
   */
  async generateTokens(requirements: BusinessRequirements): Promise<DesignTokens> {
    console.log('[DesignSystemEngine] Generating spacing matrices and theme colors tokens...');

    const fallback: DesignTokens = {
      colors: {
        primary: requirements.colorPalette.primary,
        secondary: requirements.colorPalette.secondary,
        background: requirements.colorPalette.background,
        surface: '#0C0C0E',
        text: requirements.colorPalette.text,
        textMuted: '#94a3b8',
        border: 'rgba(255, 255, 255, 0.05)',
        accents: requirements.colorPalette.accents
      },
      typography: {
        headingFont: requirements.typography.headingFont,
        bodyFont: requirements.typography.bodyFont,
        sizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem'
        }
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
      },
      radius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '9999px'
      },
      shadows: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 6px -1px rgba(0,0,0,0.1)',
        lg: '0 10px 15px -3px rgba(0,0,0,0.1)'
      },
      grid: {
        columns: 12,
        gap: '24px'
      },
      animations: {
        fadeIn: 'transition-opacity duration-300 ease-out',
        slideUp: 'transform translate-y-2 transition-all duration-500 ease-out',
        transitionSpeed: '150ms'
      },
      responsive: {
        breakpoints: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px'
        }
      }
    };

    try {
      const result = await aiEngine.callModel<DesignTokens>(
        prompts.DESIGN_SYSTEM_PROMPT,
        `Requirements: ${JSON.stringify(requirements)}`,
        fallback
      );
      return result;
    } catch (err) {
      console.error('[DesignSystemEngine] Failed during AI call, using fallback', err);
      return fallback;
    }
  }
}
