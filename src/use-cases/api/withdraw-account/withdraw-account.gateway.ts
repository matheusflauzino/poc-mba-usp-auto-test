import { Account } from '@entities';

export interface WithdrawAccountGateway {
  logInfo(message: string, meta?: any): void;
  logError(message: string, meta?: any): void;
  findAccountByIdentifier(identifier: string): Promise<Account | null>;
  updateAccount(account: Account): Promise<Account>;
}
