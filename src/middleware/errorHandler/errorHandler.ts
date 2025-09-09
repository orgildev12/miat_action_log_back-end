import { Request, Response, NextFunction } from 'express';
import { ValidationError, NotFoundError, ConflictError, ForbiddenError, GenericError, DatabaseUnavailableError } from './errorTypes';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error occurred:', err);

  if (err instanceof ValidationError) {
    return res.status(err.status).json({ name: err.name, message: err.message, errors: err.errors });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.status).json({ name: err.name, message: err.message });
  }

  if (err instanceof ConflictError) {
    return res.status(err.status).json({ name: err.name, message: err.message });
  }

  if (err instanceof ForbiddenError) {
    return res.status(err.status).json({ name: err.name, message: err.message });
  }

  if (err instanceof DatabaseUnavailableError) {
    return res.status(err.status).json({ name: err.name, message: err.message });
  }

  // Fallback: wrap unknown error into GenericError
  const generic = err instanceof GenericError ? err : new GenericError();
  return res.status(generic.status).json({
    name: generic.name,
    message: generic.message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};

export default errorHandler;