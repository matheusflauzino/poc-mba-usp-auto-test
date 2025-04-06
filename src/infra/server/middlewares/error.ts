import { Request, Response, NextFunction } from 'express';
import { Errors } from '@shared';

/** default error handler */
export function error(err: Error | Error[], _req: Request, res: Response, next: NextFunction) {
  const error = Array.isArray(err) ? err[0] : err;

  res.status(Errors.getStatusCodeFromError(error)).json({ error });
}
