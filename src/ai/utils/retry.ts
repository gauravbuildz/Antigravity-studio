import { logger } from './logger';

/**
 * Antigravity Studio Automated Retry Utility
 * 
 * Executes an asynchronous task with automatic backoff retry policies
 * if API connection issues or validation checks fail.
 */
export async function executeWithRetry<T>(
  taskName: string,
  task: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.info(`[Retry] Executing "${taskName}" - Attempt #${attempt}...`);
      return await task();
    } catch (error: any) {
      lastError = error;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      logger.warn(
        `[Retry] Attempt #${attempt} for "${taskName}" failed with error: "${errorMessage}".`
      );

      if (attempt < maxRetries) {
        const backoffDelay = delayMs * attempt;
        logger.info(`[Retry] Waiting ${backoffDelay}ms before next retry...`);
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      }
    }
  }

  logger.error(`[Retry] All ${maxRetries} attempts for "${taskName}" failed.`);
  throw lastError;
}
