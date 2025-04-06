import { EventTypes, QueueMessage } from './index';
import { Errors } from '@shared';
import executeQueueRule from './execute-queue-rule';
import { AwilixContainer } from 'awilix';

export default async (container: AwilixContainer, messageBody: QueueMessage, type: EventTypes): Promise<any> => {
  const startDate = new Date();

  switch (type) {
    case EventTypes.ProcessSimulator:
      await executeQueueRule('processSimulator', container, messageBody);
      break;
    default:
      throw new Errors.NotImplementedError('Invalid message received');
  }

  const milliseconds = Date.now() - startDate.getTime();
  const logger = container.resolve('logger');
  logger.info('Callback message processed', { milliseconds });
};
