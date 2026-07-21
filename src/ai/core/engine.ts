import { logger } from '../utils/logger';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Antigravity Studio AI Execution Engine
 * 
 * Interacts with model instances, processes raw responses,
 * and handles parsing fallback schemas to ensure structured output.
 */
export class AIEngine {
  /**
   * Sends prompts to the model and returns parsed JSON.
   */
  async callModel<T>(systemPrompt: string, userPrompt: string, fallbackData: T): Promise<T> {
    logger.info('[AIEngine] Sending transaction payloads to Gemini API...');
    logger.debug(`[AIEngine] System Prompt: ${systemPrompt.slice(0, 100)}...`);
    logger.debug(`[AIEngine] User Prompt: ${userPrompt.slice(0, 100)}...`);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.warn('[AIEngine] GEMINI_API_KEY is missing. Using local fallback configurations.');
      return fallbackData;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: systemPrompt,
      });

      const response = await model.generateContent(userPrompt);
      const text = response.response.text();
      
      if (!text) {
        throw new Error('Gemini API returned an empty response.');
      }

      // Clean up markdown block wrapping if present
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.substring(7);
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.substring(3);
      }
      if (cleanText.endsWith('```')) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
      }
      cleanText = cleanText.trim();

      logger.info('[AIEngine] Received response payload from Gemini model successfully.');
      return JSON.parse(cleanText) as T;
    } catch (error: any) {
      logger.error('[AIEngine] Failed during model call run.', error);
      return fallbackData;
    }
  }
}

export const aiEngine = new AIEngine();
