interface Extra {
  friendlyMessage?: string;
  body?: any;
}

export class ApplicationError extends Error {
  extra?: Extra;

  constructor(message?: string) {
    super(message);
    this.name = 'application_error';
  }
}

export class BadRequestError extends ApplicationError {
  constructor(message?: string) {
    super(message ?? 'Invalid input');
    this.name = 'bad_request';
  }
}

export class ApiError extends ApplicationError {
  constructor(message: string, extra?: any) {
    super(message);
    this.name = 'request_error';
    this.extra = extra;
  }
}

export class ForbiddenAccessError extends ApplicationError {
  constructor(message?: string) {
    super(message);
    this.name = 'forbidden_access';
  }
}

export class MissingParam extends Error {
  constructor(paramName: string) {
    super(`Missing property ${paramName}`);
    this.name = 'MissingParam';
  }
}

export class ConflictError extends ApplicationError {
  constructor(message?: string, extra?: Extra) {
    super(message);
    this.name = 'conflict';
    this.extra = extra;
  }
}

export class NotImplementedError extends ApplicationError {
  constructor(message?: string) {
    super(message);
    this.name = 'not_implemented';
  }
}

export class PreconditionError extends ApplicationError {
  constructor(message?: string) {
    super(message);
    this.name = 'precondition_not_satisfied';
  }
}

export class UnprocessableEntityError extends ApplicationError {
  constructor(message?: string) {
    super(message);
    this.name = 'unprocessable_entity';
  }
}

export class UnexpectedError extends ApplicationError {
  constructor(message?: string) {
    super(message);
    this.name = 'unexpected_error';
  }
}

export class InternalError extends ApplicationError {
  constructor(message?: string) {
    super(message ?? 'Internal server error');
    this.name = 'internal_error';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFound';
  }
}

export const Errors = {
  MissingParam,
  NotFound: NotFoundError
};

export function getStatusCodeFromError(error: Error): number {
  if (error instanceof ForbiddenAccessError) {
    return 403;
  }

  if (error instanceof NotFoundError) {
    return 404;
  }

  if (error instanceof ConflictError) {
    return 409;
  }

  if (error instanceof PreconditionError) {
    return 412;
  }

  if (error instanceof UnprocessableEntityError) {
    return 422;
  }

  if (error instanceof InternalError) {
    return 500;
  }

  if (error instanceof UnexpectedError) {
    return 500;
  }

  if (error instanceof NotImplementedError) {
    return 501;
  }

  return 400;
}

export function formatErrorResponse(input: ApplicationError) {
  return {
    error: {
      code: input.name,
      message: input.message,
      ...(input?.extra && { friendly_message: input.extra.friendlyMessage })
    }
  };
}
