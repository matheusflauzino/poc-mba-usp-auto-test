import { Router, Request, Response, NextFunction } from 'express';
import { IMessageService } from '@adapters';
import { Config } from '../../config';

export const queue = Router();

queue.post('/message', async (req: Request, res: Response, _next: NextFunction) => {
  const container = req.container;
  const sqsService: IMessageService = container.resolve('messageService');
  const config: Config = container.resolve('config');

  await sqsService.sendMessage(JSON.stringify(req.body), config.queues.self);

  res.status(200).end();
});
