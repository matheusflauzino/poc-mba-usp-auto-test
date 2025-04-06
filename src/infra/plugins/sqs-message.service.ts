import { IMessageService, MessagesBody } from '@adapters';
import {
  SQS,
  SendMessageBatchCommandInput,
  SendMessageBatchCommandOutput,
  SendMessageBatchRequestEntry,
  SendMessageCommandInput
} from '@aws-sdk/client-sqs';
import { Config } from '../config';
import { Constants } from '@shared';

export default class SqsMessageService implements IMessageService {
  private _sqs: SQS;

  constructor(params: { sqs: SQS; config: Config }) {
    this._sqs = params.sqs;
  }

  public async sendMessage(messageBody: string, queue: string, delaySeconds = 0) {
    const params: SendMessageCommandInput = {
      MessageBody: messageBody,
      QueueUrl: queue,
      DelaySeconds: delaySeconds
    };

    await this._sqs.sendMessage(params);
  }

  public async sendMessageBatch(messagesBody: MessagesBody[], queue: string, delaySeconds?: number) {
    const batchSize = 10;

    const numBatches = Math.ceil(messagesBody.length / batchSize);

    const batchPromises: Promise<SendMessageBatchCommandOutput>[] = [];

    for (let i = 0; i < numBatches; i++) {
      const batchMessages = messagesBody.slice(i * batchSize, (i + 1) * batchSize);

      const batchEntries = this.formatEntriesBatch(batchMessages, delaySeconds ?? i * Constants.Time.ThreeSeconds);

      if (batchEntries.length === 0) continue;

      const params: SendMessageBatchCommandInput = {
        Entries: batchEntries,
        QueueUrl: queue
      };

      batchPromises.push(this._sqs.sendMessageBatch(params));
    }

    await Promise.all(batchPromises);
  }

  private formatEntriesBatch(messagesBody: MessagesBody[], delaySeconds: number): SendMessageBatchRequestEntry[] {
    return messagesBody.map(({ message, id }) => {
      const entry: SendMessageBatchRequestEntry = {
        Id: id,
        MessageBody: message,
        DelaySeconds: delaySeconds
      };

      return entry;
    });
  }
}
