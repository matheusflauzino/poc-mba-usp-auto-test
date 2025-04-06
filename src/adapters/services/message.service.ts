import {
  GConstructor,
  IMessageService,
  MessagesBody,
} from '../dtos';

export function MixMessageService<TBase extends GConstructor>(Base: TBase) {
  return class MessageService extends Base {
    readonly _messageService: IMessageService;
    readonly _queueUrls: {
      self: string;
    };

    constructor(...args: any[]) {
      super(...args);
      this._messageService = args[0].messageService;
      this._queueUrls = args[0].config.queues;
    }

    public async sendMessageToOwnQueue(message: string, delaySeconds?: number): Promise<void> {
      await this._messageService.sendMessage(message, this._queueUrls.self, delaySeconds);
    }

    public async sendBatchMessagesToOwnQueue(message: MessagesBody[], delaySeconds?: number): Promise<void> {
      await this._messageService.sendMessageBatch(message, this._queueUrls.self, delaySeconds);
    }
  };
}
