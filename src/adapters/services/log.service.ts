import { GConstructor, ILogger, LogData } from '../dtos';

export function MixLogService<TBase extends GConstructor>(Base: TBase) {
  return class MixLogService extends Base {
    readonly _logger: ILogger;

    constructor(...args: any[]) {
      super(...args);
      this._logger = args[0].logger;
    }

    public logError(message: string, data?: LogData): void {
      this._logger.error(message, data);
    }

    public logInfo(message: string, data?: LogData): void {
      this._logger.info(message, data);
    }

    public logDebug(message: string, data?: LogData): void {
      this._logger.debug(message, data);
    }

    public logCritical(message: string, data?: LogData): void {
      this._logger.critical(message, data);
    }
  };
}
