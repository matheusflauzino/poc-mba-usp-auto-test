import { LogData, MessagesBody } from '@adapters';

export interface LoanSimulationGateway {
  /* Log */
  logInfo(message: string, data?: LogData): void;
  logError(message: string, data?: LogData): void;
  logCritical(message: string, data?: LogData): void;

  sendBatchMessagesToOwnQueue(message: MessagesBody[], delaySeconds?: number): Promise<void>
}
