export type MessagesBody = {
  id: string;
  message: string;
};

export interface IMessageService {
  sendMessage(message: string, queue: string, delaySeconds?: number): Promise<void>;
  sendMessageBatch(message: MessagesBody[], queue: string, delaySeconds?: number): Promise<void>;
}




