import { DetectedFeatures } from '../types';
import * as prompts from '../prompts';
import { aiEngine } from '@/ai/core/engine';

/**
 * IDENTITY: Antigravity Studio Feature Detection Engine v1.0
 * 
 * GOAL: Analyze explicit and implicit requirements from user prompts and automatically
 * detect backend features, security components, and database requirements.
 * 
 * RESPONSIBILITIES:
 * - Detect features based on specified keywords (Auth, Dashboard, Ecommerce, SaaS, Blog, etc.).
 * - Automatically generate security features (XSS, Rate limiting, CSRF).
 * - Match functional elements to required database structures.
 * 
 * RULES:
 * - Never output any code, layout code, or UI elements.
 * - Always return a structured JSON matching DetectedFeatures interface.
 */
export class FeatureDetectionEngine {
  /**
   * INPUT: User prompt string.
   * OUTPUT: Conforming DetectedFeatures object.
   */
  async detect(userPrompt: string): Promise<DetectedFeatures> {
    console.log('[FeatureDetectionEngine] Scanning user instructions for functional features...');

    const promptLower = userPrompt.toLowerCase();
    const hasLogin = promptLower.includes('login') || promptLower.includes('auth') || promptLower.includes('signup');
    const hasDashboard = promptLower.includes('dashboard') || promptLower.includes('admin');
    const hasEcommerce = promptLower.includes('shop') || promptLower.includes('ecommerce') || promptLower.includes('cart');

    const frontendFeatures = ['Responsive layout', 'Navigation header', 'Footer links'];
    const backendFeatures = ['Next.js Route Handlers'];
    const databaseFeatures: string[] = [];
    const apiFeatures: string[] = [];
    const securityFeatures = ['XSS prevention', 'Input validation'];
    const seoFeatures = ['Title tags metadata', 'OpenGraph headers'];
    const performanceFeatures = ['Responsive image loading'];
    const extraFeatures: string[] = [];

    if (hasLogin) {
      frontendFeatures.push('Login form', 'Signup page', 'Forgot password layout');
      backendFeatures.push('Session cookies management', 'Password hashing');
      databaseFeatures.push('Users table');
      apiFeatures.push('/api/auth/login', '/api/auth/signup', '/api/auth/logout');
      securityFeatures.push('CSRF protection', 'Secure session cookies');
    }

    if (hasDashboard) {
      frontendFeatures.push('Sidebar component', 'Interactive charts panel');
      backendFeatures.push('Role Based Access rules');
      apiFeatures.push('/api/analytics', '/api/user/profile');
    }

    if (hasEcommerce) {
      frontendFeatures.push('Product grid list', 'Shopping cart items list');
      backendFeatures.push('Stripe checkout sessions');
      databaseFeatures.push('Products table', 'Orders table');
      apiFeatures.push('/api/checkout', '/api/products');
    }

    const fallback: DetectedFeatures = {
      frontendFeatures,
      backendFeatures,
      databaseFeatures,
      apiFeatures,
      securityFeatures,
      seoFeatures,
      performanceFeatures,
      extraFeatures
    };

    try {
      const result = await aiEngine.callModel<DetectedFeatures>(
        prompts.FEATURE_DETECTION_PROMPT,
        `User Prompt: ${userPrompt}`,
        fallback
      );
      return result;
    } catch (err) {
      console.error('[FeatureDetectionEngine] Failed during AI call, using fallback', err);
      return fallback;
    }
  }
}
