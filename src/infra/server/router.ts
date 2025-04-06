import { Router, Request, Response, NextFunction } from 'express';
import { simulations, healthcheck, queue } from './routes';
import { Errors } from '@shared';
/** application router */
const router = Router();

router.use('/healthcheck', healthcheck);
router.use('/simulations', simulations);
router.use('/queue', queue);

/** fallback route */
router.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new Errors.NotFoundError());
});

export default router;
