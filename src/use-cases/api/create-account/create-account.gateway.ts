import { LogData } from '@adapters';
import { Account } from '@entities';

export interface CreateAccountGateway {
  /* Log */
  logInfo(message: string, data?: LogData): void;
  logError(message: string, data?: LogData): void;

  /* Repository */
  saveAccount(account: Account): Promise<void>;
}
