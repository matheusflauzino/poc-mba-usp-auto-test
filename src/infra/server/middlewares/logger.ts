import { Request, Response, NextFunction } from 'express';
import { Utils, Constants } from '@shared';
import { ILogger } from '@adapters';

const env = process.env.NODE_ENV || Constants.Env.Development;
const ignore = ['/healthcheck'];

/** logger setup middleware */
export function logger(req: Request, res: Response, next: NextFunction) {
  if (ignore.includes(req.path)) return next();
  res.reqStartedAt = Date.now();

  const logger: ILogger = req.container.resolve('logger');

  logger.info('HTTP request started', { req });

  res.on('finish', () => {
    logger.info('HTTP request finished', { req, res });
  });

  next();
}
