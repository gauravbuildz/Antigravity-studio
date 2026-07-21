export interface BusinessProfile {
  businessName: string;
  businessType: string;
  industry: string;
  goals: string[];
  audience: string;
}

export interface FeatureSpecification {
  frontendFeatures: string[];
  backendFeatures: string[];
  databaseFeatures: string[];
  apiFeatures: string[];
  securityFeatures: string[];
}

export interface PageLayout {
  name: string;
  route: string;
  sections: string[];
}

export interface ProjectPlan {
  projectName: string;
  pages: PageLayout[];
  routes: string[];
}

export interface DesignTokens {
  colors: { primary: string; secondary: string; background: string; text: string };
  fonts: { heading: string; body: string };
}

export interface ComponentSpecification {
  reusableComponents: string[];
  layoutPattern: string;
}

export interface ColumnDefinition {
  name: string;
  type: string;
  constraints: string[];
}

export interface TableDefinition {
  name: string;
  columns: ColumnDefinition[];
  indexes: string[];
}

export interface DatabasePlan {
  tables: TableDefinition[];
  postgresPrismaSchema: string;
}

export interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params: string[];
  responseFormat: string;
}

export interface APIPlan {
  endpoints: APIEndpoint[];
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: 'typescript' | 'tsx' | 'css' | 'json';
}

export interface GeneratedFrontend {
  files: GeneratedFile[];
  mainLayoutCode: string;
}

export interface GeneratedBackend {
  apiHandlers: GeneratedFile[];
  middlewareCode: string;
}

export interface QualityMetrics {
  score: number;
  uiux: number;
  security: number;
  performance: number;
  accessibility: number;
  seo: number;
}

export interface QualityReport {
  metrics: QualityMetrics;
  passed: boolean;
  errors: string[];
  fixesRecommended: string[];
}

export interface DeploymentConfig {
  platform: 'Vercel' | 'Netlify';
  envVariables: string[];
  buildScript: string;
}

export interface OrchestrationContext {
  userPrompt: string;
  business?: BusinessProfile;
  features?: FeatureSpecification;
  plan?: ProjectPlan;
  design?: DesignTokens;
  components?: ComponentSpecification;
  database?: DatabasePlan;
  api?: APIPlan;
  frontend?: GeneratedFrontend;
  backend?: GeneratedBackend;
  quality?: QualityReport;
  deployment?: DeploymentConfig;
  errors: string[];
}

export type PipelineStage =
  | 'requirements'
  | 'features'
  | 'planning'
  | 'design'
  | 'components'
  | 'database'
  | 'api'
  | 'frontend'
  | 'backend'
  | 'review'
  | 'autofix'
  | 'deploy';

export interface PipelineStepResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
