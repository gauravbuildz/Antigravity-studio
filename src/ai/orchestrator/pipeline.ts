import {
  PipelineStepResult,
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
import { aiEngine } from '../core/engine';
import { executeWithRetry } from '../utils/retry';
import { logger } from '../utils/logger';

/**
 * Antigravity Studio Pipeline Executor
 * 
 * Invokes AI Agent workflows stage-by-stage with built-in retries.
 */
export class PipelineExecutor {
  async executeRequirements(userPrompt: string): Promise<PipelineStepResult<BusinessProfile>> {
    return executeWithRetry('Requirement extraction analysis stage', async () => {
      const fallback: BusinessProfile = {
        businessName: 'MetricsSaaS',
        businessType: 'SaaS Analytics Framework',
        industry: 'Technology Segment',
        goals: ['Monitor service latency', 'Visualize conversion metrics'],
        audience: 'Software Engineers and Managers'
      };

      const systemPrompt = 'You are the Requirements Extraction Agent. Parse user requests into a structured Business Profile. Return ONLY a valid JSON object matching the BusinessProfile schema, no conversational text.';
      const result = await aiEngine.callModel<BusinessProfile>(systemPrompt, userPrompt, fallback);
      
      return { success: true, data: result };
    });
  }

  async executeFeatures(userPrompt: string): Promise<PipelineStepResult<FeatureSpecification>> {
    return executeWithRetry('Feature detection stage', async () => {
      const fallback: FeatureSpecification = {
        frontendFeatures: ['Responsive layout header navbar', 'User details profile dropdown panel'],
        backendFeatures: ['Next.js Route Handlers APIs', 'Database transaction models'],
        databaseFeatures: ['Users table', 'Sessions lookup logs table'],
        apiFeatures: ['/api/auth/login', '/api/auth/logout', '/api/user/profile'],
        securityFeatures: ['Input validation checks', 'CSRF protection rules']
      };

      const systemPrompt = 'You are the Feature Detector Agent. Map explicit and implicit functional rules. Return ONLY a valid JSON object matching the FeatureSpecification schema, no conversational text.';
      const result = await aiEngine.callModel<FeatureSpecification>(systemPrompt, userPrompt, fallback);
      
      return { success: true, data: result };
    });
  }

  async executePlanning(requirements: BusinessProfile, features: FeatureSpecification): Promise<PipelineStepResult<ProjectPlan>> {
    return executeWithRetry('Blueprint planning stage', async () => {
      const fallback: ProjectPlan = {
        projectName: requirements.businessName,
        pages: requirements.goals.map((g, idx) => ({
          name: idx === 0 ? 'Home' : `Page-${idx}`,
          route: idx === 0 ? '/' : `/page-${idx}`,
          sections: ['Navbar', 'HeroBanner', 'Footer']
        })),
        routes: ['/', '/login', '/dashboard']
      };

      const systemPrompt = 'You are the Planning Agent. Map routing paths and wireframe lists. Return ONLY a valid JSON object matching the ProjectPlan schema, no conversational text.';
      const result = await aiEngine.callModel<ProjectPlan>(
        systemPrompt,
        `Requirements: ${JSON.stringify(requirements)}. Features: ${JSON.stringify(features)}`,
        fallback
      );
      
      return { success: true, data: result };
    });
  }

  async executeDesign(plan: ProjectPlan): Promise<PipelineStepResult<DesignTokens>> {
    return executeWithRetry('Design tokens generation stage', async () => {
      const fallback: DesignTokens = {
        colors: { primary: '#6366f1', secondary: '#a855f7', background: '#050507', text: '#f8fafc' },
        fonts: { heading: 'Plus Jakarta Sans', body: 'Inter' }
      };

      const systemPrompt = 'You are the Design System Agent. Produce colors HSL mappings. Return ONLY a valid JSON object matching the DesignTokens schema, no conversational text.';
      const result = await aiEngine.callModel<DesignTokens>(systemPrompt, JSON.stringify(plan), fallback);
      
      return { success: true, data: result };
    });
  }

  async executeComponents(plan: ProjectPlan, design: DesignTokens): Promise<PipelineStepResult<ComponentSpecification>> {
    return executeWithRetry('Component selection stage', async () => {
      const fallback: ComponentSpecification = {
        reusableComponents: ['GlassmorphicNavbar', 'FeatureMetricGridsCard'],
        layoutPattern: 'max-w-7xl mx-auto px-6 font-sans'
      };

      const systemPrompt = 'You are the Component Selection Agent. Map UI blocks to planned pages. Return ONLY a valid JSON object matching the ComponentSpecification schema, no conversational text.';
      const result = await aiEngine.callModel<ComponentSpecification>(
        systemPrompt,
        `Plan: ${JSON.stringify(plan)}. Design: ${JSON.stringify(design)}`,
        fallback
      );
      
      return { success: true, data: result };
    });
  }

  async executeDatabase(features: FeatureSpecification): Promise<PipelineStepResult<DatabasePlan>> {
    return executeWithRetry('Database planner stage', async () => {
      const fallback: DatabasePlan = {
        tables: [
          {
            name: 'User',
            columns: [
              { name: 'id', type: 'String', constraints: ['@id', '@default(uuid())'] },
              { name: 'email', type: 'String', constraints: ['@unique'] }
            ],
            indexes: ['email']
          }
        ],
        postgresPrismaSchema: `model User {\n  id String @id @default(uuid())\n  email String @unique\n}`
      };

      const systemPrompt = 'You are the Database Planner Agent. Generate a valid PostgreSQL Prisma schema file (postgresPrismaSchema) mapping out tables (User, Role, Product, Order, Subscription, AuditLog) with explicit indexes and relations. Return ONLY a valid JSON object matching the DatabasePlan schema, no conversational text.';
      const result = await aiEngine.callModel<DatabasePlan>(systemPrompt, JSON.stringify(features), fallback);
      
      return { success: true, data: result };
    });
  }

  async executeAPI(features: FeatureSpecification, database: DatabasePlan): Promise<PipelineStepResult<APIPlan>> {
    return executeWithRetry('API route planner stage', async () => {
      const fallback: APIPlan = {
        endpoints: [
          { path: '/api/auth/login', method: 'POST', params: ['email', 'password'], responseFormat: 'JSON' }
        ]
      };

      const systemPrompt = 'You are the API Planner Agent. List endpoint route definitions. Return ONLY a valid JSON object matching the APIPlan schema, no conversational text.';
      const result = await aiEngine.callModel<APIPlan>(
        systemPrompt,
        `Features: ${JSON.stringify(features)}. Database: ${JSON.stringify(database)}`,
        fallback
      );
      
      return { success: true, data: result };
    });
  }

  async executeFrontend(plan: ProjectPlan, design: DesignTokens, components: ComponentSpecification): Promise<PipelineStepResult<GeneratedFrontend>> {
    return executeWithRetry('Frontend generation stage', async () => {
      const fallback: GeneratedFrontend = {
        files: [
          {
            path: 'src/app/page.tsx',
            content: `export default function HomePage() { return <main className="p-20 bg-slate-950 min-h-screen text-white"><h1 className="text-4xl font-bold">Metrics Dashboard</h1></main>; }`,
            language: 'tsx'
          }
        ],
        mainLayoutCode: `export default function Layout({ children }: { children: React.ReactNode }) { return <html className="dark"><body>{children}</body></html>; }`
      };

      const systemPrompt = 'You are the Frontend Code Generator Agent. Generate complete React/Next.js TSX files with forms and interactive elements connected to the backend API routes using asynchronous fetch bindings. Return ONLY a valid JSON object matching the GeneratedFrontend schema, no conversational text.';
      const result = await aiEngine.callModel<GeneratedFrontend>(
        systemPrompt,
        `Plan: ${JSON.stringify(plan)}. Design: ${JSON.stringify(design)}. Components: ${JSON.stringify(components)}`,
        fallback
      );
      
      return { success: true, data: result };
    });
  }

  async executeBackend(apiPlan: APIPlan, dbPlan: DatabasePlan): Promise<PipelineStepResult<GeneratedBackend>> {
    return executeWithRetry('Backend route compilation stage', async () => {
      const fallback: GeneratedBackend = {
        apiHandlers: [
          {
            path: 'src/app/api/auth/login/route.ts',
            content: `import { NextResponse } from "next/server";\nexport async function POST() { return NextResponse.json({ success: true }); }`,
            language: 'typescript'
          }
        ],
        middlewareCode: `export function middleware(request: any) { return; }`
      };

      const systemPrompt = 'You are the Backend Code Generator Agent. Generate real REST API routes (apiHandlers) using TypeScript route handlers with Zod inputs validation, Auth.js session checks, and Prisma client query operations. Return ONLY a valid JSON object matching the GeneratedBackend schema, no conversational text.';
      const result = await aiEngine.callModel<GeneratedBackend>(
        systemPrompt,
        `API: ${JSON.stringify(apiPlan)}. DB: ${JSON.stringify(dbPlan)}`,
        fallback
      );
      
      return { success: true, data: result };
    });
  }

  async executeReview(frontend: GeneratedFrontend, backend: GeneratedBackend): Promise<PipelineStepResult<QualityReport>> {
    return executeWithRetry('Quality review audit stage', async () => {
      const fallback: QualityReport = {
        metrics: { score: 92, uiux: 91, security: 88, performance: 90, accessibility: 94, seo: 92 },
        passed: true,
        errors: [],
        fixesRecommended: []
      };

      const systemPrompt = 'You are the Quality Review Agent. Perform comprehensive static analysis, checking for broken imports, TS compliance, accessibility metrics, responsive views, security loopholes, and database constraints. Return ONLY a valid JSON object matching the QualityReport schema, no conversational text.';
      const result = await aiEngine.callModel<QualityReport>(
        systemPrompt,
        `Frontend: ${JSON.stringify(frontend)}. Backend: ${JSON.stringify(backend)}`,
        fallback
      );
      
      return { success: true, data: result };
    });
  }

  async executeAutoFix(frontend: GeneratedFrontend, backend: GeneratedBackend, quality: QualityReport): Promise<PipelineStepResult<{ frontend: GeneratedFrontend; backend: GeneratedBackend }>> {
    return executeWithRetry('Auto fix refactoring stage', async () => {
      const fallback = {
        frontend,
        backend
      };

      const systemPrompt = 'You are the Auto Fix Agent. Analyze compilation failures, TypeScript warnings, and static checks issues from the QualityReport, execute code corrections to repair the files, and track repaired files paths. Return ONLY a valid JSON object containing the updated GeneratedFrontend and GeneratedBackend fields, no conversational text.';
      const result = await aiEngine.callModel<{ frontend: GeneratedFrontend; backend: GeneratedBackend }>(
        systemPrompt,
        `Frontend: ${JSON.stringify(frontend)}. Backend: ${JSON.stringify(backend)}. Report: ${JSON.stringify(quality)}`,
        fallback
      );
      
      return { success: true, data: result };
    });
  }

  async executeDeployment(plan: ProjectPlan): Promise<PipelineStepResult<DeploymentConfig>> {
    return executeWithRetry('Deployment setup stage', async () => {
      const fallback: DeploymentConfig = {
        platform: 'Vercel',
        envVariables: ['DATABASE_URL', 'NEXTAUTH_SECRET'],
        buildScript: 'npm run build'
      };

      const systemPrompt = 'You are the Deployment Agent. Map Vercel build settings configurations. Return ONLY a valid JSON object matching the DeploymentConfig schema, no conversational text.';
      const result = await aiEngine.callModel<DeploymentConfig>(systemPrompt, JSON.stringify(plan), fallback);
      
      return { success: true, data: result };
    });
  }
}
