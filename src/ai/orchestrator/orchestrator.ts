import { OrchestrationContext } from '../types';
import { OrchestratorContextManager } from './context';
import { OrchestratorStateMachine } from './state';
import { PipelineExecutor } from './pipeline';
import { validator } from '../utils/validator';
import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

/**
 * Antigravity Studio Master Orchestration Engine
 * 
 * Coordinating requirements, planning, design system variables, UI components,
 * databases PostgreSQL structures, route handlers, testing suites, self-healing quality checks,
 * and deployment routines.
 */
export class AntigravityOrchestrator {
  private pipeline = new PipelineExecutor();
  private stateMachine = new OrchestratorStateMachine();

  async run(userPrompt: string): Promise<OrchestrationContext> {
    logger.info('[Orchestrator] Launching Antigravity Studio X pipeline execution loop...');
    const ctxManager = new OrchestratorContextManager(userPrompt);
    this.stateMachine.startOrchestration();

    try {
      // Stage 1: Requirements
      this.stateMachine.transitionTo('requirements');
      const reqStart = Date.now();
      const reqRes = await this.pipeline.executeRequirements(userPrompt);
      
      if (!reqRes.success || !validator.validateRequirements(reqRes.data)) {
        throw new Error('Requirement validation check failed.');
      }
      ctxManager.updateBusiness(reqRes.data!);
      this.stateMachine.completeStage('requirements', true, Date.now() - reqStart);

      // Stage 2: Features
      this.stateMachine.transitionTo('features');
      const featStart = Date.now();
      const featRes = await this.pipeline.executeFeatures(userPrompt);

      if (!featRes.success || !validator.validateFeatures(featRes.data)) {
        throw new Error('Feature detection validation check failed.');
      }
      ctxManager.updateFeatures(featRes.data!);
      this.stateMachine.completeStage('features', true, Date.now() - featStart);

      // Stage 3: Planning
      this.stateMachine.transitionTo('planning');
      const planStart = Date.now();
      const planRes = await this.pipeline.executePlanning(ctxManager.getContext().business!, ctxManager.getContext().features!);

      if (!planRes.success || !validator.validatePlan(planRes.data)) {
        throw new Error('Project planning blueprint validation check failed.');
      }
      ctxManager.updatePlan(planRes.data!);
      this.stateMachine.completeStage('planning', true, Date.now() - planStart);

      // Stage 4: Design Tokens
      this.stateMachine.transitionTo('design');
      const designStart = Date.now();
      const designRes = await this.pipeline.executeDesign(ctxManager.getContext().plan!);

      if (!designRes.success) {
        throw new Error('Design tokens generation validation check failed.');
      }
      ctxManager.updateDesign(designRes.data!);
      this.stateMachine.completeStage('design', true, Date.now() - designStart);

      // Stage 5: UI Components Planner
      this.stateMachine.transitionTo('components');
      const compStart = Date.now();
      const compRes = await this.pipeline.executeComponents(ctxManager.getContext().plan!, ctxManager.getContext().design!);

      if (!compRes.success) {
        throw new Error('UI component selection validation check failed.');
      }
      ctxManager.updateComponents(compRes.data!);
      this.stateMachine.completeStage('components', true, Date.now() - compStart);

      // Stage 6: Database Planning
      this.stateMachine.transitionTo('database');
      const dbStart = Date.now();
      const dbRes = await this.pipeline.executeDatabase(ctxManager.getContext().features!);

      if (!dbRes.success || !validator.validateDatabase(dbRes.data)) {
        throw new Error('Database planning validation check failed.');
      }
      ctxManager.updateDatabase(dbRes.data!);
      this.stateMachine.completeStage('database', true, Date.now() - dbStart);

      // Stage 7: API Routing Planning
      this.stateMachine.transitionTo('api');
      const apiStart = Date.now();
      const apiRes = await this.pipeline.executeAPI(ctxManager.getContext().features!, ctxManager.getContext().database!);

      if (!apiRes.success || !validator.validateAPI(apiRes.data)) {
        throw new Error('API routing endpoints blueprint validation check failed.');
      }
      ctxManager.updateAPI(apiRes.data!);
      this.stateMachine.completeStage('api', true, Date.now() - apiStart);

      // Stage 8: Frontend TSX Generation
      this.stateMachine.transitionTo('frontend');
      const frontStart = Date.now();
      const frontRes = await this.pipeline.executeFrontend(
        ctxManager.getContext().plan!,
        ctxManager.getContext().design!,
        ctxManager.getContext().components!
      );

      if (!frontRes.success || !validator.validateFrontend(frontRes.data)) {
        throw new Error('Frontend React files compilation validation check failed.');
      }
      ctxManager.updateFrontend(frontRes.data!);
      this.stateMachine.completeStage('frontend', true, Date.now() - frontStart);

      // Stage 9: Backend handler Generation
      this.stateMachine.transitionTo('backend');
      const backStart = Date.now();
      const backRes = await this.pipeline.executeBackend(ctxManager.getContext().api!, ctxManager.getContext().database!);

      if (!backRes.success || !validator.validateBackend(backRes.data)) {
        throw new Error('Backend route controller compilation validation check failed.');
      }
      ctxManager.updateBackend(backRes.data!);
      this.stateMachine.completeStage('backend', true, Date.now() - backStart);

      // Stage 10: Quality Review & Auto Fix Self Healing Loops
      this.stateMachine.transitionTo('review');
      const reviewStart = Date.now();
      let reviewRes = await this.pipeline.executeReview(ctxManager.getContext().frontend!, ctxManager.getContext().backend!);

      if (!reviewRes.success || !validator.validateQuality(reviewRes.data)) {
        throw new Error('Quality review audit report validation check failed.');
      }
      ctxManager.updateQuality(reviewRes.data!);
      this.stateMachine.completeStage('review', true, Date.now() - reviewStart);

      let autofixIteration = 1;
      const maxFixes = 3;
      const passingScore = 95;

      while (ctxManager.getContext().quality!.metrics.score < passingScore && autofixIteration <= maxFixes) {
        logger.warn(
          `[Orchestrator] Current Quality Score (${ctxManager.getContext().quality!.metrics.score}%) below target metrics. Initiating healing sweep loop #${autofixIteration}...`
        );
        this.stateMachine.transitionTo('autofix');
        const fixStart = Date.now();
        const fixRes = await this.pipeline.executeAutoFix(
          ctxManager.getContext().frontend!,
          ctxManager.getContext().backend!,
          ctxManager.getContext().quality!
        );

        if (fixRes.success) {
          ctxManager.updateFrontend(fixRes.data!.frontend);
          ctxManager.updateBackend(fixRes.data!.backend);
          this.stateMachine.completeStage('autofix', true, Date.now() - fixStart);

          // Rerun Quality evaluation
          this.stateMachine.transitionTo('review');
          const auditStart = Date.now();
          reviewRes = await this.pipeline.executeReview(ctxManager.getContext().frontend!, ctxManager.getContext().backend!);
          if (reviewRes.success) {
            ctxManager.updateQuality(reviewRes.data!);
            this.stateMachine.completeStage('review', true, Date.now() - auditStart);
          }
        }
        autofixIteration++;
      }

      // Stage 11: Deployment Settings
      this.stateMachine.transitionTo('deploy');
      const deployStart = Date.now();
      const deployRes = await this.pipeline.executeDeployment(ctxManager.getContext().plan!);

      if (!deployRes.success) {
        throw new Error('Deployment settings generation validation check failed.');
      }
      ctxManager.updateDeployment(deployRes.data!);
      this.stateMachine.completeStage('deploy', true, Date.now() - deployStart);

      // Persist generated files to the filesystem safely
      try {
        const ctx = ctxManager.getContext();
        const sandboxDir = path.join(process.cwd(), 'public', 'deploys', 'generated-project');
        fs.mkdirSync(sandboxDir, { recursive: true });

        if (ctx.frontend?.files) {
          for (const file of ctx.frontend.files) {
            const sanitizedPath = file.path.replace(/^src\//, '').replace(/^app\//, '');
            const targetPath = path.join(sandboxDir, sanitizedPath);
            fs.mkdirSync(path.dirname(targetPath), { recursive: true });
            fs.writeFileSync(targetPath, file.content, 'utf-8');
            logger.info(`[Orchestrator] Saved frontend file in sandbox: ${sanitizedPath}`);
          }
        }

        if (ctx.backend?.apiHandlers) {
          for (const handler of ctx.backend.apiHandlers) {
            const sanitizedPath = handler.path.replace(/^src\//, '').replace(/^app\//, '');
            const targetPath = path.join(sandboxDir, sanitizedPath);
            fs.mkdirSync(path.dirname(targetPath), { recursive: true });
            fs.writeFileSync(targetPath, handler.content, 'utf-8');
            logger.info(`[Orchestrator] Saved backend handler file in sandbox: ${sanitizedPath}`);
          }
        }

        if (ctx.database?.postgresPrismaSchema) {
          const targetPath = path.join(sandboxDir, 'prisma', 'schema.prisma');
          fs.mkdirSync(path.dirname(targetPath), { recursive: true });
          fs.writeFileSync(targetPath, ctx.database.postgresPrismaSchema, 'utf-8');
          logger.info(`[Orchestrator] Saved PostgreSQL Prisma Schema file: ${targetPath}`);
        }
      } catch (writeErr: any) {
        logger.error(`[Orchestrator] Failed to persist generated codebase files: ${writeErr.message}`);
      }

      this.stateMachine.completeOrchestration(true);
    } catch (err: any) {
      const errMsg = err instanceof Error ? err.message : String(err);
      ctxManager.addError(errMsg);
      this.stateMachine.completeOrchestration(false);
      logger.error(`[Orchestrator] Orchestration transaction aborted due to error: ${errMsg}`);
    }

    return ctxManager.getContext();
  }
}
