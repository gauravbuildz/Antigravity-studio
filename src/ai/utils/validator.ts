import {
  BusinessProfile,
  FeatureSpecification,
  ProjectPlan,
  DatabasePlan,
  APIPlan,
  GeneratedFrontend,
  GeneratedBackend,
  QualityReport
} from '../types';
import { logger } from './logger';

/**
 * Antigravity Studio Pipeline Validation Engine
 * 
 * Runs integrity checks after every execution stage to verify data format and content presence.
 */
export class OrchestratorValidator {
  validateRequirements(requirements?: BusinessProfile): boolean {
    if (!requirements) {
      logger.error('[Validator] Business Profile requirements are undefined.');
      return false;
    }
    if (!requirements.businessName || !requirements.businessType || !requirements.industry) {
      logger.error('[Validator] Requirements missing core identity tags.');
      return false;
    }
    logger.info('[Validator] Business Profile requirements passed structural validation.');
    return true;
  }

  validateFeatures(features?: FeatureSpecification): boolean {
    if (!features) {
      logger.error('[Validator] Features specification is undefined.');
      return false;
    }
    if (!Array.isArray(features.frontendFeatures) || !Array.isArray(features.backendFeatures)) {
      logger.error('[Validator] Features list formats are invalid.');
      return false;
    }
    logger.info('[Validator] Features specification passed structural validation.');
    return true;
  }

  validatePlan(plan?: ProjectPlan): boolean {
    if (!plan) {
      logger.error('[Validator] Project Plan is undefined.');
      return false;
    }
    if (!plan.projectName || !Array.isArray(plan.pages)) {
      logger.error('[Validator] Project Plan missing pages list or title.');
      return false;
    }
    logger.info('[Validator] Project Plan passed structural validation.');
    return true;
  }

  validateDatabase(database?: DatabasePlan): boolean {
    if (!database) {
      logger.error('[Validator] Database Plan is undefined.');
      return false;
    }
    if (!Array.isArray(database.tables) || database.tables.length === 0) {
      logger.error('[Validator] Database Plan contains no tables.');
      return false;
    }
    logger.info('[Validator] Database Plan passed structural validation.');
    return true;
  }

  validateAPI(api?: APIPlan): boolean {
    if (!api) {
      logger.error('[Validator] API Plan is undefined.');
      return false;
    }
    if (!Array.isArray(api.endpoints)) {
      logger.error('[Validator] API Plan endpoints schema is invalid.');
      return false;
    }
    logger.info('[Validator] API Plan passed structural validation.');
    return true;
  }

  validateFrontend(frontend?: GeneratedFrontend): boolean {
    if (!frontend) {
      logger.error('[Validator] Generated Frontend code is undefined.');
      return false;
    }
    if (!Array.isArray(frontend.files) || frontend.files.length === 0) {
      logger.error('[Validator] Generated Frontend contains no files.');
      return false;
    }
    logger.info('[Validator] Generated Frontend passed structural validation.');
    return true;
  }

  validateBackend(backend?: GeneratedBackend): boolean {
    if (!backend) {
      logger.error('[Validator] Generated Backend code is undefined.');
      return false;
    }
    if (!Array.isArray(backend.apiHandlers) || backend.apiHandlers.length === 0) {
      logger.error('[Validator] Generated Backend contains no routes files.');
      return false;
    }
    logger.info('[Validator] Generated Backend passed structural validation.');
    return true;
  }

  validateQuality(quality?: QualityReport): boolean {
    if (!quality) {
      logger.error('[Validator] Quality Report is undefined.');
      return false;
    }
    if (typeof quality.metrics.score !== 'number') {
      logger.error('[Validator] Quality metrics score format is invalid.');
      return false;
    }
    logger.info('[Validator] Quality Report passed validation.');
    return true;
  }
}

export const validator = new OrchestratorValidator();
