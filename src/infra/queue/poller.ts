import {
  SQS,
  Message,
  ChangeMessageVisibilityCommand,
  DeleteMessageCommand,
  ReceiveMessageCommand
} from '@aws-sdk/client-sqs';
import { ValidEventTypes, QueueMessage, EventTypes } from './index';
import { Config, getGlobalLogger } from '@infra';
import router from './router';
import { Errors, Utils, Constants } from '@shared';
import { AwilixContainer } from 'awilix';
import { Logger } from 'pino';

let isPolling = false;

const createHandlers = (container: AwilixContainer) => {
  const logger: Logger = container.resolve('logger');
  const config: Config = container.resolve('config');

  const removeMessage = async (config: Config, message: Message): Promise<void> => {
    const sqs = new SQS(config.aws?.sqs);
    logger.debug('Deleting message', { messageAttributes: message.Attributes });

    await sqs.send(
      new DeleteMessageCommand({
        QueueUrl: config.queues.self,
        ReceiptHandle: message.ReceiptHandle
      })
    );
  };

  const postponeMessageDelivery = async (
    config: Config,
    message: Message,
    timeout: number,
    logger: Logger
  ): Promise<void> => {
    const sqs = new SQS(config.aws?.sqs);

    await sqs.send(
      new ChangeMessageVisibilityCommand({
        QueueUrl: config.queues.self,
        ReceiptHandle: message.ReceiptHandle,
        VisibilityTimeout: timeout
      })
    );

    logger.info('Callback message rescheduled', { data: JSON.stringify(message.Body) });
  };

  const onMessage = async (sqsMessage: Message): Promise<void> => {
    const scope = container.createScope();
    const scopeLogger = scope.resolve('logger');
    const message = sqsMessage.Body;
    let messageBody: QueueMessage;

    if (!message) {
      throw new Errors.InternalError('Invalid message received');
    }

    try {
      try {
        messageBody = JSON.parse(message);
      } catch (err) {
        throw new Errors.InternalError('Invalid message received');
      }

      const type = sqsMessage.MessageAttributes?.messageType?.StringValue ?? messageBody.type;

      if (!type) {
        throw new Errors.InternalError('Empty event type');
      }

      const isValidEventType = (): boolean => {
        return ValidEventTypes.toString().includes(type);
      };

      const context = { uuid: Utils.generateUUID(), eventType: type };
      scopeLogger.addContext(context);

      scopeLogger.info('Callback message received', {
        bodyTxt: JSON.stringify(messageBody),
        approximateReceiveCountNumber: sqsMessage?.Attributes?.ApproximateReceiveCount || 0
      });

      if (!isValidEventType()) {
        throw new Errors.InternalError('Invalid event type');
      }

      await router(scope, messageBody, type);
      await removeMessage(config, sqsMessage);
    } catch (err: any) {
      scopeLogger.error('Error processing message', { exception: err });

      if (err.name === 'CredentialsProviderError') {
        await postponeMessageDelivery(config, sqsMessage, Constants.Time.TwoMinutesInSeconds, logger);
      } else {
        await removeMessage(config, sqsMessage);
      }
    }
  };

  return { onMessage };
};

export const startSqsPoller = async (config: Config, container: AwilixContainer): Promise<void> => {
  if (isPolling) {
    throw new Errors.InternalError('SQS poller already started');
  }

  isPolling = true;
  const logger = getGlobalLogger();
  const handlers = createHandlers(container);
  const sqs = new SQS(config.aws?.sqs);

  const pollQueue = async () => {
    while (isPolling) {
      try {
        const command = new ReceiveMessageCommand({
          QueueUrl: config.queues.self,
          MaxNumberOfMessages: 10,
          WaitTimeSeconds: 60,
          MessageAttributeNames: ['All'],
          AttributeNames: ['All']
        });

        const response = await sqs.send(command);

        if (response.Messages && response.Messages.length > 0) {
          for (const message of response.Messages) {
            try {
              await handlers.onMessage(message);
            } catch (err) {
              logger.error('Error processing message', { exception: err });
            }
          }
        } else {
          logger.debug('No more messages in queue');
        }
      } catch (err) {
        // console.log(err);

        //logger.error('Error while fetching messages', { err });
      }
    }
  };

  logger.info('SQS poller started');
  pollQueue().catch((err) => logger.error('Poller encountered an error', { err }));
};

export const stopSqsPoller = async (): Promise<void> => {
  if (!isPolling) {
    throw new Errors.InternalError('SQS poller not started');
  }

  isPolling = false;
  const logger = getGlobalLogger();
  logger.info('SQS poller stopped');
};
