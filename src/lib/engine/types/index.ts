export interface BusinessRequirements {
  businessType: string;
  industry: string;
  targetAudience: string;
  goals: string[];
  pages: { name: string; path: string; description: string }[];
  features: string[];
  preferredStyle: string;
  theme: 'light' | 'dark' | 'dimmed' | 'custom';
  colorPalette: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accents: string[];
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
}

export interface BusinessProfile {
  marketSegment: string;
  businessModel: string;
  primaryValueProposition: string;
  revenueStreams: string[];
  competitorsAnalysed: string[];
}

export interface DetectedFeatures {
  frontendFeatures: string[];
  backendFeatures: string[];
  databaseFeatures: string[];
  apiFeatures: string[];
  securityFeatures: string[];
  seoFeatures: string[];
  performanceFeatures: string[];
  extraFeatures: string[];
}

export interface ProjectBlueprint {
  projectName: string;
  description: string;
  folderStructure: string[];
  modulesMap: Record<string, string>;
}

export interface SoftwareArchitecture {
  architecturePattern: 'monolith' | 'serverless' | 'microservices' | 'hybrid';
  layers: string[];
  middlewareConfig: string[];
  scalingDirectives: string[];
}

export interface UIUXDesignBlueprint {
  visualLayoutPattern: string;
  wireframesPlanned: string[];
  userJourneyMappers: string[];
}

export interface SectionPlan {
  id: string;
  name: string;
  type: string;
  components: string[];
  contentRequirements: string[];
}

export interface PagePlan {
  name: string;
  path: string;
  sections: SectionPlan[];
  metaDescription: string;
}

export interface WebsitePlan {
  blueprintId: string;
  pages: PagePlan[];
  informationArchitecture: {
    hierarchy: string[];
    internalLinks: { source: string; target: string }[];
  };
  userFlow: string[];
  navigationLayout: {
    headerLinks: { label: string; href: string }[];
    footerLinks: { label: string; href: string }[];
  };
}

export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    accents: string[];
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    sizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  grid: {
    columns: number;
    gap: string;
  };
  animations: {
    fadeIn: string;
    slideUp: string;
    transitionSpeed: string;
  };
  responsive: {
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
}

export interface ComponentSelection {
  id: string;
  name: string;
  category: 'landing' | 'dashboard' | 'ecommerce' | 'saas' | 'common';
  props: Record<string, any>;
  customStyleOverrides: string[];
}

export interface ComponentPlan {
  components: ComponentSelection[];
  layoutGrid: string;
}

export interface DatabasePlan {
  tables: {
    name: string;
    columns: { name: string; type: string; constraints: string[] }[];
    indexes: string[];
  }[];
  securityRules: string[];
}

export interface APIBlueprint {
  endpoints: { route: string; method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; desc: string }[];
  responseFormats: Record<string, string>;
}

export interface AuthPlan {
  provider: 'Auth.js' | 'Clerk' | 'MockSandbox';
  protectedRoutes: string[];
  middlewareLogic: string;
}

export interface StatePlan {
  stores: { name: string; actions: string[]; initialValues: Record<string, any> }[];
  contextProviders: string[];
}

export interface PromptPackage {
  systemPrompt: string;
  userPrompt: string;
  validationRules: string[];
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: 'typescript' | 'tsx' | 'css' | 'json' | 'markdown';
}

export interface GeneratedFrontend {
  files: GeneratedFile[];
  mainLayoutCode: string;
  globalStyles: string;
}

export interface GeneratedBackend {
  apiRoutes: GeneratedFile[];
  dbSchema: string;
  migrationsScript: string;
  validationSchemas: Record<string, string>;
}

export interface TestingSuite {
  testFiles: GeneratedFile[];
  coverageTarget: number;
  testRunnerCommand: string;
}

export interface QualityMetrics {
  overallScore: number;
  uiUXScore: number;
  accessibilityScore: number;
  seoScore: number;
  performanceScore: number;
  securityScore: number;
  codeQualityScore: number;
}

export interface QualityReport {
  metrics: QualityMetrics;
  weaknesses: string[];
  improvementsRecommended: string[];
  passedChecks: string[];
}

export interface AutoImprovementHistory {
  iteration: number;
  metrics: QualityMetrics;
  fixesApplied: string[];
}

export interface DeploymentConfig {
  platform: 'Vercel' | 'Netlify' | 'Docker';
  envVariablesRequired: string[];
  buildScript: string;
  vercelJsonContent: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  openGraph: Record<string, string>;
  twitterCard: Record<string, string>;
  structuredDataJsonLd: string;
  sitemapXml: string;
  robotsTxt: string;
}

export interface AccessibilityRules {
  wcagLevel: 'A' | 'AA' | 'AAA';
  ariaLabels: Record<string, string>;
  keyboardNavRules: string[];
  colorContrastCheck: boolean;
}

export interface PerformanceConfig {
  lazyLoadedImages: string[];
  codeSplits: string[];
  cachingDirectives: Record<string, string>;
}

export interface SecurityRulesConfig {
  inputValidationRegex: Record<string, string>;
  rateLimits: { windowMs: number; maxRequests: number };
  xssSanitizationPaths: string[];
  csrfEnabled: boolean;
}

export interface OrchestratorState {
  userPrompt: string;
  requirements?: BusinessRequirements;
  businessProfile?: BusinessProfile;
  features?: DetectedFeatures;
  projectBlueprint?: ProjectBlueprint;
  architecture?: SoftwareArchitecture;
  uiuxBlueprint?: UIUXDesignBlueprint;
  designTokens?: DesignTokens;
  componentPlan?: ComponentPlan;
  database?: DatabasePlan;
  apiBlueprint?: APIBlueprint;
  authPlan?: AuthPlan;
  statePlan?: StatePlan;
  prompts?: PromptPackage;
  frontend?: GeneratedFrontend;
  backend?: GeneratedBackend;
  testingSuite?: TestingSuite;
  qualityReport?: QualityReport;
  improvementHistory: AutoImprovementHistory[];
  qualityScore: number;
  deployment?: DeploymentConfig;
  seo?: SEOMetadata;
  accessibility?: AccessibilityRules;
  performance?: PerformanceConfig;
  security?: SecurityRulesConfig;
  plan?: WebsitePlan;
}
