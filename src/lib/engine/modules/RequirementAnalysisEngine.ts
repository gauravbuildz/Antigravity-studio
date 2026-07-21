import { BusinessRequirements } from '../types';
import * as prompts from '../prompts';
import { aiEngine } from '@/ai/core/engine';

/**
 * IDENTITY: Antigravity Studio Requirement Analysis Engine v1.0
 * 
 * GOAL: Transform user's natural language input into a structured requirements document
 * to configure layouts, pages, database models, and active SaaS features.
 * 
 * RESPONSIBILITIES:
 * - Detect business type, industry segment, and core objectives.
 * - Map required public, user-session, and admin-facing pages.
 * - Establish branding aesthetics, preferred styling palettes, and font configurations.
 * 
 * RULES:
 * - Never output any frontend UI code or component templates.
 * - Conforms strictly to the output JSON specifications.
 */
export class RequirementAnalysisEngine {
  /**
   * INPUT: Natural language prompt string from developer/user.
   * OUTPUT: Structured BusinessRequirements object.
   */
  async analyze(userPrompt: string): Promise<BusinessRequirements> {
    console.log('[RequirementAnalysisEngine] Initiating requirements extraction workflow...');
    
    const fallback: BusinessRequirements = {
      businessType: 'SaaS Analytics Platform',
      industry: 'Technology / Product Operations',
      targetAudience: 'Product teams, developers, and analytics leaders',
      goals: ['Track active user metrics', 'Visualize data logs', 'Manage multi-tenant api keys'],
      pages: [
        { name: 'Home', path: 'index.html', description: 'Landing page highlighting services, stats grids, and call to action' },
        { name: 'Pricing', path: 'pricing.html', description: 'Comparison grids for subscription plans' },
        { name: 'About', path: 'about.html', description: 'Overview of our vision, values, and engineering values' }
      ],
      features: ['Authentication', 'Real-time database queries', 'Custom analytics grids'],
      preferredStyle: 'Glassmorphic Dark Mode Theme',
      theme: 'dark',
      colorPalette: {
        primary: '#6366f1',
        secondary: '#a855f7',
        background: '#050507',
        text: '#f8fafc',
        accents: ['#10b981', '#f59e0b']
      },
      typography: {
        headingFont: 'Plus Jakarta Sans',
        bodyFont: 'Inter'
      }
    };

    try {
      const result = await aiEngine.callModel<BusinessRequirements>(
        prompts.REQUIREMENT_ANALYSIS_PROMPT,
        `User Prompt: ${userPrompt}`,
        fallback
      );
      return result;
    } catch (err) {
      console.error('[RequirementAnalysisEngine] Failed during AI call, using fallback', err);
      return fallback;
    }
  }
}
