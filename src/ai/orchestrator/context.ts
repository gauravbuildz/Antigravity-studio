import {
  OrchestrationContext,
  BusinessProfile,
  FeatureSpecification,
  ProjectPlan,
  DesignTokens,
  ComponentSpecification,
  DatabasePlan,
  APIPlan,
  GeneratedFrontend,
  GeneratedBackend,
  QualityReport,
  DeploymentConfig
} from '../types';

/**
 * Antigravity Studio Context Manager
 * 
 * Maintains shared global context across the entire 12-stage AI software generation pipeline.
 * Modules can read from this context, but only the Master Orchestrator can perform updates.
 */
export class OrchestratorContextManager {
  private context: OrchestrationContext;

  constructor(userPrompt: string) {
    this.context = {
      userPrompt,
      errors: []
    };
  }

  /**
   * Get current readonly snapshot of global orchestration context.
   */
  getContext(): Readonly<OrchestrationContext> {
    return this.context;
  }

  updateBusiness(business: BusinessProfile): void {
    this.context.business = business;
  }

  updateFeatures(features: FeatureSpecification): void {
    this.context.features = features;
  }

  updatePlan(plan: ProjectPlan): void {
    this.context.plan = plan;
  }

  updateDesign(design: DesignTokens): void {
    this.context.design = design;
  }

  updateComponents(components: ComponentSpecification): void {
    this.context.components = components;
  }

  updateDatabase(database: DatabasePlan): void {
    this.context.database = database;
  }

  updateAPI(api: APIPlan): void {
    this.context.api = api;
  }

  updateFrontend(frontend: GeneratedFrontend): void {
    this.context.frontend = frontend;
  }

  updateBackend(backend: GeneratedBackend): void {
    this.context.backend = backend;
  }

  updateQuality(quality: QualityReport): void {
    this.context.quality = quality;
  }

  updateDeployment(deployment: DeploymentConfig): void {
    this.context.deployment = deployment;
  }

  addError(error: string): void {
    this.context.errors.push(error);
  }

  clearErrors(): void {
    this.context.errors = [];
  }
}
