import { Account } from '@entities';

export interface GetAccountGateway {
  logInfo(message: string, meta?: any): void;
  logError(message: string, meta?: any): void;
  findAccountByIdentifier(identifier: string): Promise<Account | null>;
}
