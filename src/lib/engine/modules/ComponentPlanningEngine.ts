import { WebsitePlan, DesignTokens, ComponentPlan } from '../types';
import * as prompts from '../prompts';
import { aiEngine } from '@/ai/core/engine';

/**
 * IDENTITY: Antigravity Studio Component Planning Engine v1.0
 * 
 * GOAL: Select and plan reusable visual components matching the architectural
 * planning and design tokens system.
 * 
 * RESPONSIBILITIES:
 * - Match website blueprint sections to corresponding component categories (Landing, SaaS, Dashboard, Ecommerce).
 * - Plan layout grid configuration and components props structures.
 * - Establish custom styling overrides matching token styles.
 * 
 * RULES:
 * - Never output any React code, styles.css files, or layout code.
 * - Return JSON matching ComponentPlan.
 */
export class ComponentPlanningEngine {
  /**
   * INPUT: WebsitePlan and DesignTokens.
   * OUTPUT: Compiled ComponentPlan.
   */
  async planComponents(plan: WebsitePlan, tokens: DesignTokens): Promise<ComponentPlan> {
    console.log('[ComponentPlanningEngine] Extracting components configurations for blueprint layouts...');

    const fallback: ComponentPlan = {
      components: [
        {
          id: 'comp-navbar',
          name: 'GlassmorphicHeader',
          category: 'common',
          props: { links: plan.navigationLayout.headerLinks, logoText: 'AetherMetrics' },
          customStyleOverrides: ['backdrop-blur-md', 'border-white/5']
        },
        {
          id: 'comp-hero',
          name: 'SplitHeroBanner',
          category: 'landing',
          props: { heading: 'Premium SaaS Analytics', description: 'Understand your growth rates.' },
          customStyleOverrides: ['py-20', 'bg-slate-950']
        },
        {
          id: 'comp-pricing',
          name: 'TierPricingCards',
          category: 'saas',
          props: { tiers: ['Basic', 'Growth', 'Enterprise'] },
          customStyleOverrides: ['p-6', 'rounded-xl']
        }
      ],
      layoutGrid: 'max-w-7xl mx-auto px-6'
    };

    try {
      const result = await aiEngine.callModel<ComponentPlan>(
        prompts.COMPONENT_PLANNING_PROMPT,
        `Plan: ${JSON.stringify(plan)}. Tokens: ${JSON.stringify(tokens)}`,
        fallback
      );
      return result;
    } catch (err) {
      console.error('[ComponentPlanningEngine] Failed during AI call, using fallback', err);
      return fallback;
    }
  }
}
