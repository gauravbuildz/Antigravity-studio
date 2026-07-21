import { PipelineStage } from '../types';

export interface StageExecutionRecord {
  stage: PipelineStage;
  timestamp: number;
  success: boolean;
  durationMs: number;
  error?: string;
}

export type OrchestrationStatus = 'idle' | 'running' | 'completed' | 'failed';

/**
 * Antigravity Studio Pipeline State Tracker
 * 
 * Manages the orchestrator workflow state machine, tracing execution progress,
 * duration logs, success flags, and transitions through all 12 pipeline stages.
 */
export class OrchestratorStateMachine {
  private currentStage: PipelineStage | null = null;
  private status: OrchestrationStatus = 'idle';
  private history: StageExecutionRecord[] = [];
  private startTime: number = 0;

  startOrchestration(): void {
    this.status = 'running';
    this.startTime = Date.now();
    this.history = [];
    console.log('[StateMachine] Pipeline orchestration started.');
  }

  transitionTo(stage: PipelineStage): void {
    if (this.status !== 'running') {
      throw new Error(`Cannot transition to stage ${stage} when status is ${this.status}`);
    }
    this.currentStage = stage;
    console.log(`[StateMachine] Transitioning to stage: ${stage}`);
  }

  completeStage(stage: PipelineStage, success: boolean, durationMs: number, error?: string): void {
    this.history.push({
      stage,
      timestamp: Date.now(),
      success,
      durationMs,
      error
    });
    console.log(`[StateMachine] Stage ${stage} completed. Success: ${success} (${durationMs}ms)`);
  }

  completeOrchestration(success: boolean): void {
    this.status = success ? 'completed' : 'failed';
    this.currentStage = null;
    const totalDuration = Date.now() - this.startTime;
    console.log(`[StateMachine] Pipeline orchestration finished. Status: ${this.status}. Total Duration: ${totalDuration}ms`);
  }

  getCurrentStage(): PipelineStage | null {
    return this.currentStage;
  }

  getStatus(): OrchestrationStatus {
    return this.status;
  }

  getHistory(): StageExecutionRecord[] {
    return this.history;
  }
}
