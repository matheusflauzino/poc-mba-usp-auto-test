import pino, { Logger, LoggerOptions } from 'pino';
import { Constants, Utils } from '@shared';
import { getConfig } from '@infra';
import { entitySerializers } from '@entities';

const env = process.env.NODE_ENV || Constants.Env.Development;
let globalLogger: Logger;

export const initGlobalLogger = () => {
  if (globalLogger) {
    return;
  }

  const config = getConfig();


  const options: LoggerOptions = {
    name: config.projectData.name,
    level: config.log.level,
    base: { env, version: config.projectData.version },
    serializers: entitySerializers,
  };

  const transport =
    env === Constants.Env.Development
      ? pino.transport({
        target: 'pino-pretty',
        options: { colorize: true },
      })
      : undefined;

  globalLogger = pino(options, transport);

  globalLogger.info('Logger initialized');
  globalLogger.setBindings({ uuid: Utils.generateUUID() });
};

export const getGlobalLogger = () => {
  if (!globalLogger) {
    throw new Error('Global logger not initialized');
  }

  return globalLogger;
};
