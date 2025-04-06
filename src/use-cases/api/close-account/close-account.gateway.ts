export interface CloseAccountGateway {
  logInfo(message: string, meta?: any): void;
  logError(message: string, meta?: any): void;
  findAccountByIdentifier(identifier: string): Promise<any>;
  deleteAccount(identifier: string): Promise<void>;
}
