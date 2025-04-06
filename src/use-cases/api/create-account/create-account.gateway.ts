export interface CreateAccountGateway {
  logInfo(message: string, meta: any): void;
  logError(message: string, meta: any): void;
}
