import { PipelineStage } from '../types';

export interface WorkflowStep {
  stage: PipelineStage;
  name: string;
  description: string;
}

/**
 * Antigravity Studio Pipeline Workflow Manager
 * 
 * Configures the sequential pipeline stage parameters, metadata mappings,
 * and steps mapping definitions.
 */
export class OrchestratorWorkflow {
  private steps: WorkflowStep[] = [
    {
      stage: 'requirements',
      name: 'Requirement Extraction Analysis',
      description: 'Translates natural language inputs into structured Business Profile descriptions.'
    },
    {
      stage: 'features',
      name: 'Feature Detection Matrix',
      description: 'Scans implicit and explicit user demands to detect functional layers.'
    },
    {
      stage: 'planning',
      name: 'Project Blueprint Planning',
      description: 'Drafts navigation links hierarchies, routing schemes, and user flow maps.'
    },
    {
      stage: 'design',
      name: 'Design Tokens Assembly',
      description: 'Compiles primary colors HSL, border-radius definitions, and typography scales.'
    },
    {
      stage: 'components',
      name: 'Grid Components Configuration',
      description: 'Maps visual cards and interactive sections to component blueprints.'
    },
    {
      stage: 'database',
      name: 'Relational Database Planning',
      description: 'Structures PostgreSQL tables constraints, relationships, and lookups indexing.'
    },
    {
      stage: 'api',
      name: 'RESTful API Planning',
      description: 'Maps server-side endpoints schema specs and validation patterns.'
    },
    {
      stage: 'frontend',
      name: 'Next.js Frontend Compilation',
      description: 'Generates CSS styles configurations, layouts wrappers, and pages TSX.'
    },
    {
      stage: 'backend',
      name: 'API Routing Backend Handlers',
      description: 'Writes route controller files, auth validators, and Zod checks.'
    },
    {
      stage: 'review',
      name: 'Quality Review Audit',
      description: 'Scores accessibility metrics, SEO metadata check, and vulnerabilities sanitization.'
    },
    {
      stage: 'autofix',
      name: 'Auto Fix Self Healing System',
      description: 'Performs refactoring sweeps to patch audit flaws and code warnings.'
    },
    {
      stage: 'deploy',
      name: 'Deployment Configurations Generator',
      description: 'Generates deployment settings (vercel.json, environment variables).'
    }
  ];

  getSteps(): WorkflowStep[] {
    return this.steps;
  }

  getStepByStage(stage: PipelineStage): WorkflowStep | undefined {
    return this.steps.find((s) => s.stage === stage);
  }

  getStepIndex(stage: PipelineStage): number {
    return this.steps.findIndex((s) => s.stage === stage);
  }
}

export const workflow = new OrchestratorWorkflow();
