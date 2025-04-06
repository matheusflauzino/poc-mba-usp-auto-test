import { createServer as createHTTPServer, Server } from 'node:http';
import { getConfig, getGlobalLogger } from '@infra';
import express from 'express';
import router from './router';

/* middlewares */
import { error } from './middlewares/error';
import { logger } from './middlewares/logger';
import { scope } from './middlewares/scope';
import { AwilixContainer } from 'awilix';

/**
 * Creates the application server
 */
export function createServer(container: AwilixContainer): Server {
  const app = express();

  const globalLogger = getGlobalLogger();

  /** json parser */
  app.use(express.json());

  /** urlencoded parser */
  app.use(express.urlencoded({ extended: true }));

  /** container scope mdw */
  app.use(scope(container));

  /** logger middleware */
  app.use(logger);

  /** application router */
  app.use(router);

  /** error handler */
  app.use(error);

  globalLogger.info('Server created');

  return createHTTPServer(app);
}

export async function startServer(server: Server) {
  const config = getConfig();

  const globalLogger = getGlobalLogger();

  server.listen(config.httpServer.port, () => {
    globalLogger.info(`Server listening on port ${config.httpServer.port}`);

    if (process.send) {
      process.send('ready');
    }
  });
}
