export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  args?: any[];
}

/**
 * Antigravity Studio Structured Logger
 * 
 * Manages clean formatted system logs, tracking internal pipeline runs,
 * agent warnings, and compilation error traces.
 */
export class StructuredLogger {
  private logs: LogEntry[] = [];

  private log(level: LogLevel, message: string, ...args: any[]): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      args: args.length > 0 ? args : undefined
    };
    this.logs.push(entry);

    const logString = `[${entry.timestamp}] [${level}] ${message}`;
    if (level === 'ERROR') {
      console.error(logString, ...args);
    } else if (level === 'WARN') {
      console.warn(logString, ...args);
    } else {
      console.log(logString, ...args);
    }
  }

  debug(message: string, ...args: any[]): void {
    this.log('DEBUG', message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.log('INFO', message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.log('WARN', message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.log('ERROR', message, ...args);
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const logger = new StructuredLogger();
