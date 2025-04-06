import { createContainer, asClass, AwilixContainer, InjectionMode, Lifetime, asValue, asFunction } from 'awilix';
import path from 'path';
import { Config } from './config';
import { Constants } from '@shared';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { getGlobalLogger } from './tools';
import { SQS } from '@aws-sdk/client-sqs';
import { Logger } from 'pino';

function camalize(str: string) {
  return str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
}

let container: AwilixContainer;

export type AppContainer = {
  env: string;
  config: Config;
  path: typeof path;
  logger: Logger;
  dynamoDB: DynamoDB;
  sqs: SQS;
};

export function loadContainer(config: Config): AwilixContainer {
  if (container) {
    throw new Error('Container already loaded');
  }

  container = createContainer({
    injectionMode: InjectionMode.PROXY
  });

  const createLoggerInstance = () => getGlobalLogger();

  const env = process.env.NODE_ENV || Constants.Env.Development;

  container.register({
    env: asValue(env),
    config: asValue(config),
    dynamoDB: asFunction(() => new DynamoDB(config.aws?.dynamodb)),
    sqs: asFunction(() => new SQS(config.aws?.sqs)),
    logger: asFunction(createLoggerInstance).scoped()
  });

  const baseDir = path.resolve(`${__dirname} + '/..`);

  container.loadModules(
    [
      `${baseDir}/use-cases/**/*.interactor.*`,
      `${baseDir}/adapters/**/*.presenter.*`,
      `${baseDir}/adapters/**/*.controller.*`,
      `${baseDir}/adapters/**/*.gateway.*`,
      `${baseDir}/infra/plugins/**/*.*`,
      `${baseDir}/infra/db/mappers/**/*.*`
    ],
    {
      formatName: (name: string) => {
        const infraLabelsRegex =
          /sqs|express|aws|dynamo|crypto|http/gi;

        let moduleName = name.replace(infraLabelsRegex, '');

        if (moduleName.startsWith('-')) {
          moduleName = moduleName.slice(1);
        }

        moduleName = moduleName.replace('.', '-');

        const camalized = camalize(moduleName).replace('-', '');
        return camalized;
      },
      resolverOptions: {
        register: asClass,
        lifetime: Lifetime.SCOPED
      }
    }
  );

  return container;
}

export const getContainer = () => {
  return container;
};
