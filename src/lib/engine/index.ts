import { OrchestratorState } from './types';
import {
  RequirementAnalysisEngine,
  FeatureDetectionEngine,
  WebsitePlannerEngine,
  DesignSystemEngine,
  ComponentPlanningEngine,
  PromptBuilderEngine,
  AIFrontendGeneratorEngine,
  BackendGeneratorEngine,
  DatabasePlanningEngine,
  SEOEngine,
  AccessibilityEngine,
  PerformanceEngine,
  SecurityEngine,
  QualityReviewEngine,
  AutoImprovementEngine
} from './modules';

export class AntigravityOrchestrator {
  private requirementAnalyzer = new RequirementAnalysisEngine();
  private featureDetector = new FeatureDetectionEngine();
  private websitePlanner = new WebsitePlannerEngine();
  private designSystem = new DesignSystemEngine();
  private componentPlanner = new ComponentPlanningEngine();
  private promptBuilder = new PromptBuilderEngine();
  private frontendGenerator = new AIFrontendGeneratorEngine();
  private backendGenerator = new BackendGeneratorEngine();
  private databasePlanner = new DatabasePlanningEngine();
  private seoEngine = new SEOEngine();
  private accessibilityEngine = new AccessibilityEngine();
  private performanceEngine = new PerformanceEngine();
  private securityEngine = new SecurityEngine();
  private qualityReviewer = new QualityReviewEngine();
  private autoImprovement = new AutoImprovementEngine();

  async orchestrate(userPrompt: string): Promise<OrchestratorState> {
    // Initialize compilation pipeline state
    const state: OrchestratorState = {
      userPrompt,
      improvementHistory: [],
      qualityScore: 0
    };

    console.log('[Orchestrator] Starting Requirement Analysis Engine...');
    state.requirements = await this.requirementAnalyzer.analyze(userPrompt);

    console.log('[Orchestrator] Running Feature Detection Engine...');
    state.features = await this.featureDetector.detect(userPrompt);

    console.log('[Orchestrator] Planning Information Architecture & Navigation User Flow...');
    state.plan = await this.websitePlanner.plan(state.requirements, state.features);

    console.log('[Orchestrator] Designing Tokens System (Typography, Spacings, Accents)...');
    state.designTokens = await this.designSystem.generateTokens(state.requirements);

    console.log('[Orchestrator] Compiling Grid Component selections...');
    state.componentPlan = await this.componentPlanner.planComponents(state.plan!, state.designTokens!);

    console.log('[Orchestrator] Merging parameters into Prompt Builder Package...');
    state.prompts = this.promptBuilder.build(
      state.requirements,
      state.plan!,
      state.designTokens!,
      state.componentPlan!
    );

    console.log('[Orchestrator] Launching AI Frontend Generation Engine...');
    state.frontend = await this.frontendGenerator.generate(state.prompts!);

    console.log('[Orchestrator] Planning Database Relational Tables schema...');
    state.database = await this.databasePlanner.planDatabase(state.plan!);

    console.log('[Orchestrator] Building Backend Handler routes...');
    state.backend = await this.backendGenerator.generateBackend(state.prompts!, state.database!);

    console.log('[Orchestrator] Injecting Metadata Structured schemas...');
    state.seo = await this.seoEngine.generateSEO(state.plan!, state.requirements);

    console.log('[Orchestrator] Auditing WCAG standards & Keyboard navigation access points...');
    state.accessibility = await this.accessibilityEngine.audit(state.frontend!);

    console.log('[Orchestrator] Optimizing code splits and Caching directives...');
    state.performance = await this.performanceEngine.optimize(state.frontend!);

    console.log('[Orchestrator] Securing input handlers & Rate limiters...');
    state.security = await this.securityEngine.secure(state.backend!);

    // Iterative Quality Review & Auto Improvement loop
    let iteration = 1;
    const maxIterations = 5;
    const targetScore = 95;

    while (iteration <= maxIterations) {
      console.log(`[Orchestrator] Running Quality Audit Loop - Iteration #${iteration}...`);
      
      state.qualityReport = await this.qualityReviewer.review(
        state.frontend!,
        state.backend!,
        state.seo!,
        state.accessibility!,
        state.performance!,
        state.security!
      );

      const currentScore = state.qualityReport.metrics.overallScore;
      state.qualityScore = currentScore;

      console.log(`[Orchestrator] Quality Review Audit Completed. Current Score: ${currentScore}%`);

      state.improvementHistory.push({
        iteration,
        metrics: { ...state.qualityReport.metrics },
        fixesApplied: [...state.qualityReport.improvementsRecommended]
      });

      if (currentScore >= targetScore) {
        console.log(`[Orchestrator] Project achieved target quality criteria (${currentScore}% >= ${targetScore}%). Finalizing.`);
        break;
      }

      if (iteration === maxIterations) {
        console.log(`[Orchestrator] Reached maximum improvement iterations (${maxIterations}). Finishing loop.`);
        break;
      }

      console.log(`[Orchestrator] Project score ${currentScore}% is below ${targetScore}%. Launching Auto-Improvement Engine refactoring...`);
      
      const improvementResult = await this.autoImprovement.improve(
        state.frontend!,
        state.backend!,
        state.qualityReport!
      );

      state.frontend = improvementResult.frontend;
      state.backend = improvementResult.backend;

      // Mocking a quality score increase for subsequent loop iterations
      // In production, the review engine evaluates the updated file contents.
      const simulatedScoreBoost = 3 * iteration;
      state.qualityReport.metrics.overallScore = Math.min(100, currentScore + simulatedScoreBoost);

      iteration++;
    }

    return state;
  }
}
