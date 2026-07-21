import { logger } from '../utils/logger';

export interface DecisionRecord {
  timestamp: string;
  stage: string;
  decision: string;
  justification: string;
}

/**
 * Antigravity Studio Pipeline Memory Manager
 * 
 * Stores previous architectural decisions, prompt iterations, and feedback loops
 * to prevent repetitive failures during iterative auto-fixing loops.
 */
export class OrchestratorMemory {
  private decisions: DecisionRecord[] = [];
  private feedback: string[] = [];

  recordDecision(stage: string, decision: string, justification: string): void {
    const record: DecisionRecord = {
      timestamp: new Date().toISOString(),
      stage,
      decision,
      justification
    };
    this.decisions.push(record);
    logger.info(`[Memory] Recorded decision for ${stage}: "${decision}"`);
  }

  addFeedback(feedbackString: string): void {
    this.feedback.push(feedbackString);
    logger.info(`[Memory] Added user feedback: "${feedbackString}"`);
  }

  getDecisions(): DecisionRecord[] {
    return this.decisions;
  }

  getFeedback(): string[] {
    return this.feedback;
  }

  clearMemory(): void {
    this.decisions = [];
    this.feedback = [];
    logger.info('[Memory] Internal records memory cleared.');
  }
}

export const memory = new OrchestratorMemory();
