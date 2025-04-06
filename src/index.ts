import {
  initGlobalLogger,
  getGlobalLogger,
  createServer,
  startServer,
  initConfig,
  getConfig,
  startSqsPoller,
  loadContainer
} from '@infra';
import { Utils } from '@shared';
import { AwilixContainer } from 'awilix';
import { Server } from 'node:http';

(async () => {
  try {
    /** application config */
    await initConfig();
  } catch (error) {
    if (Array.isArray(error)) {
      (error as Array<Error>).forEach((err) => {
        console.error(err);
      });
    } else {
      console.error(error);
    }

    await shutdownBeforeLogger(1);
  }

  const config = getConfig();

  /** application global logger */
  initGlobalLogger();

  const logger = getGlobalLogger();

  logger.info('Application starting...');

  logger.info('Config initialized', {
    strConfig: JSON.stringify(Utils.getKeys(config))
  });

  let container;
  try {
    container = loadContainer(config);
    logger.info('Container loaded');

    if (!container) {
      throw new Error('Container not defined');
    }
  } catch (err) {
    logger.error('Cannot load container', { err });
    await shutdownBeforeServer(1);
  }

  /** applicaion server */
  const server = createServer(container as AwilixContainer);

  server.on('error', async (err) => {
    logger.error(`Server error ${err.message}`, { err });

    await shutdown(server, 1);
  });

  /** signal handling */
  process.on('SIGINT', async () => {
    await shutdown(server);
  });

  process.on('SIGTERM', async () => {
    await shutdown(server);
  });

  process.on('uncaughtException', async (err: Error, _origin: string) => {
    logger.error(`uncaughtException: ${err.message}`, { err });

    await shutdown(server);
  });

  await startSqsPoller(config, container as AwilixContainer);

  /** application start */
  await startServer(server);

  logger.info('Bootstrapped', { nodeVersion: process.version });
})();

async function shutdown(server: Server, exitCode = 0) {
  const logger = getGlobalLogger();

  logger.info('Terminating the application');

  logger.info('Terminating the server');
  server.close(async () => {
    logger.info('Server terminated');

    console.info('Application terminated');
    process.exit(exitCode);
  });
}

async function shutdownBeforeLogger(exitCode = 0) {
  console.info('Terminating the application');
  console.info('Application terminated');
  process.exit(exitCode);
}

async function shutdownBeforeServer(exitCode = 0) {
  const logger = getGlobalLogger();

  logger.info('Terminating the application');


  console.info('Application terminated');
  process.exit(exitCode);
}
