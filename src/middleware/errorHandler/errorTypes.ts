export class ValidationError extends Error {
  public status = 400;
  public errors: string[];

  constructor(errors: string[] | string) {
    const errorArray = Array.isArray(errors) ? errors : [errors];
    const message = `Validation failed: ${errorArray.join(', ')}`;
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
    this.name = 'ValidationError';
    this.errors = errorArray;
  }
}

export class NotFoundError extends Error {
  public status = 404;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
    this.name = 'NotFoundError';
  }
}

export class ForbiddenError extends Error {
  public status = 403;
  constructor(message: string = 'Access denied') {
    super(message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends Error {
  public status = 409;
  constructor(resource: string, field?: string) {
    const message = field
      ? `${resource} with this ${field} already exists`
      : `${resource} already exists`;
    super(message);
    Object.setPrototypeOf(this, ConflictError.prototype);
    this.name = 'ConflictError';
  }
}

export class GenericError extends Error {
  public status = 500;
  constructor(message: string = 'Internal server error') {
    super(message);
    Object.setPrototypeOf(this, GenericError.prototype);
    this.name = 'GenericError';
  }
}
