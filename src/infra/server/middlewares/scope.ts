import { AwilixContainer, asValue } from 'awilix';
import { Request, Response, NextFunction } from 'express';

export function scope(container: AwilixContainer) {
  return (req: Request, res: Response, next: NextFunction) => {
    const scope = container.createScope();

    req.container = scope;

    next();
  };
}
