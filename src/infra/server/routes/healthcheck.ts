import { Router, Request, Response, NextFunction } from 'express';
import { getConfig } from '@infra';

/** healthcheck router */
export const healthcheck = Router();

/** healthcheck */
healthcheck.all('/', async (_req: Request, res: Response, _next: NextFunction) => {
  const config = getConfig();
  res.status(200).json({ version: config.projectData.version });
});
