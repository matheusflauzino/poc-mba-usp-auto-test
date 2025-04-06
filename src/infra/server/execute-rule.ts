import { Request, Response, NextFunction } from 'express';

type ExecuteRuleOptions = {
  routeVersion: string;
};

export default function executeRule(rule: string, options?: ExecuteRuleOptions) {
  return async (request: Request, res: Response, next: NextFunction) => {

    const container = request.container;

    const controller: any = container.resolve(`${rule}Controller`);
    const presenter: any = container.resolve(`${rule}Presenter`);

    try {
      if (options?.routeVersion) {
        res.locals.routeVersion = options.routeVersion;
      }

      await controller.run(request, res, next);
      const view = presenter.view;
      return res.status(view.statusCode).json(view.body);
    } catch (err: any) {
      console.error(err.message, { err: err });

      return res.status(500).json({
        name: 'unexpected_failure',
        description: 'Unexpected server error'
      });
    }
  };
}
