import { Logger } from 'pino';

declare global {
  namespace Express {
    interface Request {
      logger: Logger;
      container: AwilixContainer;
    }

    interface Response {
      reqStartedAt: number;
    }
  }
}
