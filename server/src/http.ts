import type { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from 'express';

/** Error with an HTTP status. The body shape matches what the frontend's Axios interceptor reads. */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message);
  }
}

/** Lets async route handlers throw instead of calling next(err) by hand. */
export const asyncHandler =
  (fn: (req: Request, res: Response) => Promise<unknown> | unknown): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message, code: err.code });
    return;
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error', code: 'INTERNAL' });
};
